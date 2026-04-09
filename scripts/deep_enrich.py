import json
import os
import re
import time
import socket
import smtplib
import dns.resolver
from bs4 import BeautifulSoup
import requests
from duckduckgo_search import DDGS
from tqdm import tqdm
from urllib.parse import urljoin, urlparse
import argparse
import sys
import random

class FirestoreREST:
    """Minimal Firestore REST Client for updates."""
    def __init__(self, project_id, api_key):
        self.project_id = project_id
        self.api_key = api_key
        self.base_url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents"

    def _to_firestore_value(self, val):
        if val is None: return {"nullValue": None}
        if isinstance(val, bool): return {"booleanValue": val}
        if isinstance(val, (int, float)): return {"doubleValue": float(val)}
        if isinstance(val, str): return {"stringValue": val}
        if isinstance(val, list):
            return {"arrayValue": {"values": [self._to_firestore_value(i) for i in val]}}
        if isinstance(val, dict):
            return {"mapValue": {"fields": {k: self._to_firestore_value(v) for k, v in val.items()}}}
        return {"stringValue": str(val)}

    def patch_document(self, collection, doc_id, data):
        url = f"{self.base_url}/{collection}/{doc_id}?key={self.api_key}"
        
        fields = {k: self._to_firestore_value(v) for k, v in data.items()}
        update_mask = list(data.keys())
        
        payload = {"fields": fields}
        mask_params = "&".join([f"updateMask.fieldPaths={k}" for k in update_mask])
        url += f"&{mask_params}"
        
        try:
            res = requests.patch(url, json=payload, timeout=10)
            if res.status_code != 200:
                print(f"  [ERROR] Firestore update failed: {res.status_code} - {res.text}")
                return False
            return True
        except Exception as e:
            print(f"  [ERROR] Firestore exception: {e}")
            return False

class DeepEnricher:
    def __init__(self, data_path, base_path, project_id, api_key):
        self.data_path = data_path
        self.base_path = base_path
        
        # Load base data (17k)
        print(f"[INIT] Loading base data from {base_path}...")
        with open(base_path, 'r') as f:
            base_data = json.load(f)
            
        # Create mapping of base data
        self.data_map = {inv['id']: inv for inv in base_data}
        
        # Load and merge existing progress
        if os.path.exists(data_path):
            print(f"[INIT] Merging progress from {data_path}...")
            with open(data_path, 'r') as f:
                enriched_data = json.load(f)
                for inv in enriched_data:
                    if inv['id'] in self.data_map:
                        self.data_map[inv['id']].update(inv)
                    else:
                        self.data_map[inv['id']] = inv
        
        # Convert back to list for the run loop
        self.data = list(self.data_map.values())
                
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.db = FirestoreREST(project_id, api_key)

    def save_data(self):
        # Always save to the enriched path
        with open(self.data_path, 'w') as f:
            json.dump(list(self.data_map.values()), f, indent=2)

    def find_domain(self, website):
        if not website: return None
        domain = re.sub(r'^https?://(www\.)?', '', website).split('/')[0]
        return domain

    def get_mx_record(self, domain):
        try:
            records = dns.resolver.resolve(domain, 'MX')
            mx_record = str(records[0].exchange)
            return mx_record
        except Exception:
            return None

    def verify_email_smtp(self, email, mx_record):
        if not mx_record: return False
        try:
            host = socket.gethostname()
            server = smtplib.SMTP(timeout=10)
            server.set_debuglevel(0)
            server.connect(mx_record)
            server.helo(host)
            server.mail('verify@warrenintel.com')
            code, message = server.rcpt(email)
            server.quit()
            return code == 250
        except Exception:
            return False

    def generate_email_patterns(self, name, domain):
        if not name or not domain: return []
        parts = name.lower().split()
        if len(parts) < 2: return [f"{parts[0]}@{domain}"]
        first, last = parts[0], parts[-1]
        return [
            f"{first}@{domain}", f"{first}.{last}@{domain}",
            f"{first}{last}@{domain}", f"{first[0]}{last}@{domain}",
            f"{first}{last[0]}@{domain}", f"{last}@{domain}"
        ]

    def get_wikipedia_summary(self, query):
        try:
            url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{query.replace(' ', '_')}"
            res = requests.get(url, headers=self.headers, timeout=5)
            if res.status_code == 200:
                data = res.json()
                return data.get('extract'), data.get('content_urls', {}).get('desktop', {}).get('page')
        except Exception:
            pass
        return None, None

    def scrape_crunchbase_snippet(self, name):
        """Extract description from search result for Crunchbase."""
        try:
            query = f"site:crunchbase.com {name} investment firm profile"
            with DDGS() as ddgs:
                results = ddgs.text(query, max_results=3)
                for r in results:
                    url = r['href']
                    if 'crunchbase.com/organization/' in url:
                        return r.get('body'), url
        except Exception:
            pass
        return None, None

    def scrape_firm_website(self, url):
        try:
            res = requests.get(url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(res.text, 'html.parser')
            
            # Find logo
            logo = None
            img = soup.find('img', alt=re.compile(r'logo', re.I)) or soup.find('img', src=re.compile(r'logo', re.I))
            if img:
                logo = img['src']
                if not logo.startswith('http'):
                    logo = urljoin(url, logo)
            
            # Find social links
            socials = {}
            links = soup.find_all('a', href=True)
            for link in links:
                href = link['href'].lower()
                if 'linkedin.com/company' in href: socials['linkedin'] = link['href']
                if 'twitter.com' in href or 'x.com' in href: socials['twitter'] = link['href']
                if 'facebook.com' in href: socials['facebook'] = link['href']
                if 'instagram.com' in href: socials['instagram'] = link['href']
            
            # Find meta description
            desc = soup.find('meta', attrs={'name': 'description'})
            if desc: desc = desc.get('content')
            
            # Extract contact info (simple)
            emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', res.text)
            phones = re.findall(r'\+?\d{1,4}[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}', res.text)
            
            contact = {
                "emails": list(set(emails))[:2],
                "phones": list(set(phones))[:2]
            }
            
            return logo, socials, desc, contact
        except Exception:
            return None, {}, None, {}

    def clean_name(self, investor):
        name = investor.get('name', '')
        if '...' in name or not name:
            investor_id = investor.get('id', '')
            cleaned_id = investor_id.replace('-20', ' ').replace('-', ' ').title()
            investor['name'] = cleaned_id
        return investor['name']

    def search_portfolio(self, name):
        """Find potential portfolio companies for an investor with links."""
        portfolio = []
        try:
            query = f"{name} portfolio companies list"
            with DDGS() as ddgs:
                results = ddgs.text(query, max_results=5)
                for r in results:
                    body = r.get('body', '')
                    title = r.get('title', '')
                    url = r.get('href', '')
                    
                    # Extract names from body or title
                    matches = re.findall(r'(?:invested in|portfolio includes|investments include)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)', body)
                    for m in matches:
                        if m.lower() not in name.lower() and len(m) > 2:
                            if not any(p['name'] == m for p in portfolio):
                                portfolio.append({"name": m})

                # Try to get links for the top 5
                for i in range(min(5, len(portfolio))):
                    company_name = portfolio[i]['name']
                    # Simple heuristic: if we have a result that matches the company name exactly in title, use that URL
                    for r in results:
                        if company_name.lower() in r.get('title', '').lower():
                            portfolio[i]['url'] = r.get('href')
                            break
                            
        except Exception:
            pass
        return portfolio[:10]

    def search_check_sizes(self, name):
        """Discover specific ticket ranges for an investor."""
        try:
            query = f"{name} investment check size ticket range range"
            with DDGS() as ddgs:
                results = ddgs.text(query, max_results=5)
                for r in results:
                    body = r.get('body', '')
                    # Look for money patterns
                    matches = re.findall(r'(\$[\d.]+[kKmMbB]?\s*(?:to|-)\s*\$[\d.]+[kKmMbB]?)', body)
                    if matches:
                        return matches[0]
                    
                    # Look for "from $..."
                    matches = re.findall(r'from\s*\$[\d.]+[kKmMbB]?', body)
                    if matches:
                        return matches[0]
        except Exception:
            pass
        return None

    def search_news(self, name):
        """Find latest news for an investor."""
        news = []
        try:
            query = f"{name} investment news 2024 2025"
            with DDGS() as ddgs:
                results = ddgs.text(query, max_results=5)
                for r in results:
                    news.append({
                        "title": r.get('title'),
                        "url": r.get('href')
                    })
        except Exception:
            pass
        return news

    def find_website_google(self, name):
        try:
            print(f"  [SEARCH] Searching DuckDuckGo for {name} website...")
            query = f"{name} investment firm official website"
            # Smart jitter: 1.5 - 3.5s for speed
            time.sleep(random.uniform(1.5, 3.5))
            with DDGS() as ddgs:
                results = ddgs.text(query, max_results=10)
                for r in results:
                    url = r['href']
                    if any(x in url for x in ['crunchbase.com', 'linkedin.com', 'wikipedia.org', 'pitchbook.com', 'tracxn.com', 'facebook.com', 'instagram.com']):
                        continue
                    print(f"  [DEBUG] Potential website found: {url}")
                    return url
        except Exception as e:
            if "429" in str(e):
                print(f"  [CRITICAL] Rate limited (429). Will trigger long sleep.")
                return "RATE_LIMIT"
            print(f"  [ERROR] Search failed: {e}")
        return None

    def enrich_investor(self, investor):
        name = self.clean_name(investor)
        website = investor.get('website')
        
        print(f"\n[START] Enriching {name}...")
        updates = {}
        
        # 0. Find Website
        if not website:
            website = self.find_website_google(name)
            if website:
                investor['website'] = website
                updates['website'] = website
                print(f"  [SUCCESS] Found website: {website}")

        # 1. Wikipedia / Crunchbase
        if not investor.get('description') or len(investor.get('description')) < 50:
            summary, wiki_url = self.get_wikipedia_summary(name)
            if summary:
                investor['description'] = summary
                investor['wikipedia'] = wiki_url
                updates['description'] = summary
                updates['wikipedia'] = wiki_url
                print(f"  [SUCCESS] Found Wikipedia.")
            else:
                # Try Crunchbase
                cb_desc, cb_url = self.scrape_crunchbase_snippet(name)
                if cb_url:
                    investor['crunchbase'] = cb_url
                    updates['crunchbase'] = cb_url
                    print(f"  [SUCCESS] Found Crunchbase URL.")

        # 2. Website Scraping
        if website:
            logo, socials, desc, contact = self.scrape_firm_website(website)
            if logo and not investor.get('logo'): 
                investor['logo'] = logo
                updates['logo'] = logo
            if socials:
                existing_socials = investor.get('socials', {})
                existing_socials.update(socials)
                investor['socials'] = existing_socials
                updates['socials'] = existing_socials
            if desc and (not investor.get('description') or len(investor.get('description')) < 50):
                investor['description'] = desc
                updates['description'] = desc
            if contact:
                investor['contact_scraped'] = contact
                updates['contact_scraped'] = contact

        # 3. Portfolio & News
        if not investor.get('portfolio_details'):
            portfolio = self.search_portfolio(name)
            if portfolio:
                investor['portfolio_details'] = portfolio
                updates['portfolio_details'] = portfolio
                # Also update flat portfolio for compatibility
                investor['portfolio'] = [p['name'] for p in portfolio]
                updates['portfolio'] = investor['portfolio']
                print(f"  [SUCCESS] Found {len(portfolio)} portfolio companies.")
        
        if not investor.get('check_size_details'):
            checks = self.search_check_sizes(name)
            if checks:
                investor['check_size_details'] = checks
                updates['check_size_details'] = checks
                print(f"  [SUCCESS] Found check size: {checks}")

        if not investor.get('news_links'):
            news = self.search_news(name)
            if news:
                investor['news_links'] = news
                updates['news_links'] = news
                print(f"  [SUCCESS] Found {len(news)} news links.")

        # 4. Email Discovery
        domain = self.find_domain(website)
        if domain and 'personal' in investor:
            founder_name = investor['personal'].get('name')
            if founder_name:
                mx = self.get_mx_record(domain)
                if mx:
                    patterns = self.generate_email_patterns(founder_name, domain)
                    for p in patterns:
                        if self.verify_email_smtp(p, mx):
                            investor['personal']['email'] = p
                            investor['personal']['email_status'] = 'verified'
                            updates['personal'] = investor['personal']
                            print(f"    [SUCCESS] Verified email: {p}")
                            break
                        time.sleep(0.5)

        investor['enriched'] = True
        investor['deep_enriched'] = True
        updates['enriched'] = True
        updates['deep_enriched'] = True
        
        # Firestore Update
        if updates:
            print(f"  [SYNC] Updating Firestore for {investor['id']}...")
            self.db.patch_document("investors", investor['id'], updates)
            
        return investor

    def run(self, limit=None, ghana_only=True, batch_size=80, batch_pause=120):
        count = 0
        batch_count = 0
        target_records = []
        
        for i, inv in enumerate(self.data):
            # Skip if already deep enriched
            if inv.get('deep_enriched'):
                continue
                
            location = inv.get('location', '')
            if ghana_only:
                if 'Ghana' in location:
                    target_records.append(i)
            else:
                target_records.append(i)

        print(f"Found {len(target_records)} records matching criteria for enrichment.")
        
        for idx in tqdm(target_records):
            investor = self.data[idx]
            
            # Enrich
            result = self.enrich_investor(investor)
            if result == "RATE_LIMIT":
                print("\n[RATE LIMIT] Encountered 429. Sleeping for 20 minutes to recover...")
                time.sleep(1200) # 20 minutes
                continue # Try the same record again or move to next (enrich_investor doesn't return RATE_LIMIT directly yet, wait)
                
            self.data[idx] = result
            count += 1
            batch_count += 1
            
            # Save frequency
            if count % 5 == 0:
                self.save_data()
            
            # Batch Pause
            if batch_count >= batch_size:
                print(f"\n[PAUSE] Completed batch of {batch_size}. Sleeping for {batch_pause} seconds...")
                time.sleep(batch_pause)
                batch_count = 0
            else:
                # Optimized Jitter for speed: 1.0 - 2.5s
                time.sleep(random.uniform(1.0, 2.5))
            
            if limit and count >= limit:
                break
        
        self.save_data()
        print(f"\n[DONE] Enriched {count} records.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Warren Intel Deep Data Enrichment")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of records to enrich")
    parser.add_argument("--all", action="store_true", help="Enrich all investors, not just Ghana")
    parser.add_argument("--batch-size", type=int, default=50, help="Number of records before a long pause")
    parser.add_argument("--batch-pause", type=int, default=300, help="Pause duration in seconds after each batch")
    args = parser.parse_args()

    PROJECT_ID = "warrenintel-c53a2"
    API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU"
    
    enricher = DeepEnricher(
        'public/warren_enriched.json', 
        'public/warren.json',
        PROJECT_ID, 
        API_KEY
    )
    # Run based on arguments
    enricher.run(
        limit=args.limit, 
        ghana_only=not args.all, 
        batch_size=args.batch_size, 
        batch_pause=args.batch_pause
    )

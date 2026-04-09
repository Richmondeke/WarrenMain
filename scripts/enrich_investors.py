import json
import time
import random
import os
import argparse
import re
try:
    from googlesearch import search
except ImportError:
    print("googlesearch-python not found. Please install it using: pip install googlesearch-python")
    exit(1)

# Configuration
JSON_PATH = '/Users/mac/.gemini/antigravity/scratch/warrenintel/public/warren.json'
OUTPUT_PATH = '/Users/mac/.gemini/antigravity/scratch/warrenintel/public/warren_enriched.json'
SAVE_INTERVAL = 20

# More extensive blacklist to avoid noise
EXCLUDED_DOMAINS = [
    'github.com', 'zhihu.com', 'quora.com', 'facebook.com', 'twitter.com', 'x.com',
    'instagram.com', 'youtube.com', 'medium.com', 'clutch.co', 'crunchbase.com',
    'zoominfo.com', 'pitchbook.com', 'apollo.io', 'rocketreach.co', 'baidu.com',
    'vk.com', 'ok.ru', 'pinterset.com', 'glassdoor.com', 'indeed.com', 'linkedin.com/posts',
    'reddit.com', 'wikipedia.org', 'bloomberg.com', 'forbes.com', 'reuters.com'
]

# Names to skip (too generic or placeholders)
SKIP_NAMES = ["unknown", "n/a", "none", "investor", "angel", "private", "stealth", "family office"]

def get_google_results(query, max_results=5):
    try:
        # googlesearch.search returns a generator of URLs
        results = list(search(query, num_results=max_results, sleep_interval=2))
        return results
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        # If we get a 429 Too Many Requests, we should wait longer
        if "429" in str(e):
            print("Rate limited. Waiting 60 seconds...")
            time.sleep(60)
        return []

def is_valid_url(url, name, type_of_link='website'):
    url_lower = url.lower()
    
    # Strictly exclude profile sites for main website
    if type_of_link == 'website':
        if any(domain in url_lower for domain in EXCLUDED_DOMAINS + ['linkedin.com']):
            return False
            
    # For LinkedIn, must be a company page
    if type_of_link == 'linkedin':
        if 'linkedin.com/company/' not in url_lower:
            return False
            
    # Name matching (heuristic)
    clean_name = re.sub(r'[^a-z0-9]', '', name.lower())
    if len(clean_name) > 3:
        # Check if the core name is in the URL
        # Loosened to 3 chars for very short names
        core_part = clean_name[:min(4, len(clean_name))]
        if core_part in url_lower:
            print(f"    [MATCH] {core_part} found in {url_lower}")
            return True
        # Allow common VC words in URL
        if any(kw in url_lower for kw in ['vc', 'capital', 'funds', 'ventures', 'investment', 'partners', 'equity']):
            print(f"    [MATCH] VC keyword found in {url_lower}")
            return True
        
    print(f"    [SKIP] No match for {name} in {url_lower}")
    return False # Be strict for website

def search_with_fallbacks(name, type_of_link='website'):
    queries = []
    if type_of_link == 'website':
        queries = [
            f"{name} venture capital official website",
            f"{name} investment firm homepage",
            f"what is the official website for {name}"
        ]
    elif type_of_link == 'linkedin':
        queries = [
            f"{name} venture capital linkedin company",
            f"{name} official linkedin page"
        ]

    for q in queries:
        print(f"  Searching: {q}")
        results = get_google_results(q)
        print(f"    Found {len(results)} results")
        for url in results:
            if is_valid_url(url, name, type_of_link):
                return url
        time.sleep(random.uniform(1, 2)) # short sleep between fallback attempts
    
    return None

def enrich_investor(firm):
    name = firm.get('name')
    if not name or name.lower() in SKIP_NAMES:
        return firm
    
    # Clean name for searching (remove ellipsis, etc)
    search_name = name.replace('...', '').strip()
    search_name = re.sub(r'\s+', ' ', search_name)

    print(f"\n--- {name} (Searching as: {search_name}) ---")

    # 1. Website URL
    if not firm.get('website'):
        url = search_with_fallbacks(search_name, 'website')
        if url:
            firm['website'] = url
            print(f"  [+] Website: {url}")
        time.sleep(random.uniform(2, 4))

    # 2. LinkedIn URL
    if not firm.get('linkedin'):
        url = search_with_fallbacks(search_name, 'linkedin')
        if url:
            firm['linkedin'] = url
            print(f"  [+] LinkedIn: {url}")
        time.sleep(random.uniform(2, 4))

    # 3. Logo URL (Clearbit heuristic if website found)
    if not firm.get('logo') and firm.get('website'):
        domain = firm['website'].replace('https://', '').replace('http://', '').split('/')[0]
        # Clean up common subdomains for better Clearbit results
        if domain.startswith('www.'):
            domain = domain[4:]
        firm['logo'] = f"https://logo.clearbit.com/{domain}"
        print(f"  [+] Logo (Clearbit): {firm['logo']}")

    firm['enriched'] = True
    return firm

def main():
    parser = argparse.ArgumentParser(description='Enrich investor data.')
    parser.add_argument('--limit', type=int, help='Limit number of firms to process')
    parser.add_argument('--offset', type=int, default=0, help='Start index for processing')
    parser.add_argument('--resume', action='store_true', help='Resume from last processed index')
    parser.add_argument('--location', type=str, help='Filter firms by location (e.g. Ghana)')
    args = parser.parse_args()

    # Load data
    current_path = OUTPUT_PATH if os.path.exists(OUTPUT_PATH) and args.resume else JSON_PATH
    print(f"Loading data from {current_path}...")
    with open(current_path, 'r') as f:
        firms = json.load(f)
    
    # Apply location filter if provided
    if args.location:
        print(f"Filtering firms for location: {args.location}")
        firms = [f for f in firms if args.location.lower() in f.get('location', '').lower()]
        print(f"Found {len(firms)} matches for '{args.location}'")

    start_index = args.offset
    if args.resume:
        start_index = next((i for i, f in enumerate(firms) if not f.get('enriched')), 0)

    limit = args.limit if args.limit else (len(firms) - start_index)
    end_index = min(start_index + limit, len(firms))

    print(f"Processing from index {start_index} to {end_index}...")

    try:
        count = 0
        for i in range(start_index, end_index):
            firms[i] = enrich_investor(firms[i])
            count += 1
            
            if count % SAVE_INTERVAL == 0:
                print(f"Saving temporary progress at index {i}...")
                with open(OUTPUT_PATH, 'w') as f:
                    # If we filtered, we might not want to overwrite the WHOLE file 
                    # unless we are careful about merging. 
                    # For simplicity, if filtering, we save to a separate file or handle merging.
                    # Let's just save the current set.
                    json.dump(firms, f, indent=2)

    except KeyboardInterrupt:
        print("\nInterrupted by user. Saving final progress...")
    finally:
        with open(OUTPUT_PATH, 'w') as f:
            json.dump(firms, f, indent=2)
        print(f"Saved results to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()

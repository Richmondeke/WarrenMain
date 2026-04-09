import json

WEBSITE_MAPPING = {
    "dfs-20lab": "https://dfslab.net",
    "synergy-capital-ma---": "http://www.synergycapitalmanagers.com",
    "adlevo-20capital": "http://www.adlevocapital.com",
    "alitheia-20capital": "https://alitheia.com",
    "mest-20africa": "https://meltwater.org",
    "v8-20capital-20partners": "https://v8cappartners.com",
    "leapfrog-20investments": "https://www.leapfroginvest.com",
    "gray-20matters-20capital": "https://graymatterscap.com",
    "frontier-20digital-20ventures": "https://frontierdv.com",
    "vu-20venture-20partners": "https://www.vuventurepartners.com",
    "sumara-venture-stu---": "https://sumaraventurestudio.com/",
    "praxis": "https://praxis.co",
    "sunu-20capital": "https://www.sunucapital.com/",
    "acumen-20resilient-20agriculture-20fund": "https://arafund.com/",
    "blue-20haven-20initiative": "https://www.bluehaveninitiative.com/",
    "otv": "https://otv.vc",
    "skoll-20foundation": "https://skoll.org",
    "arise-pty-ltd": "https://www.ariseinvest.com",
    "pcg-investments": "https://pcginvestments.nl",
    "global-social-impa---": "https://globalsocialimpact.es",
    "first-national-ban---": "https://www.firstnationalbank.com.gh",
    "fastforward-u": "https://ventures.jhu.edu/fastforward-u",
    "jaof-20rahou": "https://openvc.app/investor/jaof-rahou",
    "babajide-20tella": "https://openvc.app/investor/babajide-tella",
    "george-20mwenda": "https://www.openvc.app/investor/george-mwenda",
    "end-poverty--make----": "https://pitchbook.com/profiles/investor/495208-end-poverty-make-trillions",
    "w-20fund": "https://thewfund.com"
}

def seed_websites():
    path = 'public/warren_enriched.json'
    with open(path, 'r') as f:
        data = json.load(f)
    
    count = 0
    for inv in data:
        if inv['id'] in WEBSITE_MAPPING and not inv.get('website'):
            inv['website'] = WEBSITE_MAPPING[inv['id']]
            count += 1
            
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Updated {count} records with websites.")

if __name__ == "__main__":
    seed_websites()

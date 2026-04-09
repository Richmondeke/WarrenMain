import json

file_path = '/Users/mac/.gemini/antigravity/scratch/warrenintel/public/warren_enriched.json'

with open(file_path, 'r') as f:
    data = json.load(f)

for investor in data:
    if investor.get('id') == 'dfs-20lab':
        investor['news_links'] = [
            { "title": "DFS Lab and Stellar Development Foundation Announce Blockchain Bootcamp", "url": "https://dfslab.net/stellar-bootcamp" },
            { "title": "Inside the DFS Lab Fintech Ecosystem", "url": "https://techcabal.com/dfs-lab-fintech" }
        ]
        print("Updated DFS Lab with news links.")

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)

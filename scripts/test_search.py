import sys
from duckduckgo_search import DDGS
import re

def test_search(name):
    print(f"\n--- Testing: {name} ---")
    ddgs = DDGS()
    
    # Portfolio search
    query_p = f"{name} portfolio companies list"
    results_p = list(ddgs.text(query_p, max_results=5))
    print(f"Portfolio search results: {len(results_p)}")
    for r in results_p:
        print(f"  - {r.get('title')}: {r.get('href')}")
        
    # Check size search
    query_c = f"{name} average check size ticket range investment"
    results_c = list(ddgs.text(query_c, max_results=5))
    print(f"Check size search results: {len(results_c)}")
    patterns = [
        r'\$(\d+(?:\.\d+)?\s*[km])\s*to\s*\$(\d+(?:\.\d+)?\s*[km])',
        r'check size(?:s)?(?::)?\s*\$(\d+(?:\.\d+)?\s*[km])',
        r'ticket\s*(?:size|range)(?::)?\s*\$(\d+(?:\.\d+)?\s*[km])',
        r'\$(\d+(?:\.\d+)?\s*[km])(?:\s*-\s*\$\d+(?:\.\d+)?\s*[km])?'
    ]
    
    for r in results_c:
        snippet = r.get('body', '').lower()
        print(f"  Snippet: {snippet[:100]}...")
        for pattern in patterns:
            match = re.search(pattern, snippet)
            if match:
                print(f"    [MATCH] {match.group(0)}")

if __name__ == "__main__":
    test_search("DFS Lab")
    test_search("Ingressive Capital")
    test_search("Ventures Platform")

from googlesearch import search
import re

def test_google_search(name):
    print(f"\n--- Testing Google Search: {name} ---")
    
    # Portfolio search
    query_p = f"{name} portfolio companies list"
    print(f"Searching portfolio: {query_p}")
    try:
        results_p = list(search(query_p, num_results=5))
        print(f"Portfolio search results: {len(results_p)}")
        for r in results_p:
            print(f"  - {r}")
    except Exception as e:
        print(f"Portfolio search error: {e}")
        
    # Check size search
    query_c = f"{name} average check size ticket range investment"
    print(f"Searching check size: {query_c}")
    try:
        results_c = list(search(query_c, num_results=5))
        print(f"Check size search results: {len(results_c)}")
        for r in results_c:
             print(f"  - {r}")
    except Exception as e:
        print(f"Check size search error: {e}")

if __name__ == "__main__":
    test_google_search("DFS Lab")
    test_google_search("Ingressive Capital")
    test_google_search("Ventures Platform")

from duckduckgo_search import DDGS

try:
    with DDGS() as ddgs:
        print("Searching for 'Python'...")
        results = [r for r in ddgs.text("Python package", max_results=5)]
        print(f"Results: {len(results)}")
        for r in results:
            print(f" - {r['title']}")
except Exception as e:
    print(f"Error: {e}")

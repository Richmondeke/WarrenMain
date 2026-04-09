from duckduckgo_search import DDGS

print("--- Testing DDGS Backends ---")
backends = ["api", "html", "lite"]

with DDGS() as ddgs:
    for backend in backends:
        print(f"\nTesting backend: {backend}")
        try:
            results = list(ddgs.text("DFS Lab portfolio", backend=backend, max_results=3))
            print(f"Results ({backend}): {len(results)}")
            for r in results:
                print(f" - {r.get('title')}")
        except Exception as e:
            print(f"Error ({backend}): {e}")

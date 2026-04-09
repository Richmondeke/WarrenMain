from duckduckgo_search import DDGS

def test_search():
    query = "U-investors venture capital official website"
    print(f"Searching for: {query}")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))
            for r in results:
                print(f" - {r['href']}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_search()

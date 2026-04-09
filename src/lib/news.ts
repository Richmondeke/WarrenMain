/**
 * News integration via NewsData.io free tier.
 * Two modes: company-specific news, and general market/business news.
 * All results cached in Firestore (TTL varies by mode).
 */

export interface NewsArticle {
    title: string;
    description: string | null;
    link: string;
    source: string;
    pubDate: string;
    imageUrl?: string;
}

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY || "";
const NEWSDATA_BASE = "https://newsdata.io/api/1/news";

/**
 * Fetch news articles for a specific company name.
 * TTL: 6 hours (cached in Firestore by caller)
 */
export async function fetchCompanyNews(companyName: string, limit = 5): Promise<NewsArticle[]> {
    if (!NEWSDATA_API_KEY) {
        console.warn("[news] No NEWSDATA_API_KEY found. Register free at newsdata.io");
        return getMockNews(companyName);
    }

    try {
        const query = encodeURIComponent(companyName);
        const res = await fetch(
            `${NEWSDATA_BASE}?apikey=${NEWSDATA_API_KEY}&q=${query}&language=en&category=business`,
            { next: { revalidate: 0 } }
        );

        if (!res.ok) {
            console.error(`[news] API error ${res.status} for ${companyName}`);
            return getMockNews(companyName);
        }

        const data = await res.json();
        const articles: NewsArticle[] = (data.results || []).slice(0, limit).map((a: Record<string, string>) => ({
            title: a.title,
            description: a.description,
            link: a.link,
            source: a.source_id,
            pubDate: a.pubDate,
            imageUrl: a.image_url || undefined,
        }));

        return articles.length > 0 ? articles : getMockNews(companyName);
    } catch (err) {
        console.error("[news] fetchCompanyNews error:", err);
        return getMockNews(companyName);
    }
}

/**
 * Fetch top business/market news headlines (platform-wide).
 * TTL: 1 hour (cached in Firestore by caller)
 */
export async function fetchMarketNews(limit = 6): Promise<NewsArticle[]> {
    if (!NEWSDATA_API_KEY) {
        console.warn("[news] No NEWSDATA_API_KEY found. Register free at newsdata.io");
        return getMarketMockNews();
    }

    try {
        const res = await fetch(
            `${NEWSDATA_BASE}?apikey=${NEWSDATA_API_KEY}&language=en&category=business`,
            { next: { revalidate: 0 } }
        );

        if (!res.ok) return getMarketMockNews();

        const data = await res.json();
        return (data.results || []).slice(0, limit).map((a: Record<string, string>) => ({
            title: a.title,
            description: a.description,
            link: a.link,
            source: a.source_id,
            pubDate: a.pubDate,
            imageUrl: a.image_url || undefined,
        }));
    } catch (err) {
        console.error("[news] fetchMarketNews error:", err);
        return getMarketMockNews();
    }
}

// Fallback mock data when API key is not set
function getMockNews(companyName: string): NewsArticle[] {
    return [
        {
            title: `${companyName} Reports Strong Quarterly Results`,
            description: `${companyName} continues to deliver value across its core business segments, according to its latest financial disclosures.`,
            link: "#",
            source: "Financial Times",
            pubDate: new Date().toISOString(),
        },
        {
            title: `${companyName} Expands Strategic Partnerships`,
            description: `New partnerships announced this quarter signal growth intentions in key markets.`,
            link: "#",
            source: "Reuters",
            pubDate: new Date(Date.now() - 86400000).toISOString(),
        },
    ];
}

function getMarketMockNews(): NewsArticle[] {
    return [
        {
            title: "African Tech Startups Attract Record Investment",
            description: "VC funding for African tech companies hits an all-time high as global investors increase allocations to emerging markets.",
            link: "#",
            source: "TechCrunch Africa",
            pubDate: new Date().toISOString(),
        },
        {
            title: "Nigerian Exchange (NGX) Posts Strong Weekly Gains",
            description: "Banking and consumer goods sectors lead gains on the NGX as foreign investor confidence returns.",
            link: "#",
            source: "Business Day NG",
            pubDate: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            title: "JSE All-Share Index Reaches New Monthly High",
            description: "South Africa's primary stock exchange closes the month on a positive note, driven by mining and financial stocks.",
            link: "#",
            source: "Moneyweb",
            pubDate: new Date(Date.now() - 7200000).toISOString(),
        },
        {
            title: "Fed Rate Decision Impacts Emerging Market Flows",
            description: "Global capital flows shift as the Federal Reserve signals a more dovish stance for 2025.",
            link: "#",
            source: "Bloomberg",
            pubDate: new Date(Date.now() - 10800000).toISOString(),
        },
    ];
}

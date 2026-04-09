/**
 * GET /api/news?company=Flutterwave  → company-specific news (6hr TTL)
 * GET /api/news                       → market/business headlines (1hr TTL)
 */
import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";
import { fetchCompanyNews, fetchMarketNews, NewsArticle } from "@/lib/news";

const TTL_1_HOUR = 3600;
const TTL_6_HOURS = 21600;

export async function GET(req: NextRequest) {
    const company = req.nextUrl.searchParams.get("company");

    if (company) {
        // Company-specific news
        const cacheKey = `news-company-${company.toLowerCase().replace(/\s+/g, "-")}`;
        const cached = await getCached<NewsArticle[]>(cacheKey, TTL_6_HOURS);
        if (cached) {
            return NextResponse.json({ articles: cached, _source: "cache" });
        }

        const articles = await fetchCompanyNews(company);
        await setCached(cacheKey, articles);
        return NextResponse.json({ articles, _source: "api" });
    }

    // Market-wide headlines
    const cacheKey = "news-market-headlines";
    const cached = await getCached<NewsArticle[]>(cacheKey, TTL_1_HOUR);
    if (cached) {
        return NextResponse.json({ articles: cached, _source: "cache" });
    }

    const articles = await fetchMarketNews();
    await setCached(cacheKey, articles);
    return NextResponse.json({ articles, _source: "api" });
}

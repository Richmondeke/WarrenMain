/**
 * GET /api/enrich/[ticker]
 * Cache-first company enrichment endpoint.
 * Checks Firestore first (30-day TTL), then calls RapidAPI.
 */
import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";
import { fetchCompanyEnrichment, CompanyEnrichment } from "@/lib/company-enrichment";

const TTL_30_DAYS = 60 * 60 * 24 * 30;

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ ticker: string }> }
) {
    const { ticker } = await params;
    const cacheKey = `enrich-${ticker.toLowerCase()}`;

    // 1. Try cache first
    const cached = await getCached<CompanyEnrichment>(cacheKey, TTL_30_DAYS);
    if (cached) {
        return NextResponse.json({ ...cached, _source: "cache" });
    }

    // 2. Fetch from RapidAPI
    const enrichment = await fetchCompanyEnrichment(ticker);
    if (!enrichment) {
        return NextResponse.json({ error: "No enrichment data found" }, { status: 404 });
    }

    // 3. Cache the result for 30 days
    await setCached(cacheKey, enrichment);

    return NextResponse.json({ ...enrichment, _source: "api" });
}

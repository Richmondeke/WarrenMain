/**
 * GET /api/funding/[company]
 * Cache-first funding rounds endpoint (7-day TTL).
 */
import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";
import { fetchFundingRounds, FundingRound } from "@/lib/funding";

const TTL_7_DAYS = 60 * 60 * 24 * 7;

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ company: string }> }
) {
    const { company } = await params;
    const cacheKey = `funding-${company.toLowerCase()}`;

    // 1. Try cache
    const cached = await getCached<FundingRound[]>(cacheKey, TTL_7_DAYS);
    if (cached) {
        return NextResponse.json({ rounds: cached, _source: "cache" });
    }

    // 2. Fetch from API
    const rounds = await fetchFundingRounds(company);
    await setCached(cacheKey, rounds);

    return NextResponse.json({ rounds, _source: "api" });
}

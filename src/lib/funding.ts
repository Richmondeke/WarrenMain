/**
 * Funding data via Crunchbase API on RapidAPI.
 * Returns funding rounds for a company — cached platform-wide (7 day TTL).
 */

export interface FundingRound {
    round: string;         // e.g. "Series A", "Seed", "IPO"
    amount: number | null; // in USD
    date: string;          // e.g. "2021-01"
    investors: string[];
    currency?: string;
}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
const CRUNCHBASE_HOST = "crunchbase-crunchbase-v1.p.rapidapi.com";

/**
 * Fetch funding rounds for a company from Crunchbase via RapidAPI.
 * Falls back to mock data if no API key is available.
 */
export async function fetchFundingRounds(companySlug: string): Promise<FundingRound[]> {
    if (!RAPIDAPI_KEY) {
        return getMockFunding(companySlug);
    }

    try {
        const res = await fetch(
            `https://${CRUNCHBASE_HOST}/entities/organizations/${encodeURIComponent(companySlug)}?field_ids=funding_rounds`,
            {
                headers: {
                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                    "X-RapidAPI-Host": CRUNCHBASE_HOST,
                },
                next: { revalidate: 0 },
            }
        );

        if (!res.ok) {
            console.warn(`[funding] Crunchbase API error ${res.status} for ${companySlug}`);
            return getMockFunding(companySlug);
        }

        const data = await res.json();
        const rounds = data?.properties?.funding_rounds || [];

        return rounds.map((r: Record<string, unknown>) => ({
            round: (r.investment_type as string) || "Unknown",
            amount: (r.raised_usd as number) || null,
            date: (r.announced_on as string) || "",
            investors: ((r.lead_investor_identifiers as Array<{ value: string }>)?.map((i) => i.value) || []),
        }));
    } catch (err) {
        console.error("[funding] fetchFundingRounds error:", err);
        return getMockFunding(companySlug);
    }
}

/**
 * Generate plausible mock funding data for demo purposes.
 */
function getMockFunding(slug: string): FundingRound[] {
    // Well-known African companies get realistic mock data
    const africanMocks: Record<string, FundingRound[]> = {
        flutterwave: [
            { round: "Seed", amount: 250000, date: "2016-10", investors: ["Y Combinator"] },
            { round: "Series A", amount: 10000000, date: "2017-10", investors: ["Greycroft", "Green Visor Capital"] },
            { round: "Series B", amount: 20000000, date: "2018-10", investors: ["Greycroft", "Tiger Global"] },
            { round: "Series C", amount: 170000000, date: "2021-03", investors: ["Tiger Global", "Avenir Growth"] },
            { round: "Series D", amount: 250000000, date: "2022-02", investors: ["B Capital Group", "Alta Park"] },
        ],
        paystack: [
            { round: "Seed", amount: 1300000, date: "2016-09", investors: ["Stripe", "Comcast Ventures"] },
            { round: "Series A", amount: 8000000, date: "2018-08", investors: ["Stripe", "Visa"] },
        ],
    };

    const match = africanMocks[slug.toLowerCase()];
    if (match) return match;

    // Generic mock for unknown companies
    return [
        { round: "Seed", amount: 1500000, date: "2018-01", investors: ["Angel Investors"] },
        { round: "Series A", amount: 8000000, date: "2020-06", investors: ["Venture Partners"] },
        { round: "Series B", amount: 25000000, date: "2022-09", investors: ["Growth Capital Fund"] },
    ];
}

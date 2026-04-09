import { NextResponse } from "next/server";
import { getHistoricalPrices } from "@/lib/financial-data";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get('ticker');
    const range = searchParams.get('range') || '1y';

    if (!ticker) {
        return NextResponse.json({ error: "Missing ticker parameter" }, { status: 400 });
    }

    try {
        const data = await getHistoricalPrices(ticker, range);
        return NextResponse.json({ data });
    } catch (error) {
        console.error("Historical data API error:", error);
        return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 });
    }
}

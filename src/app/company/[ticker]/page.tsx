import { CompanyClientPage } from "@/components/company/CompanyClientPage";
import { getCompanyProfile, getLatestAnnualReportUrl, getHistoricalPrices } from "@/lib/financial-data";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function CompanyDataFetcher({ ticker }: { ticker: string }) {
    // Try to find the latest 10-K URL first
    const secFilingUrl = await getLatestAnnualReportUrl(ticker);

    // Fetch initial quantitative data from Yahoo Finance
    let profile = await getCompanyProfile(ticker);

    if (!profile) {
        if (!secFilingUrl) {
            // Unrecognized ticker and no SEC filings found
            return notFound();
        }
        // Graceful fallback if Yahoo limits rate but SEC filing is found
        profile = {
            symbol: ticker,
            price: 0,
            currency: "USD",
            companyName: ticker,
            sector: "Unavailable",
            description: "Live market data is currently rate-limited by the provider. However, we successfully located the official SEC 10-K filing below!",
            ceo: "Unavailable",
            mktCap: 0,
            exchangeShortName: "US"
        };
    }

    const historicalData = await getHistoricalPrices(ticker);

    return (
        <CompanyClientPage
            ticker={ticker}
            profile={profile}
            secFilingUrl={secFilingUrl}
            historicalData={historicalData}
        />
    );
}

export default async function CompanyPage({ params }: { params: Promise<{ ticker: string }> }) {
    const resolvedParams = await params;
    const ticker = resolvedParams.ticker.toUpperCase();

    return (
        <Suspense fallback={<CompanySkeleton />}>
            <CompanyDataFetcher ticker={ticker} />
        </Suspense>
    );
}

function CompanySkeleton() {
    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl animate-pulse">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="space-y-4">
                    <div className="h-10 w-64 bg-secondary rounded-lg"></div>
                    <div className="flex gap-4">
                        <div className="h-10 w-48 bg-primary/20 rounded-md"></div>
                        <div className="h-10 w-48 bg-secondary rounded-md"></div>
                    </div>
                </div>
                <div className="h-32 w-full md:w-80 bg-secondary rounded-xl"></div>
            </div>
            <div className="h-12 w-full bg-secondary/50 rounded-t-lg mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="h-24 bg-secondary/30 rounded-lg"></div>
                <div className="h-24 bg-secondary/30 rounded-lg"></div>
                <div className="h-24 bg-secondary/30 rounded-lg"></div>
                <div className="h-24 bg-secondary/30 rounded-lg"></div>
            </div>
            <div className="h-64 w-full bg-secondary/20 rounded-xl"></div>
        </div>
    );
}

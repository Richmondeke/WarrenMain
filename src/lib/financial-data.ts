export interface CompanyProfile {
    symbol: string;
    price: number;
    currency: string;
    previousClose?: number;
    changePercent?: number;
    companyName: string;
    sector: string;
    description: string;
    ceo: string;
    mktCap: number;
    exchangeShortName: string;
}

export interface SECTicker {
    ticker: string;
    title: string;
    cik_str?: number;
    region?: string;
    currency?: string;
    sector?: string;
}

export type Region = 'US' | 'NG' | 'GH' | 'ZA';

export interface HistoricalPrice {
    date: string;
    price: number;
}

const NIGERIA_COMPANIES: SECTicker[] = [
    { ticker: "ACCESSCORP", title: "Access Holdings Plc", region: "NG", currency: "NGN", sector: "Financial Services" },
    { ticker: "AFRIPRUD", title: "Africa Prudential Plc", region: "NG", currency: "NGN", sector: "Financial Services" },
    { ticker: "AIRTELAFRI", title: "Airtel Africa Plc", region: "NG", currency: "NGN", sector: "Telecommunications" },
    { ticker: "BUACEMENT", title: "BUA Cement Plc", region: "NG", currency: "NGN", sector: "Industrial Goods" },
    { ticker: "BUAFOODS", title: "BUA Foods Plc", region: "NG", currency: "NGN", sector: "Consumer Goods" },
    { ticker: "DANGCEM", title: "Dangote Cement Plc", region: "NG", currency: "NGN", sector: "Industrial Goods" },
    { ticker: "DANGSUGAR", title: "Dangote Sugar Refinery Plc", region: "NG", currency: "NGN", sector: "Consumer Goods" },
    { ticker: "FBNH", title: "FBN Holdings Plc", region: "NG", currency: "NGN", sector: "Financial Services" },
    { ticker: "GTCO", title: "Guaranty Trust Holding Company Plc", region: "NG", currency: "NGN", sector: "Financial Services" },
    { ticker: "GEREGU", title: "Geregu Power Plc", region: "NG", currency: "NGN", sector: "Utilities" },
    { ticker: "MTNN", title: "MTN Nigeria Communications Plc", region: "NG", currency: "NGN", sector: "Telecommunications" },
    { ticker: "NESTLE", title: "Nestle Nigeria Plc", region: "NG", currency: "NGN", sector: "Consumer Goods" },
    { ticker: "NGXGROUP", title: "Nigerian Exchange Group Plc", region: "NG", currency: "NGN", sector: "Financial Services" },
    { ticker: "SEPLAT", title: "Seplat Energy Plc", region: "NG", currency: "NGN", sector: "Oil and Gas" },
    { ticker: "STANBIC", title: "Stanbic IBTC Holdings Plc", region: "NG", currency: "NGN", sector: "Financial Services" },
    { ticker: "UBA", title: "United Bank For Africa Plc", region: "NG", currency: "NGN", sector: "Financial Services" },
    { ticker: "ZENITHBANK", title: "Zenith Bank Plc", region: "NG", currency: "NGN", sector: "Financial Services" }
];

const SOUTH_AFRICA_COMPANIES: SECTicker[] = [
    { ticker: "ABG", title: "Absa Group Limited", region: "ZA", currency: "ZAR", sector: "Financial Services" },
    { ticker: "ANB", title: "Anheuser-Busch InBev", region: "ZA", currency: "ZAR", sector: "Consumer Goods" },
    { ticker: "APN", title: "Aspen Pharmacare Holdings", region: "ZA", currency: "ZAR", sector: "Healthcare" },
    { ticker: "BTI", title: "British American Tobacco PLC", region: "ZA", currency: "ZAR", sector: "Consumer Goods" },
    { ticker: "CPI", title: "Capitec Bank Holdings Limited", region: "ZA", currency: "ZAR", sector: "Financial Services" },
    { ticker: "DSY", title: "Discovery Limited", region: "ZA", currency: "ZAR", sector: "Financial Services" },
    { ticker: "FSR", title: "Firstrand Limited", region: "ZA", currency: "ZAR", sector: "Financial Services" },
    { ticker: "GLN", title: "Glencore", region: "ZA", currency: "ZAR", sector: "Basic Materials" },
    { ticker: "HAR", title: "Harmony Gold Mining Company", region: "ZA", currency: "ZAR", sector: "Basic Materials" },
    { ticker: "IMP", title: "Impala Platinum Holdings", region: "ZA", currency: "ZAR", sector: "Basic Materials" },
    { ticker: "MTN", title: "MTN Group Limited", region: "ZA", currency: "ZAR", sector: "Telecommunications" },
    { ticker: "NED", title: "Nedbank Group Limited", region: "ZA", currency: "ZAR", sector: "Financial Services" },
    { ticker: "NPN", title: "Naspers Limited", region: "ZA", currency: "ZAR", sector: "Technology" },
    { ticker: "OML", title: "Old Mutual Limited", region: "ZA", currency: "ZAR", sector: "Financial Services" },
    { ticker: "PRO", title: "Prosus N.V.", region: "ZA", currency: "ZAR", sector: "Technology" },
    { ticker: "REM", title: "Remgro Limited", region: "ZA", currency: "ZAR", sector: "Financial Services" },
    { ticker: "SLM", title: "Sanlam Limited", region: "ZA", currency: "ZAR", sector: "Financial Services" },
    { ticker: "SOL", title: "Sasol Limited", region: "ZA", currency: "ZAR", sector: "Basic Materials" },
    { ticker: "SBK", title: "Standard Bank Group Limited", region: "ZA", currency: "ZAR", sector: "Financial Services" },
    { ticker: "VOD", title: "Vodacom Group Limited", region: "ZA", currency: "ZAR", sector: "Telecommunications" }
];

export async function getCompanyProfile(ticker: string): Promise<CompanyProfile | null> {
    try {
        const yfResponse = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`, {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 3600 }
        });

        if (!yfResponse.ok) return null;

        const data = await yfResponse.json();
        const meta = data.chart?.result?.[0]?.meta;

        if (!meta) return null;

        const price = meta.regularMarketPrice || 0;
        const previousClose = meta.previousClose || price;
        const changePercent = previousClose ? ((price - previousClose) / previousClose) * 100 : 0;
        const companyName = meta.longName || meta.shortName || ticker;

        // Fetch description from Wikipedia Search
        let description = "Description not available.";
        try {
            const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(companyName)}&utf8=&format=json&srlimit=1`);
            const wikiData = await wikiRes.json();
            if (wikiData.query?.search?.[0]?.snippet) {
                // Strip HTML tags from the Wikipedia snippet
                description = (wikiData.query.search[0].snippet as string).replace(/<\/?[^>]+(>|$)/g, "") + "...";
            }
        } catch {
            console.error("Wiki fetch failed");
        }

        // Fetch Sector from SEC EDGAR mapping (only really works for US dual-listed or US companies)
        let sector = "Unknown";
        try {
            const userAgent = "Warrenintel contact@warrenintel.com";
            const secRes = await fetch("https://www.sec.gov/files/company_tickers.json", { headers: { "User-Agent": userAgent } });
            const secData = await secRes.json() as Record<string, SECTicker>;
            // Clean up ticker for matching (e.g. MSFT, not MSFT.LG)
            const cleanTicker = ticker.split('.')[0];
            const hit = Object.values(secData).find((item) => item.ticker === cleanTicker.toUpperCase());

            if (hit && hit.cik_str) {
                const cik = hit.cik_str.toString().padStart(10, '0');
                const subRes = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, { headers: { "User-Agent": userAgent } });
                const subData = await subRes.json() as { sicDescription?: string };
                sector = subData.sicDescription || "Unknown";
            }
        } catch {
            console.error("SEC fetch failed");
        }

        // African Market Fallbacks for Sector if SEC failed (which it will for pure NG/ZA/GH listings)
        if (sector === "Unknown") {
            const cleanTicker = ticker.split('.')[0];
            const afMatch = [...NIGERIA_COMPANIES, ...SOUTH_AFRICA_COMPANIES].find(c => c.ticker === cleanTicker);
            if (afMatch && afMatch.sector) {
                sector = afMatch.sector;
            }
        }

        return {
            symbol: meta.symbol,
            price: price,
            currency: meta.currency || (ticker.endsWith('.LG') ? 'NGN' : ticker.endsWith('.J') ? 'ZAR' : ticker.endsWith('.GH') ? 'GHS' : 'USD'),
            previousClose: previousClose,
            changePercent: parseFloat(changePercent.toFixed(2)),
            companyName: companyName,
            sector: sector,
            description: description,
            ceo: "Run Analysis to Extract",
            mktCap: 0,
            exchangeShortName: meta.fullExchangeName || "Unknown"
        };
    } catch (error) {
        console.error(`Error fetching robust profile for ${ticker}:`, error);
        return null;
    }
}

export async function getLatestAnnualReportUrl(ticker: string): Promise<string | null> {
    try {
        // 1. Get CIK mapping from SEC
        const userAgent = "Warrenintel contact@warrenintel.com"; // SEC compliance requires User-Agent
        const tickersResponse = await fetch("https://www.sec.gov/files/company_tickers.json", {
            headers: { "User-Agent": userAgent },
            next: { revalidate: 86400 } // Cache mapping
        });

        if (!tickersResponse.ok) {
            console.error("Failed to fetch SEC tickers");
            return null;
        }

        const tickersData = await tickersResponse.json() as Record<string, SECTicker>;
        const companyMatches = Object.values(tickersData).filter((item) => item.ticker === ticker.toUpperCase());

        if (companyMatches.length === 0 || !companyMatches[0].cik_str) return null;

        // SEC API requires 10-digit CIK string
        const cik = companyMatches[0].cik_str.toString().padStart(10, '0');

        // 2. Fetch submissions for this CIK
        const submissionsResponse = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
            headers: { "User-Agent": userAgent },
            next: { revalidate: 43200 } // Cache 12 hours
        });

        if (!submissionsResponse.ok) {
            console.error(`Failed to fetch SEC submissions for CIK ${cik}`);
            return null;
        }

        const submissionsData = await submissionsResponse.json() as {
            filings?: {
                recent?: {
                    form: string[];
                    accessionNumber: string[];
                    primaryDocument: string[];
                }
            }
        };

        // 3. Find latest 10-K
        const recentFilings = submissionsData.filings?.recent;
        if (!recentFilings) return null;

        const forms = recentFilings.form;
        let index10K = -1;
        for (let i = 0; i < forms.length; i++) {
            if (forms[i] === "10-K") {
                index10K = i;
                break;
            }
        }

        if (index10K === -1) return null;

        const accessionNumber = recentFilings.accessionNumber[index10K].replace(/-/g, '');
        const primaryDocument = recentFilings.primaryDocument[index10K];
        const rawCikStr = companyMatches[0].cik_str; // URL formulation uses unpadded CIK

        // 4. Construct direct EDGAR link
        return `https://www.sec.gov/Archives/edgar/data/${rawCikStr}/${accessionNumber}/${primaryDocument}`;

    } catch (error) {
        console.error("Error fetching SEC filings:", error);
        return null;
    }
}

// Map of major tickers by sector for the dashboard
export const DASHBOARD_TICKERS = [
    // Technology
    { ticker: "AAPL", sector: "Technology" },
    { ticker: "MSFT", sector: "Technology" },
    { ticker: "GOOGL", sector: "Technology" },
    { ticker: "NVDA", sector: "Technology" },
    { ticker: "META", sector: "Technology" },
    // Healthcare
    { ticker: "JNJ", sector: "Healthcare" },
    { ticker: "UNH", sector: "Healthcare" },
    { ticker: "LLY", sector: "Healthcare" },
    // Finance
    { ticker: "JPM", sector: "Finance" },
    { ticker: "V", sector: "Finance" },
    { ticker: "MA", sector: "Finance" },
    // Consumer Goods
    { ticker: "AMZN", sector: "Consumer" },
    { ticker: "WMT", sector: "Consumer" },
    { ticker: "PG", sector: "Consumer" },
    // Energy / Auto
    { ticker: "XOM", sector: "Energy" },
    { ticker: "TSLA", sector: "Auto" }
];

export async function getDashboardData(): Promise<CompanyProfile[]> {
    try {
        // Fetch all profiles concurrently
        const fetchPromises = DASHBOARD_TICKERS.map(item => getCompanyProfile(item.ticker));
        const results = await Promise.all(fetchPromises);

        // Filter out any nulls if a request failed, and inject our hardcoded sectors since Yahoo free removed them
        const validProfiles: CompanyProfile[] = [];

        results.forEach((profile, index) => {
            if (profile) {
                profile.sector = DASHBOARD_TICKERS[index].sector;
                validProfiles.push(profile);
            }
        });

        return validProfiles;
    } catch (error) {
        console.error("Failed to fetch dashboard batch data:", error);
        return [];
    }
}

export async function getHistoricalPrices(ticker: string, range: string = '1y'): Promise<HistoricalPrice[]> {
    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=1d`, {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 3600 } // Cache 1hr
        });

        if (!response.ok) return [];

        const data = await response.json();
        const result = data.chart?.result?.[0];

        if (!result || !result.timestamp || !result.indicators?.quote?.[0]?.close) {
            return [];
        }

        const timestamps: number[] = result.timestamp;
        const closes: number[] = result.indicators.quote[0].close;

        const prices: HistoricalPrice[] = [];

        for (let i = 0; i < timestamps.length; i++) {
            if (closes[i] !== null && closes[i] !== undefined) {
                // Convert unix timestamp to simple YYYY-MM-DD string
                const dateObj = new Date(timestamps[i] * 1000);
                prices.push({
                    date: dateObj.toISOString().split('T')[0],
                    price: parseFloat(closes[i].toFixed(2))
                });
            }
        }

        return prices;

    } catch (err) {
        console.error(`Failed to fetch historical chart data for ${ticker}:`, err);
        return [];
    }
}

export async function getRegionalCompanies(region: Region): Promise<SECTicker[]> {
    try {
        if (region === 'US') {
            const userAgent = "Warrenintel contact@warrenintel.com";
            const response = await fetch("https://www.sec.gov/files/company_tickers.json", {
                headers: { "User-Agent": userAgent },
                next: { revalidate: 86400 }
            });
            if (!response.ok) return [];
            const data = await response.json() as Record<string, SECTicker>;
            return Object.values(data).map((c) => ({
                ticker: c.ticker,
                title: c.title,
                cik_str: c.cik_str,
                region: 'US',
                currency: 'USD'
            }));
        }

        if (region === 'NG') return NIGERIA_COMPANIES;
        if (region === 'ZA') return SOUTH_AFRICA_COMPANIES;

        if (region === 'GH') {
            const response = await fetch("https://dev.kwayisi.org/apis/gse/equities");
            if (!response.ok) return [];
            const data = await response.json() as { name: string, price: number }[];
            return data.map(c => ({
                ticker: c.name,
                title: c.name, // GSE API doesn't provide long name in summary
                region: 'GH',
                currency: 'GHS'
            }));
        }

        return [];
    } catch (error) {
        console.error(`Failed to fetch ${region} companies:`, error);
        return [];
    }
}

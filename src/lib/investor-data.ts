export interface Investor {
    id: string;
    name: string;
    type: string;
    stage: string[];
    location: string;
    checks: string;
    thesis: string;
    flags: string[];
    description?: string;
    website?: string;
    contactEmail?: string;
    linkedIn?: string;
    rating?: number;
    updatedAt?: any;
    logo?: string;
    industries?: string[];
    minCheckSize?: number;
    wikipedia?: string;
    socials?: {
        linkedin?: string;
        twitter?: string;
    };
    deep_enriched?: boolean;
    personal?: {
        name?: string;
        email?: string;
        email_status?: string;
    };
    portfolio?: string[];
    portfolio_details?: { name: string; url?: string }[];
    news_links?: { title: string; url: string }[];
    check_size_details?: string;
    crunchbase?: string;
}

export interface InvestorStats {
    totalInvestors: number;
    activeStages: Record<string, number>;
    topIndustries: Record<string, number>;
    avgCheckSize: number;
}

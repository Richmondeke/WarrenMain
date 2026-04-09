"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, FileText, MessageSquareText } from "lucide-react";
import { SwotGrid } from "./SwotGrid";
import { FinancialHighlights } from "./FinancialHighlights";
import { RiskFlags } from "./RiskFlags";
import { AgmSummary } from "./AgmSummary";
import { CompanyProfile, HistoricalPrice } from "@/lib/financial-data";
import { PriceChart } from "./PriceChart";
import { formatCurrency } from "@/lib/utils";
import { EnrichedProfilePanel } from "./EnrichedProfilePanel";
import { CompanyNewsPanel } from "./CompanyNewsPanel";
import { FundingTimeline } from "./FundingTimeline";
import { ReportChat } from "./ReportChat";
import { FadeIn, FadeInStagger } from "../ui/Animations";
import { InsightSkeleton } from "../ui/Skeleton";

type Tab = "overview" | "swot" | "financials" | "risks" | "agm" | "funding" | "news" | "chat";

interface CompanyClientPageProps {
    ticker: string;
    profile: CompanyProfile;
    secFilingUrl: string | null;
    historicalData: HistoricalPrice[];
}

export function CompanyClientPage({ ticker, profile, secFilingUrl, historicalData }: CompanyClientPageProps) {
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!secFilingUrl) {
            setAnalysisError("No SEC 10-K filing available to analyze.");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const response = await fetch("/api/analyze-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticker, filingUrl: secFilingUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to analyze the report");
            }

            const json = await response.json();
            setAnalysisData(json.data);
            setActiveTab("swot"); // Auto-switch to insights
        } catch (err: any) {
            console.error(err);
            setAnalysisError(err.message || "An error occurred during analysis.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{profile.companyName}</h1>
                            <span className="px-3 py-1 bg-primary/10 text-[10px] font-black uppercase tracking-widest rounded-full text-primary border border-primary/20">{profile.exchangeShortName}</span>
                        </div>
                        <p className="text-xl font-bold text-muted-foreground opacity-70 tracking-tight">{ticker} · {profile.sector}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {secFilingUrl ? (
                            <>
                                <button
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-black py-3 px-6 rounded-2xl text-sm transition-all shadow-premium flex items-center gap-2 disabled:opacity-50 active:scale-95"
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !!analysisData}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Analyzing Intelligence...
                                        </>
                                    ) : analysisData ? (
                                        "Analysis Complete"
                                    ) : (
                                        "Analyze Form 10-K"
                                    )}
                                </button>
                                <a
                                    href={secFilingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-secondary/50 hover:bg-secondary text-foreground border border-glass-border font-bold py-3 px-6 rounded-2xl text-sm transition-all backdrop-blur-sm flex items-center gap-2 active:scale-95"
                                >
                                    <FileText className="w-4 h-4" />
                                    Source Report
                                </a>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Official SEC filings currently unavailable for this ticker.</p>
                        )}
                        {analysisError && <span className="text-rose-500 text-xs font-bold mt-2 md:mt-0">{analysisError}</span>}
                    </div>
                </div>

                {/* Sentiment Scorecard */}
                <div className="bg-card/40 backdrop-blur-md border border-glass-border rounded-3xl p-6 md:w-80 shadow-premium transition-all hover:border-primary/20">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">AI Sentiment</h3>
                        {analysisData?.sentiment_score?.label && (
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black rounded-full uppercase tracking-widest">
                                {analysisData.sentiment_score.label}
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-5xl font-black tracking-tighter text-foreground">
                            {analysisData?.sentiment_score?.score ? analysisData.sentiment_score.score.toFixed(1) : "-"}
                        </span>
                        <span className="text-muted-foreground font-bold opacity-30">/10</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium opacity-80">
                        {analysisData?.sentiment_score?.rationale || "Extract historical and qualitative sentiment by analyzing the official report."}
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-[72px] z-40 -mx-4 px-4 bg-background/50 backdrop-blur-md border-b border-glass-border mb-10 overflow-x-auto disable-scrollbar">
                <div className="flex space-x-1 min-w-max py-2">
                    <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Overview</TabButton>
                    <TabButton active={activeTab === "swot"} onClick={() => setActiveTab("swot")}>Intelligence</TabButton>
                    <TabButton active={activeTab === "financials"} onClick={() => setActiveTab("financials")}>Financials</TabButton>
                    <TabButton active={activeTab === "risks"} onClick={() => setActiveTab("risks")}>
                        <span className="flex items-center gap-1.5">Risks <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /></span>
                    </TabButton>
                    <TabButton active={activeTab === "news"} onClick={() => setActiveTab("news")}>News</TabButton>
                    <TabButton active={activeTab === "funding"} onClick={() => setActiveTab("funding")}>Funding</TabButton>
                    <TabButton active={activeTab === "agm"} onClick={() => setActiveTab("agm")}>AGM</TabButton>
                    <TabButton active={activeTab === "chat"} onClick={() => setActiveTab("chat")}>
                        <div className={`px-4 py-2 rounded-2xl border transition-all flex items-center gap-2 font-black uppercase tracking-[0.1em] text-[10px] ${activeTab === 'chat'
                            ? 'bg-primary text-primary-foreground border-primary shadow-premium'
                            : 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10'
                            }`}>
                            Chat AI <MessageSquareText className="w-3.5 h-3.5" />
                        </div>
                    </TabButton>
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {isAnalyzing && (
                    <FadeIn direction="none">
                        <InsightSkeleton />
                    </FadeIn>
                )}

                {!isAnalyzing && (
                    <>
                        {activeTab === "overview" && (
                            <FadeIn direction="up">
                                <div className="text-gray-300 max-w-3xl leading-relaxed space-y-6">
                                    <p>{profile.description}</p>

                                    {/* Core stock stats */}
                                    <FadeInStagger className="grid grid-cols-2 lg:grid-cols-4 gap-6" delayChildren={0.1}>
                                        <FadeIn direction="none">
                                            <div className="p-6 bg-card/40 backdrop-blur-md border border-glass-border rounded-[2rem] h-full shadow-sm hover:shadow-premium transition-all hover:bg-card/60 group">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-3 leading-none">Price</p>
                                                <div className="flex items-baseline gap-1">
                                                    <p className="font-black text-3xl tracking-tighter leading-none">{formatCurrency(profile.price, profile.currency)}</p>
                                                    <span className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest">{profile.currency}</span>
                                                </div>
                                            </div>
                                        </FadeIn>
                                        <FadeIn direction="none">
                                            <div className="p-6 bg-card/40 backdrop-blur-md border border-glass-border rounded-[2rem] h-full shadow-sm hover:shadow-premium transition-all hover:bg-card/60 group">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-3 leading-none">Sector</p>
                                                <p className="font-black text-lg tracking-tight leading-tight">{profile.sector}</p>
                                            </div>
                                        </FadeIn>
                                        <FadeIn direction="none">
                                            <div className="p-6 bg-card/40 backdrop-blur-md border border-glass-border rounded-[2rem] h-full shadow-sm hover:shadow-premium transition-all hover:bg-card/60 group">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-3 leading-none">CEO</p>
                                                <p className="font-black text-lg tracking-tight leading-tight">{analysisData?.profile_updates?.ceo || profile.ceo}</p>
                                            </div>
                                        </FadeIn>
                                        <FadeIn direction="none">
                                            <div className="p-6 bg-card/40 backdrop-blur-md border border-glass-border rounded-[2rem] h-full shadow-sm hover:shadow-premium transition-all hover:bg-card/60 group">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-3 leading-none">Market Cap</p>
                                                <p className="font-black text-2xl tracking-tighter leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {analysisData?.profile_updates?.market_cap || (profile.mktCap > 0 ? `${formatCurrency(profile.mktCap / 1000000000, profile.currency)}B` : "---")}
                                                </p>
                                            </div>
                                        </FadeIn>
                                    </FadeInStagger>

                                    {/* Enriched company profile (employees, founded, HQ, LinkedIn) */}
                                    <FadeIn delay={0.3}>
                                        <div className="border-t border-navy-800 pt-4">
                                            <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Company Details</h3>
                                            <EnrichedProfilePanel companyName={profile.companyName} />
                                        </div>
                                    </FadeIn>

                                    {/* Historical Chart */}
                                    <FadeIn delay={0.4}>
                                        <PriceChart data={historicalData} ticker={ticker} currency={profile.currency} />
                                    </FadeIn>
                                </div>
                            </FadeIn>
                        )}
                        {activeTab === "funding" && (
                            <FadeIn direction="up">
                                <div className="max-w-2xl">
                                    <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-6">Funding History</h3>
                                    <FundingTimeline companySlug={profile.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")} />
                                </div>
                            </FadeIn>
                        )}
                        {activeTab === "news" && (
                            <FadeIn direction="up">
                                <div className="max-w-2xl">
                                    <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-6">Latest News</h3>
                                    <CompanyNewsPanel companyName={profile.companyName} />
                                </div>
                            </FadeIn>
                        )}
                        {activeTab === "swot" && (
                            <FadeIn direction="up">
                                <SwotGrid data={analysisData?.swot} />
                            </FadeIn>
                        )}
                        {activeTab === "financials" && (
                            <FadeIn direction="up">
                                <FinancialHighlights data={analysisData?.financials} />
                            </FadeIn>
                        )}
                        {activeTab === "risks" && (
                            <FadeIn direction="up">
                                <RiskFlags data={analysisData?.risk_flags} />
                            </FadeIn>
                        )}
                        {activeTab === "agm" && (
                            <FadeIn direction="up">
                                <AgmSummary data={analysisData?.agm_summary} />
                            </FadeIn>
                        )}
                        {activeTab === "chat" && (
                            <FadeIn direction="up" className="h-[600px]">
                                <ReportChat ticker={ticker} companyName={profile.companyName} filingUrl={secFilingUrl} />
                            </FadeIn>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    if (active && typeof children === 'object' && 'props' in (children as any) && (children as any).props.className?.includes('bg-primary')) {
        return <div onClick={onClick} className="cursor-pointer">{children}</div>;
    }

    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group whitespace-nowrap ${active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
        >
            {children}
            {active && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.4)]"></span>
            )}
        </button>
    );
}

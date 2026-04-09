"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SwotGrid } from "@/components/company/SwotGrid";
import { FinancialHighlights } from "@/components/company/FinancialHighlights";
import { RiskFlags } from "@/components/company/RiskFlags";
import { AgmSummary } from "@/components/company/AgmSummary";

type Tab = "overview" | "swot" | "financials" | "risks" | "agm";

export default function ResultsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("swot");
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [companyName, setCompanyName] = useState<string>("Unknown Company");
    const router = useRouter();

    useEffect(() => {
        // Retrieve the data from session storage
        const storedData = sessionStorage.getItem("warrenintel_analysis");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                setAnalysisData(parsed.data);
                setCompanyName(parsed.companyName || "Unknown Company");
            } catch (e) {
                console.error("Failed to parse analysis data from session storage:", e);
                router.push("/");
            }
        } else {
            // If no data, send them back to the upload page
            router.push("/");
        }
    }, [router]);

    if (!analysisData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-400">Loading analysis data...</div>
            </div>
        );
    }

    const { sentiment_score } = analysisData;

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Upload
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{companyName}</h1>
                        <span className="px-2 py-1 bg-navy-800 text-xs rounded-md text-gray-300 font-mono border border-navy-800">AI Analyzed</span>
                    </div>

                    <div className="flex items-center gap-3 mt-4 text-gray-400 text-sm">
                        <p>Annual Report extracted via Gemini 1.5 Pro</p>
                    </div>
                </div>

                {/* Sentiment Scorecard */}
                <div className="bg-card border border-navy-800 rounded-xl p-4 md:w-80 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Investment Sentiment</h3>
                        {sentiment_score?.label && (
                            <span className="px-2.5 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold rounded-full">
                                {sentiment_score.label}
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl font-mono font-bold text-white">
                            {sentiment_score?.score ? sentiment_score.score.toFixed(1) : "N/A"}
                        </span>
                        <span className="text-gray-500 font-mono">/10</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed text-balance">
                        {sentiment_score?.rationale || "No rationale provided by AI."}
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto border-b border-navy-800 mb-6 disable-scrollbar">
                <div className="flex space-x-1 min-w-max">
                    <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Overview</TabButton>
                    <TabButton active={activeTab === "swot"} onClick={() => setActiveTab("swot")}>SWOT Analysis</TabButton>
                    <TabButton active={activeTab === "financials"} onClick={() => setActiveTab("financials")}>Financials</TabButton>
                    <TabButton active={activeTab === "risks"} onClick={() => setActiveTab("risks")}>
                        <span className="flex items-center gap-1.5">Risk Flags <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /></span>
                    </TabButton>
                    <TabButton active={activeTab === "agm"} onClick={() => setActiveTab("agm")}>AGM Summary</TabButton>
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "overview" && <div className="text-gray-400 max-w-3xl leading-relaxed">
                    Overview content goes here. Select SWOT, Financials, or Risk Flags for detailed extracted data from this report.
                </div>}
                {activeTab === "swot" && <SwotGrid data={analysisData.swot} />}
                {activeTab === "financials" && <FinancialHighlights data={analysisData.financials} />}
                {activeTab === "risks" && <RiskFlags data={analysisData.risk_flags} />}
                {activeTab === "agm" && <AgmSummary data={analysisData.agm_summary} />}
            </div>
        </div>
    );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${active
                ? "border-gold-500 text-gold-500"
                : "border-transparent text-gray-400 hover:text-white hover:border-navy-800"
                }`}
        >
            {children}
        </button>
    );
}

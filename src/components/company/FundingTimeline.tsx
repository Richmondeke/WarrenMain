"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users } from "lucide-react";
import type { FundingRound } from "@/lib/funding";

interface FundingTimelineProps {
    companySlug: string; // lowercase company name used as Crunchbase slug
}

function formatAmount(amount: number | null): string {
    if (!amount) return "Undisclosed";
    if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
}

function getRoundColor(round: string): string {
    const r = round.toLowerCase();
    if (r.includes("seed")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (r.includes("series a")) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (r.includes("series b")) return "bg-violet-500/10 text-violet-500 border-violet-500/20";
    if (r.includes("series c")) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    if (r.includes("series d") || r.includes("series e")) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (r.includes("ipo")) return "bg-primary/10 text-primary border-primary/20";
    return "bg-secondary text-muted-foreground border-glass-border";
}

export function FundingTimeline({ companySlug }: FundingTimelineProps) {
    const [rounds, setRounds] = useState<FundingRound[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/funding/${encodeURIComponent(companySlug)}`)
            .then(res => res.ok ? res.json() : { rounds: [] })
            .then(json => setRounds(json.rounds || []))
            .catch(() => setRounds([]))
            .finally(() => setLoading(false));
    }, [companySlug]);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-card/40 backdrop-blur-sm border border-glass-border rounded-3xl" />
                ))}
            </div>
        );
    }

    if (!rounds.length) {
        return <p className="text-muted-foreground text-sm italic py-12 text-center opacity-60 font-medium">No official funding rounds recorded.</p>;
    }

    const totalRaised = rounds.reduce((sum, r) => sum + (r.amount || 0), 0);

    return (
        <div className="space-y-10">
            {/* Total raised summary */}
            {totalRaised > 0 && (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 p-8 rounded-3xl bg-primary/5 border border-primary/10 backdrop-blur-md shadow-premium">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                        <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Cumulative Capital</p>
                            <p className="text-3xl font-black text-foreground tracking-tighter">{formatAmount(totalRaised)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Rounds Closed</p>
                            <p className="text-3xl font-black text-foreground tracking-tighter">{rounds.length}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Funding rounds timeline */}
            <div className="relative pl-8 space-y-6">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-glass-border to-transparent" />
                {[...rounds].reverse().map((round, i) => (
                    <div key={i} className="relative group">
                        {/* Timeline dot */}
                        <div className="absolute -left-[32.5px] top-6 w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-background border border-primary/50 group-hover:scale-125 transition-transform" />

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl bg-card/40 backdrop-blur-md border border-glass-border transition-all hover:bg-card/50 hover:shadow-premium">
                            <div className="flex flex-wrap items-center gap-4">
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getRoundColor(round.round)}`}>
                                    {round.round}
                                </span>
                                <span className="text-xl font-black tracking-tighter text-foreground">{formatAmount(round.amount)}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-medium">
                                {round.investors.length > 0 && (
                                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 border border-glass-border">
                                        <Users className="w-3.5 h-3.5" />
                                        <span className="opacity-90">
                                            {round.investors.slice(0, 2).join(", ")}
                                            {round.investors.length > 2 && ` +${round.investors.length - 2}`}
                                        </span>
                                    </span>
                                )}
                                {round.date && <span className="opacity-60">{round.date}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

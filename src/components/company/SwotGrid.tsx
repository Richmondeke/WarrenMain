"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Target, ShieldAlert } from "lucide-react";

type QuadrantProps = {
    title: string;
    type: "strength" | "weakness" | "opportunity" | "threat";
    items: string[];
    icon: React.ReactNode;
};

type SwotData = {
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
};

export function SwotGrid({ data }: { data?: SwotData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Quadrant
                title="Strengths"
                type="strength"
                icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                items={data?.strengths || ["No strengths found."]}
            />
            <Quadrant
                title="Weaknesses"
                type="weakness"
                icon={<TrendingDown className="w-5 h-5 text-red-500" />}
                items={data?.weaknesses || ["No weaknesses found."]}
            />
            <Quadrant
                title="Opportunities"
                type="opportunity"
                icon={<Target className="w-5 h-5 text-blue-500" />}
                items={data?.opportunities || ["No opportunities found."]}
            />
            <Quadrant
                title="Threats"
                type="threat"
                icon={<ShieldAlert className="w-5 h-5 text-yellow-500" />}
                items={data?.threats || ["No threats found."]}
            />
        </div>
    );
}

function Quadrant({ title, type, items, icon }: QuadrantProps) {
    const [expanded, setExpanded] = useState(false);

    const styles = {
        strength: "border-emerald-500/20 bg-emerald-500/5",
        weakness: "border-rose-500/20 bg-rose-500/5",
        opportunity: "border-blue-500/20 bg-blue-500/5",
        threat: "border-amber-500/20 bg-amber-500/5",
    };

    const headerColors = {
        strength: "text-emerald-400",
        weakness: "text-rose-400",
        opportunity: "text-blue-400",
        threat: "text-amber-400",
    };

    const displayItems = expanded ? items : items.slice(0, 3);
    const hasMore = items.length > 3;

    return (
        <div className={`rounded-3xl border p-6 backdrop-blur-md ${styles[type]} transition-all hover:shadow-premium`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-background/40 border border-glass-border">
                    {icon}
                </div>
                <h3 className={`text-lg font-black tracking-tight ${headerColors[type]}`}>{title}</h3>
            </div>

            <ul className="space-y-4">
                {displayItems.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/20 shrink-0 border border-primary/40"></span>
                        <span className="leading-relaxed font-medium opacity-90">{item}</span>
                    </li>
                ))}
            </ul>

            {hasMore && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                    {expanded ? (
                        <>Read less <ChevronUp className="ml-1.5 w-3 h-3" /></>
                    ) : (
                        <>Read more ({items.length - 3}) <ChevronDown className="ml-1.5 w-3 h-3" /></>
                    )}
                </button>
            )}
        </div>
    );
}

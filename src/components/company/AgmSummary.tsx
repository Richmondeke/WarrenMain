import { CheckCircle2, XCircle, AlertCircle, Users } from "lucide-react";

type AgmItem = {
    title: string;
    status: string;
    votes: string;
    note?: string;
};

export function AgmSummary({ data }: { data?: AgmItem[] }) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary" />
                    AGM Governance Outcomes
                </h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Meeting Date: May 12, 2024</span>
            </div>

            <div className="bg-card/40 backdrop-blur-md border border-glass-border rounded-3xl overflow-hidden shadow-premium">
                <div className="grid grid-cols-12 bg-primary/5 p-6 border-b border-glass-border text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                    <div className="col-span-8 md:col-span-9">Resolution / Governance Item</div>
                    <div className="col-span-4 md:col-span-3 text-right">Outcome</div>
                </div>

                <div className="divide-y divide-glass-border">
                    {data && data.length > 0 ? data.map((item, index) => (
                        <ResolutionRow
                            key={index}
                            title={item.title || "Unknown Resolution"}
                            status={item.status as any}
                            votes={item.votes || "N/A"}
                            note={item.note}
                        />
                    )) : (
                        <div className="p-8 text-center text-muted-foreground italic font-medium opacity-60">No structured AGM data extracted.</div>
                    )}
                </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-glass-border text-sm text-muted-foreground leading-relaxed font-medium">
                <strong className="text-foreground font-black block mb-2 uppercase tracking-widest text-[10px] opacity-60">Analyst Synthesis</strong>
                The primary point of contention at this AGM was the remuneration report, which suffered a &quot;first strike&quot; due to high executive bonuses amid flat dividend payouts. Management may face a board spill if a second strike occurs next year.
            </div>
        </div>
    );
}

function ResolutionRow({ title, status, votes, note }: { title: string, status: "passed" | "failed" | "passed_warning", votes: string, note?: string }) {
    const statusConfig = {
        passed: {
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
            text: "Passed",
            className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        },
        passed_warning: {
            icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
            text: "Contested",
            className: "text-amber-500 bg-amber-500/10 border-amber-500/20"
        },
        failed: {
            icon: <XCircle className="w-4 h-4 text-rose-500" />,
            text: "Rejected",
            className: "text-rose-500 bg-rose-500/10 border-rose-500/20"
        }
    };

    const config = statusConfig[status];

    return (
        <div className="grid grid-cols-12 p-6 items-center hover:bg-white/5 transition-all group">
            <div className="col-span-8 md:col-span-9">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{title}</p>
                {note && <p className="text-[10px] font-black text-amber-500 mt-2 flex items-center gap-1.5 uppercase tracking-widest"><AlertCircle className="w-3.5 h-3.5" /> {note}</p>}
            </div>
            <div className="col-span-4 md:col-span-3 text-right flex flex-col items-end justify-center">
                <div className={`flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${config.className}`}>
                    {config.icon}
                    {config.text}
                </div>
                <div className="text-[10px] text-muted-foreground font-black tracking-widest mt-2 opacity-40">{votes} FOR</div>
            </div>
        </div>
    );
}

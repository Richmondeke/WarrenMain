import { AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react";

type RiskData = {
    level: "high" | "medium" | "low";
    title: string;
    description: string;
};

export function RiskFlags({ data }: { data?: RiskData[] }) {
    const defaultRisks: RiskData[] = [
        {
            level: "medium",
            title: "No Risk Data Found",
            description: "We could not identify notable risks in the provided document, or analysis is still pending.",
        }
    ];

    const displayRisks = data && data.length > 0 ? data : defaultRisks;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-primary" />
                    Critical Intelligence Risks
                </h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Source: Official 2024 Audit</div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {displayRisks.map((risk, index) => (
                    <RiskCard
                        key={index}
                        level={risk.level as any}
                        title={risk.title}
                        description={risk.description}
                    />
                ))}
            </div>
        </div>
    );
}

function RiskCard({ level, title, description }: { level: "high" | "medium" | "low", title: string, description: string }) {
    const config = {
        high: {
            border: "border-rose-500/20",
            bg: "bg-rose-500/5",
            icon: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
            badge: "bg-rose-500/10 text-rose-500 border-rose-500/20",
            label: "CRITICAL"
        },
        medium: {
            border: "border-amber-500/20",
            bg: "bg-amber-500/5",
            icon: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
            badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            label: "MODERATE"
        },
        low: {
            border: "border-glass-border",
            bg: "bg-card/40",
            icon: <Info className="w-5 h-5 text-muted-foreground shrink-0" />,
            badge: "bg-secondary text-muted-foreground border-glass-border",
            label: "INSIGNIFICANT"
        }
    };

    const style = config[level];

    return (
        <div className={`p-6 rounded-3xl border backdrop-blur-md ${style.border} ${style.bg} flex gap-5 transition-all hover:shadow-premium group`}>
            <div className="mt-1">{style.icon}</div>
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <h3 className="font-black tracking-tight text-lg text-foreground group-hover:text-primary transition-colors">{title}</h3>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${style.badge} whitespace-nowrap self-start sm:self-auto uppercase tracking-widest`}>
                        {style.label}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {description}
                </p>
            </div>
        </div>
    );
}

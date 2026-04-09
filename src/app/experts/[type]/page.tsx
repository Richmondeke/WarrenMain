import { ExpertSearchView } from "@/components/experts/ExpertSearchView";

export default function ExpertPage({ params }: { params: { type: string } }) {
    const typeMap: Record<string, { label: string; title: string }> = {
        designers: { label: "Designers", title: "Deck Designers" },
        advisors: { label: "Advisors", title: "Fundraising Advisors" },
        lawyers: { label: "Lawyers", title: "Startup Lawyers" },
        builders: { label: "Builders", title: "MVP Builders" }
    };

    const config = typeMap[params.type] || { label: "Experts", title: "Startup Experts" };

    return <ExpertSearchView type={config.label} title={config.title} />;
}

export function generateStaticParams() {
    return [
        { type: "designers" },
        { type: "advisors" },
        { type: "lawyers" },
        { type: "builders" }
    ];
}

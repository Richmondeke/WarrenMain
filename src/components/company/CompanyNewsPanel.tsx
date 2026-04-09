"use client";

import { useEffect, useState } from "react";
import { TrendingUp, ExternalLink } from "lucide-react";
import type { NewsArticle } from "@/lib/news";

interface CompanyNewsPanelProps {
    companyName: string;
}

function formatDate(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
        return dateStr;
    }
}

export function CompanyNewsPanel({ companyName }: CompanyNewsPanelProps) {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/news?company=${encodeURIComponent(companyName)}`)
            .then(res => res.ok ? res.json() : { articles: [] })
            .then(json => setArticles(json.articles || []))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, [companyName]);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-card/40 backdrop-blur-sm border border-glass-border rounded-3xl" />
                ))}
            </div>
        );
    }

    if (!articles.length) {
        return <p className="text-muted-foreground text-sm italic py-8 text-center opacity-60 font-medium">No fresh intelligence feeds detected.</p>;
    }

    return (
        <div className="space-y-4">
            {articles.map((article, i) => (
                <a
                    key={i}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-5 p-6 rounded-3xl bg-card/40 backdrop-blur-md border border-glass-border hover:border-primary/40 hover:bg-card/60 transition-all group hover:shadow-premium"
                >
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-black text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                        </p>
                        {article.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 font-medium leading-relaxed opacity-80 group-hover:opacity-100">{article.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-4 opacity-40 group-hover:opacity-60 transition-opacity">
                            <span>{article.source}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                            <span>{formatDate(article.pubDate)}</span>
                        </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors mt-1" />
                </a>
            ))}
        </div>
    );
}

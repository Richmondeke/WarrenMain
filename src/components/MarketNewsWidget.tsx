"use client";

import { useEffect, useState } from "react";
import { Newspaper, ExternalLink, TrendingUp } from "lucide-react";
import type { NewsArticle } from "@/lib/news";

function formatDate(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
        return "";
    }
}

export function MarketNewsWidget() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/news")
            .then(res => res.ok ? res.json() : { articles: [] })
            .then(json => setArticles(json.articles || []))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                    <Newspaper className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Market Intelligence</h2>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-muted/30 rounded-3xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {articles.slice(0, 4).map((article, i) => (
                        <a
                            key={i}
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col justify-between p-6 rounded-3xl border border-glass-border bg-card/40 backdrop-blur-sm hover:border-primary/40 hover:shadow-premium transition-all duration-300 group h-full"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-4">
                                    <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-sm font-bold leading-relaxed line-clamp-3 group-hover:text-primary transition-colors tracking-tight">
                                    {article.title}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-6 pt-4 border-t border-glass-border/50">
                                <span className="text-primary/70">{article.source}</span>
                                <span className="opacity-30">·</span>
                                <span className="opacity-60">{formatDate(article.pubDate)}</span>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </section>
    );
}

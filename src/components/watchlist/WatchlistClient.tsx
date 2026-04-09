"use client";

import { useAuth } from "@/lib/firebase/AuthContext";
import { getWatchlist, toggleWatchlist } from "@/lib/firestore";
import { useEffect, useState } from "react";
import { Loader2, ExternalLink, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getRegionalCompanies, SECTicker, Region } from "@/lib/financial-data";
import { AuthModal } from "@/components/auth/AuthModal";

export function WatchlistClient() {
    const { user, loading: authLoading } = useAuth();
    const [savedTickers, setSavedTickers] = useState<string[]>([]);
    const [companies, setCompanies] = useState<SECTicker[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setLoadingData(false);
            return;
        }

        let mounted = true;

        async function loadWatchlist() {
            try {
                if (!user) return;
                const tickers = await getWatchlist(user.uid);

                if (!mounted) return;
                setSavedTickers(tickers);

                if (tickers.length === 0) {
                    setLoadingData(false);
                    return;
                }

                // Fetch all regions to cross-match (could be optimized later)
                const [us, ng, gh, za] = await Promise.all([
                    getRegionalCompanies("US"),
                    getRegionalCompanies("NG"),
                    getRegionalCompanies("GH"),
                    getRegionalCompanies("ZA"),
                ]);

                // Flatten all companies to find matches
                const allCompanies = [...us, ...ng, ...gh, ...za];

                const matchedCompanies = tickers.map(tickerString => {
                    // Ticker string from watchlist might have regional suffixes (.LG, .J)
                    const normalized = tickerString.split('.')[0];
                    // Find exactly if exists, or try to match
                    const match = allCompanies.find(c => {
                        const fullTicker = c.region !== 'US' && !c.ticker.includes('.') ? `${c.ticker}${c.region === 'NG' ? '.LG' : c.region === 'ZA' ? '.J' : c.region === 'GH' ? '.GH' : ''}` : c.ticker;
                        return fullTicker === tickerString || c.ticker === tickerString;
                    });

                    return match || {
                        ticker: tickerString,
                        title: "Unknown Company",
                        region: "US" as Region
                    };
                });

                if (mounted) {
                    setCompanies(matchedCompanies);
                    setLoadingData(false);
                }

            } catch (err) {
                console.error("Failed to load watchlist data", err);
                if (mounted) setLoadingData(false);
            }
        }

        loadWatchlist();

        return () => { mounted = false; };
    }, [user, authLoading]);

    const handleRemove = async (tickerString: string) => {
        if (!user) return;

        // Optimistic UI
        setSavedTickers(prev => prev.filter(t => t !== tickerString));
        setCompanies(prev => prev.filter(c => {
            const fullTicker = c.region !== 'US' && !c.ticker.includes('.') ? `${c.ticker}${c.region === 'NG' ? '.LG' : c.region === 'ZA' ? '.J' : c.region === 'GH' ? '.GH' : ''}` : c.ticker;
            return fullTicker !== tickerString && c.ticker !== tickerString;
        }));

        try {
            await toggleWatchlist(user.uid, tickerString, false);
        } catch (error) {
            console.error("Failed to remove from watchlist", error);
            // In a real app we might revert the optimistic update here.
        }
    };

    if (authLoading || loadingData) {
        return (
            <div className="flex flex-col justify-center items-center py-32 min-h-[50vh] space-y-6">
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
                    <Loader2 className="w-12 h-12 animate-spin text-primary absolute top-0 left-0 [animation-delay:0.2s]" />
                </div>
                <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Synchronizing Intelligence...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-24 bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-glass-border border-dashed shadow-premium relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-sm relative z-10">
                    <Star className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-4 relative z-10">Sign in to track your <span className="text-primary">Edge</span></h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-10 font-medium leading-relaxed opacity-80 relative z-10 px-6">
                    Create an account to save high-conviction companies, track their SEC filings, and access AI-powered deep-dives instantly.
                </p>
                <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-sm transition-all shadow-premium hover:shadow-primary/20 active:scale-95 relative z-10"
                >
                    Initialize Intelligence
                </button>
                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </div>
        );
    }

    if (savedTickers.length === 0) {
        return (
            <div className="text-center py-24 bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-glass-border border-dashed shadow-premium relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-sm relative z-10">
                    <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-4 relative z-10">Your Watchlist is <span className="text-primary">Empty</span></h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-10 font-medium leading-relaxed opacity-80 relative z-10 px-6">
                    Begin your research by exploring the market. Add companies to your watchlist to monitor their qualitative signals and financial health.
                </p>
                <Link
                    href="/"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-sm transition-all shadow-premium hover:shadow-primary/20 active:scale-95 inline-block relative z-10"
                >
                    Explore Markets
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, i) => {
                const fullTicker = company.region !== 'US' && !company.ticker.includes('.') ? `${company.ticker}${company.region === 'NG' ? '.LG' : company.region === 'ZA' ? '.J' : company.region === 'GH' ? '.GH' : ''}` : company.ticker;

                return (
                    <div key={`${fullTicker}-${i}`} className="bg-card/40 backdrop-blur-md border border-glass-border rounded-[2rem] p-8 shadow-sm hover:shadow-premium transition-all duration-500 relative group overflow-hidden hover:border-primary/30">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>

                        <button
                            onClick={() => handleRemove(fullTicker)}
                            className="absolute top-6 right-6 p-2.5 text-yellow-500 hover:text-rose-500 bg-background/50 backdrop-blur-md border border-glass-border hover:border-rose-500/30 rounded-xl transition-all z-10 md:opacity-0 group-hover:opacity-100 shadow-sm"
                            title="Remove from Watchlist"
                        >
                            <Star className="w-4 h-4 fill-yellow-500 group-hover:fill-current" />
                        </button>

                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="space-y-1">
                                <h3 className="font-black text-2xl tracking-tighter text-foreground leading-none">{company.ticker}</h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] line-clamp-1 opacity-60 leading-none">{company.title}</p>
                            </div>
                        </div>

                        <div className="mt-auto flex gap-4 relative z-10">
                            <Link
                                href={`/company/${fullTicker}`}
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-[0.1em] transition-all shadow-premium hover:shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
                            >
                                AI Analysis
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronUp, ChevronDown, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { getRegionalCompanies, Region, SECTicker } from "@/lib/financial-data";
import { useAuth } from "@/lib/firebase/AuthContext";
import { getWatchlist, toggleWatchlist } from "@/lib/firestore";
import { AuthModal } from "./auth/AuthModal";

interface CompanyTableProps {
    initialCompanies: SECTicker[];
    initialRegion: Region;
}

type SortField = "ticker" | "title";
type SortOrder = "asc" | "desc";

export function CompanyTable({ initialCompanies, initialRegion }: CompanyTableProps) {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<SECTicker[]>(initialCompanies);
    const [region, setRegion] = useState<Region>(initialRegion);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<SortField>("ticker");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [togglingTimers, setTogglingTimers] = useState<Record<string, boolean>>({});
    const itemsPerPage = 15;

    useEffect(() => {
        let mounted = true;
        if (user?.uid) {
            getWatchlist(user.uid).then(list => {
                if (mounted) setWatchlist(list);
            });
        } else {
            setWatchlist([]);
        }
        return () => { mounted = false; };
    }, [user]);

    const handleRegionChange = async (newRegion: Region) => {
        setIsLoading(true);
        setRegion(newRegion);
        try {
            const data = await getRegionalCompanies(newRegion);
            setCompanies(data);
            setCurrentPage(1);
            setSearchQuery("");
        } catch (error) {
            console.error("Failed to change region:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleWatchlist = async (tickerId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        if (togglingTimers[tickerId]) return;

        setTogglingTimers(prev => ({ ...prev, [tickerId]: true }));
        const isCurrentlyWatched = watchlist.includes(tickerId);

        // Optimistic update
        setWatchlist(prev =>
            isCurrentlyWatched ? prev.filter(t => t !== tickerId) : [...prev, tickerId]
        );

        try {
            await toggleWatchlist(user.uid, tickerId, !isCurrentlyWatched);
        } catch (error) {
            console.error("Failed to toggle watchlist", error);
            // Revert on failure
            setWatchlist(prev =>
                isCurrentlyWatched ? [...prev, tickerId] : prev.filter(t => t !== tickerId)
            );
        } finally {
            setTogglingTimers(prev => ({ ...prev, [tickerId]: false }));
        }
    };

    // Filter and Sort
    const filteredAndSorted = useMemo(() => {
        let result = companies.filter(company =>
            company.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        result.sort((a, b) => {
            const valA = a[sortField]?.toString().toLowerCase() || "";
            const valB = b[sortField]?.toString().toLowerCase() || "";

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [companies, searchQuery, sortField, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
    const paginatedItems = filteredAndSorted.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
        setCurrentPage(1);
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortOrder === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Market Explorer</h2>
                    <div className="flex flex-wrap gap-2">
                        {(['US', 'NG', 'GH', 'ZA'] as Region[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => handleRegionChange(r)}
                                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border transition-all duration-300 ${region === r
                                    ? "bg-primary border-primary text-primary-foreground shadow-premium"
                                    : "bg-secondary/50 border-glass-border text-muted-foreground hover:border-primary/30 hover:bg-secondary"
                                    }`}
                            >
                                {r === 'US' ? '🇺🇸 USA' : r === 'NG' ? '🇳🇬 Nigeria' : r === 'GH' ? '🇬🇭 Ghana' : '🇿🇦 S. Africa'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="search"
                        placeholder="Search markets..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-secondary/50 border border-glass-border rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all shadow-sm focus:shadow-md"
                    />
                </div>
            </div>

            <div className={`overflow-x-auto rounded-3xl border border-glass-border bg-card/40 backdrop-blur-sm shadow-sm transition-all duration-500 ${isLoading ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="px-4 py-3 w-10"></th>
                            <th
                                className="px-6 py-3 cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => handleSort("ticker")}
                            >
                                <div className="flex items-center">
                                    Ticker
                                    <SortIcon field="ticker" />
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => handleSort("title")}
                            >
                                <div className="flex items-center">
                                    Company Name
                                    <SortIcon field="title" />
                                </div>
                            </th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {paginatedItems.map((company) => {
                            const fullTicker = company.region !== 'US' && !company.ticker.includes('.') ? `${company.ticker}${region === 'NG' ? '.LG' : region === 'ZA' ? '.J' : region === 'GH' ? '.GH' : ''}` : company.ticker;
                            const isWatched = watchlist.includes(fullTicker);

                            return (
                                <tr key={fullTicker} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={(e) => handleToggleWatchlist(fullTicker, e)}
                                            className="focus:outline-none text-muted-foreground hover:text-yellow-500 transition-colors"
                                            aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
                                        >
                                            <Star className={`w-4 h-4 ${isWatched ? "fill-yellow-500 text-yellow-500" : ""}`} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-primary">{company.ticker}</td>
                                    <td className="px-6 py-4 truncate max-w-md">{company.title}</td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/company/${fullTicker}`}
                                            className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                                        >
                                            Analyze
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {paginatedItems.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                                    No companies found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center px-2 py-4">
                    <div className="text-xs text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length} companies
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-xs rounded-md bg-secondary text-secondary-foreground disabled:opacity-50 border border-transparent hover:border-border transition-colors"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-medium px-2">Page {currentPage} of {totalPages}</span>
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-xs rounded-md bg-secondary text-secondary-foreground disabled:opacity-50 border border-transparent hover:border-border transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}

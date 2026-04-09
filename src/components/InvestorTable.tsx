"use client";

import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, ExternalLink, Mail, MapPin, Briefcase } from "lucide-react";
import { Investor } from "@/lib/investor-data";

interface InvestorTableProps {
    investors: Investor[];
}

type SortField = "name" | "type" | "location";
type SortOrder = "asc" | "desc";

export function InvestorTable({ investors }: InvestorTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // Filter and Sort
    const filteredAndSorted = useMemo(() => {
        let result = investors.filter(investor =>
            investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (investor.industries || []).some(i => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
            investor.location.toLowerCase().includes(searchQuery.toLowerCase())
        );

        result.sort((a, b) => {
            const valA = a[sortField]?.toString().toLowerCase() || "";
            const valB = b[sortField]?.toString().toLowerCase() || "";

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [investors, searchQuery, sortField, sortOrder]);

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
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Investor Database</h2>
                    <p className="text-muted-foreground text-sm">Discover and connect with top investors across all stages and industries.</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="search"
                        placeholder="Search by name, industry, or location..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-secondary/50 border border-glass-border rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all shadow-sm focus:shadow-md"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-[2rem] border border-glass-border bg-card/10 backdrop-blur-md shadow-premium">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/30 border-b border-glass-border">
                        <tr>
                            <th
                                className="px-6 py-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                                onClick={() => handleSort("name")}
                            >
                                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Investor
                                    <SortIcon field="name" />
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                                onClick={() => handleSort("type")}
                            >
                                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Type
                                    <SortIcon field="type" />
                                </div>
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Focus & Stage</th>
                            <th
                                className="px-6 py-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                                onClick={() => handleSort("location")}
                            >
                                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Location
                                    <SortIcon field="location" />
                                </div>
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Contact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border">
                        {paginatedItems.map((investor) => (
                            <tr key={investor.id} className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-lg tracking-tighter text-white">{investor.name}</span>
                                        {investor.website && (
                                            <a href={investor.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-1 font-bold uppercase tracking-wider">
                                                Visit Website <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 rounded-full bg-secondary/50 border border-glass-border text-[10px] font-black uppercase tracking-widest text-primary">
                                        {investor.type}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-wrap gap-1">
                                            {(investor.industries || []).slice(0, 3).map(ind => (
                                                <span key={ind} className="text-[10px] font-medium text-muted-foreground bg-muted/20 px-2 py-0.5 rounded-md border border-muted/30">
                                                    {ind}
                                                </span>
                                            ))}
                                            {(investor.industries || []).length > 3 && (
                                                <span className="text-[10px] text-muted-foreground font-bold">+{(investor.industries || []).length - 3} more</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-emerald-500">
                                            <Briefcase className="w-3 h-3" />
                                            {investor.stage.join(" · ")}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                        {investor.location}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    {investor.contactEmail ? (
                                        <a href={`mailto:${investor.contactEmail}`} className="inline-flex items-center justify-center p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground text-xs italic">N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {paginatedItems.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="p-4 rounded-full bg-muted/20">
                                            <Search className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="italic text-lg">No investors found matching your search Criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 bg-card/20 rounded-3xl border border-glass-border">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl bg-secondary/50 border border-glass-border disabled:opacity-30 hover:bg-secondary transition-all"
                        >
                            <ChevronUp className="w-5 h-5 -rotate-90" />
                        </button>
                        <div className="flex items-center px-4 rounded-xl bg-secondary/50 border border-glass-border">
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">Page {currentPage} / {totalPages}</span>
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-xl bg-secondary/50 border border-glass-border disabled:opacity-30 hover:bg-secondary transition-all"
                        >
                            <ChevronDown className="w-5 h-5 -rotate-90" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

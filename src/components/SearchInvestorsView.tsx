"use client";

import { useState, useEffect } from "react";
import { QueryDocumentSnapshot } from "firebase/firestore";

import {
    Loader2,
    Check,
    X,
    Mail,
    Linkedin,
    Globe,
    Crown,
    ArrowRight,
    ArrowUpDown,
    ChevronUp,
    ChevronDown
} from "lucide-react";
import { FadeIn, SlideIn } from "@/components/ui/Animations";
import { InvestorRow } from "./InvestorRow";
import { InvestorDetailSidebar } from "./InvestorDetailSidebar";
import { Investor } from "@/lib/investor-data";
import { SubscriptionPaywall } from "./SubscriptionPaywall";
import { addToCRM, saveInvestors, getGlobalInvestors, updateInvestor, getGlobalInvestorsCount } from "@/lib/firestore";
import { useAuth } from "@/lib/firebase/AuthContext";
import { toast } from "sonner";
import { FILTER_LOCATIONS, FILTER_STAGES, FILTER_CHECKS } from "@/lib/filter-options";
import { cn, getCountryFlag } from "@/lib/utils";

export function SearchInvestorsView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [pageHistory, setPageHistory] = useState<(QueryDocumentSnapshot | null)[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedStage, setSelectedStage] = useState<string | null>(null);
    const [selectedCheckSize, setSelectedCheckSize] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<'location' | 'stage' | 'checks' | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [contactModalInvestor, setContactModalInvestor] = useState<Investor | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [sortField, setSortField] = useState<keyof Investor | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const { user, isPro, role } = useAuth();
    const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarEditing, setIsSidebarEditing] = useState(false);

    useEffect(() => {
        fetchInvestors();
    }, []);

    const fetchInvestors = async (cursor: QueryDocumentSnapshot | null = null, direction: 'next' | 'prev' = 'next', queryStr?: string, filters?: { location?: string | null; stage?: string | null; checks?: string | null }) => {
        setIsLoading(true);

        // Use the current state if parameters are not provided
        const activeQuery = queryStr !== undefined ? queryStr : searchQuery;
        const activeLocation = filters?.location !== undefined ? filters.location : selectedLocation;
        const activeStage = filters?.stage !== undefined ? filters.stage : selectedStage;
        const activeChecks = filters?.checks !== undefined ? filters.checks : selectedCheckSize;

        const { investors: data, lastDoc: newLastDoc } = await getGlobalInvestors(
            cursor || undefined,
            50,
            activeQuery,
            {
                location: activeLocation || undefined,
                stage: activeStage || undefined,
                checks: activeChecks || undefined
            }
        );

        if (data.length > 0) {
            setInvestors(data);
            setLastDoc(newLastDoc);
            setHasMore(data.length === 50);

            // Fetch total count on initial load or when search query/filters change
            if (!cursor || queryStr !== undefined || filters !== undefined) {
                const count = await getGlobalInvestorsCount(activeQuery, {
                    location: activeLocation || undefined,
                    stage: activeStage || undefined,
                    checks: activeChecks || undefined
                });
                setTotalCount(count);
            }

            if (direction === 'next' && cursor) {
                setPageHistory(prev => [...prev, cursor]);
                setCurrentPage(prev => prev + 1);
            } else if (direction === 'prev') {
                setPageHistory(prev => prev.slice(0, -1));
                setCurrentPage(prev => prev - 1);
            } else {
                // Initial load or search
                setPageHistory([]);
                setCurrentPage(1);
            }
        } else if (!activeQuery && !activeLocation && !activeStage && !activeChecks) {
            // FALLBACK TO LOCAL DATA (Quota Fix)
            try {
                const res = await fetch("/warren_enriched.json");
                const localData = await res.json();
                const slice = localData.slice(0, 50);
                setInvestors(slice);
                setTotalCount(localData.length);
                setHasMore(false); // Local is not paginated fully here
                setPageHistory([]);
                setCurrentPage(1);
            } catch (err) {
                console.error("Local fallback failed", err);
                setInvestors([]);
                setTotalCount(0);
            }
        } else {
            setInvestors([]);
            setTotalCount(0);
            setHasMore(false);
            setPageHistory([]);
            setCurrentPage(1);
        }
        setIsLoading(false);
    };

    const handleSearch = () => {
        fetchInvestors(null, 'next', searchQuery);
    };

    const toggleLocationFilter = (location: string | null) => {
        setSelectedLocation(location);
        fetchInvestors(null, 'next', undefined, { location: location });
    };

    const toggleStageFilter = (stage: string | null) => {
        setSelectedStage(stage);
        fetchInvestors(null, 'next', undefined, { stage: stage });
    };

    const toggleCheckFilter = (checks: string | null) => {
        setSelectedCheckSize(checks);
        fetchInvestors(null, 'next', undefined, { checks: checks });
    };

    const handleNextPage = () => {
        if (!lastDoc || !hasMore || isLoading) return;
        fetchInvestors(lastDoc, 'next');
    };

    const handlePrevPage = () => {
        if (pageHistory.length === 0 || isLoading) return;

        // Cursors are: [Page1StartDoc, Page2StartDoc, ...]
        // If we are on Page 2, history is [Page1StartDoc]
        // To go to Page 1, we use null.
        // If we are on Page 3, history is [Page1StartDoc, Page2StartDoc]
        // To go to Page 2, we use history[0]

        const prevCursor = pageHistory.length > 1 ? pageHistory[pageHistory.length - 2] : null;
        fetchInvestors(prevCursor, 'prev');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/ingest-investors", {
                method: "POST",
                body: formData,
            });
            const { data, error } = await res.json();
            if (error) throw new Error(error);

            setInvestors(prev => [...prev, ...data]);
            toast.success(`${data.length} investors ingested locally.`);
        } catch (err) {
            toast.error("Failed to process file");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSyncToFirestore = async () => {
        if (!user) {
            toast.error("Please sign in to save to database");
            return;
        }
        setIsUploading(true);
        try {
            await saveInvestors(investors);
            toast.success("Database synced to Firestore!");
        } catch (err) {
            toast.error("Failed to sync database");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdateInvestor = async (id: string, data: Partial<Investor>) => {
        try {
            await updateInvestor(id, data);
            setInvestors(prev => prev.map(inv => inv.id === id ? { ...inv, ...data } : inv));
            setEditingInvestor(null);
            toast.success("Investor updated");
        } catch (err) {
            toast.error("Failed to update investor");
        }
    };

    const handleAddToCRM = async (investor: Investor) => {
        if (!user) {
            toast.error("Please sign in to add to CRM");
            return;
        }

        try {
            await addToCRM(user.uid, investor);
            toast.success(`${investor.name} added to CRM`);
        } catch (err) {
            toast.error("Failed to add to CRM");
        }
    };

    const sortedInvestors = [...investors].sort((a, b) => {
        if (!sortField) return 0;

        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        if (Array.isArray(aValue) && Array.isArray(bValue)) {
            const aStr = aValue[0] || "";
            const bStr = bValue[0] || "";
            return sortDirection === 'asc'
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });

    const displayInvestors = isPro ? sortedInvestors : sortedInvestors.slice(0, 5);

    const handleSort = (field: keyof Investor) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleContact = (investor: Investor) => {
        if (!isPro) {
            setShowPaywall(true);
            return;
        }
        setContactModalInvestor(investor);
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-surface font-manrope">
            {/* TopNavBar */}
            <header className="flex justify-between items-center px-10 py-6 w-full font-manrope">
                <div className="flex items-center gap-6 w-1/2">
                    <div className="relative w-full group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-gray-400 outline-none transition-all"
                            placeholder="Search sectors like media, SaaS, AI..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wide uppercase text-emerald-800">
                        <button className="hover:text-emerald-600 transition-colors">Upload Pitch Deck</button>
                        <button onClick={handleSyncToFirestore} className="hover:text-emerald-600 transition-colors flex items-center gap-2">
                            {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>Sync to Cloud</span>}
                        </button>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                            <span className="material-symbols-outlined text-gray-600">notifications</span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                            <img alt="User" className="w-full h-full object-cover" src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdtSsM_6NudH7UR7gxqh8RoxL5hL5l_ZpANxC5_88J5buSEiwP2EaNnGiRl_XpJ3Xv1Hjx1ygInm1oLn712w7HDi1Ce9RcZ-ibMFJAVp1mzQVKMw4ckg1M2wLy2CbPZrxsOyJKvszRB5hKlypMb_-j5GZNLRTYgOsIbdYiLVHKRezcDEO_bA89aNSCnk-XTeXttN2LGQIic8PtGVsROiF3yXtEpewfDMst9kobrU9VoAwSTo4ZFY6x8jZXYXwxbzRYFTbzHLuJFNQZ"} />
                        </div>
                    </div>
                </div>
            </header>
            {/* Promo Banner */}
            <div className="px-10 py-6">
                <FadeIn delay={0.3}>
                    <div className="bg-[#212529] rounded-[2rem] p-8 flex items-center justify-between text-white overflow-hidden relative shadow-2xl">
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">🤖</div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight mb-2">Get Intercom free for 1 year with Warren</h3>
                                <p className="text-sm font-medium opacity-60">Use code "WARREN". Conditions apply.</p>
                            </div>
                        </div>
                        <a
                            href="https://www.intercom.com/early-stage"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-black px-8 py-3 rounded-xl font-black text-sm relative z-10 hover:bg-white/90 transition-all"
                        >
                            Redeem Offer
                        </a>
                    </div>
                </FadeIn>
            </div>

            {/* Search Header & Filters */}
            <section className="px-10 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="font-headline text-[3.5rem] font-extrabold text-on-surface tracking-tight leading-none">
                            {totalCount?.toLocaleString() ?? displayInvestors.length} <span className="text-emerald-800">Investors</span>
                        </h2>
                        <p className="text-muted-foreground mt-2 font-medium">Discover venture partners, angel syndicates, and corporate labs tailored to your fundraise.</p>
                    </div>
                    <div className="flex items-center gap-2 no-scrollbar pb-2 relative z-[100]">
                        <FilterDropdown
                            label="Geography"
                            options={FILTER_LOCATIONS}
                            value={selectedLocation}
                            showFlag={true}
                            searchable={true}
                            isOpen={openDropdown === 'location'}
                            onToggle={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                            onSelect={toggleLocationFilter}
                        />
                        <FilterDropdown
                            label="Investment stage"
                            options={FILTER_STAGES}
                            value={selectedStage}
                            isOpen={openDropdown === 'stage'}
                            onToggle={() => setOpenDropdown(openDropdown === 'stage' ? null : 'stage')}
                            onSelect={toggleStageFilter}
                        />
                        <FilterDropdown
                            label="Check size"
                            options={FILTER_CHECKS}
                            value={selectedCheckSize}
                            isOpen={openDropdown === 'checks'}
                            onToggle={() => setOpenDropdown(openDropdown === 'checks' ? null : 'checks')}
                            onSelect={toggleCheckFilter}
                            alignRight={true}
                        />
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-800 text-white shadow-lg shadow-emerald-900/20 hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined text-[20px]">tune</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Investor List Table */}
            <section className="px-10 flex-1 flex flex-col">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-x-auto">
                    {/* Table Header */}
                    <div className="grid grid-cols-[300px_1fr_1fr_1fr_160px_100px] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 items-center text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        <button
                            onClick={() => handleSort('name')}
                            className="flex items-center gap-1.5 hover:text-emerald-800 transition-colors uppercase text-left"
                        >
                            Firm Name & Location
                            {sortField === 'name' ? (
                                sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-30" />
                            )}
                        </button>
                        <div className="flex items-center gap-1.5 uppercase">Focus Area</div>
                        <button
                            onClick={() => handleSort('checks')}
                            className="flex items-center gap-1.5 hover:text-emerald-800 transition-colors uppercase text-left"
                        >
                            Ticket Size
                            {sortField === 'checks' ? (
                                sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-30" />
                            )}
                        </button>
                        <button
                            onClick={() => handleSort('stage')}
                            className="flex items-center gap-1.5 hover:text-emerald-800 transition-colors uppercase text-left"
                        >
                            Stage
                            {sortField === 'stage' ? (
                                sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-30" />
                            )}
                        </button>
                        <div className="text-center uppercase">Action</div>
                        <div className="text-right uppercase">Tools</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-50 min-h-[400px]">
                        {isLoading && investors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <Loader2 className="w-10 h-10 text-emerald-800 animate-spin mb-4" />
                                <p className="text-sm font-bold text-gray-400 animate-pulse">Loading investors...</p>
                            </div>
                        ) : investors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-40 text-center px-10">
                                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
                                <h3 className="text-xl font-bold text-gray-500 mb-2">No investors found</h3>
                                <p className="text-sm text-gray-400 max-w-xs">We couldn't find any investors matching your search. Try adjusting your filters.</p>
                            </div>
                        ) : (
                            displayInvestors.map((investor: Investor, idx) => (
                                <InvestorRow
                                    key={investor.id || idx}
                                    investor={investor}
                                    onContact={handleContact}
                                    onAddToCRM={handleAddToCRM}
                                    onEdit={(inv) => {
                                        setSelectedInvestor(inv);
                                        setIsSidebarOpen(true);
                                        setIsSidebarEditing(true);
                                    }}
                                    onClick={() => {
                                        setSelectedInvestor(investor);
                                        setIsSidebarOpen(true);
                                        setIsSidebarEditing(false);
                                    }}
                                    isAdmin={role === 'admin'}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Pagination / Footer */}
                <footer className="py-12 flex items-center justify-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || isLoading}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="px-4 py-2 rounded-full editorial-gradient text-white font-bold text-xs shadow-md">
                                {currentPage}
                            </div>
                            {hasMore && (
                                <button
                                    onClick={handleNextPage}
                                    className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 font-bold text-xs transition-colors"
                                >
                                    {currentPage + 1}
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleNextPage}
                            disabled={!hasMore || isLoading}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                        </button>
                    </div>
                </footer>
            </section>

            {/* Paywall CTA for free users */}
            {!isPro && investors.length > 5 && (
                <div className="relative pb-20">
                    {/* Paywall Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

                    {/* Paywall Card */}
                    <FadeIn delay={0.2} className="relative z-20 max-w-sm mx-auto">
                        <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] text-center">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-800 mx-auto mb-6">
                                <Crown className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight mb-3">Unlock All Investors</h3>
                            <p className="text-muted-foreground font-medium mb-8 max-w-md">
                                You've reached the free limit. Upgrade to Pro to access our full database of 17,000+ investors, direct contact details, and priority introductions.
                            </p>

                            <button
                                onClick={() => setShowPaywall(true)}
                                className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-[1.05] hover:shadow-primary/40 transition-all group"
                            >
                                Get Pro Access
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                                Limited time: ₦5,000/month
                            </p>
                        </div>
                    </FadeIn>
                </div>
            )}

            <SubscriptionPaywall
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                userEmail={user?.email || undefined}
            />



            {/* Contact Modal */}
            {contactModalInvestor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <FadeIn>
                        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-border w-full max-w-md overflow-hidden relative">
                            <div className="p-10 text-center">
                                <div className="w-20 h-20 bg-muted rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl">
                                    🏢
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-2">Contact {contactModalInvestor.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium mb-8">Choose your preferred way to reach out.</p>

                                <div className="space-y-3">
                                    {contactModalInvestor.contactEmail ? (
                                        <a
                                            href={`mailto:${contactModalInvestor.contactEmail}?subject=Introduction: [Your Startup Name] / Warrenintel`}
                                            className="w-full py-4 px-6 bg-primary text-white rounded-2xl font-black text-sm shadow-sm flex items-center justify-center gap-3 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Send Professional Email
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full py-4 px-6 bg-muted text-muted-foreground rounded-2xl font-black text-sm flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Email not available
                                        </button>
                                    )}

                                    {contactModalInvestor.linkedIn && (
                                        <a
                                            href={contactModalInvestor.linkedIn}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 px-6 bg-[#0077b5] text-white rounded-2xl font-black text-sm shadow-sm flex items-center justify-center gap-3 hover:bg-[#0077b5]/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                            Connect on LinkedIn
                                        </a>
                                    )}

                                    {contactModalInvestor.website && (
                                        <a
                                            href={contactModalInvestor.website.startsWith('http') ? contactModalInvestor.website : `https://${contactModalInvestor.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 px-6 bg-white border border-border text-foreground rounded-2xl font-black text-sm shadow-sm flex items-center justify-center gap-3 hover:bg-muted transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Visit Website
                                        </a>
                                    )}
                                </div>

                                <button
                                    onClick={() => setContactModalInvestor(null)}
                                    className="mt-8 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            )}
            <InvestorDetailSidebar
                investor={selectedInvestor}
                isOpen={isSidebarOpen}
                onClose={() => {
                    setIsSidebarOpen(false);
                    setIsSidebarEditing(false);
                }}
                isPro={isPro || false}
                onUpgrade={() => setShowPaywall(true)}
                role={role}
                onUpdate={(updatedInv) => {
                    setInvestors(prev => prev.map(inv => inv.id === updatedInv.id ? updatedInv : inv));
                    setSelectedInvestor(updatedInv);
                }}
                initialIsEditing={isSidebarEditing}
            />
        </div>
    );
}



function FilterDropdown({
    label,
    options,
    value,
    onSelect,
    isOpen,
    onToggle,
    searchable = false,
    alignRight = false
}: {
    label: string,
    options: string[],
    value: string | null,
    onSelect: (val: string | null) => void,
    isOpen: boolean,
    onToggle: () => void,
    searchable?: boolean,
    showFlag?: boolean,
    alignRight?: boolean
}) {
    const [search, setSearch] = useState("");
    const filteredOptions = searchable
        ? options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()))
        : options;

    return (
        <div className="relative z-[100]">
            <button
                onClick={onToggle}
                className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap",
                    value
                        ? "bg-emerald-800 text-white shadow-lg shadow-emerald-900/20"
                        : "bg-white border border-gray-100 text-emerald-800 hover:bg-emerald-50"
                )}
            >
                {getCountryFlag(value || "") !== "🌍" && value && <span className="shrink-0">{getCountryFlag(value)}</span>}
                <span className="truncate max-w-[120px]">{value || label}</span>
                <span className="material-symbols-outlined text-[16px] opacity-70">expand_more</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[9998]" onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }} />
                    <SlideIn className={`absolute top-full mt-3 w-64 max-h-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden ${alignRight ? 'right-0 origin-top-right' : 'right-0 md:left-0 origin-top-left'}`}>
                        {searchable && (
                            <div className="p-3 border-b border-gray-100 bg-gray-50">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-gray-400">search</span>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder={`Search ${label.toLowerCase()}...`}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-100 rounded-xl text-xs outline-none focus:border-emerald-300 transition-all font-medium"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                            {/* Clear Option */}
                            <button
                                onClick={() => {
                                    onSelect(null);
                                    onToggle();
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2 hover:bg-emerald-50 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between border-b border-gray-50 mb-1",
                                    !value ? 'text-emerald-800' : 'text-gray-400'
                                )}
                            >
                                <span>Clear {label} filter</span>
                                {!value && <Check className="w-3 h-3" />}
                            </button>

                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            onSelect(opt);
                                            onToggle();
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 hover:bg-emerald-50/50 text-xs font-semibold transition-colors flex items-center justify-between",
                                            value === opt ? 'text-emerald-800 bg-emerald-50' : 'text-gray-600 hover:text-emerald-900'
                                        )}
                                    >
                                        <div className="flex items-center gap-2 truncate pr-4">
                                            {getCountryFlag(opt) !== "🌍" && <span>{getCountryFlag(opt)}</span>}
                                            <span className="truncate">{opt}</span>
                                        </div>
                                        {value === opt && <Check className="w-3 h-3 shrink-0" />}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest opacity-20">
                                    No matches found
                                </div>
                            )}
                        </div>
                    </SlideIn>
                </>
            )}
        </div>
    );
}

function FilterButton({ label, flag, active = false, onClick }: { label: string, flag?: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all text-sm font-bold ${active
                ? "bg-primary border-primary text-white shadow-md"
                : "bg-white border-border text-foreground hover:bg-muted/50 hover:border-primary/20"
                }`}
        >
            {flag && <span className="text-base">{flag}</span>}
            {label}
            <ChevronDown className={`w-4 h-4 opacity-50 ${active ? "text-white" : "text-muted-foreground"}`} />
        </button>
    );
}

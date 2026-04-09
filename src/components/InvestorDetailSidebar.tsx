"use client";

import { useState, useEffect } from "react";
import { X, Globe, Linkedin, Mail, MapPin, ChevronRight, Download, Share2, Crown, Edit3, Save, RotateCcw } from "lucide-react";
import { Investor } from "@/lib/investor-data";
import { cn, getCountryFlag } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { updateInvestor } from "@/lib/firestore";
import { toast } from "sonner";

interface InvestorDetailSidebarProps {
    investor: Investor | null;
    isOpen: boolean;
    onClose: () => void;
    isPro: boolean;
    onUpgrade: () => void;
    role?: string | null;
    onUpdate?: (updatedInvestor: Investor) => void;
    initialIsEditing?: boolean;
}

export function InvestorDetailSidebar({ investor, isOpen, onClose, isPro, onUpgrade, role, onUpdate, initialIsEditing }: InvestorDetailSidebarProps) {
    const [imgError, setImgError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedInvestor, setEditedInvestor] = useState<Investor | null>(null);

    const isAdmin = role === 'admin';

    // Reset state when investor changes
    useEffect(() => {
        setImgError(false);
        setIsEditing(initialIsEditing || false);
        setEditedInvestor(investor);
    }, [investor, initialIsEditing]);

    const getDomain = (url: string | undefined) => {
        if (!url) return "Official Website";
        try {
            // Robust parsing with try-catch
            const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
            return parsed.hostname.replace('www.', '');
        } catch (e) {
            return url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0] || "Official Website";
        }
    };

    const handleSave = async () => {
        if (!investor || !editedInvestor) return;
        setIsSaving(true);
        try {
            await updateInvestor(investor.id, {
                name: editedInvestor.name,
                type: editedInvestor.type,
                location: editedInvestor.location,
                description: editedInvestor.description,
                check_size_details: editedInvestor.check_size_details,
                thesis: editedInvestor.thesis,
                stage: editedInvestor.stage,
                checks: editedInvestor.checks
            });
            toast.success("Investor intelligence updated successfully");
            setIsEditing(false);
            if (onUpdate) onUpdate(editedInvestor);
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("Failed to update investor intelligence");
        } finally {
            setIsSaving(false);
        }
    };

    if (!investor) return null;

    const flag = (investor.flags && investor.flags.length > 0 && investor.flags[0] !== "🌍")
        ? investor.flags[0]
        : getCountryFlag(investor.location);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100] md:hidden"
                    />

                    {/* Sidebar container */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 w-full max-w-lg h-screen bg-white z-[110] flex flex-col shadow-[-12px_0_48px_-12px_rgba(25,28,29,0.2)] border-l border-slate-100 overflow-hidden font-manrope"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-white sticky top-0 z-20">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-800">
                                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                                </div>
                                <span className="font-bold text-sm tracking-tight text-on-surface">Investor Intelligence</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {isAdmin && !isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="h-8 px-3 flex items-center gap-1.5 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-all font-bold text-[10px] uppercase tracking-wider"
                                    >
                                        <Edit3 className="w-3 h-3" /> Edit
                                    </button>
                                )}
                                {isEditing && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="h-8 px-3 flex items-center gap-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-all font-bold text-[10px] uppercase tracking-wider"
                                        >
                                            <RotateCcw className="w-3 h-3" /> Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="h-8 px-3 flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all font-bold text-[10px] uppercase tracking-wider disabled:opacity-50"
                                        >
                                            {isSaving ? <RotateCcw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                            Save
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </header>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10 pb-20">
                            {/* Firm Identification */}
                            <section className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 shrink-0 bg-white rounded-xl border border-slate-100 flex items-center justify-center p-2 shadow-sm">
                                        {investor.logo && !imgError ? (
                                            <img
                                                src={investor.logo}
                                                alt={investor.name}
                                                className="w-full h-auto object-contain"
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-slate-300 text-3xl">account_balance</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedInvestor?.type || ""}
                                                    onChange={(e) => setEditedInvestor(prev => prev ? { ...prev, type: e.target.value } : null)}
                                                    className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-bold outline-none border border-emerald-100 focus:border-emerald-300 w-32"
                                                />
                                            ) : (
                                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                    {investor.type || "Investor"}
                                                </span>
                                            )}
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedInvestor?.location || ""}
                                                    onChange={(e) => setEditedInvestor(prev => prev ? { ...prev, location: e.target.value } : null)}
                                                    className="text-slate-400 text-[10px] font-bold outline-none border border-slate-100 focus:border-emerald-200 rounded px-1 w-24"
                                                />
                                            ) : (
                                                <span className="text-slate-400 text-[11px] font-bold flex items-center gap-0.5">
                                                    <MapPin className="w-3 h-3" /> {investor.location || "Global"}
                                                </span>
                                            )}
                                        </div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedInvestor?.name || ""}
                                                onChange={(e) => setEditedInvestor(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                className="text-xl font-black text-on-surface tracking-tight leading-tight outline-none border border-slate-100 focus:border-emerald-300 rounded px-2 w-full"
                                            />
                                        ) : (
                                            <h2 className="text-2xl font-black text-on-surface tracking-tight leading-tight">
                                                {investor.name}
                                            </h2>
                                        )}
                                    </div>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        value={editedInvestor?.description || editedInvestor?.thesis || ""}
                                        onChange={(e) => setEditedInvestor(prev => prev ? { ...prev, description: e.target.value } : null)}
                                        className="text-sm text-slate-500 leading-relaxed font-medium outline-none border border-slate-100 focus:border-emerald-300 rounded p-2 w-full min-h-[100px]"
                                    />
                                ) : (
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        {investor.description || investor.thesis || "No detailed description available for this firm."}
                                    </p>
                                )}

                                {investor.wikipedia && (
                                    <a
                                        href={investor.wikipedia}
                                        target="_blank"
                                        className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-1 mt-2"
                                    >
                                        <Globe className="w-3 h-3" /> View Source (Wikipedia)
                                    </a>
                                )}

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-6 py-6 border-y border-slate-50">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest font-black text-emerald-800 mb-1">Checks</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedInvestor?.checks || ""}
                                                onChange={(e) => setEditedInvestor(prev => prev ? { ...prev, checks: e.target.value, check_size_details: e.target.value } : null)}
                                                className="text-sm font-black text-on-surface outline-none border border-slate-100 focus:border-emerald-300 rounded px-1 w-full bg-white"
                                            />
                                        ) : (
                                            <p className="text-base font-black text-on-surface truncate">
                                                {investor.check_size_details || investor.checks || "N/A"}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest font-black text-emerald-800 mb-1">Stage</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={Array.isArray(editedInvestor?.stage) ? editedInvestor?.stage.join(", ") : (editedInvestor?.stage || "")}
                                                onChange={(e) => setEditedInvestor(prev => prev ? { ...prev, stage: e.target.value.split(",").map(s => s.trim()) } : null)}
                                                className="text-sm font-black text-on-surface outline-none border border-slate-100 focus:border-emerald-300 rounded px-1 w-full bg-white"
                                                placeholder="Seed, Series A..."
                                            />
                                        ) : (
                                            <p className="text-base font-black text-on-surface truncate">
                                                {Array.isArray(investor.stage) ? investor.stage[0] : (investor.stage || "N/A")}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest font-black text-emerald-800 mb-1">HQ</p>
                                        <p className="text-base font-black text-on-surface truncate">{investor.location || "N/A"}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Investment Thesis Section */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4 flex items-center gap-2">
                                    <span className="h-[1px] w-4 bg-slate-200"></span> Thesis & Strategy
                                </h3>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/30 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                                    {isEditing ? (
                                        <textarea
                                            value={editedInvestor?.thesis || ""}
                                            onChange={(e) => setEditedInvestor(prev => prev ? { ...prev, thesis: e.target.value } : null)}
                                            className="w-full text-sm leading-relaxed text-slate-600 mb-6 italic border-l-2 border-emerald-500/20 pl-4 font-medium outline-none bg-white focus:border-emerald-300 rounded p-2"
                                            placeholder="Enter investment thesis..."
                                        />
                                    ) : (
                                        <p className="text-sm leading-relaxed text-slate-600 mb-6 italic border-l-2 border-emerald-500/20 pl-4 font-medium">
                                            "{investor.thesis || "Active investor looking for high-growth opportunities spanning multiple sectors and geographies."}"
                                        </p>
                                    )}

                                    <div className="space-y-5 relative z-10">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-600">
                                                <span className="material-symbols-outlined text-[18px]">target</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-on-surface text-[11px] mb-0.5 uppercase tracking-wide">Investment Focus</h4>
                                                <p className="text-[11px] text-slate-500 leading-tight">
                                                    {investor.industries?.join(", ") || "Sector Agnostic, Diversified"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-600">
                                                <span className="material-symbols-outlined text-[18px]">payments</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-on-surface text-[11px] mb-0.5 uppercase tracking-wide">Ticket Range</h4>
                                                <p className="text-[11px] text-slate-500 leading-tight">
                                                    Typically {investor.check_size_details || investor.checks || "varies based on opportunity"}.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-wrap gap-2">
                                        {investor.stage?.map((st) => (
                                            <span key={st} className="bg-white border border-slate-100 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm">
                                                {st}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Portfolio Companies */}
                            {(investor.portfolio_details || (investor.portfolio && investor.portfolio.length > 0)) && (
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4 flex items-center gap-2">
                                        <span className="h-[1px] w-4 bg-slate-200"></span> Portfolio Companies
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {investor.portfolio_details ? (
                                            investor.portfolio_details.map((company) => (
                                                company.url ? (
                                                    <a
                                                        key={company.name}
                                                        href={company.url}
                                                        target="_blank"
                                                        className="px-3 py-1 bg-white border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 rounded-lg text-[11px] font-bold text-slate-600 transition-all shadow-sm flex items-center gap-1.5"
                                                    >
                                                        {company.name}
                                                        <Globe className="w-2.5 h-2.5 opacity-40" />
                                                    </a>
                                                ) : (
                                                    <span key={company.name} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-600">
                                                        {company.name}
                                                    </span>
                                                )
                                            ))
                                        ) : (
                                            investor.portfolio?.map((company) => (
                                                <span key={company} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-600">
                                                    {company}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Latest News */}
                            {investor.news_links && investor.news_links.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4 flex items-center gap-2">
                                        <span className="h-[1px] w-4 bg-slate-200"></span> Latest News
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {investor.news_links.slice(0, 3).map((news, idx) => (
                                            <a
                                                key={idx}
                                                href={news.url}
                                                target="_blank"
                                                className="block p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all bg-white shadow-sm"
                                            >
                                                <p className="text-[11px] font-bold text-on-surface line-clamp-2 leading-snug mb-2">
                                                    {news.title}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-black">
                                                        {getDomain(news.url)}
                                                    </span>
                                                    <ChevronRight className="w-3 h-3 text-slate-300" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Pro-Only Contact Tools */}
                            <section className="bg-emerald-900 rounded-3xl p-8 text-white relative shadow-xl overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Crown className="w-16 h-16" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-lg font-black mb-1 leading-tight">Investor Outreach</h4>
                                    <p className="text-[11px] text-emerald-100/60 mb-8 font-medium">Direct connection tools for verified founders.</p>

                                    {isPro ? (
                                        <div className="space-y-3">
                                            <a
                                                href={investor.website && (investor.website.startsWith('http') ? investor.website : `https://${investor.website}`)}
                                                target="_blank"
                                                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 transition-all font-bold text-xs"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Globe className="w-4 h-4" />
                                                    <span>{getDomain(investor.website)}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 opacity-40" />
                                            </a>
                                            <a
                                                href={(() => {
                                                    const li = investor.socials?.linkedin || investor.linkedIn;
                                                    if (!li) return "#";
                                                    if (li.startsWith('http')) return li;
                                                    if (li.includes('linkedin.com')) return `https://${li}`;
                                                    return `https://linkedin.com/in/${li}`;
                                                })()}
                                                target="_blank"
                                                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 transition-all font-bold text-xs"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Linkedin className="w-4 h-4" />
                                                    <span>LinkedIn Profile</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 opacity-40" />
                                            </a>
                                            <a
                                                href={`mailto:${investor.personal?.email || investor.contactEmail}`}
                                                className="w-full flex items-center justify-center p-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest mt-4 shadow-lg shadow-emerald-950/20"
                                            >
                                                <Mail className="w-4 h-4 mr-2" />
                                                Send Inquiry {investor.personal?.email_status === 'verified' && '(Verified)'}
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                            <div className="flex items-center justify-center gap-2 text-emerald-100/60 mb-2">
                                                <Globe className="w-3 h-3" />
                                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                                    {getDomain(investor.website)}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-emerald-100/80 mb-6 font-medium leading-relaxed">
                                                Full contact data, including LinkedIn and verified email, are restricted to Pro members.
                                            </p>
                                            <button
                                                onClick={onUpgrade}
                                                className="w-full py-4 bg-white text-emerald-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg"
                                            >
                                                Unlock Contact Data
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <footer className="pt-4 flex items-center justify-between text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span>Verified Profile</span>
                                </div>
                                <div className="flex gap-4">
                                    <button className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                        <Share2 className="w-3 h-3" /> Share
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                        <Download className="w-3 h-3" /> Save JSON
                                    </button>
                                </div>
                            </footer>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

"use client";

import { Investor } from "@/lib/investor-data";
import { Star, Mail, Globe, UserPlus, Edit2, X, Linkedin } from "lucide-react";
import { getCountryFlag } from "@/lib/utils";
import { motion } from "framer-motion";

interface InvestorCardProps {
    investor: Investor;
    onContact: (investor: Investor) => void;
    onAddToCRM: (investor: Investor) => void;
    onEdit: (investor: Investor) => void;
}

const cleanData = (val: string | undefined): string => {
    if (!val) return "";
    // If it looks like a CSV line (many commas and a URL), it's likely corrupted
    if (val.includes(',') && (val.includes('http') || val.includes('www.'))) {
        // Try to extract the first part if it's not a URL
        const parts = val.split(',');
        const firstPart = parts[0].trim().replace(/^["„']|["“']$/g, '');
        if (firstPart && !firstPart.includes('http')) return firstPart;
        return "Internal Data Error";
    }
    // Remove leading/trailing weird quotes like „ or “
    return val.trim().replace(/^["„']|["“']$/g, '');
};

export function InvestorCard({ investor, onContact, onAddToCRM, onEdit }: InvestorCardProps) {
    const name = cleanData(investor.name);
    const type = cleanData(investor.type) || "VC firm";
    const thesis = cleanData(investor.thesis);

    // If it's pure garbage, we might want to return null, but for now let's just show it cleaned
    if (name === "Internal Data Error" || name.length < 2) return null;
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.005 }}
            className="group relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40 dark:bg-slate-900/40 dark:border-slate-800/40 rounded-3xl p-6 grid grid-cols-[1fr_150px_150px_150px_2fr_180px] gap-6 items-start shadow-premium hover:shadow-2xl transition-all duration-300"
        >
            {/* Background Glow Effect on Hover */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Name & Type Cell */}
            <div className="flex gap-4 relative z-10">
                <div className="relative w-14 h-14 shrink-0">
                    <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                    <div className="relative w-full h-full rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        {name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] text-white shadow-sm shadow-blue-500/50">
                        ✓
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {type}
                        </span>
                        {investor.rating && (
                            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 px-2 py-0.5 rounded-lg transition-transform hover:scale-105">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-[10px] font-bold">{investor.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-3 flex flex-col gap-1.5">
                        {investor.contactEmail && (
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium group/mail">
                                <div className="p-1 rounded-md bg-slate-50 dark:bg-slate-800 group-hover/mail:bg-primary/5 group-hover/mail:text-primary transition-colors">
                                    <Mail className="w-3 h-3" />
                                </div>
                                <span className="truncate max-w-[120px]">{investor.contactEmail}</span>
                            </div>
                        )}
                        {investor.website && (
                            <a
                                href={investor.website.startsWith('http') ? investor.website : `https://${investor.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-500 font-bold group/web"
                            >
                                <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 group-hover/web:bg-emerald-100 dark:group-hover/web:bg-emerald-800/40 transition-colors">
                                    <Globe className="w-3 h-3" />
                                </div>
                                <span className="hover:underline">Website</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Geography Cell */}
            <div className="space-y-3 relative z-10 pt-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 opacity-70">Focus Area</div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 group-hover:border-primary/10 transition-colors">
                        <span className="text-sm">
                            {(investor.flags && investor.flags.length > 0 && investor.flags[0] !== "🌍")
                                ? investor.flags[0]
                                : getCountryFlag(investor.location)}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{investor.location || "Global"}</span>
                    </div>
                    {investor.flags && investor.flags.length > 1 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5">
                            <div className="flex -space-x-1.5">
                                {investor.flags.slice(1, 4).map((f, i) => (
                                    <span key={i} className="text-xs grayscale hover:grayscale-0 transition-all cursor-default">{f}</span>
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">+{investor.flags.length - 1} more</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Checks Cell */}
            <div className="space-y-3 relative z-10 pt-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 opacity-70">Ticket Size</div>
                <div className="px-3 py-2 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/5 dark:border-primary/10 text-primary font-black text-[12px] tracking-tight">
                    {investor.checks || "$250k - $5M"}
                </div>
            </div>

            {/* Stages Cell */}
            <div className="space-y-3 relative z-10 pt-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 opacity-70">Investment Stage</div>
                <div className="flex flex-wrap gap-1.5">
                    {(investor.stage || []).map((stage: string) => (
                        <div key={stage} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-primary/30 transition-colors">
                            {stage}
                        </div>
                    ))}
                </div>
            </div>

            {/* Thesis Cell */}
            <div className="space-y-3 relative z-10 pt-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 opacity-70">Investment Thesis</div>
                <div className="relative group/thesis">
                    <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary/30 to-transparent rounded-full opacity-50" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic line-clamp-3">
                        "{thesis || "No specific thesis provided for this firm."}"
                    </p>
                </div>
            </div>

            {/* Actions Cell */}
            <div className="flex flex-col gap-3 relative z-10 pt-1">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onContact(investor)}
                    className="w-full py-3 bg-linear-to-r from-primary to-primary/90 text-white rounded-xl text-[11px] font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                    <Mail className="w-4 h-4" />
                    CONTACT FIRM
                </motion.button>

                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => onAddToCRM(investor)}
                        title="Add to CRM"
                        className="flex items-center justify-center h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                    >
                        <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onEdit(investor)}
                        title="Edit Investor"
                        className="flex items-center justify-center h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-500/20"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        title="Skip"
                        className="flex items-center justify-center h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

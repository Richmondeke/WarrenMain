"use client";

import { useState } from "react";
import { Investor } from "@/lib/investor-data";
import { getCountryFlag } from "@/lib/utils";

interface InvestorRowProps {
    investor: Investor;
    onContact: (investor: Investor) => void;
    onAddToCRM: (investor: Investor) => void;
    onEdit: (investor: Investor) => void;
    onClick?: () => void;
    isAdmin?: boolean;
}

export function InvestorRow({ investor, onContact, onAddToCRM, onEdit, onClick, isAdmin }: InvestorRowProps) {
    const [imgError, setImgError] = useState(false);

    const flag = (investor.flags && investor.flags.length > 0 && investor.flags[0] !== "🌍")
        ? investor.flags[0]
        : getCountryFlag(investor.location);

    return (
        <div
            onClick={onClick}
            className="grid grid-cols-[300px_1fr_1fr_1fr_160px_100px] gap-4 px-6 py-3.5 items-center table-row-hover transition-colors border-b border-gray-50 last:border-0 group cursor-pointer"
        >
            {/* Firm Name & Location */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    {investor.logo && !imgError ? (
                        <img
                            src={investor.logo}
                            alt={investor.name}
                            className="w-7 h-7 object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <span className="material-symbols-outlined text-slate-300">account_balance</span>
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-bold text-on-surface truncate pr-2">{investor.name}</h3>
                    <p className="text-[11px] font-medium text-emerald-700 truncate">{investor.location || "Global"}</p>
                </div>
            </div>

            {/* Focus Area */}
            <div className="flex">
                <div className="flex items-center gap-2 px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-on-surface-variant text-[11px] font-semibold rounded">
                    <span>{flag}</span>
                    <span className="truncate max-w-[150px]">{investor.location || "Sector Agnostic"}</span>
                </div>
            </div>

            {/* Ticket Size */}
            <div className="text-[12px] text-on-surface-variant font-medium">
                {investor.checks || "Contact for details"}
            </div>

            {/* Stage */}
            <div>
                <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold rounded">
                    {Array.isArray(investor.stage) ? investor.stage[0] : (investor.stage || "Early Stage")}
                </span>
            </div>

            {/* Action */}
            <div className="flex justify-center">
                <button
                    onClick={() => onContact(investor)}
                    className="editorial-gradient text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap active:scale-95"
                >
                    CONTACT
                </button>
            </div>

            {/* Tools */}
            <div className="flex items-center justify-end gap-2 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors">
                <button
                    onClick={() => onAddToCRM(investor)}
                    className="hover:text-emerald-700 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                </button>
                {isAdmin && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(investor);
                        }}
                        className="hover:text-emerald-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                )}
            </div>
        </div>
    );
}

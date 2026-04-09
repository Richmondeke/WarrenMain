"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SubscriptionPaywall } from "../SubscriptionPaywall";
import { useAuth } from "@/lib/firebase/AuthContext";
import { cn } from "@/lib/utils";

const FOUNDER_ITEMS = [
    { name: "Dashboard", icon: "dashboard", href: "/dashboard" },
    { name: "Search Investors", icon: "person_search", href: "/search" },
    { name: "Deal Room", icon: "analytics", href: "/decks" },
    { name: "CRM", icon: "group", href: "/crm" },
    { name: "Resources", icon: "library_books", href: "/perks" },
    { name: "Fundability", icon: "trending_up", href: "/fundability" },
];

const CAPITAL_ITEMS = [
    { name: "Portfolio", icon: "account_balance", href: "/portfolio" },
    { name: "LP Portal", icon: "shield_person", href: "/lp-portal" },
    { name: "Deal Sourcing", icon: "travel_explore", href: "/deal-sourcing" },
    { name: "Pipeline", icon: "view_kanban", href: "/pipeline" },
    { name: "Ecosystem Map", icon: "map", href: "/ecosystem-map" },
    { name: "Thesis Builder", icon: "edit_note", href: "/thesis-builder" },
];

const MENU_ITEMS = [...FOUNDER_ITEMS, ...CAPITAL_ITEMS];

export function Sidebar() {
    const pathname = usePathname();
    const { user, role, logout } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('warren_pro') === 'true') {
            setIsSubscribed(true);
        }
        const handleStorage = () => {
            if (localStorage.getItem('warren_pro') === 'true') {
                setIsSubscribed(true);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <>
            <aside className="fixed left-0 top-0 bottom-0 flex flex-col z-40 h-screen w-64 bg-white/80 backdrop-blur-xl shadow-xl shadow-gray-200/50 font-manrope text-sm font-medium tracking-tight">
                <div className="px-8 py-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 editorial-gradient rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                        </div>
                        <div>
                            <h1 className="font-manrope text-lg font-extrabold text-emerald-900 leading-none">Warren Intel</h1>
                            <p className="text-[10px] uppercase tracking-widest text-emerald-700 mt-1">
                                {role === 'fund_manager' ? 'Capital Suite' : role === 'admin' ? 'Admin Console' : 'Founder Suite'}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                    {(role === 'admin' || role === 'founder' || !role) && FOUNDER_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "mx-2 px-4 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200",
                                    isActive
                                        ? "bg-emerald-50 text-emerald-800 font-bold"
                                        : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
                                )}
                            >
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* Capital Suite Section */}
                    {(role === 'admin' || role === 'fund_manager') && (
                        <>
                            <div className="pt-4 pb-1 px-6">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">Capital Suite</p>
                            </div>

                            {CAPITAL_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "mx-2 px-4 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200",
                                            isActive
                                                ? "bg-emerald-50 text-emerald-800 font-bold"
                                                : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
                                        )}
                                    >
                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                                            {item.icon}
                                        </span>
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </>
                    )}

                    {/* Admin Suite Section */}
                    {role === 'admin' && (
                        <>
                            <div className="pt-4 pb-1 px-6">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">Admin Suite</p>
                            </div>

                            {[
                                { name: "Users", icon: "manage_accounts", href: "/admin/users" },
                                { name: "Content", icon: "edit_calendar", href: "/admin/content" },
                                { name: "Support", icon: "support_agent", href: "/admin/support" },
                            ].map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "mx-2 px-4 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200",
                                            isActive
                                                ? "bg-emerald-50 text-emerald-800 font-bold"
                                                : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
                                        )}
                                    >
                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </nav>

                <div className="px-4 mb-6">
                    {!isSubscribed ? (
                        <button
                            onClick={() => setShowPaywall(true)}
                            className="w-full editorial-gradient text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/10 hover:opacity-90 transition-opacity"
                        >
                            Upgrade to Pro
                        </button>
                    ) : (
                        <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                            <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            <div className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none">Pro Active</div>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-4 pb-8 space-y-1">
                    <Link href="/settings" className="text-gray-600 hover:bg-gray-100 mx-2 px-4 py-2.5 rounded-lg flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span>Settings</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="w-[calc(100%-16px)] text-left text-gray-600 hover:bg-red-50 hover:text-red-600 mx-2 px-4 py-2.5 rounded-lg flex items-center gap-3 transition-transform duration-200 hover:translate-x-1"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <SubscriptionPaywall
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                userEmail={user?.email || undefined}
            />
        </>
    );
}

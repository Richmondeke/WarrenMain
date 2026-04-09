"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, Bell, Settings } from "lucide-react";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/search", icon: Search, label: "Search" },
        { href: "/watchlist", icon: Bookmark, label: "Watchlist" },
        { href: "/alerts", icon: Bell, label: "Alerts" },
        { href: "/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden pointer-events-none">
            <div className="max-w-lg mx-auto h-20 bg-card/60 backdrop-blur-xl border border-glass-border rounded-[2.5rem] shadow-premium pointer-events-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                <div className="flex h-full items-center justify-around px-4 relative z-10">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center transition-all duration-300 relative group ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {isActive && (
                                    <span className="absolute -top-3 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]"></span>
                                )}
                                <Icon className={`h-5 w-5 mb-1.5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                                <span className={`text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { Search, Bell, User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

export function TopNav() {
    const { user, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-glass-border bg-background/60 backdrop-blur-md">
            <div className="container flex h-16 items-center px-4 md:px-6 mx-auto">
                <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-xl text-foreground mr-6 transition-opacity hover:opacity-80">
                    <span className="text-primary">Warren</span>intel
                </Link>

                <div className="flex-1 flex max-w-md mx-auto hidden md:flex items-center relative">
                    <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search for a company..."
                        className="w-full bg-secondary/50 border border-glass-border rounded-full py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 placeholder-muted-foreground transition-all shadow-sm focus:shadow-md"
                    />
                </div>

                <nav className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />

                    {user ? (
                        <>
                            <Link href="/pricing" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline decoration-primary/30 underline-offset-4">
                                Pricing
                            </Link>
                            <Link href="/dashboard" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/watchlist" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Watchlist
                            </Link>
                            <button className="text-muted-foreground hover:text-foreground w-9 h-9 flex items-center justify-center rounded-full bg-secondary transition-colors text-primary hover:bg-secondary/80">
                                <Bell className="h-4 w-4" />
                                <span className="sr-only">Notifications</span>
                            </button>
                            <div className="relative group">
                                <button className="w-9 h-9 rounded-full overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {user.email?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}
                                </button>
                                {/* Simple dropdown for logout */}
                                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="p-3 border-b border-border">
                                        <p className="text-sm font-medium truncate">{user.displayName || "Investor"}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <div className="p-1">
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </nav>
            </div>

        </header>
    );
}

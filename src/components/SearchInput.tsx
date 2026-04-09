"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchInput() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            // Route to the new company dashboard
            router.push(`/company/${query.trim().toUpperCase()}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative mb-8 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a company (e.g. AAPL, TSLA)"
                className="w-full bg-secondary/50 backdrop-blur-md border border-glass-border rounded-full py-4 pl-12 pr-4 text-base text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 shadow-premium placeholder-muted-foreground transition-all"
            />
        </form>
    );
}

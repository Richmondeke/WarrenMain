"use client";

import { useState } from "react";
import {
    Search as SearchIcon,
    ChevronDown,
    ExternalLink,
    Mail,
    MapPin,
    ArrowRight
} from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/Animations";
import Link from "next/link";

interface Expert {
    id: string;
    name: string;
    firm: string;
    photo: string;
    specialties: string[];
    country: string;
    flag: string;
    description?: string;
}

interface ExpertSearchViewProps {
    type: string; // "Lawyers", "Designers", "Advisors", "Builders"
    title: string;
}

export function ExpertSearchView({ type, title }: ExpertSearchViewProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data for high fidelity
    const experts: Expert[] = [
        {
            id: "1",
            name: "Omeed Tabiei",
            firm: "Optimist Legal",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            specialties: ["Incorporation", "Fundraising", "Contracts", "M&A", "Regulatory (SEC, FTC, FCC...)"],
            country: "USA",
            flag: "🇺🇸"
        },
        {
            id: "2",
            name: "Jade Ruscev",
            firm: "Stamina Law",
            photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            specialties: ["Incorporation", "Fundraising", "Contracts"],
            country: "France",
            flag: "🇫🇷"
        },
        {
            id: "3",
            name: "Bartek Rost",
            firm: "Parrilli Renison LLC",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            specialties: ["Employment", "HR"],
            country: "USA",
            flag: "🇺🇸"
        },
        {
            id: "4",
            name: "Anthony Malone",
            firm: "Nexus Venture Counsel",
            photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
            specialties: ["Incorporation", "Fundraising", "Patents & IP", "Contracts", "M&A", "Employment", "HR"],
            country: "USA",
            flag: "🇺🇸"
        }
    ];

    return (
        <div className="flex-1 flex flex-col h-screen bg-white overflow-hidden">
            <header className="px-8 py-12 text-center space-y-6">
                <FadeIn>
                    <h1 className="text-[44px] font-black tracking-tight leading-[1.1] text-foreground">
                        Find the perfect <span className="text-primary lowercase">{type.slice(0, -1)}</span> for your startup
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground mt-4">
                        Powered by <Link href="/" className="text-primary underline underline-offset-4 decoration-primary/20 hover:decoration-primary transition-all">warrenintel.com</Link>
                    </p>
                </FadeIn>
            </header>

            <div className="px-8 pb-8 flex justify-center sticky top-0 z-20 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-3 w-full max-w-[1000px]">
                    <div className="relative flex-1 group">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or firm"
                            className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl text-sm font-medium transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <FilterButton label="Expertise" />
                    <FilterButton label="Country" />
                </div>
            </div>

            <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-20">
                <div className="max-w-[1200px] mx-auto">
                    <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {experts.map((expert) => (
                            <FadeInStaggerItem key={expert.id}>
                                <div className="bg-white rounded-[2rem] border border-border overflow-hidden hover:shadow-premium transition-all group cursor-pointer flex flex-col h-full">
                                    <div className="aspect-[4/5] relative overflow-hidden">
                                        <img
                                            src={expert.photo}
                                            alt={expert.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black border border-white/20 shadow-sm">
                                            {expert.country}
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4 flex flex-col flex-1">
                                        <div>
                                            <h3 className="text-lg font-black tracking-tight text-primary hover:text-pink-600 transition-colors">
                                                {expert.name}
                                            </h3>
                                            <p className="text-sm font-black text-foreground mt-1">{expert.firm}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 flex-1">
                                            {expert.specialties.map(spec => (
                                                <span
                                                    key={spec}
                                                    className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-4 mt-auto border-t border-border/50 flex gap-4">
                                            <button className="flex-1 py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-2">
                                                <Mail className="w-3 h-3" />
                                                Contact
                                            </button>
                                            <button className="w-10 h-10 bg-muted hover:bg-primary hover:text-white rounded-xl flex items-center justify-center transition-all">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </FadeInStaggerItem>
                        ))}
                    </FadeInStagger>

                    <FadeIn delay={0.4} className="mt-12 text-center pb-20">
                        <button className="text-sm font-black text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mx-auto">
                            I'm a startup {type.slice(0, -1).toLowerCase()} <ArrowRight className="w-4 h-4" />
                        </button>
                    </FadeIn>
                </div>
            </main>
        </div>
    );
}

function FilterButton({ label }: { label: string }) {
    return (
        <button className="px-5 py-3 bg-white border border-border rounded-xl text-sm font-bold flex items-center gap-4 hover:bg-muted transition-all min-w-[160px] justify-between">
            <span className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">{label}</span>
            <ChevronDown className="w-4 h-4 opacity-30" />
        </button>
    );
}

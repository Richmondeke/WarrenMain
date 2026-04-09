"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Clock, Share2, Bookmark, Mail, Search, Info } from "lucide-react";
import Link from "next/link";
import { LandingNavbar } from "./LandingNavbar";
import { useEffect, useState } from "react";
import { getIntelItems, IntelItem } from "@/lib/firestore";

export default function InsightsView() {
    const [intel, setIntel] = useState<IntelItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getIntelItems();
            setIntel(data);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
            <LandingNavbar activePage="insights" />

            <main className="max-w-7xl mx-auto px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Article Content Column */}
                    <article className="lg:w-2/3">
                        {/* Article Header */}
                        <header className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-[#c6e9be] text-[#4c6a48] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-label">Market Intelligence</span>
                                <span className="text-on-surface-variant text-sm font-label flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> 8 Min Read
                                </span>
                            </div>
                            <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight leading-[1.1] mb-8">
                                The Shift in Series B Dynamics: Why Capital Efficiency is the New Growth
                            </h1>
                            <div className="flex items-center justify-between py-6 border-y border-outline-variant/15 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#2e7d32] flex items-center justify-center text-white font-bold">EM</div>
                                    <div>
                                        <p className="font-bold text-on-surface">Elias Montgomery</p>
                                        <p className="text-xs text-on-surface-variant">Senior Fundraising Strategist</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-label text-on-surface-variant uppercase tracking-wider">Published</p>
                                    <p className="font-bold text-on-surface">Oct 24, 2023</p>
                                </div>
                            </div>
                            <div className="rounded-xl overflow-hidden shadow-[0_12px_32px_-8px_rgba(25,28,29,0.06)] mb-12">
                                <img
                                    alt="Featured News"
                                    className="w-full h-[450px] object-cover"
                                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                />
                            </div>
                        </header>

                        {/* Article Body */}
                        <div className="space-y-8 text-lg leading-relaxed text-on-surface/90">
                            <p className="font-headline text-2xl font-light italic text-emerald-800 leading-snug">
                                "The landscape of mid-stage fundraising has fundamentally recalibrated. Investors are no longer just looking at the top-line; they are dissecting the unit economics with surgical precision."
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                <div className="space-y-4">
                                    <p>As we navigate through the final quarter of the year, the data indicates a significant pivot in how Series B rounds are being priced and structured. The era of "growth at any cost" has been replaced by a rigorous focus on the **Efficiency Ratio**.</p>
                                    <p>Recent data pulled from the Warren Intel repository suggests that companies with a Burn Multiple under 1.5x are seeing 2.3x more competitive term sheets compared to their high-burn counterparts.</p>
                                </div>
                                <div className="space-y-4">
                                    <p>This trend isn't just a temporary market cooling; it's a structural maturation of the private equity ecosystem. Founders must now demonstrate a clear path to profitability within 18 months of their next raise.</p>
                                    <p>We are seeing "Money Green" sectors like Greentech and B2B SaaS infrastructure leading the charge in these more disciplined valuations.</p>
                                </div>
                            </div>

                            {/* Data Visualization Section */}
                            <section className="my-16 p-8 bg-surface-container-low rounded-xl">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <h3 className="text-xl font-headline font-bold text-emerald-900 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" /> Funding Velocity Trends
                                        </h3>
                                        <p className="text-sm text-on-surface-variant">Average time to close (days) by sector, Q1-Q3 2023</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                                        <span className="text-xs font-label uppercase tracking-tighter">Live Market Data</span>
                                    </div>
                                </div>
                                {/* Simple Bar Chart */}
                                <div className="h-48 w-full flex items-end gap-2 px-4">
                                    {[
                                        { label: "SaaS", height: "40%" },
                                        { label: "Fintech", height: "65%" },
                                        { label: "GreenTech", height: "95%", primary: true },
                                        { label: "AI/ML", height: "55%" },
                                        { label: "Retail", height: "30%" }
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-t-lg transition-all flex flex-col justify-end items-center pb-2 group relative cursor-pointer
                                                ${item.primary ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'}`}
                                            style={{ height: item.height }}
                                        >
                                            <span className={`text-[10px] font-bold mb-1 ${item.primary ? 'text-white' : 'text-primary'}`}>
                                                {item.label}
                                            </span>
                                            {/* Tooltip on hover */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {item.height === "95%" ? "42 days" : "68 days"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <blockquote className="border-l-4 border-primary pl-8 py-4 my-12 bg-surface-container-low/50 rounded-r-lg">
                                <p className="text-2xl font-headline font-bold text-emerald-900 mb-2">"The best founders aren't just raising capital; they're acquiring long-term partners who value sustainable scale over vanity metrics."</p>
                                <cite className="text-sm font-label text-on-surface-variant">— Sarah Jenkins, Partner at Emerald Ventures</cite>
                            </blockquote>

                            <p>Moving forward, Warren Intel expects to see a surge in bridge rounds as companies wait for these valuation paradigms to fully stabilize. For those currently in the "Deal Room," transparency remains the greatest currency.</p>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3 space-y-10">
                        {/* CTA Widget */}
                        <div className="bg-primary-container p-8 rounded-2xl text-on-primary-container shadow-[0_12px_32px_-8px_rgba(25,28,29,0.06)] relative overflow-hidden">
                            <div className="relative z-10">
                                <BarChart3 className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-headline font-bold mb-4">How this affects your raise</h3>
                                <p className="text-on-primary-container/80 text-sm mb-6 leading-relaxed">Based on your current sector (Fintech) and stage (Series A), these market shifts could impact your valuation by 12-15%.</p>
                                <button className="w-full bg-white text-emerald-900 font-bold py-3 rounded-lg hover:bg-surface-container-lowest transition-all shadow-md">
                                    Run Sensitivity Analysis
                                </button>
                            </div>
                        </div>

                        {/* Recent News List */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/20 pb-4">Recent Intel</h4>
                            <div className="space-y-8">
                                {(intel.length > 0 ? intel : MOCK_RECENT_INTEL).map((item, i) => (
                                    <Link key={i} href="#" className="group block">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                                            </div>
                                            <div>
                                                <h5 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-1">
                                                    {item.title}
                                                </h5>
                                                <p className="text-xs text-on-surface-variant">Oct {20 + i} • {5 + (i * 2)} min read</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <button className="w-full border border-primary/20 text-primary font-bold py-3 rounded-lg hover:bg-primary-container/5 transition-all text-sm uppercase tracking-widest font-label">
                                View All Insights
                            </button>
                        </div>

                        {/* Newsletter Card */}
                        <div className="bg-surface-container-low p-8 rounded-2xl">
                            <h4 className="text-lg font-headline font-bold text-emerald-900 mb-2 font-manrope">Fundraising Daily</h4>
                            <p className="text-sm text-on-surface-variant mb-6">Get the raw data and tactical advice delivered to your inbox every morning.</p>
                            <div className="space-y-3">
                                <input className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary" placeholder="work@company.com" type="email" />
                                <button className="w-full bg-gradient-to-b from-[#0d631b] to-[#2e7d32] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all text-sm">Subscribe</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="bg-surface-container-highest mt-24 py-16 px-8 border-t border-outline-variant/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="max-w-xs">
                        <span className="text-2xl font-extrabold text-emerald-900 tracking-tighter font-manrope">Warren Intel</span>
                        <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">Providing high-fidelity intelligence for the world's most ambitious founders and investors. Premium fundraising at scale.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div>
                            <h6 className="font-label font-bold text-emerald-900 mb-6 uppercase tracking-widest text-xs">Intelligence</h6>
                            <ul className="space-y-4 text-sm text-on-surface-variant">
                                <li><Link href="#" className="hover:text-primary">Market Reports</Link></li>
                                <li><Link href="#" className="hover:text-primary">Deal Tracker</Link></li>
                                <li><Link href="#" className="hover:text-primary">LP Insights</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h6 className="font-label font-bold text-emerald-900 mb-6 uppercase tracking-widest text-xs">Resources</h6>
                            <ul className="space-y-4 text-sm text-on-surface-variant">
                                <li><Link href="#" className="hover:text-primary">Fundraising AI</Link></li>
                                <li><Link href="#" className="hover:text-primary">Pitch Decks</Link></li>
                                <li><Link href="#" className="hover:text-primary">Valuation Tool</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h6 className="font-label font-bold text-emerald-900 mb-6 uppercase tracking-widest text-xs">Legal</h6>
                            <ul className="space-y-4 text-sm text-on-surface-variant">
                                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                                <li><Link href="#" className="hover:text-primary">Disclaimer</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/10 flex justify-between items-center text-[10px] uppercase tracking-widest font-label text-on-surface-variant">
                    <span>© 2023 Warren Intel LLC. All rights reserved.</span>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-primary">Twitter</Link>
                        <Link href="#" className="hover:text-primary">LinkedIn</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const MOCK_RECENT_INTEL = [
    { title: "Q3 Venture Debt Report", img: "https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80&w=2070" },
    { title: "Winning the Boardroom", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" },
];

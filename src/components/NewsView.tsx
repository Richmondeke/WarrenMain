"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Clock,
    Share2,
    Bookmark,
    ArrowRight,
    Bell,
    Search as SearchIcon,
    CheckCircle,
    FileText,
    Map,
    Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewsView() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
            {/* TopNavBar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-emerald-900/10 shadow-sm" : "bg-gray-100 dark:bg-zinc-900 border-transparent"
                }`}>
                <div className="flex justify-between items-center h-16 px-8 max-w-[1920px] mx-auto">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50">Capital Insights</Link>
                        <div className="hidden md:flex gap-6">
                            {["Market News", "Venture Capital", "M&A", "IPO Watch", "Policy", "Private Equity"].map((item) => (
                                <Link key={item} href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors text-sm font-medium">
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden lg:block">
                            <input
                                className="bg-surface-container-high border-none rounded-full px-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Search insights..."
                                type="text"
                            />
                        </div>
                        <button className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors">
                            <Bell className="w-5 h-5 text-emerald-800 dark:text-emerald-500" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 overflow-hidden border border-emerald-900/10">
                            <img
                                alt="Executive Profile"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwWArSxlgKGTsVreAYPBngPluhglLAZAFH51MYjvGcXQ5ccnQHHYNPFUrM39R3eDlRi9BM6XvHBKDTl5lDlrfu_muh1VfDF7n02LpY-1oW4WBAum-XMC8qBtR5EOXzicy6i5-VaX5ZsZBzZSzPD_C1kc_5u6lcDEcztmmWCRRO4tC_pfcDPUBcgaLHozi5txwyDNCbFEKi6NBsE9rqyIEhiQ3gWv5JWevkI6W4GiTbFBwIHRkiZePxfRSYcubCCzfPu-eNE6vh0tZx"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    {/* Category Navigation */}
                    <div className="flex items-center gap-8 mb-10 overflow-x-auto no-scrollbar pb-2 scrollbar-hide">
                        <button className="whitespace-nowrap text-primary border-b-2 border-primary pb-2 font-bold transition-all">All Fundraising</button>
                        <button className="whitespace-nowrap text-on-surface-variant hover:text-primary pb-2 transition-all">Venture Capital</button>
                        <button className="whitespace-nowrap text-on-surface-variant hover:text-primary pb-2 transition-all">Private Equity</button>
                        <button className="whitespace-nowrap text-on-surface-variant hover:text-primary pb-2 transition-all">M&A</button>
                        <button className="whitespace-nowrap text-on-surface-variant hover:text-primary pb-2 transition-all">Policy</button>
                        <button className="whitespace-nowrap text-on-surface-variant hover:text-primary pb-2 transition-all">Fund Announcements</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Editorial Column */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Featured Article Hero */}
                            <section className="group relative overflow-hidden rounded-3xl bg-on-surface text-white min-h-[500px] flex items-end p-8 md:p-12 transition-all hover:shadow-2xl">
                                <div className="absolute inset-0">
                                    <img
                                        alt="Corporate Headquarters"
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMWPVPChESkeAOkMjA9CLdGpyA2ZJnAJ63K6935lgDC5dKtSez3VoJ7nM-Qkv_hzMW6VcI8xR5mU-_R3bnmbRzWB59M9YXkV9msoNt28QXC8hXY47t9e9l_ftit_-mfqjpnbePArwcJbjif3sgG0T6fDPRfhQcQeoq1hqYbBpSJxzy9-ofJ8dlfZp-qDYhk3NNO47GChJ3e0mMaNpJ-Xt_gpPVVS1VCmeUjoeN1-37juI7cCJBZjZdl8LAMdvftFk8LdPqtuQQr6vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-transparent to-transparent"></div>
                                </div>
                                <div className="relative z-10 max-w-2xl">
                                    <span className="inline-block bg-primary-container text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase mb-4">Deep Dive</span>
                                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6 font-headline">Series B Dynamics: The Flight to Quality and Capital Efficiency</h2>
                                    <p className="text-lg text-gray-300 mb-8 font-light leading-relaxed">As global liquidity tightens, top-tier venture firms are refocusing on unit economics and sustainable growth models. We analyze the 40 largest Series B rounds of Q3.</p>
                                    <div className="flex items-center gap-6">
                                        <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                            Read Full Insight <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-medium text-gray-400">12 min read • Today</span>
                                    </div>
                                </div>
                            </section>

                            {/* Editorial Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Card 1 */}
                                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            alt="Cash flow"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD14tWbySAlXINL1YHROzextAqj8VAJpaJDdBnzp1zvrFanaq57weK--8GgF6OfI2er4IqzRDBYsPFbP7wI6rgMZt435YDSWy7kOSfWiP-GVo14lPoH936YltSkO5gKDItjNd22rWJB4slplw4eFN0bZ3dGablsGKCMQWKlwtfS30GnYUG4iU-OV7fOKp3dgeT566qmi7r2OyoBknEH0yNv-JiwybNzdvomzLW2aCQ4O5z5Rc1HTPIGzPwKmddM89qxOY8vVLCN3aFS"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Venture Capital</span>
                                            <span className="text-[10px] text-on-surface-variant font-medium uppercase">6 Min Read</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-primary transition-colors font-headline">The Resurgence of Hardware: Climate-Tech Fundraising Hits 2-Year High</h3>
                                        <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">New battery storage technologies are attracting significant late-stage capital from traditional energy giants and VC alike.</p>
                                        <div className="flex items-center justify-between border-t border-surface-container pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded bg-primary-fixed"></div>
                                                <span className="text-xs font-bold text-primary">+12.4% sector inflow</span>
                                            </div>
                                            <Bookmark className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 (With Sparkline) */}
                                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-bold text-tertiary tracking-widest uppercase">M&A Focus</span>
                                            <span className="text-[10px] text-on-surface-variant font-medium uppercase">4 Min Read</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-primary transition-colors font-headline">Fintech Consolidation: Why Regional Banks are Buying Neo-Banks</h3>
                                        <p className="text-on-surface-variant text-sm mb-4">A shift in strategy as established institutions seek to acquire digital-native customer bases and proprietary tech stacks.</p>

                                        {/* Mock Sparkline */}
                                        <div className="bg-surface-container-low rounded-xl p-4 mb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-on-surface-variant">Deal Velocity</span>
                                                <span className="text-xs font-black text-emerald-700">Trending Up</span>
                                            </div>
                                            <div className="relative h-12 w-full flex items-end gap-1 px-1">
                                                <div className="flex-1 bg-primary/20 rounded-t h-4 transition-all hover:bg-primary/40"></div>
                                                <div className="flex-1 bg-primary/30 rounded-t h-6 transition-all hover:bg-primary/50"></div>
                                                <div className="flex-1 bg-primary/40 rounded-t h-5 transition-all hover:bg-primary/60"></div>
                                                <div className="flex-1 bg-primary/50 rounded-t h-8 transition-all hover:bg-primary/70"></div>
                                                <div className="flex-1 bg-primary/70 rounded-t h-7 transition-all hover:bg-primary/80"></div>
                                                <div className="flex-1 bg-primary/90 rounded-t h-10 transition-all hover:bg-primary/95"></div>
                                                <div className="flex-1 bg-primary rounded-t h-12"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 pb-6 mt-auto">
                                        <div className="flex items-center justify-between border-t border-surface-container pt-4">
                                            <span className="text-xs text-on-surface-variant italic">Source: Warren Intel Terminal</span>
                                            <Share2 className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group md:col-span-2 flex flex-col md:flex-row">
                                    <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                                        <img
                                            alt="Office building"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbQsvkvwerodxUyhvuLTde0wIuXH7rmYCMyJe8lUVvu-gbhdsO2es7bvMIAzA_jUGo9ni2g5qKWSF6AbmCUkGGmL_T8yB5w3T3b1-1SyXdgC1i-4i6ql7PkLes2dJm0VgPM-xw6LrANYRk0zitMniOXhrxiwDd3_1gK4fhsxGNZ6QsfmlCoqEwKolJuaKDTQDWE5NtlmVJ-LaQnYmKMWK1hRZaOIBsD7tFJh9YHmcomzPuzxM-65ii0QDytnidBuwq471WXNV9iUhM"
                                        />
                                    </div>
                                    <div className="p-8 md:w-2/3">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Policy</span>
                                            <span className="text-xs text-on-surface-variant">• Updated 2h ago</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors font-headline">The SEC's New Private Fund Rules: Compliance Costs vs. Investor Protection</h3>
                                        <p className="text-on-surface-variant text-base mb-6 leading-relaxed">Legal experts discuss the long-term impact on emerging managers as new disclosure requirements take effect next quarter.</p>
                                        <div className="flex items-center gap-3">
                                            <img
                                                alt="Author"
                                                className="w-8 h-8 rounded-full"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnfdYEpNaEq1jpEtbyB0Z7k338phX9TZwtd4cLW5HLyYsLF221xE-J5vh465ZO7kN1DxtSEL744jigNhglFxdSdVHRpzRKLbioaxMc59wG2ooyazPlFjfP_6Z1esA2hMBxXWG9gG0krctKKvMhKfMyKI6lLLM6Q1Ef9e7e2Ysw-kMI0Ce_6MTLG7lb7wT3E3mRgsCt7CcRRcCIdn8VjdIg0nlkVALpo9Qnj-usouuIrKMhm73Zg-XrxzKa320xFbNkqygXMojCKl3h"
                                            />
                                            <span className="text-sm font-bold">Written by Sarah Kensington</span>
                                            <span className="text-sm text-gray-400">Chief Policy Analyst</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Insights */}
                        <aside className="lg:col-span-4 space-y-8">
                            {/* Trending Section */}
                            <div className="bg-surface-container-low rounded-3xl p-8">
                                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 font-headline text-emerald-900 border-b border-emerald-900/10 pb-4">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Top Capital Movers
                                </h4>
                                <div className="space-y-6">
                                    {[
                                        { id: "01", title: "Andreessen Horowitz raises $7.2B across multiple new funds", detail: "+14% YoY increase in dry powder" },
                                        { id: "02", title: "Mistral AI valuation hits $6B after latest Sovereign fund round", detail: "Series C / Artificial Intelligence" },
                                        { id: "03", title: "BlackRock nears agreement to acquire Infrastructure Global", detail: "$12.5B estimated transaction" }
                                    ].map((mover) => (
                                        <div key={mover.id} className="flex items-start gap-4 group cursor-pointer">
                                            <span className="text-2xl font-black text-outline-variant italic group-hover:text-primary transition-colors">{mover.id}</span>
                                            <div>
                                                <h5 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors mb-1">{mover.title}</h5>
                                                <p className="text-[10px] font-bold text-emerald-600">{mover.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-8 py-3 border border-outline-variant rounded-xl text-sm font-bold hover:bg-surface-container-highest transition-colors">
                                    View All Market Movers
                                </button>
                            </div>

                            {/* Recommended Reports */}
                            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-surface-container-high shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-lg font-bold mb-6 font-headline text-emerald-900">Expert Analysis</h4>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-surface-container-low group cursor-pointer hover:bg-surface-container-high transition-all">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Quarterly PDF Report</span>
                                        </div>
                                        <h5 className="font-bold text-sm group-hover:text-primary">Global Private Equity Trends 2024</h5>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-surface-container-low group cursor-pointer hover:bg-surface-container-high transition-all">
                                        <div className="flex items-center gap-3 mb-2">
                                            <TrendingUp className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Premium Dataset</span>
                                        </div>
                                        <h5 className="font-bold text-sm group-hover:text-primary">Series A Benchmarking Tool</h5>
                                    </div>
                                </div>
                            </div>

                            {/* Newsletter Signup */}
                            <div className="bg-primary text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                                <h4 className="text-2xl font-extrabold mb-4 relative z-10 leading-tight font-headline">Weekly Alpha</h4>
                                <p className="text-sm text-primary-fixed mb-6 relative z-10 font-medium">Get the hidden fundraising data delivered every Monday morning.</p>
                                <div className="space-y-3 relative z-10">
                                    <input
                                        className="w-full bg-white/20 border-none rounded-xl px-4 py-3 text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white outline-none"
                                        placeholder="work@firm.com"
                                        type="email"
                                    />
                                    <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">Subscribe Now</button>
                                </div>
                                <p className="text-[10px] text-white/40 mt-4 text-center pb-2">Join 15,000+ Managing Directors & Principals.</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-surface-container-highest mt-24 py-16 px-8 border-t border-outline-variant/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="max-w-xs">
                        <span className="text-2xl font-extrabold text-emerald-900 tracking-tighter font-headline">Warren Intel</span>
                        <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">Providing high-fidelity intelligence for the world's most ambitious founders and investors. Premium fundraising at scale.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div>
                            <h6 className="font-bold text-emerald-900 mb-6 uppercase tracking-widest text-xs">Intelligence</h6>
                            <ul className="space-y-4 text-sm text-on-surface-variant">
                                <li><Link href="#" className="hover:text-primary transition-colors">Market Reports</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Deal Tracker</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">LP Insights</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h6 className="font-bold text-emerald-900 mb-6 uppercase tracking-widest text-xs">Resources</h6>
                            <ul className="space-y-4 text-sm text-on-surface-variant">
                                <li><Link href="#" className="hover:text-primary transition-colors">Fundraising AI</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Pitch Decks</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Valuation Tool</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h6 className="font-bold text-emerald-900 mb-6 uppercase tracking-widest text-xs">Legal</h6>
                            <ul className="space-y-4 text-sm text-on-surface-variant">
                                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Disclaimer</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-medium text-on-surface-variant">
                    <span>© 2026 Warren Intel LLC. All rights reserved.</span>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
                        <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

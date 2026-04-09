"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LandingNavbar } from "./LandingNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { getPlatformStats, getTestimonials, PlatformStats, Testimonial } from "@/lib/firestore";

const STAGES = ["Pre-Seed", "Seed", "Series A", "Acquisition Capital"];

const FOUNDERS_AVATARS = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBma3FtVrZN1tt8fW4U0J62CZQERPTrFpMkeP1c4A0RTEOa-crWhP-XYgb9P5R37DF2U6wyVOigIQQv70yLtUZJW0NpfucZXy7Tj3xutolaVhN0_uVbVtSGDltEyt-Ws442TVjEXd9M2zWzJ-xBgTBC-T2cIPkvCeruuoY4GEny7rcchRvfu00-5ZHBoF134oqjQmbtf6BRLbajRRm8-BqhvJAW0VCeJceYRHR4P1cmhvhqkay2gAmTB1wscEqpdKKnGwHOBH5i6-fW",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBlEtkj-x1-dsu_HNR-ZgWcEfl4rO5s0OxR5efAhcs12NSWdYyR00Vom0zwYuTb6lI0qwFkg4JpQN7fn2Xs0W_JQcifzHCDyDgqKiZrsqdSwbla0q3zi0ey8L9ILB8pMTl7TZqMZppoxFGxi9QRmZ5bW3g2szH2HOAc5CwVr0ao_U6gxqXveis3ZqXUdon7XJYqmLh84xsmGZ4a5YdfDozqTD4c7-ozWOXE8kJVRUSG5fy9Wr3C7_-9-eteHwMhd80dYawZ8yba1aIy",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCrGDGhjUYx3JO0hmoBlTKpkgDfYwFG6ZRRl0Q7xCk0rN_GX_JbK8Wv3noHnRLbx5GCMGxSKjp-Xe8DVrZeEFVk0nWDfIf6-xztOZOHADg7fs3LWOufiJjIsWcTfXc9kqE5N8DVUmfvFJiemTGJxsGaLhR9ePoyImZA2d8GhCsCI1RS_VKc2k9SXtwF_1FfKR-3ncdsnrETLiJf5bd6DWpgSoIHwZIVxFMN526n3XVpUonEzB5jnczsAu-OMByqpcy4XZ5C0iL2A4Lh",
];

const TESTIMONIALS = [
    {
        name: "Marcus Thorne", role: "Founder, GridScale",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGAdJkJeR_oFmItaCuSEiUT7MQ3VVkomzf2VEwEcuuybFhK4vyosNZPNew1jpNxXwyAuCnGz8W4ejBGtthe3wO3aVoO9HL87MJJDBrnxSV311aqmlawImX9AVayENPC0OJj7tdcIDtCeoJYJXJk5IPjlPcY0aNFB5JDSe_kicuNMjWuAfLPJdeylZsTnNXGZiIp3Wnw_m-SbS4Q0tNxkyMFQG_JWFRGx3Yu10y-vepP_VFR79dgYLgVK5smWRgOMr7EDSlD9SnG_hc",
        quote: "The AI matching alone saved us at least 40 hours of manual research. It pointed us to three funds we hadn't even considered, and one led our round."
    },
    {
        name: "Elena Rodriguez", role: "CEO, BioFlow Health",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsCSrmV9KjHB11BQVSz41f6LsKuxE3pLdui_2M5h9Nv03NW0sYxDeh-73b5M7XsQsYMotOZVSg8Tuk0NFR8eIKCR4vPSBRzfFFOgI0_Uu-hHG5Vn2utwKC7yb_0PghB8BZmnhI-bvU1B4I4obzeCKw3HHc-wYlC-FbpTkT7HaS1yyzzqopT8fdbMCATXl_S-czKo43fvMs2vS4tvL_I7EFypSP2jxXmd_TLDG8sJouJKP_Hql7b1M2m9DRATnphOoU3bmBR5yNmPE7",
        quote: "The fundability score was a wake-up call. We completely reworked our go-to-market slides based on their feedback, and the response from VCs was immediate."
    },
    {
        name: "Jameson Wu", role: "CTO, Core Protocol",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ9QVwa1QZKJVcuCRU4RXPOU0LMnUGFuol3UiZ-cFq9kCBk2dUawYT6C3ZrXrpBos6UsCKN_ePsYtuplFY7Eco8H3yzmsMpMvHZ0td4YWhGbJ1anQKAZpAXwfDNzTqXuturkE7Z4k_SLe5_qo45sdT9wS8RINOaTdpO9-R05Oxb0EuAOKDDGFbHhU184Js1HXbI90WYEPdhL2J6kRvuTuZ4fC1j5U2S7A-aKtfUDzUSpmJLIYy7Y8d8UvO_9UapctVRMyvpYpTqIQW",
        quote: "Having a secure, professional data room that actually tracks investor engagement changed the game for our follow-up strategy. Essential tool."
    },
];

export function FoundersLandingView() {
    const router = useRouter();
    const [stageIndex, setStageIndex] = useState(0);
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [s, t] = await Promise.all([
                getPlatformStats(),
                getTestimonials()
            ]);
            setStats(s);
            if (t.length > 0) setTestimonials(t);
            setIsLoading(false);
        };
        fetchData();

        const interval = setInterval(() => {
            setStageIndex((prev) => (prev + 1) % STAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-surface text-on-surface font-body min-h-screen">
            <LandingNavbar activePage="founders" />

            <main className="pt-24 overflow-x-hidden">
                {/* Hero Section */}
                <section className="px-8 py-20 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                    >
                        <div className="lg:col-span-7">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block px-3 py-1 mb-6 text-[0.6875rem] font-bold tracking-[0.1em] text-primary uppercase bg-primary/10 rounded-full"
                            >
                                Raising <AnimatePresence mode="wait">
                                    <motion.span
                                        key={STAGES[stageIndex]}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="inline-block"
                                    >
                                        {STAGES[stageIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-5xl md:text-8xl font-headline font-extrabold text-on-surface leading-[0.95] tracking-tight mb-8"
                            >
                                Raising Your <br />
                                <motion.span
                                    layout
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="relative inline-block overflow-hidden align-bottom min-w-[200px]"
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={STAGES[stageIndex]}
                                            className="text-primary block"
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -40 }}
                                            transition={{ duration: 0.5, ease: "circOut" }}
                                        >
                                            {STAGES[stageIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.span> <br />
                                in <span className="italic text-primary">Weeks</span>, Not Months.
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-xl text-gray-500 max-w-xl leading-relaxed"
                            >
                                Warren Intel provides the high-octane data intelligence and investor connectivity previously reserved for elite investment banks. Gain your edge today.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push("/signup")}
                                    className="editorial-gradient text-white px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    Get Started <span className="material-symbols-outlined">arrow_forward</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ backgroundColor: "rgba(13, 99, 27, 0.05)" }}
                                    className="px-8 py-4 rounded-xl font-headline font-bold text-lg text-primary border border-gray-200 transition-all"
                                >
                                    View Sample Deck
                                </motion.button>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="flex items-center gap-6 pt-8 border-t border-gray-200 mt-8"
                            >
                                <div className="flex -space-x-3">
                                    {FOUNDERS_AVATARS.map((src, i) => (
                                        <img key={i} alt="Founder" className="w-10 h-10 rounded-full border-2 border-surface object-cover" src={src} />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Trusted by <span className="text-on-surface font-bold">{stats?.totalFounders || "450"}+ founders</span> who raised {stats?.totalRaised || "$2.4B"} combined.</p>
                            </motion.div>
                        </div>

                        {/* Live Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="lg:col-span-5 relative"
                        >
                            <div className="bg-white rounded-2xl editorial-shadow p-6 relative z-10 overflow-hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-headline font-bold text-lg">Active Investor Outreach</h3>
                                    <span className="text-xs bg-emerald-100 text-primary px-2 py-0.5 rounded-full font-bold">LIVE</span>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { name: "Green Oak Capital", type: "Tier 1 • Fintech Focus", match: "98%", status: "Request Sent", icon: "account_balance" },
                                        { name: "Stellar Ventures", type: "Growth • SaaS Specialist", match: "94%", status: "Drafting Prep", icon: "rocket_launch" }
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 1 + (idx * 0.2) }}
                                            className={`flex items-center justify-between p-4 ${idx === 0 ? "bg-gray-50" : "bg-white border border-gray-100"} rounded-xl`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">{item.name}</div>
                                                    <div className="text-xs text-gray-500">{item.type}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-primary">{item.match} Match</div>
                                                <div className="text-[10px] text-gray-500">{item.status}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="h-32 w-full flex items-end gap-1">
                                        {[30, 45, 65, 85, 100].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: 1.5 + (i * 0.1), duration: 0.5 }}
                                                className="w-full rounded-t-sm"
                                                style={{ backgroundColor: `rgba(13, 99, 27, ${0.2 + i * 0.2})` }}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-center mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Momentum Index</div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl -z-0" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-100/20 rounded-full blur-3xl -z-0" />
                        </motion.div>
                    </motion.div>
                </section>

                {/* Video Showcase */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="py-20 px-8 bg-white border-y border-gray-100"
                >
                    <div className="max-w-5xl mx-auto text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface">Experience the Edge</h2>
                            <p className="text-gray-500 text-lg max-w-2xl mx-auto">See how Warren Intel transforms months of fundraising into a streamlined, data-driven sprint.</p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="relative group cursor-pointer aspect-video rounded-3xl overflow-hidden editorial-shadow border border-gray-100 bg-gray-200"
                        >
                            <img alt="Dashboard Demo" className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:scale-105 group-hover:brightness-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0ZLU9wC-rcgKjOAly4eV1wK5t3tozzW9-Ala0wTJsZ_YbJ0uppjbULPaZgXW7LJe0FkAKo9ndRPcKrGWz6eEUMUcby1_NxGurQJsoU214y0UFmnIaMHOZqjcMD6r7xY_9FeoHmNxHXOt7T2SoNWpzoq9OZdW4LmFCLI_omcdjLouSuxIa8uV6248vVb64gu8qfz_sdK4T9_wFe0TmlLqWbAlCFWvuxq99jIAh37T8VMQfZOc4x-9QFTMboT4O0yFpRUfTaRLnUqGo" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-24 h-24 rounded-full bg-primary/90 text-white flex items-center justify-center editorial-shadow transform transition-transform duration-300"
                                >
                                    <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                </motion.div>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between">
                                <div className="text-white text-left">
                                    <p className="text-sm font-bold tracking-widest uppercase opacity-80">Platform Walkthrough</p>
                                    <p className="text-xl font-headline font-bold">2:45 • The New Era of Fundraising</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <div className="w-2 h-2 rounded-full bg-white/40" />
                                    <div className="w-2 h-2 rounded-full bg-white/40" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Feature Bento Grid */}
                <section className="bg-gray-50 py-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">The Modern Founder&apos;s Toolkit</h2>
                            <p className="text-gray-500 max-w-2xl mx-auto text-lg">We&apos;ve automated the manual grind of fundraising so you can focus on building the future.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* AI Matching */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="md:col-span-8 bg-white rounded-2xl p-8 editorial-shadow overflow-hidden group"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="mb-8 max-w-md">
                                        <span className="material-symbols-outlined text-primary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                                        <h3 className="text-2xl font-headline font-bold mb-3">AI-Powered Investor Matching</h3>
                                        <p className="text-gray-500">Scan 25,000+ global VCs, family offices, and angels. Our engine matches your metrics against real-time deployment patterns.</p>
                                    </div>
                                    <div className="mt-auto bg-surface rounded-xl border border-gray-100 overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                    <th className="px-6 py-3">Fund Name</th>
                                                    <th className="px-6 py-3">Focus Area</th>
                                                    <th className="px-6 py-3">Avg Ticket</th>
                                                    <th className="px-6 py-3 text-right">Warren Score</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-xs">
                                                <tr className="border-b border-gray-100"><td className="px-6 py-4 font-bold">Sequoia Heritage</td><td className="px-6 py-4">B2B SaaS</td><td className="px-6 py-4">$15M - $50M</td><td className="px-6 py-4 text-right text-primary font-bold">9.8/10</td></tr>
                                                <tr className="border-b border-gray-100"><td className="px-6 py-4 font-bold">Andreessen Horowitz</td><td className="px-6 py-4">Fintech / Infra</td><td className="px-6 py-4">$10M - $100M</td><td className="px-6 py-4 text-right text-primary font-bold">9.4/10</td></tr>
                                                <tr><td className="px-6 py-4 font-bold">Index Ventures</td><td className="px-6 py-4">Consumer Tech</td><td className="px-6 py-4">$5M - $30M</td><td className="px-6 py-4 text-right text-primary font-bold">8.9/10</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Fundability Score */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="md:col-span-4 editorial-gradient text-white rounded-2xl p-8 editorial-shadow flex flex-col justify-between"
                            >
                                <div className="mb-8">
                                    <span className="material-symbols-outlined text-4xl mb-4">analytics</span>
                                    <h3 className="text-2xl font-headline font-bold mb-3">Fundability Score</h3>
                                    <p className="text-white/80 mb-6">Get a brutal, honest assessment of your deck, financials, and market positioning before you hit send.</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/10">
                                    <div className="text-center">
                                        <div className="text-5xl font-headline font-extrabold mb-1">84<span className="text-2xl text-white/60">/100</span></div>
                                        <div className="text-[10px] uppercase tracking-widest font-bold text-white/60">Ready for Launch</div>
                                    </div>
                                    <div className="mt-6 space-y-3">
                                        <div className="flex justify-between text-xs"><span>Team Strength</span><span className="font-bold">92%</span></div>
                                        <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden"><div className="bg-white h-full w-[92%]" /></div>
                                        <div className="flex justify-between text-xs pt-2"><span>Market Size</span><span className="font-bold">78%</span></div>
                                        <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden"><div className="bg-white h-full w-[78%]" /></div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Data Room */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="md:col-span-4 bg-white rounded-2xl p-8 editorial-shadow"
                            >
                                <span className="material-symbols-outlined text-primary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>folder_managed</span>
                                <h3 className="text-2xl font-headline font-bold mb-3">Secure Data Room</h3>
                                <p className="text-gray-500 mb-8">Bank-grade security for your sensitive docs. Track who views what and for how long.</p>
                                <div className="space-y-3">
                                    {["Series_A_Financials.xlsx", "Cap_Table_Q3.pdf", "IP_Strategy_Final.pdf"].map(name => (
                                        <div key={name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <span className="material-symbols-outlined text-emerald-700">description</span>
                                            <span className="text-sm font-medium">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Resources */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="md:col-span-8 bg-white rounded-2xl p-8 editorial-shadow relative overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center h-full">
                                    <div>
                                        <span className="material-symbols-outlined text-primary text-4xl mb-4">school</span>
                                        <h3 className="text-2xl font-headline font-bold mb-3">Founders&apos; Resources</h3>
                                        <p className="text-gray-500 mb-6">Access our vault of proprietary term sheets, pitch deck templates, and legal walkthroughs.</p>
                                        <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                            Browse Library <span className="material-symbols-outlined">arrow_right_alt</span>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[{ n: "120+", l: "Templates" }, { n: "15", l: "Masterclasses" }, { n: "400+", l: "Checklists" }, { n: "24/7", l: "AI Concierge" }].map(s => (
                                            <div key={s.l} className="bg-gray-50 p-4 rounded-xl text-center space-y-2">
                                                <div className="text-2xl font-bold">{s.n}</div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase">{s.l}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Value Proposition */}
                <section className="py-24 px-8 overflow-hidden">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="flex-1 relative"
                        >
                            <img alt="Conference" className="rounded-2xl grayscale brightness-90 shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXSBgv1OvLL3Ik20OgkfBWfhX015alY50QQYRHpw6x9orkR67x_E-57sDCs1fQX0QZR_RaNQ-USw2JCy59KEkBWahdwWQ0GND599TyjS-YK9MJhW9ije_fzfZj4MjQUvRlBo2cajGWqUg-1UqI9w4eRkA4_am2UM5tHtoiLi7Rqhz1FS7SghqBTkff1yakmXByBxB3NTWogy85lGVnR1SjOGrvrYy_ODvsL6Mu47R9q_n5Obh6-e6okw-_RYbXvqMGxqldfxNGI78d" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="absolute -bottom-10 -right-10 bg-white/80 backdrop-blur-xl p-8 rounded-2xl editorial-shadow max-w-xs border border-white/20"
                            >
                                <div className="flex text-primary mb-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                </div>
                                <p className="italic text-on-surface text-sm mb-4">&ldquo;Warren Intel gave us the data to negotiate from a position of absolute strength. We closed our $22M round in record time.&rdquo;</p>
                                <div className="text-xs font-bold">— Sarah Chen, CEO of Arise AI</div>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="flex-1 space-y-8"
                        >
                            <h2 className="text-5xl font-headline font-extrabold tracking-tight leading-tight">Gain the Institutional Edge You Deserve.</h2>
                            <p className="text-gray-500 text-lg">In fundraising, information is the only true currency. Warren Intel gives you the same level of market visibility and investor behavioral data that top-tier private banks use.</p>
                            <ul className="space-y-6">
                                {[
                                    { title: "Real-time Dry Powder Tracking", desc: "Know exactly which funds have capital ready to deploy this quarter." },
                                    { title: "Competitor Intelligence", desc: "Understand how similar startups are positioning their traction." },
                                    { title: "Warm-Lead Warmth Mapping", desc: "Visualize your second-degree network to identify the fastest route to an intro." },
                                ].map(item => (
                                    <li key={item.title} className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                            <span className="material-symbols-outlined text-primary text-sm">check</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{item.title}</h4>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-24 bg-gray-200 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {(testimonials.length > 0 ? testimonials : TESTIMONIALS).map((t, idx) => (
                                <motion.div
                                    key={t.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    className="bg-white p-8 rounded-2xl editorial-shadow"
                                >
                                    <div className="mb-6">
                                        <img alt={t.name} className="w-16 h-16 rounded-full object-cover mb-4" src={t.img} />
                                        <div className="font-bold">{t.name}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t.role}</div>
                                    </div>
                                    <p className="text-gray-500 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="py-24 px-8 text-center editorial-gradient text-white"
                >
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-5xl font-headline font-extrabold tracking-tight">Your Series A starts today.</h2>
                        <p className="text-white/80 text-xl max-w-2xl mx-auto">Stop guessing and start executing with the data intelligence of the world&apos;s most successful founders.</p>
                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push("/signup")}
                                className="bg-white text-primary px-10 py-5 rounded-xl font-headline font-bold text-xl shadow-xl hover:brightness-110 active:scale-95 transition-all"
                            >
                                Request Invite Only Access
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-emerald-800 text-white px-10 py-5 rounded-xl font-headline font-bold text-xl hover:bg-emerald-800/80 transition-all"
                            >
                                Book a Platform Demo
                            </motion.button>
                        </div>
                        <p className="text-white/60 text-sm">Limited to 15 new startups per month to ensure quality matching.</p>
                    </div>
                </motion.section>
            </main>

            <footer className="bg-gray-50 w-full py-12 px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto items-start">
                    <div className="space-y-6">
                        <div className="font-headline font-bold text-lg text-primary">Warren Intel</div>
                        <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
                            The premium editorial and data platform for founders navigating the venture capital ecosystem. Built by former bankers, for future leaders.
                        </p>
                    </div>
                    <div className="flex flex-col md:items-end space-y-6">
                        <div className="flex flex-wrap gap-6 md:justify-end">
                            {["Terms of Service", "Privacy Policy", "Regulatory Disclosure", "Contact Us"].map(link => (
                                <a key={link} className="text-gray-400 hover:text-primary transition-colors text-sm tracking-wide" href="#">{link}</a>
                            ))}
                        </div>
                        <div className="text-gray-400 text-sm tracking-wide text-right">
                            © 2026 Warren Intel. Private Banking Editorial Standards.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

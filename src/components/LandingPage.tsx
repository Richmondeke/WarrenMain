"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/AuthContext";
import { ArrowRight, BarChart3, Shield, Zap, TrendingUp, PieChart, Search, Sparkles, Globe, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export function LandingPage() {
    const { signInWithGoogle, user } = useAuth();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="relative overflow-hidden bg-background selection:bg-gold-500 selection:text-navy-900">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.05, 0.15, 0.05]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-gold-500/10 rounded-full blur-[150px]"
                />
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="z-10 max-w-6xl mx-auto"
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-8 backdrop-blur-md"
                    >
                        <Sparkles className="w-4 h-4 text-gold-500" />
                        Built for the 2026 Market Economy
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-foreground"
                    >
                        INVEST WITH <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-gold-500 italic">PRECISION.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
                    >
                        Warrenintel parses dense SEC filings using neural-context analysis,
                        giving you the same intelligence as institutional quant funds.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                    >
                        <Link
                            href={user ? "/dashboard" : "/signup"}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-5 rounded-2xl text-xl font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] flex items-center gap-3 group relative overflow-hidden"
                        >
                            <span className="relative z-10">Launch Terminal</span>
                            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </Link>
                        <button className="px-10 py-5 rounded-2xl text-xl font-bold border-2 border-border hover:bg-secondary/50 backdrop-blur-sm transition-all hover:border-primary/50">
                            Docs & methodology
                        </button>
                    </motion.div>
                </motion.div>

                {/* Decorative Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-primary/20 rounded-full flex justify-center p-1"
                >
                    <div className="w-1 h-2 bg-primary rounded-full" />
                </motion.div>
            </section>

            {/* Bento Grid Feature Section */}
            <section className="py-32 relative z-10 px-4 md:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">THE QUANT TERMINAL</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Institutional tools for individual investors.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[300px] gap-6">
                        {/* Large Bento Item */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-8 md:row-span-2 rounded-[2.5rem] bg-gradient-to-br from-primary to-navy-900 p-12 text-white relative overflow-hidden group shadow-2xl"
                        >
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                                        <Cpu className="w-6 h-6 text-gold-500" />
                                    </div>
                                    <h3 className="text-4xl font-black mb-4 tracking-tighter">Neural Proxy Analysis</h3>
                                    <p className="text-xl opacity-70 max-w-md leading-relaxed">
                                        Our AI doesn't just read; it simulates market reaction scenarios based on historical patterns.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/5">Low Latency</span>
                                    <span className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/5">98% Accuracy</span>
                                </div>
                            </div>
                            {/* Decorative Background Icon */}
                            <BarChart3 className="absolute -bottom-20 -right-20 w-80 h-80 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                        </motion.div>

                        {/* Square Bento Item */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-4 md:row-span-1 rounded-[2.5rem] bg-card border border-border p-8 flex flex-col justify-between group overflow-hidden"
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Search className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-2">Semantic Discovery</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Ask anything. "Which company has the most supply chain risk in Vietnam?"</p>
                            </div>
                        </motion.div>

                        {/* Square Bento Item */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-4 md:row-span-1 border-2 border-primary/20 rounded-[2.5rem] bg-primary/[0.02] p-8 flex flex-col justify-between group overflow-hidden"
                        >
                            <div className="w-10 h-10 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-500">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-2">Hedge-Fund Grade</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Risk models updated every 15 minutes with real-time news correlation.</p>
                            </div>
                        </motion.div>

                        {/* Wide Bento Item */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-12 md:row-span-1 rounded-[2.5rem] bg-secondary border border-border p-12 flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden"
                        >
                            <div className="max-w-xl">
                                <h3 className="text-3xl font-black mb-4 tracking-tight">Global Market Coverage</h3>
                                <p className="text-muted-foreground font-medium">Standardized analysis for US, Nigeria, South Africa, and Ghana markets. Compare assets across continents with zero friction.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center shadow-premium"><Globe className="w-8 h-8 text-primary" /></div>
                                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center shadow-premium rotate-12"><TrendingUp className="w-8 h-8 text-gold-500" /></div>
                                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center shadow-premium -rotate-12"><PieChart className="w-8 h-8 text-primary" /></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 relative text-center px-4">
                <div className="max-w-4xl mx-auto backdrop-blur-3xl p-20 rounded-[3rem] border border-primary/5 bg-primary/[0.02] shadow-2xl overflow-hidden relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-20 -right-20 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl"
                    />
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-tight">
                        STOP GUESSING. <br /> START ANALYZING.
                    </h2>
                    <button
                        onClick={signInWithGoogle}
                        className="bg-primary text-primary-foreground hover:bg-gold-500 hover:text-navy-900 px-16 py-8 rounded-[2rem] text-3xl font-black transition-all hover:scale-105 hover:shadow-2xl inline-flex items-center gap-4 group"
                    >
                        Get Early Access
                        <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </button>
                    <p className="mt-8 text-muted-foreground font-bold uppercase tracking-widest text-xs">Join the alpha cohort today.</p>
                </div>
            </section>

            <footer className="py-20 border-t border-border text-center">
                <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="font-black text-2xl tracking-tighter"><span className="text-primary">WARREN</span>INTEL</div>
                    <div className="text-muted-foreground text-sm font-medium">
                        © {new Date().getFullYear()} Warrenintel. Institutional Intelligence for All.
                    </div>
                    <div className="flex gap-8 text-sm font-bold text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                        <a href="#" className="hover:text-primary transition-colors">Terminal</a>
                        <a href="#" className="hover:text-primary transition-colors">Legal</a>
                    </div>
                </div>
            </footer>
        </div >
    );
}

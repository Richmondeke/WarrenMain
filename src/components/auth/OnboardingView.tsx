"use client";

import { useAuth } from "@/lib/firebase/AuthContext";
import { updateUserProfile } from "@/lib/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Rocket, Landmark, Search, ArrowRight, ShieldCheck, UserCheck, Database, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingView() {
    const { user, role } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleRoleSelection = async (selectedRole: string) => {
        if (!user) return;
        setLoading(selectedRole);
        try {
            await updateUserProfile(user.uid, {
                role: selectedRole,
                onboarded: true,
                updatedAt: new Date(),
            });
            toast.success(`Role set to ${selectedRole.replace('_', ' ')}`);

            // Redirect based on role
            if (selectedRole === 'fund_manager') {
                router.push('/portfolio');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            console.error("Failed to set role:", err);
            toast.error("Failed to save your selection. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden min-h-screen">
            {/* Top Navigation Anchor */}
            <header className="bg-[#f8f9fa] font-manrope antialiased flex justify-between items-center w-full px-8 py-6 max-w-full mx-auto fixed top-0 z-50">
                <div className="text-xl font-bold tracking-tight text-[#0d631b]">Warren Intel</div>
                <div className="text-slate-500 text-sm font-medium">Step 1 of 3</div>
            </header>

            <main className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6">
                {/* Hero Section */}
                <div className="max-w-3xl w-full text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-6"
                    >
                        How will you use Warren Intel?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-body text-lg text-on-surface-variant opacity-80 leading-relaxed max-w-2xl mx-auto"
                    >
                        Select your primary role to customize your institutional experience. We'll tailor your dashboard and deal flow to your specific objectives.
                    </motion.p>
                </div>

                {/* Role Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                    {/* Founder Card */}
                    <button
                        onClick={() => handleRoleSelection('founder')}
                        disabled={!!loading}
                        className="group relative flex flex-col text-left p-8 rounded-xl bg-white backdrop-blur-xl border border-transparent transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(25,28,29,0.1)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <div className="w-14 h-14 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 mb-8 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
                            <Rocket className="w-8 h-8" />
                        </div>
                        <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Founder</h3>
                        <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-12">
                            I am building a company and looking to raise capital efficiently.
                        </p>
                        <div className="mt-auto flex items-center text-xs font-bold tracking-wider text-emerald-700 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                            {loading === 'founder' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Select Role'}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                    </button>

                    {/* Fund Manager Card */}
                    <button
                        onClick={() => handleRoleSelection('fund_manager')}
                        disabled={!!loading}
                        className="group relative flex flex-col text-left p-8 rounded-xl bg-white backdrop-blur-xl border border-transparent transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(25,28,29,0.1)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <div className="w-14 h-14 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 mb-8 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
                            <Landmark className="w-8 h-8" />
                        </div>
                        <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Fund Manager</h3>
                        <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-12">
                            I am managing a fund and looking to source high-quality deals and manage my portfolio.
                        </p>
                        <div className="mt-auto flex items-center text-xs font-bold tracking-wider text-emerald-700 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                            {loading === 'fund_manager' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Select Role'}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                    </button>

                    {/* VC / Scout Card */}
                    <button
                        onClick={() => handleRoleSelection('fund_manager')}
                        disabled={!!loading}
                        className="group relative flex flex-col text-left p-8 rounded-xl bg-white backdrop-blur-xl border border-transparent transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(25,28,29,0.1)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <div className="w-14 h-14 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 mb-8 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="font-headline text-xl font-bold text-on-surface mb-3">VC / Scout</h3>
                        <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-12">
                            I am identifying early-stage opportunities and building my investment network.
                        </p>
                        <div className="mt-auto flex items-center text-xs font-bold tracking-wider text-emerald-700 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                            {loading === 'fund_manager' && false ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Select Role'}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                    </button>
                </div>

                {/* Secondary Background Decoration */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-100/20 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[100px]"></div>
                </div>
            </main>

            {/* Footer Action */}
            <footer className="w-full flex flex-col items-center gap-6 py-12">
                <div className="h-px w-24 bg-gray-200"></div>

                {/* Identity Branding Visual */}
                <div className="flex items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 mt-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Institutional Grade</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Privacy Focused</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Verified Data</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

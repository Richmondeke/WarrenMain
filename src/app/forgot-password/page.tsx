"use client";

import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset link sent to your email.");
        } catch (err: any) {
            toast.error(err.message || "Failed to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface text-on-surface min-h-screen flex flex-col">
            {/* TopNavBar Replacement for transactional focus */}
            <header className="bg-transparent top-0 left-0 w-full z-50">
                <nav className="flex justify-between items-center px-6 py-8 max-w-7xl mx-auto">
                    <div className="text-xl font-bold tracking-tighter text-emerald-900 font-manrope">
                        Warren Intel
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-slate-600 font-medium hover:text-emerald-700 transition-colors font-inter text-sm">Support</Link>
                    </div>
                </nav>
            </header>

            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-low mb-6">
                            <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
                        </div>
                        <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-3">Forgot Password?</h1>
                        <p className="text-on-surface-variant font-body leading-relaxed max-w-[280px] mx-auto">
                            Enter the email address associated with your account to receive instructions.
                        </p>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_-8px_rgba(25,28,29,0.06)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>
                        <form onSubmit={handleReset} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-outline text-lg">mail</span>
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-lg focus:ring-0 focus:border-b-2 focus:border-primary transition-all text-on-surface placeholder:text-outline-variant"
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 rounded-lg bg-gradient-to-b from-primary to-primary-container text-white font-bold tracking-tight text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group shadow-lg"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Send Reset Link
                                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 text-center border-t border-surface-container-low">
                            <Link href="/login" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back to Login
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-xs text-slate-500 font-label tracking-wide uppercase">
                            Security protocols by Warren Editorial Excellence
                        </p>
                    </div>
                </div>
            </main>

            <footer className="bg-slate-50 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 font-inter text-xs tracking-wide uppercase">
                        © 2024 Warren Intel. Editorial Financial Excellence.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="font-inter text-xs tracking-wide uppercase text-slate-500 hover:text-emerald-600 transition-opacity opacity-80 hover:opacity-100">Privacy Policy</Link>
                        <Link href="#" className="font-inter text-xs tracking-wide uppercase text-slate-500 hover:text-emerald-600 transition-opacity opacity-80 hover:opacity-100">Terms of Service</Link>
                        <Link href="#" className="font-inter text-xs tracking-wide uppercase text-slate-500 hover:text-emerald-600 transition-opacity opacity-80 hover:opacity-100">System Status</Link>
                    </div>
                </div>
            </footer>

            {/* Background Decoration */}
            <div className="fixed top-0 right-0 -z-10 w-1/3 h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-[#88d982] blur-[120px]"></div>
            </div>
            <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-full overflow-hidden pointer-events-none opacity-10">
                <div className="absolute bottom-1/4 -left-20 w-[300px] h-[300px] rounded-full bg-[#add0a6] blur-[100px]"></div>
            </div>
        </div>
    );
}

"use client";

import { useAuth } from "@/lib/firebase/AuthContext";
import { useState, useEffect } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SignupPage() {
    const { signUpWithEmail, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [agreed, setAgreed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            toast.error("Please agree to the Terms and Conditions");
            return;
        }
        setLoading(true);
        try {
            await signUpWithEmail(email, password);
            // Optionally save fullName to user profile or firestore
            toast.success("Account created successfully. Welcome to Warren Intel!");
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(err.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col selection:bg-[#a3f69c] selection:text-[#002204]">
            <main className="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden">
                {/* Tonal Layering Background Detail */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 bg-surface">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0d631b]/5 blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#c6e9be]/10 blur-[100px]"></div>
                </div>

                <div className="w-full max-w-md">
                    {/* Branding Anchor */}
                    <div className="text-center mb-10">
                        <span className="font-headline text-3xl font-extrabold tracking-tighter text-[#0d631b] block mb-2">Warren Intel</span>
                        <p className="font-body text-on-surface-variant text-sm tracking-wide">Enter the Digital Ledger of Financial Excellence.</p>
                    </div>

                    {/* Sign Up Form Card */}
                    <div className="bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-[0_12px_32px_-8px_rgba(25,28,29,0.06)] relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0d631b] to-[#2e7d32]"></div>
                        <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-8">Begin Your Journey</h1>

                        <form onSubmit={handleSignup} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="font-label text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" htmlFor="full_name">Full Name</label>
                                <input
                                    className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 text-on-surface transition-all placeholder:text-outline-variant"
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    placeholder="Alexander Hamilton"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Work Email */}
                            <div className="space-y-1">
                                <label className="font-label text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" htmlFor="work_email">Work Email</label>
                                <input
                                    className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 text-on-surface transition-all placeholder:text-outline-variant"
                                    id="work_email"
                                    name="work_email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="font-label text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" htmlFor="password">Password</label>
                                <input
                                    className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 text-on-surface transition-all placeholder:text-outline-variant"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start gap-3 pt-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-outline-variant text-[#0d631b] focus:ring-[#0d631b]/20 bg-surface-container-lowest"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                    />
                                </div>
                                <label className="text-xs text-on-surface-variant leading-relaxed" htmlFor="terms">
                                    I agree to the <Link href="#" className="text-[#0d631b] font-medium hover:underline transition-all">Terms and Conditions</Link> and the <Link href="#" className="text-[#0d631b] font-medium hover:underline transition-all">Privacy Policy</Link>.
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-b from-[#0d631b] to-[#2e7d32] text-white font-headline font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Create Account
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-8 text-center border-t border-outline-variant/10 pt-6">
                            <p className="text-sm text-on-surface-variant">
                                Already have an account?
                                <Link href="/login" className="text-[#0d631b] font-bold hover:underline ml-1">Log In</Link>
                            </p>
                        </div>
                    </div>

                    {/* Trust Indicator */}
                    <div className="mt-10 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="material-symbols-outlined text-2xl">verified_user</span>
                        <span className="material-symbols-outlined text-2xl">lock</span>
                        <span className="material-symbols-outlined text-2xl">security</span>
                    </div>
                </div>
            </main>

            <footer className="bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-4">
                <span className="font-inter text-xs tracking-wide uppercase text-slate-500">© 2024 Warren Intel. Editorial Financial Excellence.</span>
                <div className="flex gap-8">
                    <Link href="#" className="font-inter text-xs tracking-wide uppercase text-slate-500 hover:text-emerald-600 transition-opacity opacity-80 hover:opacity-100">Privacy Policy</Link>
                    <Link href="#" className="font-inter text-xs tracking-wide uppercase text-slate-500 hover:text-emerald-600 transition-opacity opacity-80 hover:opacity-100">Terms of Service</Link>
                    <Link href="#" className="font-inter text-xs tracking-wide uppercase text-slate-500 hover:text-emerald-600 transition-opacity opacity-80 hover:opacity-100">System Status</Link>
                </div>
            </footer>
        </div>
    );
}

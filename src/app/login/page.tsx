"use client";

import { useAuth } from "@/lib/firebase/AuthContext";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LoginPage() {
    const { signInWithGoogle, signInWithEmail, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmail(email, password);
            toast.success("Welcome back to Warren Intel");
        } catch (err: any) {
            toast.error(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            await signInWithGoogle();
            toast.success("Successfully signed in with Google");
        } catch (err: any) {
            toast.error(err.message || "Failed to sign in with Google");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
            <main className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-5xl flex flex-col md:flex-row bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_32px_-8px_rgba(25,28,29,0.06)]">
                    {/* Left Branding Side */}
                    <div className="hidden md:flex md:w-5/12 bg-gradient-to-b from-[#0d631b] to-[#2e7d32] p-12 flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-white text-3xl font-headline font-extrabold tracking-tighter mb-2">Warren Intel</div>
                            <div className="h-1 w-12 bg-[#a3f69c] rounded-full"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-white font-headline text-4xl font-bold leading-tight mb-6">Mastering the Art of Financial Intelligence.</h2>
                            <p className="text-[#a3f69c] text-sm font-medium tracking-wide uppercase opacity-90">Editorial Financial Excellence</p>
                        </div>
                        {/* Abstract Decorative Element */}
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                    </div>

                    {/* Login Form Side */}
                    <div className="w-full md:w-7/12 p-8 md:p-16 lg:p-20 bg-surface-container-lowest">
                        <div className="max-w-md mx-auto">
                            <div className="mb-10">
                                <h1 className="font-headline text-3xl font-bold text-on-surface mb-2 tracking-tight">Welcome back</h1>
                                <p className="text-on-surface-variant font-body text-sm">Access your private editorial terminal and portfolio insights.</p>
                            </div>

                            <form onSubmit={handleEmailSignIn} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="email">Email Address</label>
                                    <input
                                        className="w-full bg-surface-container-high border-none border-b-2 border-transparent py-4 px-4 rounded-t-lg transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-primary"
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@firm.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
                                        <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-container transition-colors">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            className="w-full bg-surface-container-high border-none border-b-2 border-transparent py-4 px-4 rounded-t-lg transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-primary"
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-b from-[#0d631b] to-[#2e7d32] text-white font-headline font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                                </button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-outline-variant/20"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                    <span className="bg-surface-container-lowest px-4 text-on-surface-variant">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleSignIn}
                                disabled={googleLoading}
                                className="w-full bg-white border border-outline-variant/30 text-on-surface font-headline font-bold py-4 rounded-lg shadow-sm hover:bg-surface-container-low transform transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {googleLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                Google
                            </button>

                            <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
                                <p className="text-on-surface-variant text-sm">
                                    Don't have an account?
                                    <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-8 flex justify-center space-x-6 text-on-surface-variant opacity-40">
                                <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">terminal</span>
                                <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">security</span>
                                <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">language</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-4">
                <div className="text-emerald-800 dark:text-emerald-400 font-inter text-xs tracking-wide uppercase">
                    © 2024 Warren Intel. Editorial Financial Excellence.
                </div>
                <div className="flex gap-8">
                    <Link href="#" className="font-inter text-xs tracking-wide uppercase text-slate-500 dark:text-slate-500 hover:text-emerald-600 transition-opacity opacity-80 hover:opacity-100">Privacy Policy</Link>
                    <Link href="#" className="font-inter text-xs tracking-wide uppercase text-slate-500 dark:text-slate-500 hover:text-emerald-600 transition-opacity opacity-80 hover:opacity-100">Terms of Service</Link>
                    <Link href="#" className="font-inter text-xs tracking-wide uppercase text-slate-500 dark:text-slate-500 hover:text-emerald-600 transition-opacity opacity-80 hover:opacity-100">System Status</Link>
                </div>
            </footer>
        </div>
    );
}

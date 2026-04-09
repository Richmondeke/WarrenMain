"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LandingNavbarProps {
    activePage: "founders" | "fund-managers" | "insights" | "pricing";
}

export function LandingNavbar({ activePage }: LandingNavbarProps) {
    const router = useRouter();

    return (
        <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md transition-colors duration-300 editorial-shadow border-b border-primary/10">
            <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
                <div
                    className="text-xl font-extrabold tracking-tighter text-primary font-headline cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    Warren Intel
                </div>

                <div className="hidden md:flex items-center space-x-8 font-headline font-bold tracking-tight">
                    <a
                        className={cn(
                            "transition-all duration-200 cursor-pointer pb-1",
                            activePage === "founders" ? "text-primary border-b-2 border-primary" : "text-on-surface/70 hover:text-primary"
                        )}
                        onClick={() => router.push("/")}
                    >
                        Founders
                    </a>
                    <a
                        className={cn(
                            "transition-all duration-200 cursor-pointer pb-1",
                            activePage === "fund-managers" ? "text-primary border-b-2 border-primary" : "text-on-surface/70 hover:text-primary"
                        )}
                        onClick={() => router.push("/fund-managers")}
                    >
                        Fund Managers
                    </a>
                    <a
                        className={cn(
                            "transition-all duration-200 cursor-pointer pb-1",
                            activePage === "insights" ? "text-primary border-b-2 border-primary" : "text-on-surface/70 hover:text-primary"
                        )}
                        onClick={() => router.push("/insights")}
                    >
                        Insights
                    </a>
                    <a
                        className={cn(
                            "transition-all duration-200 cursor-pointer pb-1",
                            activePage === "pricing" ? "text-primary border-b-2 border-primary" : "text-on-surface/70 hover:text-primary"
                        )}
                        onClick={() => router.push("/pricing")}
                    >
                        Pricing
                    </a>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.push("/login")}
                        className="text-on-surface/70 font-headline font-bold text-sm px-4 py-2 hover:bg-primary/5 rounded-lg transition-all"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => router.push("/signup")}
                        className="editorial-gradient text-white font-headline font-bold px-6 py-2.5 rounded-lg text-sm shadow-sm active:scale-95 transition-all hover:shadow-md"
                    >
                        Request Access
                    </button>
                </div>
            </div>
        </nav>
    );
}

"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";

const PLANS = [
    {
        name: "Standard",
        price: "Free",
        description: "Essential market data for every investor.",
        features: [
            "Real-time Stock Quotes",
            "African Market Spotlight",
            "Market News Feed",
            "Basic Watchlist",
        ],
        buttonText: "Current Plan",
        priceId: null,
    },
    {
        name: "Pro",
        price: "$19",
        period: "/mo",
        description: "Advanced AI-powered qualitative insights.",
        features: [
            "Everything in Standard",
            "AI SWOT Analysis",
            "Risk Factor Extraction",
            "Sentiment Analysis",
            "Priority API Access",
        ],
        buttonText: "Get Pro",
        priceId: "price_PRO_PLAN_ID", // Placeholder
        recommended: true,
    },
];

export function PricingTable() {
    const { user } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscription = async (priceId: string) => {
        if (!user) {
            // Redirect to login or show alert
            return;
        }

        try {
            setLoading(priceId);
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId,
                    userId: user.uid,
                    email: user.email,
                }),
            });

            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-12 px-4">
            {PLANS.map((plan) => (
                <div
                    key={plan.name}
                    className={`relative p-8 rounded-3xl border transition-all ${plan.recommended
                            ? "border-primary bg-primary/5 shadow-xl scale-105"
                            : "border-border bg-card shadow-sm hover:shadow-md"
                        }`}
                >
                    {plan.recommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-full">
                            RECOMMENDED
                        </div>
                    )}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold">{plan.price}</span>
                            {plan.period && (
                                <span className="text-muted-foreground">{plan.period}</span>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-4 text-sm">
                            {plan.description}
                        </p>
                    </div>

                    <div className="space-y-4 mb-8">
                        {plan.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-3 text-sm">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => plan.priceId && handleSubscription(plan.priceId)}
                        disabled={!plan.priceId || loading === plan.priceId}
                        className={`w-full py-4 rounded-xl font-bold transition-all ${plan.recommended
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading === plan.priceId ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                            plan.buttonText
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
}

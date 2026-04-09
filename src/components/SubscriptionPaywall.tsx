'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, Shield, Rocket, ArrowRight, Lock } from 'lucide-react';
import { PLANS, initializeTransaction } from '@/lib/payments';

interface SubscriptionPaywallProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
}

export const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({
    isOpen,
    onClose,
    userEmail = 'investor@warrenintel.com'
}) => {
    const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const plan = PLANS[selectedPlan];
            const checkoutUrl = await initializeTransaction({
                amount: plan.amount,
                customer_email: userEmail,
                reference: `sub_${Date.now()}_${selectedPlan.toLowerCase()}`,
                description: `Warrenintel ${plan.name} Subscription`
            });

            // Redirect to Korapay Checkout
            window.location.href = checkoutUrl;
        } catch (error) {
            console.error("Upgrade failed:", error);
            alert("Failed to initialize payment. Please check your console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                        onClick={onClose}
                    />

                    {/* Paywall Card */}
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
                    >
                        {/* Decorative Background Gradients */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]" />
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />

                        <div className="relative flex flex-col md:flex-row h-full">
                            {/* Left Side: Value Proposition */}
                            <div className="p-8 md:p-12 md:w-5/12 bg-white/5 border-b md:border-b-0 md:border-r border-white/5">
                                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                                    <Crown className="h-6 w-6" />
                                </div>
                                <h2 className="mb-4 text-3xl font-bold tracking-tight text-white leading-tight">
                                    Unlock the Full Potential of <span className="text-emerald-400">Warrenintel</span>
                                </h2>
                                <p className="mb-8 text-lg text-white/60 leading-relaxed">
                                    Stop hitting limits and start building your fundable network today.
                                </p>

                                <div className="space-y-4">
                                    {[
                                        { icon: Shield, text: "Unlimited Investor Search" },
                                        { icon: Zap, text: "Direct Contact Discovery" },
                                        { icon: Rocket, text: "CSV Metadata Exports" },
                                        { icon: Crown, text: "Priority Warm Intros" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                                                <item.icon className="h-3.5 w-3.5 text-emerald-400" />
                                            </div>
                                            <span className="text-sm font-medium text-white/80">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: Pricing & Selection */}
                            <div className="flex-1 p-8 md:p-12">
                                <div className="mb-10 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold text-white">Pro Plan Subscription</h3>
                                        <p className="text-sm text-white/40">Full access to all premium features</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-2 hover:bg-white/10 text-white/40 transition-colors"
                                        title="Close"
                                    >
                                        <Lock className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Simplified Plan Info - No "Filter Buttons" */}
                                <div className="mb-10 rounded-2xl bg-white/5 p-8 border border-white/5 text-center">
                                    <div className="mb-2 flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-bold text-white">₦5,000</span>
                                        <span className="text-white/40 text-lg">/mo</span>
                                    </div>
                                    <p className="text-white/60">Billed monthly. Cancel anytime.</p>

                                    <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                                        <Zap className="h-3 w-3" />
                                        <span>INSTANT ACTIVATION</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="space-y-4">
                                    <button
                                        onClick={handleUpgrade}
                                        disabled={isLoading}
                                        className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-lg font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        ) : (
                                            <>
                                                Upgrade to Pro Now
                                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] text-white/30 uppercase tracking-widest font-medium">
                                        Secure payment powered by Korapay
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-6">
                                    <div className="flex items-center gap-2 text-[10px] text-white/40">
                                        <Shield className="h-3 w-3" />
                                        <span>PCI-DSS COMPLIANT</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-white/40">
                                        <Lock className="h-3 w-3" />
                                        <span>256-BIT ENCRYPTION</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

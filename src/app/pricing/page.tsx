"use client";

import { PricingTable } from "@/components/PricingTable";
import { LandingNavbar } from "@/components/LandingNavbar";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-surface font-body">
            <LandingNavbar activePage="pricing" />

            <div className="max-w-7xl mx-auto px-4 py-24">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                        Pick your <span className="text-primary">Stance</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Unlock the full potential of AI-driven financial analysis with our Pro features.
                    </p>
                </div>

                <PricingTable />
            </div>
        </div>
    );
}

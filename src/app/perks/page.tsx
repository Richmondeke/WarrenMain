"use client";

import { PlaceholderView } from "@/components/layout/PlaceholderView";

import { Trophy } from "lucide-react";

export default function PerksPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <PlaceholderView
                title="Startup Perks"
                description="Unlock over $2M in discounts and credits for the world's best startup tools, exclusive to Warren members."
                icon={Trophy}
            />
        </main>
    );
}

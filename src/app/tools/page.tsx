"use client";

import { PlaceholderView } from "@/components/layout/PlaceholderView";

import { PlusCircle } from "lucide-react";

export default function ToolsPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <PlaceholderView
                title="Founder Tools"
                description="A curated suite of calculators, generators, and checklists designed to help you run your startup like a pro."
                icon={PlusCircle}
            />
        </main>
    );
}

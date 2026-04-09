"use client";

import { PlaceholderView } from "@/components/layout/PlaceholderView";

import { HelpCircle } from "lucide-react";

export default function HelpPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <PlaceholderView
                title="Help Center"
                description="Need assistance? Our support team and knowledge base are being prepared to help you 24/7."
                icon={HelpCircle}
            />
        </main>
    );
}

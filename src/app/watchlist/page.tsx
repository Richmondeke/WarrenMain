import { WatchlistClient } from "@/components/watchlist/WatchlistClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function WatchlistPage() {
    return (
        <main className="flex-1">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8 border-b border-border pb-6">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Your Watchlist</h1>
                    <p className="text-muted-foreground text-lg max-w-3xl">
                        Monitor your saved companies and get AI-powered insights on their SEC filings with one click.
                    </p>
                </div>

                <Suspense fallback={
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                }>
                    <WatchlistClient />
                </Suspense>
            </div>
        </main>
    );
}

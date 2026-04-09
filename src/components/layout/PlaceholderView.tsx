"use client";

import { FadeIn } from "@/components/ui/Animations";
import { LucideIcon, Construction } from "lucide-react";

interface PlaceholderViewProps {
    title: string;
    description: string;
    icon?: LucideIcon;
}

export function PlaceholderView({ title, description, icon: Icon = Construction }: PlaceholderViewProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-background">
            <FadeIn>
                <div className="space-y-6 max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                        <Icon className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tighter text-foreground">{title}</h1>
                        <p className="text-muted-foreground font-medium italic">"{description}"</p>
                    </div>
                    <div className="pt-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-[10px] font-black uppercase tracking-widest opacity-50">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            Under Development
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}

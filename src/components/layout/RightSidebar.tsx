"use client";

import { Bell, Bookmark, CheckCircle2, ChevronRight, Info, ExternalLink, MessageSquare, Plus } from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthContext";

export function RightSidebar() {
    const { user } = useAuth();

    return (
        <aside className="w-80 flex flex-col gap-6 py-8 pr-8 hidden xl:flex">
            {/* Announcements */}
            <div className="p-6 rounded-2xl border border-border bg-white shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Announcements</h3>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
                    </div>
                </div>
                <p className="text-sm font-bold mb-2">Get Intercom free for 1 year!</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">Use the code "WARREN" and enjoy. Conditions apply.</p>
                <a href="#" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    Claim it now! 💰
                </a>
            </div>

            {/* Your Pitch Deck */}
            <div className="p-6 rounded-2xl border border-border bg-white shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-4">Your Pitch Deck</h3>
                <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>Receive AI feedback to improve your deck</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>Get unlimited links to share with investors</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>100% private - your deck is never shared publicly</span>
                    </li>
                </ul>
                <button className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Plus className="w-3 h-3" />
                    Upload your first deck
                </button>
            </div>

            {/* Your Checklist */}
            <div className="p-6 rounded-2xl border border-border bg-white shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-4">Your Checklist</h3>
                <ul className="space-y-4">
                    <ChecklistItem label="Take the Fundability test" href="#" time="7 min" />
                    <ChecklistItem label="Craft your outreach email" href="#" time="4 min" />
                    <ChecklistItem label="Upload your pitch deck" href="#" time="2 min" />
                    <ChecklistItem label="Invite your team" href="#" time="1 min" />
                    <ChecklistItem label="Check out the tutorial" href="#" time="5 min" />
                </ul>
            </div>

            {/* Your Startup */}
            <div className="p-6 rounded-2xl border border-border bg-white shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-4">Your Startup</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-black mb-0.5">Syncmaster</p>
                        <a href="https://syncmaster.live" className="text-[10px] text-muted-foreground hover:underline">www.syncmaster.live</a>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold">media</span>
                        <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold">SaaS</span>
                        <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold">AI</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Raising $250k</p>
                        <p className="text-xs text-muted-foreground">HQ Country: USA</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function ChecklistItem({ label, href, time }: { label: string, href: string, time: string }) {
    return (
        <li className="flex items-center gap-3 group">
            <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-tight">
                    {label} <a href={href} className="text-primary hover:underline">Here</a>
                </p>
                <p className="text-[10px] text-muted-foreground">({time})</p>
            </div>
        </li>
    );
}

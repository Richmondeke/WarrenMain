"use client";

import { useState } from "react";

const SECTORS = ["Fintech", "Proptech", "Enterprise SaaS", "HealthTech"];
const STAGES = [
    { name: "Pre-Seed", checked: true, highlight: false },
    { name: "Seed", checked: true, highlight: true },
    { name: "Series A", checked: true, highlight: true },
    { name: "Series B+", checked: false, highlight: false },
];
const REGIONS = ["North America", "Western Europe", "Nordics"];

export function ThesisBuilderView() {
    const [thesis, setThesis] = useState("");

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#f8f9fa]">
            <div className="px-8 pt-6 pb-12 max-w-7xl mx-auto w-full">
                {/* Breadcrumbs */}
                <nav className="mb-6 flex gap-2 text-xs font-medium uppercase tracking-widest text-slate-400">
                    <span>Investment Management</span>
                    <span>/</span>
                    <span className="text-primary">Thesis Builder</span>
                </nav>

                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Left Column: Form */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <section>
                            <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight mb-2">Define Your Investment Thesis</h2>
                            <p className="text-gray-500 text-lg max-w-2xl">Refine your strategic lens to automate deal sourcing and align portfolio allocation with fund mandates.</p>
                        </section>

                        {/* Thesis Statement */}
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">description</span>
                                <h3 className="font-headline text-lg font-bold">Thesis Statement</h3>
                            </div>
                            <textarea
                                className="w-full bg-gray-100 border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary h-32 placeholder:text-slate-400 resize-none"
                                placeholder="e.g., We invest in early-stage SaaS companies leveraging AI to disrupt traditional logistics workflows in the EMEA region..."
                                value={thesis}
                                onChange={e => setThesis(e.target.value)}
                            />
                            <div className="mt-4 flex justify-between items-center text-xs text-gray-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                    Suggested by AI based on past wins
                                </span>
                                <span>{thesis.length} / 1000 characters</span>
                            </div>
                        </div>

                        {/* Sectors + Stages */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Target Sectors */}
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">category</span>
                                        <h3 className="font-headline text-lg font-bold">Target Sectors</h3>
                                    </div>
                                    <button className="text-primary text-sm font-semibold hover:underline">Manage</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {SECTORS.map(s => (
                                        <span key={s} className="bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                                            {s}
                                            <span className="material-symbols-outlined text-[14px] cursor-pointer">close</span>
                                        </span>
                                    ))}
                                    <button className="border border-dashed border-gray-300 text-gray-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-gray-50 transition-colors">
                                        <span className="material-symbols-outlined text-[14px]">add</span> Add Sector
                                    </button>
                                </div>
                            </div>

                            {/* Stage Preference */}
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary">layers</span>
                                    <h3 className="font-headline text-lg font-bold">Stage Preference</h3>
                                </div>
                                <div className="space-y-3">
                                    {STAGES.map(s => (
                                        <label key={s.name} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${s.highlight ? "border-primary bg-emerald-50/30" : "border-gray-200 hover:border-primary"}`}>
                                            <span className={`text-sm ${s.highlight ? "font-bold text-primary" : "font-medium"}`}>{s.name}</span>
                                            <input type="checkbox" defaultChecked={s.checked} className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Geography + Ticket Size */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Geographic Focus */}
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary">public</span>
                                    <h3 className="font-headline text-lg font-bold">Geographic Focus</h3>
                                </div>
                                <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4 bg-gray-200 grayscale flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-400 text-6xl">map</span>
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {REGIONS.map(r => (
                                        <span key={r} className="bg-gray-100 text-on-surface px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{r}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Ticket Size */}
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary">payments</span>
                                    <h3 className="font-headline text-lg font-bold">Ticket Size</h3>
                                </div>
                                <div className="pt-8 pb-4">
                                    <div className="relative h-2 bg-gray-200 rounded-full">
                                        <div className="absolute h-2 bg-primary rounded-full" style={{ left: "20%", right: "40%" }} />
                                        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md" style={{ left: "20%" }} />
                                        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md" style={{ right: "40%" }} />
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Minimum</p>
                                            <p className="text-xl font-headline font-bold">$500k</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Maximum</p>
                                            <p className="text-xl font-headline font-bold">$2.5M</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">info</span>
                                    <p className="text-xs text-gray-500 leading-relaxed">Typical allocation for Fund I seed-stage participation.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Score + Insights */}
                    <div className="col-span-12 lg:col-span-4 sticky top-24 space-y-6">
                        {/* Thesis Match Score */}
                        <div className="bg-primary rounded-2xl p-10 text-white shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-700/20 rounded-full blur-3xl -mr-20 -mt-20" />
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-80 mb-8">Thesis Match Score</h3>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-7xl font-headline font-extrabold tracking-tighter">84</span>
                                    <span className="text-2xl font-headline font-bold opacity-70">/100</span>
                                </div>
                                <p className="text-emerald-100 text-sm font-medium mb-10 leading-relaxed">
                                    Your current criteria captures approximately <span className="font-bold underline">1,240 deals</span> from the active global market.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-1.5">
                                            <span>Sector Density</span><span>High</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-300 w-[90%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-1.5">
                                            <span>Deal Velocity</span><span>Moderate</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-300 w-[65%]" />
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-10 bg-white text-primary py-3 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg shadow-black/10">
                                    Generate Deal Report
                                </button>
                            </div>
                        </div>

                        {/* Market Insights */}
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">trending_up</span> Market Insights
                            </h4>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-on-surface mb-1">Expanding Focus?</p>
                                        <p className="text-xs text-gray-500 leading-relaxed">Including &apos;Sustainability Tech&apos; would increase your deal flow by 18% in the Nordic region.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-primary flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">analytics</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-on-surface mb-1">Pricing Shift</p>
                                        <p className="text-xs text-gray-500 leading-relaxed">Series A valuations in Enterprise SaaS are down 12% YoY. Consider adjusting min ticket.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors">
                                Save as Draft
                            </button>
                            <button className="w-full bg-on-surface text-white py-3 rounded-lg font-bold text-sm hover:bg-gray-700 transition-colors">
                                Publish Thesis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

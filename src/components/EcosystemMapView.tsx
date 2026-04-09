"use client";

const COMPANIES = [
    { name: "Stripe", sub: "Payments", desc: "Global payment infrastructure for internet commerce.", val: "$95B", stage: "Series I", x: 15, y: 20, color: "bg-primary", ring: "ring-primary/20", size: "w-4 h-4", pulse: true },
    { name: "Revolut", sub: "Neo-Bank", desc: "Financial super-app for all things money.", val: "$33B", stage: "Series E", x: 60, y: 45, color: "bg-emerald-700", ring: "ring-emerald-700/10", size: "w-5 h-5", pulse: false },
    { name: "Klarna", sub: "BNPL", desc: "Smoothing the shopping experience.", val: "$6.7B", stage: "Downround", x: 30, y: 75, color: "bg-rose-600", ring: "ring-rose-600/20", size: "w-3 h-3", pulse: false, atRisk: true },
    { name: "Anthropic", sub: "Gen-AI", desc: "AI safety and research company.", val: "$18B", stage: "Series C", x: 80, y: 15, color: "gradient", ring: "ring-white", size: "w-6 h-6", pulse: false },
];

const SUBSECTORS = [
    { name: "Payments & Ledger", pct: 82 },
    { name: "AI Financial Assistants", pct: 64 },
    { name: "B2B Lending Tech", pct: 41 },
];

const MOVERS = [
    { name: "ZenithPay", desc: "Raised Series A led by Ledger Prime", badge: "+$12M", badgeColor: "text-primary", tag: "Trending", tagColor: "text-emerald-600 bg-emerald-50", time: "2h ago" },
    { name: "Orbit Wealth", desc: "Acquired by Goldman Sachs", badge: "Exit", badgeColor: "text-rose-600", tag: "M&A", tagColor: "text-rose-600 bg-red-50", time: "1d ago" },
    { name: "Quantify AI", desc: "Founders from Stripe/OpenAI", badge: "Stealth", badgeColor: "text-primary", tag: "Hot Lead", tagColor: "text-emerald-600 bg-emerald-50", time: "3d ago" },
];

const METRICS = [
    { label: "Total Companies", value: "1,248", delta: "+12% vs last month", up: true },
    { label: "Average Round", value: "$4.2M", delta: "+4.2% Growth", up: true },
    { label: "Capital Inflow", value: "$1.8B", delta: "-8% Series B slowdown", up: false },
    { label: "New Entries", value: "24", delta: "Focused in Seed stage", up: null },
];

export function EcosystemMapView() {
    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#f8f9fa]">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 px-8 pt-6">
                <div>
                    <nav className="flex gap-2 text-[10px] font-bold text-primary tracking-widest uppercase mb-2">
                        <span>Market Intelligence</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-500">Fintech Sector</span>
                    </nav>
                    <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Ecosystem Map</h2>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white editorial-shadow rounded-lg text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-lg hover:brightness-110 transition-all">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Track Sector
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl editorial-shadow mb-8 mx-8 flex flex-wrap items-center gap-6">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Sub-Sector</label>
                    <select className="bg-gray-50 border-none rounded-lg text-sm font-medium py-1.5 focus:ring-primary min-w-[160px]">
                        <option>All Sub-Sectors</option>
                        <option>Payments</option>
                        <option>Neo-Banking</option>
                        <option>InsurTech</option>
                        <option>Crypto/Web3</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Funding Stage</label>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold">Series A</button>
                        <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-slate-500 text-xs font-semibold hover:bg-slate-200">Series B</button>
                        <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-slate-500 text-xs font-semibold hover:bg-slate-200">Growth</button>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Recent Activity</label>
                    <select className="bg-gray-50 border-none rounded-lg text-sm font-medium py-1.5 focus:ring-primary">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>Last 12 Months</option>
                    </select>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><span className="w-3 h-3 rounded-full bg-primary" /> High Growth</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><span className="w-3 h-3 rounded-full bg-emerald-300" /> Steady</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><span className="w-3 h-3 rounded-full bg-rose-600" /> At Risk</div>
                </div>
            </div>

            {/* Main Grid: Heatmap + Side Panel */}
            <div className="grid grid-cols-12 gap-6 mx-8">
                {/* Heatmap Canvas */}
                <div className="col-span-12 lg:col-span-8 relative bg-gray-100 rounded-2xl h-[600px] overflow-hidden">
                    {/* Dot Grid */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#0d631b 0.5px, transparent 0.5px)", backgroundSize: "40px 40px" }} />
                    {/* Axis Labels */}
                    <div className="absolute left-6 top-1/2 -rotate-90 origin-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Market Saturation →</div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Technological Maturity →</div>

                    {/* Company Dots */}
                    {COMPANIES.map(c => (
                        <div key={c.name} className="absolute group/dot cursor-pointer" style={{ top: `${c.y}%`, left: `${c.x}%` }}>
                            {c.color === "gradient" ? (
                                <div className={`${c.size} rounded-full bg-gradient-to-br from-primary to-emerald-400 ring-4 ${c.ring} flex items-center justify-center shadow-lg`}>
                                    <span className="material-symbols-outlined text-white text-[12px]">bolt</span>
                                </div>
                            ) : (
                                <div className={`${c.size} ${c.color} rounded-full ring-4 ${c.ring} ${c.pulse ? "animate-pulse" : ""}`} />
                            )}
                            {/* Hover tooltip */}
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover/dot:opacity-100 transition-opacity bg-white p-3 rounded-xl editorial-shadow z-10 border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-on-surface">{c.name}</span>
                                    <span className={`text-[9px] ${c.atRisk ? "bg-red-50 text-rose-600" : "bg-emerald-50 text-primary"} px-1.5 py-0.5 rounded`}>{c.sub}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{c.desc}</p>
                                <div className="flex justify-between text-[10px]">
                                    <span className="font-semibold">{c.val} Val.</span>
                                    <span className={`${c.atRisk ? "text-rose-600" : "text-primary"} font-bold`}>{c.stage}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Density Legend */}
                    <div className="absolute bottom-6 right-6 backdrop-blur-xl bg-white/40 p-4 rounded-xl border border-white/50 shadow-sm flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-slate-600 uppercase mb-1">Density Legend</span>
                        <div className="h-2 w-32 bg-gradient-to-r from-emerald-100 via-primary to-emerald-900 rounded-full" />
                        <div className="flex justify-between text-[8px] text-slate-500 font-bold">
                            <span>EMERGING</span>
                            <span>SATURATED</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    {/* Sub-Sector Heat */}
                    <div className="bg-white p-6 rounded-2xl editorial-shadow">
                        <h3 className="font-headline font-bold text-lg mb-4">Sub-Sector Heat</h3>
                        <div className="space-y-4">
                            {SUBSECTORS.map(s => (
                                <div key={s.name}>
                                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                                        <span>{s.name}</span>
                                        <span className="text-primary">{s.pct}% Activity</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${s.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market Velocity */}
                    <div className="bg-white p-6 rounded-2xl editorial-shadow flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline font-bold text-lg">Market Velocity</h3>
                            <span className="text-[10px] font-bold text-primary bg-emerald-50 px-2 py-0.5 rounded">NEW DATA</span>
                        </div>
                        <div className="space-y-6 overflow-y-auto pr-2 flex-1">
                            {MOVERS.map(m => (
                                <div key={m.name} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                        <span className="material-symbols-outlined text-slate-400 text-lg">business</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-bold">{m.name}</h4>
                                            <span className={`text-xs font-bold ${m.badgeColor}`}>{m.badge}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mb-1">{m.desc}</p>
                                        <div className="flex gap-2">
                                            <span className="text-[9px] font-bold text-slate-400">{m.time}</span>
                                            <span className={`text-[9px] font-bold ${m.tagColor} px-1.5 rounded`}>{m.tag}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 border border-slate-100 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                            View Full Activity Feed
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-8 mt-8 pb-8">
                {METRICS.map(m => (
                    <div key={m.label} className="bg-white p-5 rounded-2xl editorial-shadow">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</span>
                        <div className="text-2xl font-bold font-headline mt-1">{m.value}</div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold mt-2 ${m.up === true ? "text-primary" : m.up === false ? "text-rose-600" : "text-slate-400"}`}>
                            {m.up !== null && <span className="material-symbols-outlined text-[12px]">{m.up ? "trending_up" : "trending_down"}</span>}
                            {m.delta}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

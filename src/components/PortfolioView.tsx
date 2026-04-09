"use client";

const SECTORS = [
    { name: "FINTECH", pct: 42, color: "bg-primary" },
    { name: "CLIMATETECH", pct: 28, color: "bg-emerald-700" },
    { name: "HEALTHCARE", pct: 18, color: "bg-emerald-500" },
    { name: "SAAS", pct: 12, color: "bg-gray-400" },
];

const HOLDINGS = [
    { initial: "N", name: "Nebula AI", stage: "Series B • Enterprise", investment: "$45.0M", growth: "+145%", growthUp: true, burn: "$1.2M/mo", nextRound: "READY", nextRoundStyle: "bg-emerald-100 text-emerald-800", score: 94, scoreColor: "text-emerald-900", barColor: "bg-primary" },
    { initial: "S", name: "Solstice Labs", stage: "Series A • Clean Energy", investment: "$12.5M", growth: "22%", growthUp: false, burn: "$450K/mo", nextRound: "Q3 2024", nextRoundStyle: "bg-rose-100 text-rose-700", score: 68, scoreColor: "text-rose-600", barColor: "bg-rose-500" },
    { initial: "V", name: "Velo Health", stage: "Seed • MedTech", investment: "$3.2M", growth: "+280%", growthUp: true, burn: "$85K/mo", nextRound: "ACTIVE", nextRoundStyle: "bg-emerald-50 text-emerald-700", score: 82, scoreColor: "text-emerald-900", barColor: "bg-emerald-600" },
];

const BARS = [30, 45, 40, 55, 60, 75, 80, 95, 85, 90, 100, 110];

export function PortfolioView() {
    return (
        <div className="flex-1 min-h-screen bg-surface font-manrope">
            {/* Top Nav */}
            <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md flex justify-between items-center px-8 py-4 w-full border-b border-gray-100 editorial-shadow">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-extrabold tracking-tighter text-emerald-900 font-headline">Emerald Ledger</h1>
                    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-96">
                        <span className="material-symbols-outlined text-gray-400 mr-2">search</span>
                        <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400 outline-none" placeholder="Search portfolio companies..." type="text" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><span className="material-symbols-outlined">settings</span></button>
                    <div className="h-8 w-px bg-gray-200 mx-2" />
                    <button className="editorial-gradient text-white px-5 py-2 rounded-lg text-sm font-bold active:scale-95 duration-200">New Deal</button>
                </div>
            </header>

            <div className="p-10 space-y-10 max-w-[1600px] mx-auto">
                {/* Hero */}
                <header className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight font-headline text-on-surface">Portfolio Performance</h2>
                        <p className="text-gray-500 mt-1">Aggregated analytics for the 2024 active fund cycle.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface shadow-sm border border-gray-200">Compare Fund Y</button>
                        <button className="bg-white px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface shadow-sm border border-gray-200">Export PDF</button>
                    </div>
                </header>

                {/* Bento Metrics */}
                <section className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-6">
                        {/* Total Portfolio Value */}
                        <div className="col-span-1 bg-white p-8 rounded-xl editorial-shadow flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Total Portfolio Value</span>
                                <div className="text-4xl font-extrabold tracking-tighter font-headline text-primary">$1.42B</div>
                            </div>
                            <div className="mt-4 flex items-center text-primary font-bold text-sm">
                                <span className="material-symbols-outlined text-lg mr-1">trending_up</span>
                                +12.4% <span className="text-gray-500 font-normal ml-2">vs prev. qtr</span>
                            </div>
                        </div>
                        {/* Weighted IRR */}
                        <div className="col-span-1 bg-white p-8 rounded-xl editorial-shadow flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Weighted IRR</span>
                                <div className="text-4xl font-extrabold tracking-tighter font-headline text-on-surface">28.4%</div>
                            </div>
                            <div className="mt-4 flex items-center text-primary font-bold text-sm">
                                <span className="material-symbols-outlined text-lg mr-1">check_circle</span>
                                Above Benchmark
                            </div>
                        </div>
                        {/* Capital Deployed */}
                        <div className="col-span-1 bg-white p-8 rounded-xl editorial-shadow flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Capital Deployed</span>
                                <div className="text-4xl font-extrabold tracking-tighter font-headline text-on-surface">$840M</div>
                            </div>
                            <div className="mt-4 flex items-center text-gray-500 text-sm">
                                <span className="font-bold text-on-surface">84%</span> <span className="ml-2">of total committed</span>
                            </div>
                        </div>
                    </div>

                    {/* Sector Diversification */}
                    <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-xl editorial-shadow">
                        <h3 className="text-lg font-extrabold font-headline mb-6">Sector Diversification</h3>
                        <div className="space-y-4">
                            {SECTORS.map(s => (
                                <div key={s.name}>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span>{s.name}</span>
                                        <span>{s.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Active Holdings Table */}
                <section className="bg-white rounded-xl editorial-shadow overflow-hidden">
                    <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
                        <h3 className="text-xl font-extrabold font-headline">Active Holdings</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center text-xs font-bold text-gray-500 gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> Healthy</div>
                            <div className="flex items-center text-xs font-bold text-gray-500 gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> Review Needed</div>
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-100">
                                <th className="px-8 py-4">Company</th>
                                <th className="px-8 py-4">Investment</th>
                                <th className="px-8 py-4">Rev. Growth</th>
                                <th className="px-8 py-4">Burn Rate</th>
                                <th className="px-8 py-4">Next Round</th>
                                <th className="px-8 py-4 text-right">Health Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {HOLDINGS.map((h, i) => (
                                <tr key={h.name} className={`hover:bg-gray-50 transition-colors group ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold ${h.score < 70 ? 'text-rose-600' : 'text-primary'}`}>{h.initial}</div>
                                            <div>
                                                <div className="font-bold text-on-surface">{h.name}</div>
                                                <div className="text-xs text-gray-500">{h.stage}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-semibold">{h.investment}</td>
                                    <td className={`px-8 py-6 font-bold ${h.growthUp ? 'text-primary' : 'text-on-surface'}`}>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">{h.growthUp ? 'trending_up' : 'trending_flat'}</span> {h.growth}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">{h.burn}</td>
                                    <td className="px-8 py-6"><span className={`${h.nextRoundStyle} px-3 py-1 rounded-full text-[11px] font-bold`}>{h.nextRound}</span></td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`font-bold ${h.scoreColor}`}>{h.score}/100</span>
                                            <div className="w-2 h-8 bg-gray-100 rounded-full overflow-hidden relative">
                                                <div className={`${h.barColor} absolute bottom-0 w-full rounded-full`} style={{ height: `${h.score}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-6 bg-gray-50 flex justify-center">
                        <button className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                            View All 42 Companies <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </section>

                {/* Bottom Section */}
                <div className="grid grid-cols-12 gap-6 pb-12">
                    {/* Fund Growth Trajectory */}
                    <div className="col-span-12 lg:col-span-7 bg-white p-8 rounded-xl editorial-shadow relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-extrabold font-headline mb-2">Fund Growth Trajectory</h3>
                            <p className="text-sm text-gray-500 mb-8">Performance compared to benchmark venture indices.</p>
                            <div className="h-48 w-full flex items-end gap-1">
                                {BARS.map((h, i) => (
                                    <div key={i} className={`flex-1 rounded-t-sm hover:opacity-80 transition-all`} style={{ height: `${h}%`, backgroundColor: `rgba(13, 99, 27, ${0.1 + (i * 0.07)})` }} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Market Intelligence */}
                    <div className="col-span-12 lg:col-span-5 bg-emerald-700 p-8 rounded-xl text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                <span className="text-xs font-bold uppercase tracking-widest">Market Intelligence</span>
                            </div>
                            <h3 className="text-2xl font-bold font-headline leading-tight">Your portfolio is 2.4x more resilient to interest rate pivots than the sector median.</h3>
                        </div>
                        <div className="relative z-10 mt-8">
                            <p className="text-sm text-emerald-100 opacity-90 mb-6">Recommendation: Consider doubling down on Series B ClimateTech bridge rounds for Q4.</p>
                            <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">Apply Strategy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

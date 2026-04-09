"use client";

const FEED_ITEMS = [
    { icon: "rocket_launch", time: "2 MINUTES AGO", text: <>Founders of <span className="underline">Stripe</span> launched &apos;Aether&apos; stealth mode.</>, sub: "Matching Thesis: Infrastructure, Fintech." },
    { icon: "attach_money", time: "14 MINUTES AGO", text: <>Nexus Ventures closed $40M Lead in &apos;Veridian&apos;.</>, sub: "Competitor Alert: Veridian operates in your Portfolio's core space." },
    { icon: "sensors", time: "1 HOUR AGO", text: <>Social Sentiment spike: #SolidStateBattery</>, sub: "Trending in ClimateTech. 4 new startups detected." },
    { icon: "hub", time: "3 HOURS AGO", text: <>IP filing detected for &apos;Quantum Encryption&apos;</>, sub: "Applicant: Stealth Startup based in Zurich." },
];

const HEATMAP = [
    { label: "Fintech", h: 65 },
    { label: "SaaS", h: 45 },
    { label: "DeepTech", h: 85 },
    { label: "BioTech", h: 100 },
    { label: "Web3", h: 55 },
    { label: "Climate", h: 75 },
];

const CARDS = [
    { name: "BioLoom AI", sector: "Synthetic Biology • Series A", match: 98, raising: "$12.5M", desc: "Pioneering generative protein design for sustainable textile manufacturing. Fits 'Decarbonization' pillar.", badge: "New", badgeStyle: "bg-emerald-50 text-primary", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCPi9ikIn3yVUgUD5PlMJ3vpjgs27DYi7EITtvh8oRv2BgwJ183uT74ifvaFgTNFxbMyDAnCQWe_TYmNZ8-znz76Xf4B_BKEQzBS9YPxReIndTbaX7ZKDqeb0m5J11WLZhmdjvC31E_FtBuiv13IvtjZR3fF-0A6T0BDINMTA6HJN4cGZnTlngG7B0KWLeEBcYnENv5WdHsPO6wvHGMwyqKERdV10jA8NjL7oWP0FhErFEMM0KPRZxt99FsEsl4iuzdfttPzvQwFB1" },
    { name: "Kinetic Scale", sector: "Autonomous Logistics • Seed", match: 94, raising: "$4.2M", desc: "Last-mile delivery robotics using proprietary spatial-AI for high-density urban environments.", badge: "Active Deal", badgeStyle: "bg-gray-100 text-gray-600", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS7wfpkgAanWVj_3jWnawQg_VptF_q9mZqpx2MEmvnTC_EIn0Dlgb2JOquFbU9Ytaizi1K-HG7KeKM4VazqZIefixsdU75YYZK_tnqNES9znAPhCQrX5KCG2nlc94Si_dD1t3pE3QSvBp7ozEjtOxIRHP3muJQQ9oocdTMhhRg5qKHqMqt7G-NTsGsw7ayoLQmvfwVyPNVUVc4OkrDSQ0qZatO66cg5-_q4FrqWmaVw-5JKUE5AXH67ius1q1ek8WR3SOeBDJ8yS8Q" },
];

export function DealSourcingView() {
    return (
        <div className="flex-1 min-h-screen bg-surface font-manrope">
            {/* Top Nav */}
            <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md flex justify-between items-center px-8 py-3 w-full editorial-shadow font-headline antialiased tracking-tight">
                <div className="flex items-center gap-8">
                    <span className="text-xl font-extrabold tracking-tighter text-emerald-900">Emerald Ledger</span>
                    <nav className="hidden md:flex gap-6">
                        <a className="text-primary font-bold border-b-2 border-primary py-1" href="#">Sourcing</a>
                        <a className="text-gray-500 font-medium hover:bg-gray-100 px-2 py-1 rounded transition-colors" href="#">Market Map</a>
                        <a className="text-gray-500 font-medium hover:bg-gray-100 px-2 py-1 rounded transition-colors" href="#">Thesis Builder</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
                        <input className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Search startups, sectors, or LPs..." type="text" />
                    </div>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><span className="material-symbols-outlined">settings</span></button>
                    <div className="h-8 w-px bg-gray-200 mx-2" />
                    <button className="flex items-center gap-2 editorial-gradient text-white px-4 py-2 rounded-lg font-bold active:scale-95 duration-200">New Deal</button>
                </div>
            </header>

            <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
                {/* Hero */}
                <section className="grid grid-cols-12 gap-6 items-end">
                    <div className="col-span-12 lg:col-span-8">
                        <h2 className="text-[3.5rem] font-headline font-extrabold text-on-surface tracking-tighter leading-none mb-2">
                            Thesis Pulse <span className="text-primary">.84</span>
                        </h2>
                        <p className="text-lg text-gray-500">Your investment thesis is currently 12% more aligned with market trends than last quarter.</p>
                    </div>
                    <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl editorial-shadow">
                            <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Matching Opportunities</p>
                            <p className="text-3xl font-headline font-bold text-on-surface">1,242</p>
                            <div className="mt-2 flex items-center gap-1 text-primary text-xs font-bold"><span className="material-symbols-outlined text-sm">trending_up</span>+14%</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl editorial-shadow">
                            <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Sourcing Efficiency</p>
                            <p className="text-3xl font-headline font-bold text-on-surface">92<span className="text-lg font-medium text-gray-300">%</span></p>
                            <div className="mt-2 flex items-center gap-1 text-primary text-xs font-bold"><span className="material-symbols-outlined text-sm">bolt</span>Top Tier</div>
                        </div>
                    </div>
                </section>

                {/* Main Bento */}
                <section className="grid grid-cols-12 gap-6">
                    {/* Left: Recommended + Heatmap */}
                    <div className="col-span-12 xl:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-headline font-bold tracking-tight">Recommended for Your Thesis</h3>
                            <button className="text-primary text-sm font-semibold hover:underline">View All Matches</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {CARDS.map(c => (
                                <div key={c.name} className="group bg-white rounded-3xl overflow-hidden editorial-shadow hover:scale-[1.01] transition-all duration-300 cursor-pointer">
                                    <div className="relative h-48">
                                        <img alt={c.name} className="w-full h-full object-cover" src={c.img} />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>{c.match}% Match
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-lg font-headline font-bold text-on-surface">{c.name}</h4>
                                                <p className="text-sm text-gray-400">{c.sector}</p>
                                            </div>
                                            <span className={`px-2 py-1 ${c.badgeStyle} text-[10px] font-bold rounded uppercase`}>{c.badge}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-6">{c.desc}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-sm font-bold text-on-surface">{c.raising} <span className="text-gray-400 font-normal">Raising</span></span>
                                            <button className="text-primary material-symbols-outlined hover:bg-primary/5 p-2 rounded-full transition-colors">add_circle</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sector Heatmap */}
                        <div className="bg-white rounded-3xl p-8 editorial-shadow">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-headline font-bold tracking-tight">Sector Heatmap</h3>
                                    <p className="text-sm text-gray-400">Correlation between thesis weight and market volume</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">Monthly</span>
                                    <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-medium">Quarterly</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between gap-4 h-48">
                                {HEATMAP.map((bar, i) => (
                                    <div key={bar.label} className="w-full rounded-t-lg relative group transition-all hover:opacity-80" style={{ height: `${bar.h}%`, backgroundColor: `rgba(13, 99, 27, ${0.1 + (bar.h / 100) * 0.9})` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-2 py-1 rounded">{bar.h}%</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {HEATMAP.map(b => <span key={b.label}>{b.label}</span>)}
                            </div>
                        </div>
                    </div>

                    {/* Right: Feed + AI Insights */}
                    <div className="col-span-12 xl:col-span-4 flex flex-col space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-headline font-bold tracking-tight">New on Warren Intel</h3>
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-3xl p-1 flex flex-col">
                            <div className="bg-white rounded-[1.25rem] flex-1 p-6 editorial-shadow overflow-hidden">
                                <div className="space-y-6">
                                    {FEED_ITEMS.map((item, i) => (
                                        <div key={i} className="flex gap-4 group cursor-pointer">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-400 font-medium">{item.time}</p>
                                                <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{item.text}</p>
                                                <p className="text-xs text-gray-500">{item.sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-12 py-3 bg-gray-100 text-on-surface text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">Open Warren Terminal</button>
                            </div>
                        </div>

                        {/* AI Thesis Insights */}
                        <div className="editorial-gradient p-6 rounded-3xl text-white editorial-shadow relative overflow-hidden group">
                            <div className="relative z-10">
                                <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                <h4 className="text-lg font-headline font-bold mb-2">Thesis Optimization</h4>
                                <p className="text-sm opacity-90 mb-4">AI suggests expanding &apos;SaaS&apos; criteria to include &apos;Vertical AI&apos; for 15% better deal flow.</p>
                                <button className="text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Review Suggestion <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[120px]">hub</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

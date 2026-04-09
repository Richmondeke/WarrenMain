"use client";

const TRANSACTIONS = [
    { ref: "CALL_2023_Q4", date: "Oct 14, 2023", type: "Capital Call", typeStyle: "bg-primary/10 text-primary", amount: "($12,450,000.00)" },
    { ref: "DIST_EXIT_APOLLO", date: "Sep 02, 2023", type: "Distribution", typeStyle: "bg-rose-100 text-rose-600", amount: "$8,120,400.00" },
    { ref: "CALL_2023_Q3", date: "Jul 10, 2023", type: "Capital Call", typeStyle: "bg-primary/10 text-primary", amount: "($5,200,000.00)" },
    { ref: "DIST_DIVIDEND_H1", date: "Jun 15, 2023", type: "Distribution", typeStyle: "bg-rose-100 text-rose-600", amount: "$1,450,000.00" },
];

const DOCS = [
    { name: "2023 Annual Audit Report.pdf", date: "March 12, 2024 • 4.2 MB", icon: "picture_as_pdf", iconBg: "bg-red-100 text-red-500" },
    { name: "Q4 2023 Quarterly Letter.pdf", date: "Jan 15, 2024 • 1.8 MB", icon: "description", iconBg: "bg-emerald-50 text-primary" },
    { name: "K-1 Tax Statements 2023.zip", date: "Feb 28, 2024 • 12.5 MB", icon: "table_view", iconBg: "bg-green-100 text-green-600" },
    { name: "Portfolio Review Slides - Mar 24.pdf", date: "Mar 05, 2024 • 8.1 MB", icon: "description", iconBg: "bg-emerald-50 text-primary" },
];

const DEADLINES = [
    { month: "APR", day: "15", title: "Capital Call Payment Due", sub: "Reference ID: CALL_2024_Q1" },
    { month: "MAY", day: "01", title: "Annual LP Meeting", sub: "RSVP required by April 20th" },
];

export function LPPortalView() {
    return (
        <div className="flex-1 min-h-screen bg-surface font-manrope">
            {/* Top Nav */}
            <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md flex justify-between items-center px-8 py-3 w-full editorial-shadow border-b border-transparent">
                <div className="flex items-center gap-8">
                    <h2 className="text-xl font-extrabold tracking-tighter text-emerald-900 font-headline">Emerald Ledger</h2>
                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-primary font-bold border-b-2 border-primary cursor-pointer pb-1">Overview</span>
                        <span className="text-gray-500 font-medium hover:text-primary cursor-pointer pb-1 transition-colors">Investors</span>
                        <span className="text-gray-500 font-medium hover:text-primary cursor-pointer pb-1 transition-colors">Documents</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                        <input className="bg-gray-100 border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 w-64 outline-none" placeholder="Search LP documents..." type="text" />
                    </div>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><span className="material-symbols-outlined">settings</span></button>
                </div>
            </header>

            <div className="p-8 max-w-[1400px] mx-auto space-y-10">
                {/* Hero */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                    <div className="lg:col-span-7">
                        <h1 className="text-[3.5rem] leading-none font-extrabold tracking-tight text-on-surface mb-4 font-headline">Limited Partner Portal</h1>
                        <p className="text-lg text-gray-500 max-w-xl font-medium">Manage investor relations, secure document distribution, and track fund deployment lifecycle for <span className="text-primary font-bold">Emerald Growth Fund II</span>.</p>
                    </div>
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-xl editorial-shadow">
                            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Commitments</div>
                            <div className="text-2xl font-bold text-on-surface">$428.5M</div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-primary mt-2">
                                <span className="material-symbols-outlined text-xs">trending_up</span>+12% YoY
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl editorial-shadow">
                            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">DPI Ratio</div>
                            <div className="text-2xl font-bold text-on-surface">1.42x</div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-primary mt-2">
                                <span className="material-symbols-outlined text-xs">verified</span>Top Quartile
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold font-headline">Capital Call & Distribution</h3>
                            <button className="text-sm font-bold text-primary hover:underline">Download Full Ledger</button>
                        </div>
                        <div className="bg-white rounded-2xl overflow-hidden editorial-shadow">
                            <div className="grid grid-cols-4 px-6 py-4 bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Reference</span><span>Date</span><span>Type</span><span className="text-right">Amount</span>
                            </div>
                            <div>
                                {TRANSACTIONS.map((t, i) => (
                                    <div key={t.ref} className={`grid grid-cols-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors cursor-pointer group ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                                        <div className="font-bold text-on-surface group-hover:text-primary transition-colors">{t.ref}</div>
                                        <div className="text-sm text-gray-500 font-medium">{t.date}</div>
                                        <div><span className={`px-3 py-1 ${t.typeStyle} text-[10px] font-bold rounded-full uppercase tracking-tight`}>{t.type}</span></div>
                                        <div className="text-right font-bold text-on-surface">{t.amount}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-center">
                                <button className="text-xs font-bold text-gray-400 hover:text-primary transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">expand_more</span>View Older Transactions
                                </button>
                            </div>
                        </div>

                        {/* Reporting Library */}
                        <div className="pt-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold font-headline">Reporting Library</h3>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
                                    <button className="p-2 text-gray-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">grid_view</span></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {DOCS.map(d => (
                                    <div key={d.name} className="bg-white p-5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:shadow-lg transition-all border border-transparent hover:border-primary/10">
                                        <div className={`w-12 h-12 ${d.iconBg} rounded-xl flex items-center justify-center`}><span className="material-symbols-outlined">{d.icon}</span></div>
                                        <div className="flex-grow">
                                            <div className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{d.name}</div>
                                            <div className="text-xs text-gray-400 font-medium">{d.date}</div>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary">download</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Secure Vault */}
                        <div className="bg-gray-900 text-white p-8 rounded-[2rem] relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <span className="material-symbols-outlined text-emerald-400 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>encrypted</span>
                                <h4 className="text-2xl font-bold font-headline mb-2 leading-tight">Secure Vault Encryption</h4>
                                <p className="text-gray-400 text-sm mb-6 font-medium leading-relaxed">All documents are stored with AES-256 military-grade encryption. Access logs are monitored 24/7.</p>
                                <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-3 px-6 rounded-full backdrop-blur-md transition-all flex items-center gap-2">
                                    Review Privacy Audit <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 blur-[40px] rounded-full" />
                        </div>

                        {/* Key Deadlines */}
                        <div className="bg-gray-100 p-8 rounded-[2rem]">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Key Deadlines</h4>
                            <div className="space-y-6">
                                {DEADLINES.map(d => (
                                    <div key={d.day} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{d.month}</span>
                                            <span className="text-lg font-extrabold text-primary leading-none">{d.day}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-on-surface text-sm">{d.title}</div>
                                            <div className="text-xs text-gray-500">{d.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* GP Insight */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">GP Insight</h4>
                            <div className="relative mb-6">
                                <img alt="Office" className="w-full h-40 object-cover rounded-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZmsVq-Q1wADuCEqKlPFMYGyTjkklnFq3QLoQgwfBL_e9N3J-oScIYbuIsy6xAqmuukR5qNcLBVk6Z3rTcWX-W66KFenZc2OGx_v9dZhWKx2ZNmc_i_sDK2G69o3CRb8_XRHbNV7STz4iVw1-MeJE4XxQZbdIndepjy3ddQFeHP8di5wvNCZ5s9V9QCad9SivsvCmULr50NCRoUFVnliYvjwOUSVW4Ofe7pHxPO_kTK1P2pko7Wb4Ec87jmBL2w9LBKV_LFoRU-CJo" />
                                <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-xl">
                                    <div className="text-[10px] font-bold text-primary uppercase">Current Focus</div>
                                    <div className="text-sm font-bold text-on-surface">Sustainable Infrastructure</div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium mb-4 italic">&quot;We are seeing unprecedented deal flow in the ESG sector, particularly within grid-scale storage solutions...&quot;</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">ED</div>
                                <div>
                                    <div className="text-xs font-bold text-on-surface">Elias Thorne</div>
                                    <div className="text-[10px] text-gray-400">Managing Partner</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

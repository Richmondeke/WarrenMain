"use client";

const PORTFOLIO_COMPANIES = [
    {
        name: "AgroStar",
        desc: "India's leading agri-tech platform providing end-to-end solutions for farmers through data and technology.",
        date: "DEC 2021 • SERIES C",
        tags: ["Supply Chain", "Retail"],
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeMdGInRkmkL5H0Z6HqdTci3U5u2-ft3R2j7ZDUVvAxOb73swnMerRxk3mytI4IYNnsyBXtdGk0NcJVeD0vBuBCjuyyDhyaQayuUXmG3DJs_8T7pYTwMxIsDg2j_0gXK9ggo5O9fBc2qWEAPJQ8f0XxMGuR7uDip--w2tG96ZIMY7Ox_JQ0PIz32NRTAqxix-cDPQeCVSUUrTwbc9JelRJeT7UZlCFCEtmrwA9R7IYR98WB1irKdhodRWO1Spg8MMxQkiSlbtYxIvM",
    },
    {
        name: "Altum Credo",
        desc: "Providing affordable housing finance to the economically weaker sections and low-income groups.",
        date: "AUG 2022 • SERIES B",
        tags: ["Fintech", "Housing"],
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBohBvSCafNjcy82TRxtGrZjDg4RatLB-2Nn6wgWb-TtLshmoJHqfuxmXz83ns3Pck9FHBh6vmLja7QY9M3a4t-VI4Wh4DWtGyDFNWg-fU5Gy5d7Nd_OTXPGN5Aba0MnluWaNJiKjt2mS8QVYyZ_BtKBuiSsQAEO99LJKmqsU0AJzVipWbXJfCjjsM2uuZ53R_ELeDLDNDAFzNML9DEC4sDTi70yXLXWSqWA4ST88uNt3Gk1W9eunNZGLDusT2-15oO0ILieUgIE93V",
    },
    {
        name: "GoBOLT",
        desc: "Tech-enabled logistics provider specializing in line-haul express trucking for e-commerce giants.",
        date: "MAR 2023 • SERIES B+",
        tags: ["Logistics", "SaaS"],
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXDijuwAngF6Qic5t4lW-AhB2QgWYyDoy1CB8eQU2a1EkuEG9Vhoikls5cGLaExdnQRD3fctrbPDWlEBZ-Nt0vQhTdX1RB2fZQrirJ3PucNXuXgwxaGo5QdaRux4ImaJ_QQFYxNG0TTpJNzsfU4-vtsQh77cTMAHf3vWLR47Vdg1J0DYQx0s_W9NzpZo9cEOhNq9s0LoB3m9uUssDa_8_P9ekWhFrm2ZRS0CC_7H9xnkr42SyNi32Z6wSB4VxRgVs-GutN9ZpmzDU1",
    },
];

const TEAM = [
    {
        name: "Vineet Rai", role: "Founder & Chairman",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFZcTpPc7896vzzTVcXkimq-fCRDS8DRrO3PPRhAxT_7Qzcmgnz1Gu6CTEvw_CU62e2y0nM0JFp8G-Wn2EZzGKD0IpXWyhNDyDeMomfExdxIaMPD-Mxf2ShfzwZ_zyocEPXfoFFGC0VkSwgTe5cGGr3JUzhgdAFzUA1g0cME37jJNSMEwwR4ReETMI20mDsiLpjSy4CfOVWMhpNGzAeTAdeBGJsc6l8Upxd1DOiHRotRgZfxnXryhHhjNMxAX6pPUX6YPcn5nT5j1Z",
    },
    {
        name: "Tarun Mehta", role: "Managing Partner",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGh6RZmuYRW9iC0mQlu1mMG_fwvdi4virO3-1xd3vMxUg4Nxeqft5rr2llOgROjIrfJH2eeVN-XMJvlaXoheMnU2-c2gOhP7zDNstt0hofWXwFyIs-lpFEugl39IVePQZhWVrecLFv48axVT13Id_lvViwKU3xkldG7eNzc3t3B42T-hu9TdOkyUPfzL-5fZfrlg6tmAOpLV4pSSqxsorz96Nw5QTMyeOWVRdqtHdASSIjbsROnn_3ydaWddaGljpCmx2o7H9Y7HDb",
    },
    {
        name: "Anurag Agrawal", role: "Operating Partner",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE6j6KU6sxzUCvAyc4_NhNpdhUUIIvbLBP3YzvqOkZr1o6WsVW0hLBsaKZw7jqiOQTVpZyfaiEUGEjrLMqoBOk-bDcpTjHTZvWTqKP0psTHrsQvlVIERUlT5fc1B38Sc3QO1fi808Q3TxcK0hWtHWP4kR0ThkSP7cnbDCpva9fpybG-PK78WXq9D2HaN2FVqVL36omm2xCNAhO9aKEGDP-Vizo7nRajD6x-DfgWlNUGjmVzKyVIAByG2c9Xukoa29cu9-9s_mu3Mko",
    },
];

const ACTIVITY = [
    { date: "MAY 14, 2024", text: "New Investment: Led $12M Series A for rural edu-tech startup Vidyakul.", color: "bg-primary" },
    { date: "APR 22, 2024", text: "Exit: Partial exit from Ergos Business Solutions yielding 4.2x MOIC.", color: "bg-rose-500" },
    { date: "MAR 08, 2024", text: "News: Vineet Rai featured in Bloomberg Markets regarding Agri-Fintech trends.", color: "bg-primary" },
];

export function InvestorProfileView() {
    return (
        <div className="flex-1 min-h-screen bg-surface font-manrope">
            {/* Top Nav */}
            <header className="sticky top-0 z-30 bg-emerald-50/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 w-full">
                <div className="flex items-center gap-8">
                    <span className="text-xl font-bold tracking-tight text-emerald-900 font-headline">Warren Intel</span>
                    <nav className="hidden lg:flex gap-6">
                        <a className="text-gray-600 hover:text-emerald-700 transition-colors text-sm font-semibold" href="#">Dashboard</a>
                        <a className="text-gray-600 hover:text-emerald-700 transition-colors text-sm font-semibold" href="#">Portfolio</a>
                        <a className="text-emerald-700 border-b-2 border-emerald-700 pb-1 text-sm font-semibold" href="#">Intelligence</a>
                        <a className="text-gray-600 hover:text-emerald-700 transition-colors text-sm font-semibold" href="#">Reports</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                        <input className="bg-gray-200 border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary w-64 transition-all outline-none" placeholder="Search firms, funds..." type="text" />
                    </div>
                    <button className="material-symbols-outlined text-gray-600 hover:text-primary transition-colors">notifications</button>
                    <button className="material-symbols-outlined text-gray-600 hover:text-primary transition-colors">account_circle</button>
                </div>
            </header>

            {/* Firm Header */}
            <section className="bg-gray-50 px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex items-start gap-8">
                            <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center editorial-shadow p-4 flex-shrink-0">
                                <img alt="Aavishkaar Logo" className="w-full h-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx4wi2t2MjidB4ElzD7obuPZId-gH19hlpuVicAfq-DdOlyneED47jl0Syt9GwASAIBQKHntca1wVkQmleebQU7TsoXrrdjmajCp2G7rz7kI8iHh9kWbAl5nGt_RIjLK5M2PodQL6ZuMKNFGLH2UjpX8zydeea5jdrBht0PRKZ5CgImRrko4gmg50JWBWa7LbZLiEq9X-NfYr3xvUt58pvqsBwMMFQQeFG_Wib8NVqt38H6rPry6XVHoAT5mLsRqT822nRNpnOJec2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Impact Leader</span>
                                    <span className="text-gray-400 text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">location_on</span> Mumbai, India
                                    </span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tight">Aavishkaar Capital</h2>
                                <p className="text-lg text-gray-500 max-w-xl font-medium leading-relaxed">Pioneering the venture capital ecosystem for the &ldquo;Other India&rdquo; through impact-driven investments.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 border-l border-gray-200 pl-8">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">Total AUM</p>
                                <p className="text-2xl font-black font-headline text-on-surface tracking-tight">$450M+</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">Dry Powder</p>
                                <p className="text-2xl font-black font-headline text-on-surface tracking-tight">$120M</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">Portfolio</p>
                                <p className="text-2xl font-black font-headline text-on-surface tracking-tight">38</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Investment Thesis */}
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <h3 className="text-2xl font-bold font-headline tracking-tight">Investment Thesis</h3>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
                            </div>
                            <div className="bg-white p-8 rounded-xl editorial-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 opacity-50" />
                                <p className="text-xl leading-relaxed text-gray-500 mb-8 italic relative z-10">
                                    &ldquo;We invest in entrepreneurs who are building scalable businesses that serve the aspiring 3 billion people living in the low-income settlements of Asia.&rdquo;
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                    {[
                                        { icon: "agriculture", title: "Agri-tech", desc: "Optimizing supply chains and financing for rural farmers across the subcontinent." },
                                        { icon: "account_balance", title: "Fintech", desc: "Providing credit and digital banking solutions to the underbanked population." },
                                        { icon: "health_and_safety", title: "Healthcare", desc: "Affordable medical diagnostic tools and delivery platforms for Tier 2 cities." },
                                    ].map(s => (
                                        <div key={s.title} className="space-y-2">
                                            <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">{s.icon}</span> {s.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4 relative z-10">
                                    <span className="bg-gray-50 px-4 py-1.5 rounded-full text-xs font-bold">Series A</span>
                                    <span className="bg-gray-50 px-4 py-1.5 rounded-full text-xs font-bold">Series B</span>
                                    <span className="bg-gray-50 px-4 py-1.5 rounded-full text-xs font-bold">$2M - $15M Ticket Size</span>
                                </div>
                            </div>
                        </section>

                        {/* Portfolio Gallery */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold font-headline tracking-tight">Active Portfolio</h3>
                                <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                    View All 38 Companies <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {PORTFOLIO_COMPANIES.map(c => (
                                    <div key={c.name} className="bg-white p-6 rounded-xl editorial-shadow hover:-translate-y-1 transition-transform group cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <img alt={c.name} className="h-10 grayscale group-hover:grayscale-0 transition-all" src={c.img} />
                                            <span className="text-[10px] font-bold text-gray-400">{c.date}</span>
                                        </div>
                                        <h4 className="font-bold text-lg mb-2">{c.name}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{c.desc}</p>
                                        <div className="flex gap-2">
                                            {c.tags.map(t => (
                                                <span key={t} className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded uppercase font-bold">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {/* Placeholder card */}
                                <div className="bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 rounded-xl">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">add_circle</span>
                                    <p className="text-sm font-bold text-gray-400">35+ More Investments</p>
                                </div>
                            </div>
                        </section>

                        {/* Leadership Team */}
                        <section>
                            <h3 className="text-2xl font-bold font-headline tracking-tight mb-8">Leadership Team</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {TEAM.map(t => (
                                    <div key={t.name} className="space-y-4">
                                        <img alt={t.name} className="w-full aspect-[4/5] object-cover rounded-lg editorial-shadow" src={t.img} />
                                        <div>
                                            <h4 className="font-black text-on-surface">{t.name}</h4>
                                            <p className="text-xs font-bold text-primary uppercase tracking-widest">{t.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Strategic Briefing CTA */}
                        <div className="bg-primary p-8 rounded-xl text-white editorial-shadow sticky top-24">
                            <h4 className="text-2xl font-black font-headline mb-4 leading-tight">Request a Strategic Briefing</h4>
                            <p className="text-sm text-emerald-200 mb-8 font-medium">Get detailed access to Aavishkaar&apos;s fund performance, sector insights, and direct meeting schedules.</p>
                            <form className="space-y-4 mb-8">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block">Full Name</label>
                                    <input className="w-full bg-white/10 border-b-2 border-white/30 border-t-0 border-x-0 focus:border-white focus:ring-0 text-white placeholder-white/40 py-2 text-sm outline-none" placeholder="Your name" type="text" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block">Investor Type</label>
                                    <select className="w-full bg-white/10 border-b-2 border-white/30 border-t-0 border-x-0 focus:border-white focus:ring-0 text-white py-2 text-sm outline-none">
                                        <option className="text-on-surface">Institutional (LP)</option>
                                        <option className="text-on-surface">Family Office</option>
                                        <option className="text-on-surface">HNW Individual</option>
                                    </select>
                                </div>
                                <button className="w-full py-4 bg-white text-primary font-black uppercase tracking-tighter rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all" type="button">
                                    Request Meeting
                                </button>
                            </form>
                            <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Global HQ: Mumbai</span>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-lg cursor-pointer hover:opacity-80">public</span>
                                    <span className="material-symbols-outlined text-lg cursor-pointer hover:opacity-80">share</span>
                                </div>
                            </div>
                        </div>

                        {/* Activity Feed */}
                        <section className="bg-gray-50 p-6 rounded-xl">
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Recent Activity</h4>
                            <div className="space-y-8">
                                {ACTIVITY.map((a, i) => (
                                    <div key={i} className="relative pl-6">
                                        <div className={`absolute left-0 top-1 w-2 h-2 rounded-full ${a.color}`} />
                                        {i < ACTIVITY.length - 1 && (
                                            <div className="absolute left-[3px] top-4 w-[1px] h-full bg-gray-200" />
                                        )}
                                        <p className="text-[10px] font-bold text-gray-400 mb-1">{a.date}</p>
                                        <p className="text-sm font-bold text-on-surface leading-snug">{a.text}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                View All News
                            </button>
                        </section>
                    </aside>
                </div>
            </div>

            {/* Global Reach Section */}
            <section className="bg-gray-200 px-8 py-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <h3 className="text-3xl font-black font-headline tracking-tighter">A Truly Global Impact from Mumbai</h3>
                        <p className="text-gray-500 leading-relaxed">Headquartered in the heart of India&apos;s financial capital, Aavishkaar operates specialized funds targeting South and Southeast Asian emerging markets.</p>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-2xl font-bold text-primary">14+</p>
                                <p className="text-[10px] font-bold uppercase text-gray-500">Target Countries</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">6</p>
                                <p className="text-[10px] font-bold uppercase text-gray-500">Global Offices</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full h-[300px] bg-gray-300 rounded-2xl overflow-hidden grayscale relative">
                        <img alt="World Map" className="w-full h-full object-cover opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg5PUy00K62qg8hID8S057fJoWedpltAoKk4qwqVjKA2kni_CFnJ89oPM4zk9GnS6x734uRD5-6D7_6SWTSAiwqp2NHxJH0ySr1gFwVc4K7HcKgfOwSY5HQKBmyPTAkP1TaIu-B_3zSxHcPQM5lmkl7sWt9kxai5Zgw_6Rs3_ETGA-BLjUlLTusnqBtSmfVGcT-6Wr-c56_vFBO6jHj5bJD38AxpPNEPf4WFhnAh8_-yr19MtRgsuuSnEcKfYn8ahPY5OcEWpbXa6-" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white p-4 rounded-lg editorial-shadow flex items-center gap-3">
                                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                                <span className="text-sm font-bold">HQ: Nariman Point, Mumbai</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-surface py-12 px-8 border-t border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-400 font-medium">© 2024 Warren Intel Intelligence Terminal. Data updated daily at 04:00 UTC.</p>
                    <div className="flex gap-6">
                        <a className="text-xs font-bold text-gray-500 hover:text-primary" href="#">Terms of Access</a>
                        <a className="text-xs font-bold text-gray-500 hover:text-primary" href="#">Privacy Shield</a>
                        <a className="text-xs font-bold text-gray-500 hover:text-primary" href="#">LP Portal</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

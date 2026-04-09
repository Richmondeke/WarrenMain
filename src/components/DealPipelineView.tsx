"use client";

type PipelineCard = {
    logo: string;
    name: string;
    desc: string;
    heat: number;
    lead: string;
    leadImg: string;
    amount: string;
    round: string;
    borderColor: string;
    extra?: React.ReactNode;
};

const PIPELINE_STAGES: { title: string; count: number; countStyle: string; cards: PipelineCard[] }[] = [
    {
        title: "First Look", count: 8, countStyle: "bg-gray-200 text-gray-600",
        cards: [
            { logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWaGO3hh-tJJs6vd0DVvbYQUAuDOHYY_vDdAWHk467IUvz3WBmUR6Nbmkt1Nw1CNLqZJqlRZZiwZR5fiiPjF3S6jeO7TYrHszZq9PxhYHlhqOFj042FoZyShFBTlNVZ1Vjp0LeRQwuM1azBCri5kCJWFJVBkZdyPYiMvBQYpzNUi0SF7A_u1jHgc1-C2dRPay9rSYKn_gWgyyL3TsrSMJz7mevwow-UIL80DLUO803ouz20c4jxmMla3mOxyGQ6LNvTt_43OoRwj_1", name: "Lumira Health", desc: "AI-driven diagnostics for remote specialized oncology consultation.", heat: 3, lead: "H. Vance", leadImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKnIOB85obbMkj67eyTQP7TgPSkmyy7YzZKjI4rVipX0i2afPUBwN4f34UA0tGnUf4M_xmhpP6hYPB2EzODoIdgaAuzZeMDhToctMDyHwDkoh3VHRwhgsvi3aGd_Hbl-mS46y8ngOJSTAlD4E2XNJT-zkw4tEQL_TJ6DuiG69frhXpQzjsfw6q-ez6Nx210Hv0IsL60uyDE8QygyUt3e-9cNE56pYlOhmNbMuiR9-LaQlIYE8Kh_ybre1D7YcLnw99WiP4NL1bfPm4", amount: "$3.5M", round: "Series A", borderColor: "border-primary/20" },
            { logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcgzXrjhsonBulEwh-xwDSd2bIoxui7mFKtLeDXxXJD_OStYiCjFkDtio-qJWV3UJ9Nil7n5-DxU8pl4XERW6PKyoV11eQmFpxkp1W6Vy1GIeAnVYFis7r0EVmEpu0VVOxfpzQy9aOW2bCpvhlUhsfCfdtcXYeR-fn3rJ9A_1Jyo8GyaGeqM6mrvucLj82DMPSlwRf-8W-a4WzdMAkT6F17klWWFaxVNbnD0KLaxtaV_7cTKlpNq6RkuznPNWNuyaxQ0rZ3V47b1fw", name: "NeoVolt Storage", desc: "Sodium-ion battery technology for grid-scale renewable storage solutions.", heat: 4, lead: "M. Sterling", leadImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWKGrwTSBXAVJdcvMy8rybJLM4vo2I4INbJ9EPigIXdiacOg7IMeCprntmC9Ob4kdin1w6J9aSKRrgRf8TZfKQWT85PQUXjxbngq5Jgx2XeEWWs_PQBOJomA8IC1YA-O_2tWIZBb9FfZMEoEg-ArhnnqmYmZez3PEFaKAsBtebn_fWGfPGEErOazGH-1FlTRxbMaBE9Iu69WHH7uWunijXtyi93NNrinnzJ8qlrcXfkwVOMtOy9GmOIUnPfimZ7MpxG0QoEkgDpzH8", amount: "$12.0M", round: "Seed+", borderColor: "border-primary/20" },
        ],
    },
    {
        title: "Due Diligence", count: 4, countStyle: "bg-emerald-700 text-white",
        cards: [
            {
                logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfopSSd9Vs3xzsIuwK8uNqAOrqBpHF_0aiq95AOz2u83HzNkCd5bWHvt5ObYy7hOR4YZYk_X3fHxGNH4UcD5eaZBIcB7FLShoTzuafqT3C4Ri1KAZEnWbY3ABcx4qnEAuPwmTlSV23jGitWnylYEEAn09eZPyGziV0rZ9e3YjmEgGXQ-n4Q2oq4tDckn_2XKZBFhyCJmQ4tbv8_s5x_SNFfSEz2b25o7JNpKJmHB2GQ_adouAGhYxEsaoJX0yMElODrgcq_geyqr5V", name: "Ethero Wealth", desc: "Blockchain-based infrastructure for private market equity settlements.", heat: 5, lead: "H. Vance", leadImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsTEsPdjlxY_OtXa0mYBu6dHvzrGZviR0UzsJ5ev97KwAwky1qasslHH3iCi_TQY9zhE_AYzDIPMHDVAYCpaDbbUUnA079a54HF8urq5pjbmRYECJEuf3ejYDw2hcwlVR8yU4klkPbOkcZZBcgVknqYzs7WcDa1-fm-uqQpaBS2AxjYjBG3lZ6bM_pd8J5p-vlogji2Yb2-ZZikk1qlcEJ9uvgugA5Dnrf-SMqLxI6lVo-ADfoE_WRCpOXg-v9o1Ro5BBMoXQtPyND", amount: "$25.0M", round: "Series B", borderColor: "border-primary",
                extra: (
                    <div className="bg-gray-100 rounded-lg p-2 mb-4">
                        <div className="flex items-center justify-between text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                            <span>Risk Assessment</span><span>82% Clear</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1"><div className="bg-primary h-1 rounded-full w-[82%]" /></div>
                    </div>
                ),
            },
        ],
    },
    {
        title: "IC Review", count: 3, countStyle: "bg-gray-200 text-gray-600",
        cards: [
            {
                logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtyXoZuWF9Y7Ni4gRpJ-pp5gZMXeSN9zKk_23XafsGM54mDE7-GDDhBYhlzx8P69aaWQo1KcW2ZzR5uYKFdfKNSvu582POFS7OOB7j6fomEHS7jNyjVD3b_5fAiLnGMfP2K0mSth2XUo1J64VzCLLXgsu5f7e4g5Vwzlp-HWTywS41xqIGbrxuYyijQb57a40qTDIDwQKtU1o5jgxDmYwZIQC84NxoCXzLqvLNBN5jS5tWxaoJ2sFEOiqkobFWnyQuftWfGKIWNDep", name: "Synthetix AI", desc: "Synthetic data generation for compliance-heavy financial modeling.", heat: 4, lead: "M. Sterling", leadImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoCQsp20W4BKJhXcBeZYx5kH5g55og7mR5TMhviftqt-4lh2tK6dRBX1UsBpEHvT0RQ_IfEw9o-7c4ICfhufC2Wdfmk4Z-PmNpe1f-_JfQftB6hggBEdBo3_KKWz9y4grj7_wypSD_NOLRn5qEDi9uaVZT5vXTYQWy25yCn1exF8_AYxrfA4Cy3lT6Ux-_Ri79cqj2ahnAPbGHt7y9RBMryrNv0EcwDMauI_Lj9skpuN_WX-sxHv2DsBzLP6N3-kUv9s2vXw7ron-C", amount: "$8.2M", round: "Series A", borderColor: "border-rose-500",
                extra: (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded">VOTE PENDING</span>
                        <span className="text-[9px] font-bold text-gray-500">JUL 24 MEETING</span>
                    </div>
                ),
            },
        ],
    },
    {
        title: "Term Sheet", count: 3, countStyle: "bg-emerald-700 text-white",
        cards: [
            {
                logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPoBNyUa05Os9VaJTTh8XwigHUX9_EkoqIDpchCw8ooxPzg_k6PLv1HJ2WxRByV9Y-zox-Rj3uT-mRPDCBCIGw1UkYGrlFfM6iYn6yrEZ-DILDEadN8GfbFj3SmIYNnheAwCRwcKlGIu-DM9O1JKVgRHHq1K_p4OiZJ_NK8UFckIm2DaAF63cGXJ85VrUGiStbROo8gmzFd-lwZHFaui_zpI-ck_WODiqorKGGuh3DI8VnHjlM_rTojATzsvPE8pr2uQcupmfXfE25", name: "UrbanFlow Systems", desc: "Real-time logistics optimization for last-mile delivery fleets.", heat: 5, lead: "H. Vance", leadImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeCdlcwcRJ1xwGz-n2vF7ofQwKvu7BUlUr6voxwjNMT55Rm7BlH3wsXX_mXLiTz2fZQ4LIN5AzwTMVq2hqTOznEajsXnJXJM43xFOl5_hWInLVti_JfGrLaZOfrgFN0SfL2WKWhMLfSIVb94KYh-ltlNkOy0PSVfxRzJlsa_S5ciIv1Yiz_MAz1acq8bw57BPiQDW5uJS3y1jJEuOeXlWTzhj5Wk4euL8a01zMpBI-SgqgkG5i2MFrOilSu2a2EBpFev-QY5YcY_pC", amount: "$15.5M", round: "Series C", borderColor: "border-primary/40",
                extra: (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded flex items-center">
                            <span className="material-symbols-outlined text-[10px] mr-1">history_edu</span> SIGNED
                        </span>
                    </div>
                ),
            },
        ],
    },
];

const CONVERSION_BARS = [
    { month: "JAN", h: 40, active: false },
    { month: "FEB", h: 55, active: false },
    { month: "MAR", h: 45, active: false },
    { month: "APR", h: 85, active: true },
];

const CONCENTRATION = [
    { label: "Fintech", pct: 42 },
    { label: "HealthTech", pct: 28 },
    { label: "ClimateTech", pct: 18 },
];

function HeatIndex({ filled }: { filled: number }) {
    return (
        <div className="flex items-center gap-0.5 justify-end mt-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-1 h-3 rounded-full ${i <= filled ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
        </div>
    );
}

export function DealPipelineView() {
    return (
        <div className="flex-1 min-h-screen bg-surface font-manrope">
            {/* Top Nav */}
            <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md flex justify-between items-center px-8 py-3 w-full editorial-shadow font-headline antialiased tracking-tight">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-extrabold tracking-tighter text-emerald-900">Emerald Ledger</h1>
                    <nav className="hidden md:flex gap-8">
                        <a className="text-primary font-bold border-b-2 border-primary py-1" href="#">Deals</a>
                        <a className="text-gray-500 font-medium py-1 hover:bg-gray-100 transition-colors" href="#">Insights</a>
                        <a className="text-gray-500 font-medium py-1 hover:bg-gray-100 transition-colors" href="#">Network</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-gray-400 text-sm">search</span>
                        <input className="bg-gray-200 border-none rounded-full py-1.5 pl-10 pr-4 text-xs w-64 focus:ring-2 focus:ring-primary outline-none" placeholder="Global fund search..." type="text" />
                    </div>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><span className="material-symbols-outlined">settings</span></button>
                    <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-bold active:scale-95 duration-200">New Deal</button>
                </div>
            </header>

            <div className="p-8">
                {/* Pipeline Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-1 font-headline">Deal Pipeline</h2>
                        <p className="text-gray-500 font-medium">Managing $420M in active deal flow across 18 entities</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {[{ label: "Lead Partner", options: ["All Partners", "Marcus Sterling", "Helena Vance"] }, { label: "Industry", options: ["All Sectors", "Fintech", "HealthTech", "Sustainability"] }, { label: "Deal Size", options: ["Any Size", "$1M - $5M", "$5M - $20M", "$20M+"] }].map(f => (
                            <div key={f.label} className="relative">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1 tracking-wider">{f.label}</label>
                                <select className="appearance-none bg-white border-none rounded-xl text-sm font-semibold text-on-surface px-4 py-2.5 pr-10 shadow-sm focus:ring-2 focus:ring-primary cursor-pointer">
                                    {f.options.map(o => <option key={o}>{o}</option>)}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 bottom-2.5 pointer-events-none text-gray-400">expand_more</span>
                            </div>
                        ))}
                        <div className="flex items-end">
                            <button className="bg-gray-200 p-2.5 rounded-xl text-on-surface hover:bg-gray-300 transition-colors"><span className="material-symbols-outlined">tune</span></button>
                        </div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    {PIPELINE_STAGES.map(stage => (
                        <div key={stage.title} className="space-y-4">
                            <div className="flex items-center justify-between px-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-headline font-bold text-on-surface tracking-tight">{stage.title}</h3>
                                    <span className={`${stage.countStyle} text-[10px] font-bold px-2 py-0.5 rounded-full`}>{String(stage.count).padStart(2, '0')}</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-300">more_horiz</span>
                            </div>
                            {stage.cards.map(card => (
                                <div key={card.name} className={`bg-white rounded-xl p-5 editorial-shadow group hover:translate-y-[-4px] transition-all duration-300 border-l-4 ${card.borderColor}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                            <img alt={card.name} className="w-full h-full object-cover" src={card.logo} />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Heat Index</span>
                                            <HeatIndex filled={card.heat} />
                                        </div>
                                    </div>
                                    <h4 className="text-on-surface font-bold text-base leading-tight mb-1">{card.name}</h4>
                                    <p className="text-gray-500 text-xs mb-4 line-clamp-2">{card.desc}</p>
                                    {card.extra}
                                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <img alt={card.lead} className="w-6 h-6 rounded-full object-cover" src={card.leadImg} />
                                            <span className="text-[11px] font-semibold text-gray-500">{card.lead}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] font-bold text-on-surface">{card.amount}</span>
                                            <span className="block text-[9px] text-gray-500">{card.round}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {stage.title === "Term Sheet" && (
                                <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2 group">
                                    <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">add</span>
                                    <span>Drag New Card Here</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pipeline Velocity */}
            <div className="px-8 pb-12">
                <h3 className="text-xl font-extrabold text-on-surface tracking-tight mb-6 font-headline">Pipeline Velocity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Conversion Momentum */}
                    <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-6 editorial-shadow flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h4 className="text-on-surface font-bold text-sm uppercase tracking-wider mb-1">Conversion Momentum</h4>
                                <p className="text-gray-500 text-xs">Moving from Diligence to IC Review</p>
                            </div>
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">+12% vs LY</span>
                        </div>
                        <div className="h-32 flex items-end gap-4">
                            {CONVERSION_BARS.map(bar => (
                                <div key={bar.month} className="flex-1 bg-gray-100 relative">
                                    <div className={`absolute bottom-0 w-full rounded-t-lg transition-all ${bar.active ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-emerald-700'}`} style={{ height: `${bar.h}%` }} />
                                    <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold ${bar.active ? 'text-primary' : 'text-gray-500'}`}>{bar.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fund Concentration */}
                    <div className="col-span-1 bg-primary text-white rounded-2xl p-6 shadow-xl shadow-primary/20 flex flex-col justify-between overflow-hidden relative">
                        <div className="relative z-10">
                            <h4 className="text-emerald-200 font-bold text-sm uppercase tracking-wider mb-4">Fund Concentration</h4>
                            <div className="space-y-4">
                                {CONCENTRATION.map(c => (
                                    <div key={c.label}>
                                        <div className="flex justify-between text-xs font-bold mb-1"><span>{c.label}</span><span>{c.pct}%</span></div>
                                        <div className="w-full bg-white/20 h-1.5 rounded-full"><div className="bg-white h-1.5 rounded-full" style={{ width: `${c.pct}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10 relative z-10 flex items-center justify-between">
                            <span className="text-[10px] font-bold opacity-80">Portfolio Diversification Index</span>
                            <span className="text-lg font-extrabold">0.84</span>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-900 rounded-full blur-3xl opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
}

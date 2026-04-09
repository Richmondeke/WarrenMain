"use client";

import { useAuth } from "@/lib/firebase/AuthContext";

const CHECKLIST_ITEMS = [
    { title: "Founder Bios & Headshots", description: "Validated by internal review", completed: true },
    { title: "3-Year Financial Model", description: "Dynamic P&L and Cashflow projections needed", completed: false, action: "Add File" },
    { title: "Competitor Matrix", description: "Feature-level landscape comparison", completed: false, action: "Add File" },
    { title: "Cap Table Cleanliness", description: "Audit of equity distribution and vesting schedules", completed: false, action: "Start Audit" },
];

const RESOURCES = [
    {
        title: "Pitch Deck Templates",
        description: "Series A-ready templates optimized for high-impact visual storytelling and data density.",
        tags: ["Slides", "Design"],
        files: "12 Files included",
        icon: "download",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZXMSiVkqeAW_UvVoCIDgE31E5kisCjsvuJnftVNM2aYUZ8qAiwScUqx05DNRAlP966qQI6Lb-z0YeEgBt0eiJ1dsBDf8gRg0dthprf0MCuFlbEj6LeVBYbdZwMcfI7qEdvkcBkCA1TDghjFWdRud1d-N8IC9MwuDm4R6hRjg8PgV_yD3_ynqO7GQVsutEHJSGVFLtbL8xr91Y5KTRPdO6f0cvasTFphVEcLYsRBBcJ645rkeeaK5UGOgCp_I1MFV0i6jHpaJYkXaU",
    },
    {
        title: "Legal Templates (SAFE/Convertible Note)",
        description: "Standardized documents for early-stage capital raising, vetted by top venture law firms.",
        tags: ["Legal", "Compliance"],
        files: "5 Documents",
        icon: "download",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyWHzFKS8oMHMceHYalOF8OYW4-C7hfSS9TXFvzTbhDpEQ6v9qxrSKhAC4q-1mTrmko3J1XvQYQXkTgjcnzNZgGaPP-BHrAllF0OGKiZmXRKU0HZMwS26S5vUkZItSGTc0OBqt2pDwFPy7Zeb51b5sgi19Shjze81OQGhXHzlKLhcHvZhhDQauHQadAgmMfuhGIo-aYQUsNN-st0CgMS7-QIm6lO90Qxh7Rgeci_KkSiMc5pyJR1V4cjpZvzzZXvrznkR-ZVJpAF8v",
    },
    {
        title: "Investor Outreach Email Scripts",
        description: "Proven cold-outreach and intro-request copy that yields a 40% higher response rate.",
        tags: ["Strategy", "Outreach"],
        files: "8 Templates",
        icon: "content_copy",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZKflrauidzVgIbZUC5ovVbOa7rPKqVftCgP74LokPwoS71UVAZjHILi2jme8mh_GsWEZuW8_iJlGayXl2SeajrfGvfe6hDLXGZvMx1Apgn3YTQ8Mu_scMV1WLiePt3X7rWZPPxUffG8mfWn7L2M7XixNvIHwyDRuaWmX2xtM0C8mJnNnbHc2xUXq3Rkb5tyzm8jS8T90Cjpo9rWJqKIOhEK1Q4IUHZeXAvlW-wmdUMYz5Eg_cTd6ogQDe6VhVRgdNcGRsRuGDrWfa",
    },
];

const PERKS = [
    { name: "AWS Activate", value: "$10,000 in credits", icon: "cloud" },
    { name: "Stripe Atlas", value: "Free incorporation", icon: "payments" },
    { name: "Notion", value: "6 months free", icon: "edit_note" },
    { name: "HubSpot", value: "90% off Year 1", icon: "hub" },
];

export function FundabilityView() {
    const { user } = useAuth();
    const score = 82;
    const circumference = 2 * Math.PI * 88; // r=88
    const offset = circumference - (score / 100) * circumference;
    const pendingItems = CHECKLIST_ITEMS.filter(i => !i.completed).length;

    return (
        <div className="flex-1 min-h-screen bg-surface font-manrope">
            {/* Video Walkthrough Banner */}
            <section className="px-12 pt-8">
                <div className="bg-primary/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-primary/10">
                    <div className="relative w-full md:w-80 h-48 bg-gray-200 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
                        <img
                            alt="Video walkthrough thumbnail"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTDXq5Ngc5dNbjgXzULYqk1Ux9soRi1oDBmtGDdXpaB8JE-_Lc59O41vD7mqyNdb31Y_WKQe9SYtxC_llTw8IEV_1LUIcKxc7iZlqAPeuLXIyDM6xsFDsUEOSQu8XgbRmRvWps2xEWHl7qcG-YBtRYtlEy0gJ3BW9JpAVUMLimV58-6qSsvsmESxbGYxjL-i9aT4m2PUwQu3Fl-oTUPPbAtIf_a-U9WH4nsnTxO1-Ub6oogFwSFYGhrccmOG9Y00pD4obLYJzt5BOZ"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-xl transform transition-transform group-hover:scale-110">
                                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                            <h3 className="font-headline text-2xl font-extrabold text-emerald-900 tracking-tight">New to Warren? Watch the Walkthrough</h3>
                            <p className="text-gray-500 mt-2 max-w-xl leading-relaxed">Get a 5-minute guided tour of our fundability tools and learn how to optimize your venture for investor readiness from day one.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <button className="px-6 py-3 editorial-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">play_circle</span>
                                Watch Now
                            </button>
                            <button className="px-6 py-3 text-primary font-bold hover:bg-primary/5 rounded-xl transition-all">Dismiss</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Header */}
            <header className="flex justify-between items-center px-12 w-full sticky top-0 bg-surface/80 backdrop-blur-md z-30 py-8">
                <div>
                    <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Founder Resources & Fundability</h2>
                    <p className="text-gray-500 text-sm mt-1">Refine your venture&apos;s investment readiness profile.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-gray-400">search</span>
                        <input className="pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-primary text-sm w-64 transition-all outline-none" placeholder="Search resources..." type="text" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-100">
                            <img alt="User" className="w-full h-full object-cover" src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuDyRvT1NhD1Lv5eMhreseKYj8AEwq5VTq9Sgh4-hqb9jbQJHtx4xoZYkcYdxG7CZ1a5jGPjgbJ7cnGhDFHKkJPxU3H8Y1LaVytDj6x_hrb7KsS4EbusW_SazuqURBmiQqBlncr7zH7ft3o5rH5skGzcdmjyYc3C3aJR5GXc-ZBduI5nQhKqq4crUSUd85Y-DShVEk4yD8CBbDkCL4JQAbNvIAPmsY59og_0YXonme8drB2PSyUNnFBkDwjfw0PjYgq8MCpwZqEpT4X7"} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-12 pb-16 space-y-12">
                {/* Fundability Hero Section */}
                <section className="grid grid-cols-12 gap-8 items-start">
                    {/* Fundability Score Dial */}
                    <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-10 editorial-shadow border border-white/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined text-[120px]">verified_user</span>
                        </div>
                        <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">Fundability Score</h3>
                        <div className="flex items-end gap-6 mb-10">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                                    <circle className="text-gray-100" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" />
                                    <circle
                                        className="text-primary"
                                        cx="96" cy="96"
                                        fill="transparent"
                                        r="88"
                                        stroke="currentColor"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        strokeWidth="12"
                                        style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="font-headline text-5xl font-extrabold text-on-surface tracking-tighter">{score}</span>
                                    <span className="text-gray-400 font-bold text-lg">/100</span>
                                </div>
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/50 text-primary font-bold text-xs uppercase tracking-wider rounded-full mb-3">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    Ready for Outreach
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">Your venture shows strong structural integrity. Minor refinements in your cap table could push you into the top 5%.</p>
                            </div>
                        </div>
                        <button className="w-full py-4 editorial-gradient text-white rounded-xl font-bold tracking-tight editorial-shadow hover:opacity-90 transition-all flex items-center justify-center gap-2 group">
                            Talk to an Expert
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>

                    {/* Compliance Checklist */}
                    <div className="col-span-12 lg:col-span-7 bg-gray-50 rounded-2xl p-10">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="font-headline text-xl font-bold text-on-surface">Compliance Checklist</h3>
                                <p className="text-sm text-gray-500 mt-1">Items required to reach &apos;Investment Grade&apos; status.</p>
                            </div>
                            <span className="text-xs font-bold bg-gray-200 px-3 py-1 rounded-full uppercase tracking-tighter">{pendingItems} Items Remaining</span>
                        </div>
                        <div className="space-y-4">
                            {CHECKLIST_ITEMS.map((item, i) => (
                                <div key={i} className={`flex items-center justify-between p-5 bg-white rounded-xl transition-all group ${item.completed ? 'border-b-2 border-transparent hover:border-primary/20' : 'border-l-4 border-rose-400'}`}>
                                    <div className="flex items-center gap-4">
                                        <span className={`material-symbols-outlined ${item.completed ? 'text-primary' : 'text-rose-400'}`}
                                            style={item.completed ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                            {item.completed ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        <div>
                                            <h4 className="font-headline text-sm font-bold text-on-surface">{item.title}</h4>
                                            <p className="text-xs text-gray-500">{item.description}</p>
                                        </div>
                                    </div>
                                    {item.completed ? (
                                        <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/5 rounded-lg">Verified</span>
                                    ) : (
                                        <button className="text-xs font-bold text-rose-500 hover:underline">{item.action}</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Resource Library */}
                <section>
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h3 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Resource Library</h3>
                            <p className="text-gray-500 mt-2 max-w-lg">Hand-picked assets to accelerate your fundraising journey. Crafted by top-tier legal and financial analysts.</p>
                        </div>
                        <button className="text-primary font-bold text-sm flex items-center gap-1 group">
                            Browse all resources
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {RESOURCES.map((res, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden editorial-shadow group border border-transparent hover:border-primary/10 transition-all">
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    <img alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={res.image} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        {res.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h4 className="font-headline text-lg font-bold text-on-surface leading-tight mb-2">{res.title}</h4>
                                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">{res.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-400">{res.files}</span>
                                        <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                            <span className="material-symbols-outlined">{res.icon}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Exclusive Startup Perks */}
                <section>
                    <div className="mb-8">
                        <h3 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Exclusive Startup Perks</h3>
                        <p className="text-gray-500 mt-2 max-w-lg">Unlock discounted tools and credits from our network of world-class partners.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PERKS.map((perk, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 editorial-shadow border border-transparent hover:border-primary/10 transition-all flex flex-col items-center text-center group cursor-pointer hover:-translate-y-1">
                                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                    <span className="material-symbols-outlined text-emerald-700 text-3xl">{perk.icon}</span>
                                </div>
                                <h4 className="font-headline text-sm font-bold text-on-surface mb-1">{perk.name}</h4>
                                <p className="text-xs text-emerald-700 font-semibold">{perk.value}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

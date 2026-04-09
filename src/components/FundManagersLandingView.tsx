"use client";

import { LandingNavbar } from "./LandingNavbar";

const COMPLIANCE_ITEMS = [
    { icon: "policy", label: "SOC2 Type II" },
    { icon: "gpp_maybe", label: "GDPR Compliant" },
    { icon: "history_edu", label: "Audited Trails" },
    { icon: "key", label: "SSO/SAML" },
];

const DEMO_MODULES = [
    { icon: "hub", label: "Deal Pipeline" },
    { icon: "security", label: "VDR Controls" },
    { icon: "monitoring", label: "LP Analytics" },
    { icon: "verified_user", label: "Audit Trails" },
];

export function FundManagersLandingView() {
    return (
        <div className="bg-surface text-on-surface font-body min-h-screen">
            <LandingNavbar activePage="fund-managers" />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="px-8 py-20 max-w-7xl mx-auto overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7">
                            <span className="inline-block px-3 py-1 mb-6 text-[0.6875rem] font-bold tracking-[0.1em] text-primary uppercase bg-primary/5 rounded-full">Institutional Excellence</span>
                            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface leading-[1.05] tracking-tight mb-8">
                                Streamline Your <span className="text-primary">Deal Flow</span> with Institutional-Grade Tools.
                            </h1>
                            <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
                                Designed for elite GPs and asset managers. Warren Intel merges proprietary data with high-security infrastructure to accelerate your investment lifecycle from sourcing to exit.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-primary text-white px-8 py-4 rounded-xl font-headline font-bold text-base shadow-lg flex items-center justify-center gap-2 group">
                                    Start Your Onboarding
                                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                                <button className="px-8 py-4 rounded-xl font-headline font-bold text-base border border-gray-200 hover:bg-gray-50 transition-colors">
                                    Explore Technical Specs
                                </button>
                            </div>
                            <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Trusted By Top Tier Funds</span>
                                <div className="flex gap-6 items-center">
                                    <span className="font-headline font-extrabold text-lg italic">SILVERSTONE</span>
                                    <span className="font-headline font-extrabold text-lg italic">OAK CAPITAL</span>
                                    <span className="font-headline font-extrabold text-lg italic">VECTOR V.</span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-5 relative">
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary/5 rounded-full blur-3xl" />
                            <div className="relative bg-white rounded-3xl p-4 shadow-[0_32px_64px_-16px_rgba(13,99,27,0.08)] border border-gray-100">
                                <img alt="Fund Dashboard" className="rounded-2xl w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWo3LDH0QDyjEYG5mTOsD6JO4aHkNwah7RL81nkeHi4ExBYqLKdQs1EimZWzBpzjbkYnPDsrl6LIjFdIxS3vrjjRKUE16Q-h6HD7xSdQZ3EZ56dDg-ro2xvTv2wU6q4c3IzJqs6f3-XQGaO1u2oRMgYxQfB9Jb3NxT07SzWzQioZcnC70ZluORSFRuno0ptMLOqF6akHdcX5MtoKCx7EKq-3M72xHqJwjFPtD72OzlJHnR7F2HiN2m8bL7zXTupbpw7lbLnAa-WK5i" />
                                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[240px]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Secure Protocol</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full mb-2">
                                        <div className="h-full w-3/4 bg-primary rounded-full" />
                                    </div>
                                    <p className="text-[11px] font-medium text-on-surface">Data Room Encryption: 256-bit Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Bento Grid */}
                <section className="bg-gray-50 py-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight mb-4 text-on-surface">Precision Intelligence for the Modern GP</h2>
                                <p className="text-gray-500 text-lg leading-relaxed">Integrated workflows that remove friction between your analysts and decision-makers.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="w-12 h-1 bg-primary rounded-full" />
                                <span className="w-4 h-1 bg-gray-300 rounded-full" />
                                <span className="w-4 h-1 bg-gray-300 rounded-full" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {/* Feature 1: Deal Sourcing */}
                            <div className="md:col-span-7 bg-white rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden group editorial-shadow">
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                                        <span className="material-symbols-outlined text-primary text-3xl">radar</span>
                                    </div>
                                    <h3 className="text-2xl font-headline font-bold mb-4">1. Proprietary Deal Sourcing</h3>
                                    <p className="text-gray-500 mb-8 max-w-md leading-relaxed">Access Warren Intel&apos;s exclusive network of high-growth founders and stealth-mode ventures before they hit the general market.</p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3 text-sm font-semibold text-on-surface">
                                            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            AI-Powered Founder Matching
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-semibold text-on-surface">
                                            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            Off-Market Secondary Opportunities
                                        </li>
                                    </ul>
                                </div>
                                <img alt="Office" className="absolute -bottom-10 -right-10 w-2/3 h-auto opacity-10 group-hover:opacity-20 transition-opacity rounded-tl-[4rem]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmyfyMrrna9sXxqEB6vo3P66Y993HB2ff71lYnPUv6BgTIZzeqhCLY96WAR0QQmgJ7YYlLB9Klcc373jy5mFUsfQgmSdxuNi2EuPtpzFPTEtBHfedOlQLm8gSBgtNAEbtD6nOAtAhkqZCCCLfiYq0dfDur6fhRt7b2aLFE9wJ4cneJ8D9sXevMm5uE5GDxIbnLZyeUIACVFJ_v0NOXrwr9X_9q66anmnYFIi0vX-PltAdotYFTSZP4C0Sut6HJUim4WVkTap7QUR8e" />
                            </div>

                            {/* Feature 2: VDR */}
                            <div className="md:col-span-5 bg-white rounded-[2rem] p-10 flex flex-col editorial-shadow">
                                <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-8">
                                    <span className="material-symbols-outlined text-rose-600 text-3xl">shield_with_house</span>
                                </div>
                                <h3 className="text-2xl font-headline font-bold mb-4">2. Secure Virtual Data Rooms</h3>
                                <p className="text-gray-500 mb-6 leading-relaxed">Next-generation VDRs with granular activity tracking and document forensics. Know exactly who is viewing what, and for how long.</p>
                                <div className="mt-auto pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Real-time Analytics</span>
                                        <span className="text-xs font-bold text-primary">+12% User Activity</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-2/3" />
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3: CRM (dark block) */}
                            <div className="md:col-span-12 bg-on-surface rounded-[2rem] p-12 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden">
                                <div>
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                                        <span className="material-symbols-outlined text-emerald-300 text-3xl">database</span>
                                    </div>
                                    <h3 className="text-3xl font-headline font-bold mb-4">3. Integrated CRM &amp; Portfolio Management</h3>
                                    <p className="text-white/70 mb-10 text-lg leading-relaxed">Centralize your investor relations and post-investment monitoring in one unified ledger. Automated KPI tracking and LP portal included.</p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                            <div className="text-2xl font-headline font-extrabold mb-1">99.9%</div>
                                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Uptime SLA</div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                            <div className="text-2xl font-headline font-extrabold mb-1">AES-256</div>
                                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Vault Security</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <img alt="Data viz" className="rounded-3xl shadow-2xl scale-110 translate-x-12 translate-y-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7MZ22GLQRMGoP_02iIjlLKaGMmCqX7iu9t4Ehws_UwgkQEP_maf0EQSaRvgQlkY2xNJPNqih-WKZEcPj7TOkojivhmE6_HIWDu1L0ygkhzj_rA9YrMyOIBdXp1IpZQ3oRYI7BdJD9ESc-or0d_enTYYcw7vFvK2eO0nprM7gALN1u2oMSK1OjqpCT-K8bCrO-X2OKI_xTE4zVxk8_grv2d0pjqUAXbHXjt1BAwfQ_xzTeaT1z2MaQIyGKCaGJ1QWXO4KM7rsosHge" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Demo Section */}
                <section className="py-24 px-8 bg-surface">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="inline-block px-3 py-1 mb-4 text-[0.6875rem] font-bold tracking-[0.1em] text-primary uppercase bg-primary/5 rounded-full">Platform Showcase</span>
                            <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface mb-6">See the Intelligence in Action</h2>
                            <p className="text-gray-500 text-lg leading-relaxed">Watch how Warren Intel transforms fragmented data into actionable investment intelligence with a guided walkthrough of our GP suite.</p>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-on-surface shadow-[0_48px_100px_-16px_rgba(25,28,29,0.15)] border border-gray-200">
                                <img alt="Dashboard Preview" className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-100 hover:mix-blend-normal transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWo3LDH0QDyjEYG5mTOsD6JO4aHkNwah7RL81nkeHi4ExBYqLKdQs1EimZWzBpzjbkYnPDsrl6LIjFdIxS3vrjjRKUE16Q-h6HD7xSdQZ3EZ56dDg-ro2xvTv2wU6q4c3IzJqs6f3-XQGaO1u2oRMgYxQfB9Jb3NxT07SzWzQioZcnC70ZluORSFRuno0ptMLOqF6akHdcX5MtoKCx7EKq-3M72xHqJwjFPtD72OzlJHnR7F2HiN2m8bL7zXTupbpw7lbLnAa-WK5i" />
                                <div className="absolute inset-0 flex items-center justify-center bg-on-surface/20 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-500">
                                    <button className="w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:scale-110 hover:bg-white hover:text-primary transition-all duration-300 shadow-2xl">
                                        <span className="material-symbols-outlined text-4xl md:text-5xl translate-x-1" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                    </button>
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-white/80 pointer-events-none">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-widest font-headline">Intelligence Module v4.2</span>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest font-headline">04:12 HD</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {DEMO_MODULES.map(m => (
                                <div key={m.label} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:bg-gray-200 transition-colors cursor-pointer group">
                                    <span className="material-symbols-outlined text-primary mb-2 block">{m.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust & Security */}
                <section className="py-24 px-8 max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-headline font-bold mb-16">Uncompromising Standards</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {COMPLIANCE_ITEMS.map(c => (
                            <div key={c.label} className="flex flex-col items-center">
                                <span className="material-symbols-outlined text-4xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                                <h4 className="font-bold text-sm">{c.label}</h4>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-8 pb-32">
                    <div className="max-w-7xl mx-auto editorial-gradient rounded-[3rem] p-12 md:p-24 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="grid grid-cols-6 h-full w-full">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="border-r border-white/20 h-full" />
                                ))}
                            </div>
                        </div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-8 leading-tight">Ready to Command Your Capital?</h2>
                            <p className="text-emerald-200 text-xl mb-12 opacity-90">Join 400+ leading funds optimizing their performance with Warren Intel.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button className="bg-white text-primary px-10 py-5 rounded-2xl font-headline font-bold text-lg hover:shadow-xl transition-shadow active:scale-90 duration-150">
                                    Book a Private Demo
                                </button>
                                <button className="text-white font-headline font-bold border-b-2 border-white/40 pb-1 hover:border-white transition-colors">
                                    Talk to our GP Advisory
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 px-8 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    <div>
                        <div className="font-headline font-bold text-lg text-primary mb-4">Warren Intel</div>
                        <p className="text-sm tracking-wide text-gray-400 max-w-sm mb-6">
                            The authoritative platform for private equity and venture capital deal intelligence.
                        </p>
                        <div className="text-gray-400 text-sm">
                            © 2024 Warren Intel. Private Banking Editorial Standards.
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-4">
                            <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface">Legal</span>
                            <a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Terms of Service</a>
                            <a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Privacy Policy</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface">Support</span>
                            <a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Regulatory Disclosure</a>
                            <a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

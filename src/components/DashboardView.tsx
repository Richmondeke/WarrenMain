"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Search,
    Globe,
    Database,
    Users,
    Briefcase,
    TrendingUp,
    Plus,
    PlayCircle,
    ExternalLink,
    Info,
    LayoutGrid,
    Map
} from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "./ui/Animations";
import { InvestorTable } from "./InvestorTable";
import { Investor, InvestorStats } from "@/lib/investor-data";
import { RightSidebar } from "./layout/RightSidebar";
import { useAuth } from "@/lib/firebase/AuthContext";
import {
    getCRMInvestors,
    CRMInvestor,
    getUserTasks,
    getUserActivity,
    getIntelItems,
    UserTask,
    UserActivity,
    IntelItem
} from "@/lib/firestore";
import { cn } from "@/lib/utils";

const MOCK_INTEL: IntelItem[] = [
    {
        id: "1",
        category: "Market Trend",
        title: "Q3 Venture Debt Report",
        description: "Venture debt volume reached record highs in Q3 as founders seek non-dilutive capital.",
        icon: "trending_up",
    },
    {
        id: "2",
        category: "Strategy",
        title: "Winning the Boardroom",
        description: "New frameworks for managing investor expectations during a down round.",
        icon: "psychology",
    }
];

export function DashboardView() {
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [crmInvestors, setCrmInvestors] = useState<CRMInvestor[]>([]);
    const [tasks, setTasks] = useState<UserTask[]>([]);
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [intel, setIntel] = useState<IntelItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const storedInvestors = sessionStorage.getItem("warrenintel_investors");
        if (storedInvestors) {
            try {
                setInvestors(JSON.parse(storedInvestors));
            } catch (e) {
                console.error("Failed to parse stored investors", e);
            }
        }

        if (user) {
            fetchCRM();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchCRM = async () => {
        if (!user) return;
        const [crmData, taskData, activityData, intelData] = await Promise.all([
            getCRMInvestors(user.uid),
            getUserTasks(user.uid),
            getUserActivity(user.uid),
            getIntelItems()
        ]);
        setCrmInvestors(crmData);
        setTasks(taskData);
        setActivities(activityData);
        setIntel(intelData);
        setIsLoading(false);
    };

    const stats = useMemo(() => {
        if (crmInvestors.length === 0) return { contacted: 0, meetings: 0, rate: 0, score: 65, change: 0 };

        const contacted = crmInvestors.filter(i => i.status !== "To be contacted").length;
        const reached = crmInvestors.filter(i => ["Reached out", "In progress", "Committed"].includes(i.status)).length;
        const meetings = crmInvestors.filter(i => ["In progress", "Committed"].includes(i.status)).length;
        const committed = crmInvestors.filter(i => i.status === "Committed").length;

        const rate = contacted > 0 ? Math.round((reached / contacted) * 100) : 0;

        // Dynamic Fundability Score calculation
        let score = 65; // Starting base for new users
        score += Math.min(contacted * 2, 10); // Up to +10 for active outreach
        score += Math.min(meetings * 5, 15); // Up to +15 for meetings
        score += committed > 0 ? 10 : 0; // +10 for first commitment

        const change = contacted > 0 ? 2.4 : 0; // Mocking week-over-week change

        return { contacted, meetings, rate, score, change };
    }, [crmInvestors]);

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#f8f9fa]">
            <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 h-16 flex justify-between items-center w-full px-8 border-b border-border shadow-sm">
                <div className="flex items-center bg-slate-50 rounded-full px-4 py-2 w-96 border border-border/50">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 outline-none" placeholder="Search investors, deals, or news..." type="text" />
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-slate-500 hover:text-primary transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                    </button>
                    <button className="text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-primary font-bold text-xs uppercase">
                            {user?.displayName ? user.displayName.charAt(0) : "A"}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8 max-w-7xl mx-auto space-y-10">
                {/* Hero Section */}
                <FadeInStagger className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    <FadeInStaggerItem className="lg:col-span-2 bg-gradient-to-br from-[#0d631b] to-emerald-800 rounded-3xl p-10 text-white relative overflow-hidden editorial-shadow flex flex-col justify-between min-h-[320px]">
                        <div className="relative z-10">
                            <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-2">Welcome back, {user?.displayName?.split(' ')[0] || "Founder"}.</h2>
                            <p className="text-emerald-100/80 text-lg max-w-md">Your fundability score has increased by {stats.change}% this week. You&apos;re in a prime position to close the seed round.</p>
                        </div>
                        <div className="relative z-10 flex items-end justify-between">
                            <button className="bg-white text-primary font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-lg">
                                <span>Continue Raising</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                            <div className="text-right hidden md:block">
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Active Deal Room</span>
                                <span className="text-2xl font-black">Series A • $5.0M</span>
                            </div>
                        </div>
                        {/* Abstract Decorative Element */}
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    </FadeInStaggerItem>

                    <FadeInStaggerItem className="bg-white rounded-3xl p-8 editorial-shadow flex flex-col justify-center items-center text-center border border-border">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Overall Fundability Score</span>
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-slate-100" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                                <circle className="text-primary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset={440 - (440 * stats.score / 100)} strokeLinecap="round" strokeWidth="12" style={{ transition: 'stroke-dashoffset 2s ease-out' }}></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-headline text-5xl font-extrabold text-emerald-950">{stats.score}</span>
                                <span className="text-xs font-bold text-primary">+{stats.change}%</span>
                            </div>
                        </div>
                        <p className="mt-8 text-xs font-medium text-slate-500 max-w-[200px] leading-relaxed">Top 15% of startups in your sector this month.</p>
                    </FadeInStaggerItem>
                </FadeInStagger>

                {/* Secondary Stats & News Row */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Fundraising News */}
                    <section className="xl:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-headline text-2xl font-bold text-emerald-950">Fundraising News</h3>
                            <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline" href="#">
                                View All <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(intel.length > 0 ? intel : MOCK_INTEL).map((item) => (
                                <NewsCard
                                    key={item.id}
                                    category={item.category}
                                    title={item.title}
                                    desc={item.description}
                                    icon={item.icon || "info"}
                                    color={item.color || "emerald"}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Active Outreach Summary */}
                    <section className="xl:col-span-4 space-y-6">
                        <h3 className="font-headline text-2xl font-bold text-emerald-950">Outreach Summary</h3>
                        <div className="bg-white rounded-3xl p-8 editorial-shadow space-y-8 border border-border">
                            <OutreachStat
                                icon="alternate_email"
                                label="Contacted"
                                value={stats.contacted}
                                progress={66}
                            />
                            <OutreachStat
                                icon="calendar_today"
                                label="Meetings"
                                value={stats.meetings}
                                progress={33}
                            />

                            <div className="pt-6 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-slate-600">Response Rate</span>
                                    <span className="text-sm font-black text-emerald-700">{stats.rate}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-emerald-400" style={{ width: `${stats.rate}%` }}></div>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-slate-50 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors">
                                View CRM Pipeline
                            </button>
                        </div>
                    </section>
                </div>

                {/* Tasks & Deal Room Row */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upcoming Tasks */}
                    <div className="space-y-6">
                        <h3 className="font-headline text-2xl font-bold text-emerald-950">Next Steps</h3>
                        <div className="space-y-4">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        title={task.title}
                                        subtitle={task.subtitle}
                                        completed={task.completed}
                                    />
                                ))
                            ) : (
                                <>
                                    <TaskItem title="Send deck to Sequoia" subtitle="Due today • High Priority" />
                                    <TaskItem title="Update CRM for Andreessen" subtitle="Due tomorrow • Routine" />
                                    <TaskItem title="Schedule intro with Founders Fund" subtitle="Completed" completed />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Deal Room Snapshot */}
                    <div className="space-y-6">
                        <h3 className="font-headline text-2xl font-bold text-emerald-950">Deal Room Snapshot</h3>
                        <div className="bg-white rounded-3xl overflow-hidden editorial-shadow border border-border">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                <span className="font-black text-xs uppercase tracking-widest text-slate-400">Recent Interactions</span>
                                <span className="text-[10px] font-bold text-slate-300">Last 24 hours</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {activities.length > 0 ? (
                                    activities.map((activity) => (
                                        <ActivityItem
                                            key={activity.id}
                                            icon={activity.icon}
                                            text={activity.text}
                                            time={activity.time}
                                            tag={activity.tag}
                                        />
                                    ))
                                ) : (
                                    <>
                                        <ActivityItem
                                            icon="visibility"
                                            text="Greylock Partners viewed Pitch_Deck_v4.pdf"
                                            time="2 hours ago • Duration: 4:12m"
                                            tag="HOT"
                                        />
                                        <ActivityItem
                                            icon="download"
                                            text="Index Ventures downloaded Financial_Model.xlsx"
                                            time="5 hours ago"
                                        />
                                        <ActivityItem
                                            icon="chat_bubble"
                                            text="Sarah Chen (Partner) left a comment on Page 12"
                                            time="Yesterday • 'Impressive LTV/CAC ratios'"
                                        />
                                    </>
                                )}
                            </div>
                            <div className="p-4 bg-slate-50 text-center">
                                <button className="text-[10px] font-black text-primary tracking-[0.2em] uppercase hover:underline">
                                    Open Full Deal Room
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Contextual Floating Action Button */}
            <button className="fixed bottom-8 right-8 bg-emerald-950 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group z-50">
                <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
            </button>
        </div>
    );
}

function NewsCard({ category, title, desc, icon, color }: { category: string, title: string, desc: string, icon: string, color: string }) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden editorial-shadow hover:translate-y-[-4px] transition-all border border-border">
            <div className="h-40 bg-slate-100 overflow-hidden relative flex items-center justify-center">
                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                </div>
                <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black uppercase px-2 py-1 rounded tracking-widest">{category}</div>
            </div>
            <div className="p-6">
                <h4 className="font-bold text-lg mb-2 leading-tight text-emerald-950">{title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{desc}</p>
                <a className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline" href="#">
                    Read More <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </a>
            </div>
        </div>
    );
}

function OutreachStat({ icon, label, value, progress }: { icon: string, label: string, value: number | string, progress: number }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                    <span className="block text-2xl font-black text-emerald-950 leading-none mb-1">{value}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
                </div>
            </div>
            <div className="text-right">
                <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
}

function TaskItem({ title, subtitle, completed = false }: { title: string, subtitle: string, completed?: boolean }) {
    return (
        <div className={`bg-white p-6 rounded-2xl editorial-shadow flex items-center justify-between group hover:bg-slate-50 transition-colors border border-border ${completed ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center transition-all cursor-pointer",
                    completed ? "bg-primary text-white" : "border-2 border-slate-200 group-hover:border-primary"
                )}>
                    {completed && <span className="material-symbols-outlined text-sm">check</span>}
                </div>
                <div>
                    <h5 className={cn("font-bold text-emerald-950", completed && "line-through")}>{title}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
                </div>
            </div>
            <span className="material-symbols-outlined text-slate-200">drag_indicator</span>
        </div>
    );
}

function ActivityItem({ icon, text, time, tag }: { icon: string, text: string, time: string, tag?: string }) {
    return (
        <div className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-950 truncate">{text}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{time}</p>
            </div>
            {tag && (
                <div className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded tracking-widest">
                    {tag}
                </div>
            )}
        </div>
    );
}

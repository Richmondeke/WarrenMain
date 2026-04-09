"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, ShieldCheck, Activity, Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { AdminHeader, AdminTable, AdminCard } from "./AdminShared";

interface UserProfile {
    id: string;
    name?: string;
    displayName?: string;
    email: string;
    role?: string;
    plan?: string;
    status?: string;
    aum?: string;
    createdAt?: any;
}

export default function UserManagementView() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserProfile[];
            setUsers(usersList);
            setLoading(false);
        }, (error) => {
            console.error("Firestore user fetch error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(u =>
        (u.name || u.displayName || "").toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            header: "User Information",
            key: "name",
            render: (user: UserProfile) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-serif text-xs">
                        {(user.name || user.displayName || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <p className="font-serif font-medium text-white tracking-tight leading-none mb-1">
                            {user.name || user.displayName || 'Anonymous'}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-sans tracking-tight">{user.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Role",
            key: "role",
            render: (user: UserProfile) => (
                <p className="text-xs text-zinc-400 font-sans">{user.role || 'Member'}</p>
            )
        },
        {
            header: "Plan Tier",
            key: "plan",
            render: (user: UserProfile) => (
                <span className={`px-2 py-1 text-[10px] font-sans font-bold tracking-widest uppercase border
          ${user.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                        user.plan === 'Pro' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'}`}>
                    {user.plan || 'Free'}
                </span>
            )
        },
        {
            header: "Status",
            key: "status",
            render: (user: UserProfile) => (
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 pulse-subtle' : 'bg-zinc-700'}`}></div>
                    <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">{user.status || 'Offline'}</span>
                </div>
            )
        },
        {
            header: "Self-Reported AUM",
            key: "aum",
            render: (user: UserProfile) => (
                <p className="text-xs font-mono text-zinc-300 text-right">{user.aum || '$0'}</p>
            )
        },
        {
            header: "",
            key: "actions",
            render: () => (
                <div className="flex justify-end">
                    <button className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-10 space-y-10 bg-zinc-950 min-h-screen border-l border-zinc-900 shadow-2xl">
            <AdminHeader
                title="Institutional Access"
                description="Manage user permissions, subscriptions, and platform security."
                primaryAction={{
                    label: "Provision Seat",
                    onClick: () => console.log("New User")
                }}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Asset Managers", value: users.length.toString(), icon: Users, trend: "+12%" },
                    { label: "Active Pro Seats", value: users.filter(u => u.plan === 'Pro').length.toString(), icon: CreditCard, trend: "+5.4%" },
                    { label: "Security Status", value: "Optimal", icon: ShieldCheck, trend: "0%" },
                    { label: "Telemetry Uptime", value: "99.98%", icon: Activity, trend: "-0.01%" },
                ].map((stat, i) => (
                    <AdminCard key={i} title={stat.label}>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-serif font-medium text-white mt-1">{stat.value}</p>
                                <div className="flex items-center gap-1 mt-2 text-[10px] font-sans font-bold text-emerald-500 uppercase tracking-widest">
                                    <ArrowUpRight className="w-2.5 h-2.5" /> {stat.trend}
                                </div>
                            </div>
                            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-none">
                                <stat.icon className="w-5 h-5 text-zinc-500" />
                            </div>
                        </div>
                    </AdminCard>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or firm..."
                            className="w-full pl-11 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-zinc-700 focus:ring-0 transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-sans font-bold hover:text-white transition-colors">
                            <Filter className="w-3.5 h-3.5" /> Filters
                        </button>
                    </div>
                </div>

                <AdminTable
                    columns={columns}
                    data={filteredUsers}
                    isLoading={loading}
                    emptyMessage="No institutional records detected."
                />
            </div>
        </div>
    );
}

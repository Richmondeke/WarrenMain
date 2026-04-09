"use client";

import { useAuth } from "@/lib/firebase/AuthContext";
import { motion } from "framer-motion";
import { User, Settings as SettingsIcon, Bell, Lock, CreditCard, Shield } from "lucide-react";

export default function SettingsPage() {
    const { user, role } = useAuth();

    return (
        <div className="p-8 max-w-4xl mx-auto font-manrope">
            <header className="mb-12">
                <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight mb-2">Account Settings</h1>
                <p className="text-emerald-700/60 font-medium">Manage your institutional profile and security preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <aside className="space-y-1">
                    {[
                        { name: "Profile", icon: User, active: true },
                        { name: "Subscription", icon: CreditCard, active: false },
                        { name: "Security", icon: Lock, active: false },
                        { name: "Notifications", icon: Bell, active: false },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${item.active
                                    ? "bg-emerald-50 text-emerald-800 shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </button>
                    ))}
                </aside>

                <main className="md:col-span-2 space-y-8">
                    <section className="bg-white/50 backdrop-blur-xl rounded-2xl p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-900 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-900/20">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-emerald-900">{user?.displayName || "Warren User"}</h2>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                                <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                                    <Shield className="w-3 h-3" />
                                    {role?.replace('_', ' ') || 'User'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/50 px-1">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.displayName || ""}
                                        className="w-full bg-gray-50/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/50 px-1">Work Email</label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email || ""}
                                        disabled
                                        className="w-full bg-gray-50/50 border-none rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed"
                                        placeholder="Enter email"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button className="editorial-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/10 hover:opacity-90 transition-opacity">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

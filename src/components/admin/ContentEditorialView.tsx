"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, TrendingUp, Newspaper } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { AdminHeader, AdminTable, AdminCard } from "./AdminShared";

interface EditorialItem {
    id: string;
    title: string;
    author: string;
    status: string;
    category: string;
    pubDate?: any;
    createdAt?: any;
}

export default function ContentEditorialView() {
    const [intel, setIntel] = useState<EditorialItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "intel"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EditorialItem[];
            setIntel(items);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const columns = [
        {
            header: "Content Title",
            key: "title",
            render: (item: EditorialItem) => (
                <div className="max-w-[400px]">
                    <p className="font-serif font-medium text-white truncate leading-tight group-hover:text-zinc-100 transition-colors">
                        {item.title}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-sans">
                        {item.category}
                    </p>
                </div>
            )
        },
        {
            header: "Status",
            key: "status",
            render: (item: EditorialItem) => (
                <span className={`px-2 py-1 text-[10px] font-sans font-bold tracking-widest uppercase border
          ${item.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        item.status === 'Review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'}`}>
                    {item.status}
                </span>
            )
        },
        {
            header: "Authored By",
            key: "author",
            render: (item: EditorialItem) => (
                <p className="text-xs text-zinc-400 font-sans">{item.author}</p>
            )
        },
        {
            header: "Actions",
            key: "actions",
            render: (item: EditorialItem) => (
                <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-10 space-y-10 bg-zinc-950 min-h-screen border-l border-zinc-900 shadow-2xl">
            <AdminHeader
                title="Editorial Command"
                description="Curate high-fidelity intelligence and manage editorial velocity."
                primaryAction={{
                    label: "Dispatch New Intel",
                    onClick: () => console.log("New Intel")
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                            <Newspaper className="w-3 h-3 text-zinc-400" /> Editorial Queue
                        </h2>
                    </div>

                    <AdminTable
                        columns={columns}
                        data={intel}
                        isLoading={loading}
                        emptyMessage="No intelligence feeds found."
                    />
                </div>

                <div className="space-y-10">
                    <AdminCard title="Trending Intel">
                        <div className="space-y-6">
                            {[
                                "Series B Dynamics", "AI Valuations 2024", "African Fintech Trends", "Burn Multiples"
                            ].map((tag, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer border-b border-zinc-900 pb-4 last:border-0 hover:border-zinc-700 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-sans text-zinc-600 font-bold tracking-widest">0{i + 1}</span>
                                        <span className="text-sm font-serif text-zinc-400 group-hover:text-white transition-colors">{tag}</span>
                                    </div>
                                    <TrendingUp className="w-3 h-3 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </AdminCard>

                    <AdminCard title="Taxonomy Control">
                        <div className="flex flex-wrap gap-2 pt-2">
                            {["Fundraising", "Venture Capital", "Africa", "SaaS", "DeepTech", "LP Reports", "Exit Strategies"].map((tag, i) => (
                                <span key={i} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}

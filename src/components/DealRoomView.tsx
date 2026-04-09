"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/firebase/AuthContext";

interface FileItem {
    name: string;
    size: string;
}

interface Folder {
    name: string;
    docs: number;
    updated: string;
    open: boolean;
    files?: FileItem[];
}

const INITIAL_FOLDERS: Folder[] = [
    { name: "Legal & Governance", docs: 12, updated: "2d ago", open: false },
    { name: "Financials & Projections", docs: 8, updated: "4h ago", open: false },
    {
        name: "Product & Tech Roadmap", docs: 15, updated: "15m ago", open: true, files: [
            { name: "Core Architecture Overview.pdf", size: "4.2 MB" },
            { name: "Patent Filing - AI Intelligence Hub.pdf", size: "2.1 MB" },
        ]
    },
    { name: "Team & HR", docs: 4, updated: "1w ago", open: false },
    { name: "Investor Deck & Pitch", docs: 1, updated: "Active Version", open: false },
];

const TOP_VCS = [
    { initials: "SC", name: "Sequoia", sessions: 8, pct: 85 },
    { initials: "BM", name: "Benchmark", sessions: 5, pct: 55 },
    { initials: "A1", name: "a16z", sessions: 3, pct: 35 },
];

const ACTIVITY = [
    { icon: "visibility", actor: "Sequoia Capital", action: "just opened the", target: "Pitch Deck", time: "3 minutes ago • From Menlo Park, CA" },
    { icon: "edit_note", actor: "Benchmark", action: "added a note to", target: "Financial Projections Q3", time: "15 minutes ago • Shared with internal team only" },
    { icon: "download", actor: "a16z (Martin Casado)", action: "downloaded", target: "Core Architecture Overview.pdf", time: "1 hour ago • High Intent Signal" },
    { icon: "person_add", actor: "New Access Granted", action: "to", target: "General Catalyst", time: "3 hours ago • Via Invitation Link" },
];

export function DealRoomView() {
    const { user } = useAuth();
    const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleFolder = (index: number) => {
        setFolders(prev => prev.map((f, i) => i === index ? { ...f, open: !f.open } : f));
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles: FileItem[] = Array.from(files).map(file => ({
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        }));

        // For demo purposes, we'll add the uploaded files to the first folder or create a new "Recently Uploaded" section if we wanted.
        // But here we'll add them to "Product & Tech Roadmap" if it exists, or just the first folder.
        setFolders(prev => {
            const next = [...prev];
            // Find "Product & Tech Roadmap" or default to index 2 (just as in initial state)
            const targetIndex = next.findIndex(f => f.name === "Product & Tech Roadmap");
            if (targetIndex !== -1) {
                next[targetIndex] = {
                    ...next[targetIndex],
                    docs: next[targetIndex].docs + newFiles.length,
                    updated: "Just now",
                    files: [...(next[targetIndex].files || []), ...newFiles],
                    open: true
                };
            }
            return next;
        });

        toast.success(`Successfully uploaded ${files.length} document(s)`);

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="flex-1 min-h-screen bg-surface font-manrope">
            {/* Top Navigation */}
            <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md flex justify-between items-center px-8 py-4 w-full border-b border-gray-100">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h2 className="font-headline text-xl font-bold text-emerald-900 tracking-tight">Series A — Spring 2026</h2>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Confidential Deal Room</span>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <button className="bg-white border border-gray-200 text-on-surface text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            Lock Room
                        </button>
                        <button className="editorial-gradient text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined text-sm">person_add</span>
                            Invite Investor
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        <img alt="VC" className="w-8 h-8 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQhOejX9xBiMTASM6frXcec_3qAjhn1vBuzUzCa9o-fBTsLXfoH6f_fdk1ANHrT1ybbyP_LCWPxsRGgCM_kdlNYfSbcUleCX4ydGVKMhCtg-_J0jNl_k_WROutXmBrBuFBhwZtqC1Zhv7f_iS95lIjN0GEBMIqi2-zDqfzY5PxymPHizu5ugD_oZ2NatF7NAczMzwyEOai_XIQuhg9roHJwK-E0Dqo98kXec46Ck6m3dREzWBoPeZmi0zQxSi5J_IPQ21aTqdX5WnA" />
                        <img alt="VC" className="w-8 h-8 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeWEMk55gmLNQudc37zWYPwpRiunMjqZgTCI2olf2pIPmCKbLdYOYr4CJgPbcG0FeQ3bjDBQr0gMvz0lOa6HJ3d9pUwlEia-udrBfP4GfcMxXmU158h45TF9LXN8QHx-_iV1B2TWa8Mcll75THugit59CXkf73ydI1Na2Pwwl9mUmORyT9EKwBv2-H6ZtwU8iT9FnmCTYhp5_j2ONkZoqEhmgBjjUDZ9wpbgfXsmOE6KWPMYro6bsNfFMzLk4elxFT4ZTwVa8YpyST" />
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">+4</div>
                    </div>
                    <span className="h-4 w-px bg-gray-200 mx-2" />
                    <button className="text-gray-500 hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="text-gray-500 hover:text-primary transition-colors"><span className="material-symbols-outlined">settings</span></button>
                </div>
            </header>

            <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
                {/* Top Bento Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Total Engagement */}
                    <div className="metric-card md:col-span-1 bg-white p-6 rounded-xl border border-gray-100 editorial-shadow flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Engagement</p>
                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+12.4%</span>
                            </div>
                            <h3 className="font-headline text-4xl font-extrabold text-emerald-950 tracking-tighter">1,284</h3>
                            <p className="text-[10px] text-gray-400 font-medium mt-1">Unique investor views this cycle</p>
                        </div>
                        <div className="mt-6 h-16 w-full overflow-hidden">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                <defs>
                                    <linearGradient id="grad-emerald" x1="0%" x2="0%" y1="0%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#0d631b', stopOpacity: 0.2 }} />
                                        <stop offset="100%" style={{ stopColor: '#0d631b', stopOpacity: 0 }} />
                                    </linearGradient>
                                </defs>
                                <path className="sparkline-path" d="M0 38 Q 15 35 25 30 T 45 22 T 65 25 T 85 10 T 100 5" fill="none" stroke="#0d631b" strokeLinecap="round" strokeWidth="2.5" />
                                <path d="M0 38 Q 15 35 25 30 T 45 22 T 65 25 T 85 10 T 100 5 V 40 H 0 Z" fill="url(#grad-emerald)" />
                            </svg>
                        </div>
                    </div>

                    {/* Attention Span */}
                    <div className="metric-card md:col-span-1 bg-white p-6 rounded-xl border border-gray-100 editorial-shadow flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Attention Span</p>
                            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold">-4s vs. avg</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="font-headline text-4xl font-extrabold text-emerald-950 tracking-tighter">42s</h3>
                            <span className="text-xs font-semibold text-gray-400">/ slide</span>
                        </div>
                        <div className="mt-auto pt-6">
                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                <p className="text-[11px] font-medium text-emerald-900 leading-tight">Focus Highlight</p>
                                <p className="text-[10px] text-gray-500 mt-1 leading-normal">Investors are spending 2.4x more time on <span className="font-bold text-emerald-800 underline decoration-emerald-500/30">Financial Projections</span>.</p>
                            </div>
                        </div>
                    </div>

                    {/* Priority Activity */}
                    <div className="metric-card md:col-span-2 bg-white p-6 rounded-xl border border-gray-100 editorial-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Priority Activity</p>
                            <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                                Full List <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {TOP_VCS.map(vc => (
                                <div key={vc.initials} className="flex flex-col gap-3 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-900 text-sm shadow-sm group-hover:bg-emerald-100 transition-colors">{vc.initials}</div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-bold text-emerald-950 truncate">{vc.name}</p>
                                            <p className="text-[9px] font-medium text-emerald-600/80 truncate">{vc.sessions} sessions</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                        <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${vc.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Data Room File Explorer */}
                    <div className="lg:col-span-7 bg-white rounded-xl editorial-shadow overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h4 className="font-headline text-lg font-bold text-emerald-900">Data Room</h4>
                            <div className="flex items-center gap-2">
                                <button className="text-gray-500 hover:text-primary"><span className="material-symbols-outlined text-xl">search</span></button>
                                <button className="text-gray-500 hover:text-primary"><span className="material-symbols-outlined text-xl">filter_list</span></button>
                            </div>
                        </div>
                        <div className="p-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            />
                            {folders.map((folder, i) => (
                                <div key={i}>
                                    <div
                                        onClick={() => toggleFolder(i)}
                                        className={`group flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer ${folder.open ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{folder.open ? 'folder_open' : 'folder'}</span>
                                            <div>
                                                <p className="text-sm font-bold text-on-surface">{folder.name}</p>
                                                <p className="text-[10px] text-gray-400">{folder.docs} documents • Last updated {folder.updated}</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{folder.open ? 'expand_more' : 'chevron_right'}</span>
                                    </div>
                                    {folder.open && folder.files && (
                                        <div className="ml-14 space-y-1 py-2">
                                            {folder.files.map((file, fi) => (
                                                <div key={fi} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-emerald-600 text-lg">description</span>
                                                        <p className="text-xs font-medium text-on-surface">{file.name}</p>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400">{file.size}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50/50 flex justify-center">
                            <button
                                onClick={handleUploadClick}
                                className="flex items-center gap-2 text-xs font-bold text-primary hover:underline transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                                Upload New Documents
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Round Progress */}
                        <div className="bg-white p-6 rounded-xl editorial-shadow">
                            <div className="flex justify-between items-start mb-6">
                                <h4 className="font-headline text-sm font-bold text-emerald-900">Round Progress</h4>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Active</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-on-surface">Target Raise: $12M</span>
                                    <span className="text-gray-500 font-medium">72% Committed</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: '72%' }} />
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Signed Term Sheets</p>
                                        <p className="text-lg font-bold text-emerald-900">2</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Active NDAs</p>
                                        <p className="text-lg font-bold text-emerald-900">14</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Activity Feed */}
                        <div className="bg-white rounded-xl editorial-shadow overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h4 className="font-headline text-sm font-bold text-emerald-900">Live Activity</h4>
                            </div>
                            <div className="p-6 space-y-6">
                                {ACTIVITY.map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start relative">
                                        {i < ACTIVITY.length - 1 && <div className="w-px h-full bg-gray-100 absolute left-4 top-8" />}
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 z-10">
                                            <span className="material-symbols-outlined text-emerald-700 text-sm">{item.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs leading-relaxed"><span className="font-bold text-on-surface">{item.actor}</span> {item.action} <span className="text-emerald-700 font-medium">{item.target}</span></p>
                                            <p className="text-[10px] text-gray-400 mt-1">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-50 text-center">
                                <button className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-primary transition-colors">View All Activity Logs</button>
                            </div>
                        </div>

                        {/* Security Banner */}
                        <div className="bg-emerald-900 p-6 rounded-xl text-white flex items-center gap-4 relative overflow-hidden shadow-lg">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <span className="material-symbols-outlined text-8xl">verified_user</span>
                            </div>
                            <span className="material-symbols-outlined text-emerald-300 text-3xl">verified_user</span>
                            <div>
                                <p className="text-xs font-bold">End-to-End Encryption Active</p>
                                <p className="text-[10px] text-emerald-200/80 leading-relaxed">Your data is secured with AES-256 bank-grade encryption. Access logs are immutable.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

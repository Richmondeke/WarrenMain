"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    LayoutGrid,
    List,
    ChevronRight,
    Settings,
    HelpCircle,
    MessageCircle,
    X,
    Mail,
    Trash2
} from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";
import { useAuth } from "@/lib/firebase/AuthContext";
import { getCRMInvestors, updateCRMStatus, removeFromCRM, CRMInvestor } from "@/lib/firestore";
import { toast } from "sonner";

export function CRMView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [investors, setInvestors] = useState<CRMInvestor[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const columnTitles: CRMInvestor["status"][] = [
        "To be contacted",
        "Reached out",
        "In progress",
        "Committed",
        "Not happening"
    ];

    useEffect(() => {
        if (user) {
            fetchInvestors();
        }
    }, [user]);

    const fetchInvestors = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getCRMInvestors(user.uid);
            setInvestors(data);
        } catch (err) {
            toast.error("Failed to fetch CRM investors");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (investorId: string, newStatus: CRMInvestor["status"]) => {
        if (!user) return;
        try {
            await updateCRMStatus(user.uid, investorId, newStatus);
            setInvestors(prev => prev.map(inv =>
                inv.id === investorId ? { ...inv, status: newStatus } : inv
            ));
            toast.success("Status updated");
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleRemove = async (investorId: string) => {
        if (!user) return;
        try {
            await removeFromCRM(user.uid, investorId);
            setInvestors(prev => prev.filter(inv => inv.id !== investorId));
            toast.success("Removed from CRM");
        } catch (err) {
            toast.error("Failed to remove investor");
        }
    };

    const filteredInvestors = investors.filter(inv =>
        inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getColumnData = (status: string) => {
        return filteredInvestors.filter(inv => inv.status === status);
    };

    return (
        <div className="flex-1 flex flex-col h-screen bg-[#f8f9fa]">
            {/* Header */}
            <header className="bg-white border-b border-border p-4 px-8 flex justify-between items-center sticky top-0 z-20">
                <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Fundraising &gt; CRM</p>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <span className="text-foreground">{investors.length}</span> investors in CRM
                </p>
            </header>

            {/* Actions Bar */}
            <div className="p-8 pb-4 flex justify-between items-center">
                <button className="bg-black text-white px-4 py-2 rounded-lg font-black text-xs flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Plus className="w-3.5 h-3.5" />
                    Add investor
                </button>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search in CRM"
                            className="bg-white border border-border px-9 py-2 rounded-lg text-xs font-bold w-64 outline-none focus:border-primary/30 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-white border border-border rounded-lg overflow-hidden p-1">
                        <button className="p-1 px-2 rounded bg-muted text-foreground"><LayoutGrid className="w-3.5 h-3.5" /></button>
                        <button className="p-1 px-2 rounded text-muted-foreground hover:bg-muted transition-colors"><List className="w-3.5 h-3.5" /></button>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <main className="flex-1 overflow-x-auto p-8 pt-0 flex gap-4 no-scrollbar">
                {columnTitles.map((status, idx) => {
                    const columnInvestors = getColumnData(status);
                    return (
                        <FadeIn key={status} delay={idx * 0.1} className="flex-grow min-w-[320px] max-w-[400px]">
                            <div className="bg-white rounded-xl border border-border h-full flex flex-col group hover:border-border/60 transition-all">
                                <div className="p-5 border-b border-border/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm font-black tracking-tight">{status}</h3>
                                        <p className="text-[10px] font-black text-muted-foreground opacity-50 uppercase tracking-[0.1em]">
                                            {columnInvestors.length} investors
                                        </p>
                                    </div>
                                    <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-20" />
                                </div>

                                <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto no-scrollbar">
                                    {columnInvestors.map((investor) => (
                                        <div
                                            key={investor.id}
                                            className="p-4 bg-white border border-border rounded-xl shadow-sm hover:border-primary/30 hover:shadow-md transition-all group/card relative"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="text-[13px] font-black tracking-tight">{investor.name}</h4>
                                                    <p className="text-[10px] font-bold text-muted-foreground">{investor.type}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(investor.id)}
                                                    className="p-1.5 text-muted-foreground hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                                    {investor.location}
                                                </span>
                                                <span className="text-[10px] font-black text-primary">
                                                    {investor.checks}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-border/50 pt-3">
                                                <div className="flex -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-white flex items-center justify-center text-[10px] font-bold">
                                                        RE
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                                                        <Mail className="w-3.5 h-3.5" />
                                                    </button>
                                                    <select
                                                        className="text-[10px] font-black outline-none bg-transparent cursor-pointer hover:text-primary transition-colors"
                                                        value={status}
                                                        onChange={(e) => handleStatusChange(investor.id, e.target.value as any)}
                                                    >
                                                        {columnTitles.map(t => (
                                                            <option key={t} value={t}>{t}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {columnInvestors.length === 0 && (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-12">
                                            <div className="w-10 h-10 rounded-full border border-dashed border-foreground mb-2 flex items-center justify-center">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase">No investors</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FadeIn>
                    );
                })}
            </main>

            {/* Help Bubble */}
            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-white rounded-full shadow-premium flex items-center justify-center border border-border group hover:scale-110 transition-all">
                    <MessageCircle className="w-6 h-6 text-foreground" />
                </button>
            </div>
        </div>
    );
}

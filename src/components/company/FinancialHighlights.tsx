"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

const mockData = [
    { year: '2020', revenue: 4200, profit: 400 },
    { year: '2021', revenue: 4800, profit: 650 },
    { year: '2022', revenue: 5100, profit: 720 },
    { year: '2023', revenue: 4900, profit: 580 },
    { year: '2024', revenue: 5800, profit: 890 },
];

type FinancialData = {
    revenue?: string;
    netProfit?: string;
    eps?: string;
    debtToEquity?: string;
    dividends?: string;
    cashAndEquivalents?: string;
};

export function FinancialHighlights({ data }: { data?: FinancialData }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Revenue"
                    value={data?.revenue || "N/A"}
                    change="+"
                    isPositive={true}
                />
                <MetricCard
                    title="Net Profit"
                    value={data?.netProfit || "N/A"}
                    change="+"
                    isPositive={true}
                />
                <MetricCard
                    title="EPS"
                    value={data?.eps || "N/A"}
                    change="+"
                    isPositive={true}
                />
                <MetricCard
                    title="Debt-to-Equity"
                    value={data?.debtToEquity || "N/A"}
                    change="Stable"
                    isPositive={true}
                />
                <MetricCard
                    title="Dividend Yield"
                    value={data?.dividends || "N/A"}
                    change="+"
                    isPositive={true}
                />
                <MetricCard
                    title="Cash & Equiv."
                    value={data?.cashAndEquivalents || "N/A"}
                    change="+"
                    isPositive={true}
                />
            </div>

            <div className="bg-card/40 backdrop-blur-md border border-glass-border rounded-3xl p-8 mt-12 shadow-premium">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-8 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    5-Year Financial Strategy
                </h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={mockData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                            <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(11, 19, 43, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (M)" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
                            <Line yAxisId="right" type="monotone" dataKey="profit" name="Net Profit (M)" stroke="hsl(var(--emerald-500))" strokeWidth={4} dot={{ r: 4, fill: 'hsl(var(--emerald-500))', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, change, isPositive }: { title: string, value: string, change: string, isPositive: boolean }) {
    return (
        <div className="bg-card/30 backdrop-blur-sm border border-glass-border rounded-3xl p-6 flex flex-col justify-between hover:bg-card/50 transition-all hover:shadow-premium group">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-4 group-hover:opacity-100 transition-opacity">{title}</div>
            <div className="flex items-end justify-between">
                <div className="text-2xl font-black tracking-tighter text-foreground">{value}</div>
                <div className={`flex items-center text-[10px] font-black uppercase tracking-tighter ${isPositive ? "text-emerald-400" : change === "Stable" ? "text-muted-foreground" : "text-rose-400"}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : change === "Stable" ? null : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {change}
                </div>
            </div>
        </div>
    );
}

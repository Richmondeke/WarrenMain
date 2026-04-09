"use client";

import { HistoricalPrice } from "@/lib/financial-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface PriceChartProps {
    data: HistoricalPrice[];
    ticker: string;
    currency?: string;
}

type Range = "1w" | "1m" | "6m" | "1y" | "5y";

export function PriceChart({ data: initialData, ticker, currency = "USD" }: PriceChartProps) {
    const [range, setRange] = useState<Range>("1y");
    const [chartData, setChartData] = useState<HistoricalPrice[]>(initialData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Skip fetch if it's the initial 1y load since we already have it
        if (range === "1y" && chartData === initialData) return;

        let mounted = true;
        setLoading(true);

        async function fetchNewRange() {
            try {
                const res = await fetch(`/api/historical-data?ticker=${ticker}&range=${range}`);
                if (!res.ok) throw new Error("Failed to fetch range data");
                const json = await res.json();
                if (mounted && json.data) {
                    setChartData(json.data);
                }
            } catch (err) {
                console.error("Error fetching historical data for chart", err);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchNewRange();

        return () => { mounted = false; };
    }, [range, ticker, initialData]);

    if (!chartData || chartData.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-card rounded-xl border border-navy-800">
                <p className="text-muted-foreground text-sm">No historical chart data available for {ticker}</p>
            </div>
        );
    }

    const minPrice = Math.min(...chartData.map(d => d.price));
    const maxPrice = Math.max(...chartData.map(d => d.price));
    const yMin = minPrice * 0.95;
    const yMax = maxPrice * 1.05;

    const firstPrice = chartData[0]?.price || 0;
    const lastPrice = chartData[chartData.length - 1]?.price || 0;
    const isPositive = lastPrice >= firstPrice;

    // Calculate percentage change
    const pctChange = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

    const strokeColor = isPositive ? "#22c55e" : "#ef4444";
    const fillGradient = isPositive ? "colorPositive" : "colorNegative";

    return (
        <div className="w-full mt-6 p-4 md:p-6 bg-card rounded-xl border border-border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Historical Price</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-mono font-bold">{formatCurrency(lastPrice, currency)}</span>
                        <span className={`text-sm font-semibold flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}{formatCurrency(lastPrice - firstPrice, currency)} ({isPositive ? '+' : ''}{pctChange.toFixed(2)}%)
                        </span>
                    </div>
                </div>

                <div className="flex items-center bg-secondary/50 rounded-lg p-1 border border-border">
                    {(["1w", "1m", "6m", "1y", "5y"] as Range[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            disabled={loading && range !== r}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${range === r
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                        >
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-64 md:h-80 relative">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                if (range === "1w" || range === "1m") {
                                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                }
                                if (range === "5y") {
                                    return date.toLocaleDateString("en-US", { year: "numeric" });
                                }
                                return date.toLocaleDateString("en-US", { month: "short" });
                            }}
                            minTickGap={30}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            domain={[yMin, yMax]}
                            tickFormatter={(num) => formatCurrency(num, currency).split('.')[0]} // Skip cents for axis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                            dx={-10}
                        />
                        <Tooltip
                            content={<CustomTooltip currency={currency} />}
                            cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={strokeColor}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#${fillGradient})`}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label, currency }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border p-3 rounded-lg shadow-xl outline-none">
                <p className="text-muted-foreground text-xs mb-1 font-mono">{label}</p>
                <p className="text-foreground font-bold text-lg">
                    {formatCurrency(payload[0].value, currency)}
                </p>
            </div>
        );
    }
    return null;
};

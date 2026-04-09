"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Calendar, Globe, Linkedin, MapPin } from "lucide-react";
import type { CompanyEnrichment } from "@/lib/company-enrichment";

interface EnrichedProfilePanelProps {
    companyName: string;
}

export function EnrichedProfilePanel({ companyName }: EnrichedProfilePanelProps) {
    const [data, setData] = useState<CompanyEnrichment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/enrich/${encodeURIComponent(companyName)}`)
            .then(res => res.ok ? res.json() : null)
            .then(json => setData(json))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [companyName]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-navy-800/50 rounded-lg" />
                ))}
            </div>
        );
    }

    if (!data) return null;

    const stats = [
        data.employees && { icon: Users, label: "Employees", value: data.employees.toLocaleString() },
        data.founded && { icon: Calendar, label: "Founded", value: data.founded.toString() },
        data.headquarters && { icon: MapPin, label: "Headquarters", value: data.headquarters },
        data.industry && { icon: Building2, label: "Industry", value: data.industry },
    ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

    if (stats.length === 0 && !data.website && !data.linkedinUrl) return null;

    return (
        <div className="space-y-4">
            {stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="p-4 bg-navy-800/50 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <Icon className="w-3.5 h-3.5" />
                                <p className="text-xs uppercase tracking-wide">{label}</p>
                            </div>
                            <p className="font-medium text-sm text-white truncate">{value}</p>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-wrap gap-3">
                {data.website && (
                    <a href={data.website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors border border-navy-700 px-3 py-1.5 rounded-md hover:border-gray-500">
                        <Globe className="w-3.5 h-3.5" /> Website
                    </a>
                )}
                {data.linkedinUrl && (
                    <a href={data.linkedinUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition-colors border border-navy-700 px-3 py-1.5 rounded-md hover:border-blue-500">
                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                )}
            </div>
        </div>
    );
}

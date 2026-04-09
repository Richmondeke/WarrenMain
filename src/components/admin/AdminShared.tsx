import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Loader2, Inbox } from 'lucide-react';

interface AdminHeaderProps {
    title: string;
    description: string;
    primaryAction?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, description, primaryAction }) => (
    <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-serif font-medium text-white mb-1 tracking-tight">
                {title}
            </h1>
            <p className="text-sm text-zinc-400 font-sans tracking-wide uppercase text-[10px]">
                {description}
            </p>
        </div>
        {primaryAction && (
            <button
                onClick={primaryAction.onClick}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-none text-xs font-serif hover:bg-white transition-colors"
            >
                {primaryAction.icon || <Plus className="w-3.5 h-3.5" />}
                {primaryAction.label}
            </button>
        )}
    </div>
);

interface AdminTableProps<T> {
    columns: {
        header: string;
        key: keyof T | string;
        render?: (item: T) => React.ReactNode;
    }[];
    data: T[];
    isLoading: boolean;
    emptyMessage?: string;
}

export function AdminTable<T>({ columns, data, isLoading, emptyMessage = "No records found" }: AdminTableProps<T>) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border border-zinc-800 bg-zinc-900/30">
                <Loader2 className="w-6 h-6 text-zinc-600 animate-spin mb-4" />
                <p className="text-xs text-zinc-500 font-sans tracking-widest uppercase">Synchronizing...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border border-zinc-800 bg-zinc-900/30">
                <Inbox className="w-6 h-6 text-zinc-700 mb-4" />
                <p className="text-xs text-zinc-500 font-sans tracking-widest uppercase">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="border border-zinc-800 bg-zinc-900/20 overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-zinc-800">
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4 text-[10px] uppercase tracking-widest text-zinc-500 font-sans font-medium">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {data.map((item, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-zinc-800/20 transition-colors">
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className="px-6 py-4 text-sm text-zinc-300">
                                    {col.render ? col.render(item) : (item[col.key as keyof T] as any)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export const AdminCard: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
    <div className="p-6 border border-zinc-800 bg-zinc-900/30">
        {title && (
            <h3 className="text-xs font-sans tracking-widest uppercase text-zinc-500 mb-4">
                {title}
            </h3>
        )}
        {children}
    </div>
);

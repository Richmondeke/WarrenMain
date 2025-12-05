import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={clsx("flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]", className)}>
      {Icon && (
        <div className="p-4 rounded-full bg-white/5 mb-4 ring-1 ring-white/10">
          <Icon size={32} className="text-slate-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-200 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transform hover:-translate-y-0.5"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
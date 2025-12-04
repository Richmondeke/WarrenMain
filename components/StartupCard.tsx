import React from 'react';
import { Startup, Deal } from '../types';
import { GlassCard } from './GlassCard';
import { MapPin, DollarSign, BarChart2, Star } from 'lucide-react';
import { clsx } from 'clsx';

interface StartupCardProps {
  deal: Deal;
  onToggleShortlist?: (id: string) => void;
}

export const StartupCard: React.FC<StartupCardProps> = ({ deal, onToggleShortlist }) => {
  const { startup } = deal;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(val);
  };

  return (
    <GlassCard hoverEffect className="flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
             {startup.logo_url ? <img src={startup.logo_url} alt="logo" className="w-full h-full object-cover" /> : <div className="text-xl font-bold text-blue-500">{startup.name[0]}</div>}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">{startup.name}</h3>
            <span className="text-xs font-medium text-blue-400 px-2 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20 inline-block mt-1">
              {startup.sector}
            </span>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleShortlist && onToggleShortlist(deal.id);
          }}
          className={clsx(
            "p-2 rounded-full transition-colors",
            deal.is_shortlisted ? "text-yellow-400 bg-yellow-400/10" : "text-slate-600 hover:text-slate-300"
          )}
        >
          <Star size={20} fill={deal.is_shortlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
        {startup.description}
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <DollarSign size={12} /> ASK
          </div>
          <div className="font-semibold text-slate-200">{formatCurrency(startup.ask)}</div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
           <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <BarChart2 size={12} /> VALUATION
          </div>
          <div className="font-semibold text-slate-200">{formatCurrency(startup.valuation)}</div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1">
          <MapPin size={14} /> {startup.location}
        </div>
        {startup.match_score && (
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="font-bold">{startup.match_score}%</span> Match
          </div>
        )}
      </div>
    </GlassCard>
  );
};
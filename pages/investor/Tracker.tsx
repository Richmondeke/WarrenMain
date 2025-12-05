import React, { useEffect, useState } from 'react';
import { Deal, DealStage } from '../../types';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/GlassCard';
import { EmptyState } from '../../components/EmptyState';
import { clsx } from 'clsx';

const COLUMNS = [
  { id: DealStage.SOURCED, label: 'Sourced', color: 'bg-slate-500' },
  { id: DealStage.REVIEWING, label: 'Reviewing', color: 'bg-blue-500' },
  { id: DealStage.DUE_DILIGENCE, label: 'Due Diligence', color: 'bg-indigo-500' },
  { id: DealStage.CLOSED, label: 'Closed', color: 'bg-emerald-500' },
];

export const Tracker: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    dataService.getDeals().then(setDeals);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] overflow-x-auto">
      <div className="flex gap-6 h-full min-w-[1000px] pb-4">
        {COLUMNS.map(col => {
          const colDeals = deals.filter(d => d.stage === col.id);
          return (
            <div key={col.id} className="flex-1 flex flex-col min-w-[280px]">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                  <h3 className="font-semibold text-slate-200">{col.label}</h3>
                </div>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">{colDeals.length}</span>
              </div>

              {/* Drop Zone */}
              <div className="flex-1 bg-white/[0.02] rounded-2xl border border-white/5 p-3 space-y-3 overflow-y-auto">
                {colDeals.length > 0 ? (
                  colDeals.map(deal => (
                    <GlassCard key={deal.id} className="p-4 cursor-grab active:cursor-grabbing hover:border-blue-500/30">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-blue-400 font-medium">{deal.startup.sector}</span>
                        {deal.is_shortlisted && <span className="text-yellow-400 text-xs">★</span>}
                      </div>
                      <h4 className="font-bold text-white mb-1">{deal.startup.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{deal.startup.description}</p>
                      <div className="mt-3 flex justify-between items-center pt-2 border-t border-white/5">
                        <span className="text-xs text-slate-500">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(deal.startup.ask)}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] border border-white/10">
                          {deal.startup.name[0]}
                        </div>
                      </div>
                    </GlassCard>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-slate-600 border border-dashed border-white/5 rounded-xl mt-2">
                    <span className="text-xs font-medium">No deals</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
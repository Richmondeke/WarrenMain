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
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<DealStage | null>(null);

  useEffect(() => {
    dataService.getDeals().then(setDeals);
  }, []);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = 'move';
    // Optional: Set transparent drag image or custom view here if needed
  };

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (activeDropZone !== stage) {
      setActiveDropZone(stage);
    }
  };

  const handleDrop = async (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    setActiveDropZone(null);
    if (!draggedDealId) return;

    const deal = deals.find(d => d.id === draggedDealId);
    if (deal && deal.stage !== stage) {
      // Optimistic update
      const previousDeals = [...deals];
      setDeals(prev => prev.map(d => d.id === draggedDealId ? { ...d, stage } : d));
      
      try {
        await dataService.updateDealStage(draggedDealId, stage);
      } catch (err) {
        console.error("Failed to update deal stage", err);
        // Revert on failure
        setDeals(previousDeals);
      }
    }
    setDraggedDealId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] overflow-x-auto">
      <div className="flex gap-6 h-full min-w-[1000px] pb-4">
        {COLUMNS.map(col => {
          const colDeals = deals.filter(d => d.stage === col.id);
          const isActive = activeDropZone === col.id;

          return (
            <div 
              key={col.id} 
              className="flex-1 flex flex-col min-w-[280px]"
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                  <h3 className="font-semibold text-slate-200">{col.label}</h3>
                </div>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">{colDeals.length}</span>
              </div>

              {/* Drop Zone */}
              <div className={clsx(
                "flex-1 rounded-2xl border p-3 space-y-3 overflow-y-auto transition-all duration-200",
                isActive 
                  ? "bg-white/10 border-blue-500/50 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]" 
                  : "bg-white/[0.02] border-white/5"
              )}>
                {colDeals.length > 0 ? (
                  colDeals.map(deal => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className={clsx(
                        "cursor-grab active:cursor-grabbing transition-opacity",
                        draggedDealId === deal.id && "opacity-40"
                      )}
                    >
                      <GlassCard className="p-4 hover:border-blue-500/30">
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
                    </div>
                  ))
                ) : (
                  <div className={clsx(
                    "flex flex-col items-center justify-center h-32 text-slate-600 border border-dashed border-white/5 rounded-xl mt-2 transition-opacity",
                    isActive ? "opacity-0" : "opacity-100"
                  )}>
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
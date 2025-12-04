import React, { useEffect, useState } from 'react';
import { Deal, DealStage, StartupStage } from '../../types';
import { dataService } from '../../services/dataService';
import { StartupCard } from '../../components/StartupCard';
import { Filter, Search, Layers, Tag, ChevronDown } from 'lucide-react';

export const Dealflow: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterScore, setFilterScore] = useState(0);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  useEffect(() => {
    const loadDeals = async () => {
      const data = await dataService.getDeals();
      setDeals(data);
      setLoading(false);
    };
    loadDeals();
  }, []);

  const handleToggleShortlist = async (id: string) => {
    const deal = deals.find(d => d.id === id);
    if (!deal) return;
    
    // Optimistic update
    setDeals(prev => prev.map(d => d.id === id ? { ...d, is_shortlisted: !d.is_shortlisted } : d));
    await dataService.toggleShortlist(id, deal.is_shortlisted);
  };

  // Extract unique sectors dynamically
  const sectors = Array.from(new Set(deals.map(d => d.startup.sector))).sort();

  const filteredDeals = deals.filter(d => 
    (d.startup.match_score || 0) >= filterScore &&
    (selectedSector === '' || d.startup.sector === selectedSector) &&
    (selectedStage === '' || d.startup.stage === selectedStage) &&
    d.stage !== DealStage.PASSED
  );

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Dealflow Pipeline</h2>
          <p className="text-slate-400">Curated AI matches for your investment thesis.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative group w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search startups..." 
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 w-full md:w-48 transition-all text-slate-200"
            />
          </div>

          {/* Sector Filter */}
          <div className="relative w-full md:w-auto">
             <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
             <select 
               value={selectedSector}
               onChange={(e) => setSelectedSector(e.target.value)}
               className="appearance-none bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-blue-500/50 text-slate-300 w-full md:w-40 cursor-pointer hover:bg-white/10 transition-colors"
             >
                <option value="" className="bg-slate-900 text-slate-200">All Sectors</option>
                {sectors.map(s => (
                  <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
                ))}
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
          </div>

          {/* Stage Filter */}
          <div className="relative w-full md:w-auto">
             <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
             <select 
               value={selectedStage}
               onChange={(e) => setSelectedStage(e.target.value)}
               className="appearance-none bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-blue-500/50 text-slate-300 w-full md:w-40 cursor-pointer hover:bg-white/10 transition-colors"
             >
                <option value="" className="bg-slate-900 text-slate-200">All Stages</option>
                {Object.values(StartupStage).map(s => (
                  <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
                ))}
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
          </div>
          
          {/* Match Score */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-full md:w-auto">
            <Filter size={16} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider whitespace-nowrap">Score &gt; {filterScore}%</span>
            <input 
              type="range" 
              min="0" 
              max="95" 
              step="5"
              value={filterScore} 
              onChange={(e) => setFilterScore(Number(e.target.value))}
              className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDeals.length > 0 ? (
            filteredDeals.map(deal => (
              <StartupCard 
                key={deal.id} 
                deal={deal} 
                onToggleShortlist={handleToggleShortlist} 
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
              <Filter size={48} className="mb-4 opacity-20" />
              <p>No deals match your criteria.</p>
              <button 
                onClick={() => { setFilterScore(0); setSelectedSector(''); setSelectedStage(''); }}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
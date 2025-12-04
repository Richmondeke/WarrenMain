import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { Modal } from '../../components/Modal';
import { Search, MapPin, Briefcase, DollarSign, ExternalLink, Filter, Globe, Layers } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { InvestorDirectoryItem } from '../../types';

export const FindInvestors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDirectoryItem | null>(null);
  const [investors, setInvestors] = useState<InvestorDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvestors = async () => {
      const data = await dataService.getInvestorDirectory();
      setInvestors(data);
      setLoading(false);
    };
    loadInvestors();
  }, []);

  const filteredInvestors = investors.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.thesis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || inv.type === selectedType;
    return matchesSearch && matchesType;
  });

  const investorTypes = Array.from(new Set(investors.map(i => i.type))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-white">Investor Matching</h2>
          <p className="text-slate-400">AI-driven recommendations for your next round.</p>
        </div>
        
        <div className="flex gap-3">
           <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search investors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 w-full md:w-64 transition-all text-slate-200"
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
             <select 
               value={selectedType}
               onChange={(e) => setSelectedType(e.target.value)}
               className="appearance-none bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-8 text-sm focus:outline-none focus:border-blue-500/50 text-slate-300 cursor-pointer hover:bg-white/10 transition-colors"
             >
                <option value="" className="bg-slate-900 text-slate-200">All Types</option>
                {investorTypes.map(t => (
                  <option key={t} value={t} className="bg-slate-900 text-slate-200">{t}</option>
                ))}
             </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestors.map(inv => (
            <GlassCard 
              key={inv.id} 
              hoverEffect 
              className="flex flex-col gap-4 h-full cursor-pointer group"
              onClick={() => setSelectedInvestor(inv)}
            >
               <div className="flex justify-between items-start">
                 <div className="w-12 h-12 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg border border-indigo-500/20">
                   {inv.name[0]}
                 </div>
                 <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                   {inv.match_score || 0}% Match
                 </div>
               </div>
               
               <div>
                 <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-400 transition-colors" title={inv.name}>{inv.name}</h3>
                 <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                   <Briefcase size={14} className="text-blue-400" /> 
                   <span className="truncate">{inv.type}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                   <MapPin size={14} className="text-blue-400" />
                   <span className="truncate">{inv.hq}</span>
                 </div>
               </div>

               <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {inv.thesis}
                  </p>
               </div>

               <div className="flex flex-wrap gap-2">
                 {inv.stages.slice(0, 3).map((stage, i) => (
                   <span key={i} className="text-[10px] uppercase font-semibold px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                     {stage}
                   </span>
                 ))}
                 {inv.stages.length > 3 && <span className="text-[10px] px-2 py-1 text-slate-500">+{inv.stages.length - 3}</span>}
               </div>

               <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto pt-4 border-t border-white/5">
                  <DollarSign size={14} className="text-emerald-500" />
                  <span>Check: <span className="text-slate-200 font-medium">{inv.cheque_range}</span></span>
               </div>

               <div className="flex gap-2 mt-2">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     // Action logic could go here
                   }}
                   className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-900/20"
                 >
                   Request Intro
                 </button>
                 {inv.website && (
                   <a 
                     href={inv.website} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors border border-white/5"
                   >
                     <ExternalLink size={18} />
                   </a>
                 )}
               </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal 
        isOpen={!!selectedInvestor} 
        onClose={() => setSelectedInvestor(null)} 
        title={selectedInvestor?.name}
      >
        {selectedInvestor && (
          <div className="space-y-8">
            {/* Header info */}
            <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <MapPin size={16} className="text-blue-400"/> 
                    {selectedInvestor.hq}
                </div>
                <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <Briefcase size={16} className="text-blue-400"/> 
                    {selectedInvestor.type}
                </div>
                <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <DollarSign size={16} className="text-emerald-400"/> 
                    {selectedInvestor.cheque_range}
                </div>
                {selectedInvestor.website && (
                    <a href={selectedInvestor.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline px-3 py-1.5">
                        <Globe size={16}/> Website
                    </a>
                )}
            </div>
            
            {/* Thesis */}
            <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Investment Thesis</h4>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-lg text-slate-200 leading-relaxed font-light">
                        {selectedInvestor.thesis}
                    </p>
                </div>
            </div>

            {/* Stages */}
            <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers size={16} /> Investment Stages
                </h4>
                <div className="flex flex-wrap gap-3">
                    {selectedInvestor.stages.map(s => (
                        <span key={s} className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 shadow-sm">
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            {/* AI Match Info (Mock) */}
            <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-xl flex gap-4 items-start">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 shrink-0">
                    <div className="text-xl font-bold">{selectedInvestor.match_score}%</div>
                </div>
                <div>
                    <h4 className="text-emerald-400 font-semibold mb-1">High Match Score</h4>
                    <p className="text-sm text-emerald-200/70">
                        This investor has a high likelihood of interest based on your sector alignment, stage fit, and their recent activity.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                <button 
                    onClick={() => setSelectedInvestor(null)}
                    className="px-6 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors font-medium"
                >
                    Close
                </button>
                <button className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5">
                    Request Introduction
                </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
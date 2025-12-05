import React, { useEffect, useState } from 'react';
import { dataService } from '../../services/dataService';
import { Startup } from '../../types';
import { GlassCard } from '../../components/GlassCard';
import { EmptyState } from '../../components/EmptyState';
import { ChevronRight, Database } from 'lucide-react';

export const Directory: React.FC = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getStartups().then((data) => {
      setStartups(data);
      setLoading(false);
    });
  }, []);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Global Startup Directory</h2>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : startups.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-white/5 text-slate-200">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">Startup</th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Valuation</th>
                <th className="px-6 py-4 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {startups.map((startup) => (
                <tr key={startup.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                      {startup.name[0]}
                    </div>
                    {startup.name}
                  </td>
                  <td className="px-6 py-4">{startup.sector}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs">
                      {startup.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(startup.valuation)}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:text-blue-300">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState 
          icon={Database}
          title="Directory is empty"
          description="There are no startups in the directory at the moment."
        />
      )}
    </GlassCard>
  );
};
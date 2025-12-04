import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { GlassCard } from '../../components/GlassCard';

const SECTOR_DATA = [
  { name: 'AI / ML', value: 45, color: '#3b82f6' },
  { name: 'Fintech', value: 25, color: '#6366f1' },
  { name: 'Health', value: 20, color: '#10b981' },
  { name: 'Crypto', value: 10, color: '#f59e0b' },
];

const PERF_DATA = [
  { name: 'Q1', return: 12 },
  { name: 'Q2', return: 19 },
  { name: 'Q3', return: 15 },
  { name: 'Q4', return: 28 },
];

export const Portfolio: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Allocation Chart */}
      <GlassCard className="h-96 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-6">Sector Allocation</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SECTOR_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {SECTOR_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.05)" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {SECTOR_DATA.map(d => (
            <div key={d.name} className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
              {d.name}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Performance Chart */}
      <GlassCard className="h-96 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-6">Portfolio IRR %</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PERF_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip 
                 cursor={{fill: 'rgba(255,255,255,0.05)'}}
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
              />
              <Bar dataKey="return" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
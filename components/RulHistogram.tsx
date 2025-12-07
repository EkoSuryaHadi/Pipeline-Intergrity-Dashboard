import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PipelineSegment } from '../types';
import { binDataForHistogram } from '../utils/dataGenerator';

interface RulHistogramProps {
  data: PipelineSegment[];
}

const RulHistogram: React.FC<RulHistogramProps> = ({ data }) => {
  const chartData = useMemo(() => binDataForHistogram(data, 'Target_RUL_Years', 15), [data]);

  return (
    <div className="h-[450px] w-full p-6 rounded-3xl
        bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl flex flex-col">
      <div className="mb-6 shrink-0">
          <h3 className="text-xl font-bold text-slate-800 mb-1">RUL Distribution</h3>
          <p className="text-sm text-slate-500">Remaining Useful Life by Soil Type</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            stacked
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
            <XAxis 
                dataKey="name" 
                tick={{fontSize: 11, fill: '#64748b'}} 
                interval={1} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
            />
            <YAxis 
                tick={{fontSize: 11, fill: '#64748b'}} 
                axisLine={false}
                tickLine={false}
                label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} 
            />
            <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.3)'}}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 500 }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', opacity: 0.8 }} iconType="circle"/>
            <Bar dataKey="Gravel" stackId="a" fill="#64748b" radius={[0,0,0,0]} />
            <Bar dataKey="Sand" stackId="a" fill="#eab308" radius={[0,0,0,0]} />
            <Bar dataKey="Loam" stackId="a" fill="#22c55e" radius={[0,0,0,0]} />
            <Bar dataKey="Silt" stackId="a" fill="#3b82f6" radius={[0,0,0,0]} />
            <Bar dataKey="Peat" stackId="a" fill="#a855f7" radius={[4,4,0,0]} />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RulHistogram;

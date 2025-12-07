import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { PipelineSegment } from '../types';

interface LinearProfileProps {
  data: PipelineSegment[];
}

const LinearProfile: React.FC<LinearProfileProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => {
      const numA = parseInt(a.Segment_ID.replace('SEG_', ''), 10);
      const numB = parseInt(b.Segment_ID.replace('SEG_', ''), 10);
      return numA - numB;
  });

  const chartData = sortedData.map(d => ({
    ...d,
    RemainingThickness: 100 - d.ILI_Defect_Depth_Percent
  }));

  return (
    <div className="h-[500px] w-full p-6 rounded-3xl mt-6
        bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl flex flex-col">
      <div className="flex justify-between items-start mb-6 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Virtual River Bottom Profile</h3>
            <p className="text-sm text-slate-500 mt-1">Linear variability of remaining wall thickness</p>
          </div>
          <div className="px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-bold border border-red-500/20">
              Critical Zone &lt; 20%
          </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
            <XAxis 
                dataKey="Segment_ID" 
                label={{ value: 'Segment ID', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 12 }} 
                interval={Math.floor(data.length / 10)} 
                tick={{fontSize: 10, fill: '#64748b'}}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
                label={{ value: '% Wall Thickness', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} 
                domain={[0, 100]}
                tick={{fontSize: 11, fill: '#64748b'}}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip 
                content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                    const val = payload[0].value as number;
                    return (
                        <div className="bg-white/90 backdrop-blur-md p-3 border border-white/50 shadow-xl rounded-xl text-xs">
                        <p className="font-bold text-slate-700 mb-1">Seg: {label}</p>
                        <p className={val < 20 ? "text-red-600 font-bold text-sm" : "text-slate-600 font-medium"}>
                            Remaining: {val.toFixed(1)}%
                        </p>
                        </div>
                    );
                    }
                    return null;
                }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="plainline"/>
            
            <ReferenceArea y1={0} y2={20} fill="#ef4444" fillOpacity={0.1} />
            
            <Line 
                type="monotone" 
                dataKey="RemainingThickness" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false} 
                name="Remaining Wall Thickness (%)"
                activeDot={{ r: 6, fill: '#2563eb', strokeWidth: 0 }}
            />
            </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LinearProfile;

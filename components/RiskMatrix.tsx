import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { PipelineSegment } from '../types';

interface RiskMatrixProps {
  data: PipelineSegment[];
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ data }) => {
  const COLORS = {
    'Immediate Repair': '#ef4444', 
    'Scheduled Repair': '#f97316', 
    'Monitored': '#eab308', 
    'Normal': '#22c55e', 
  };

  return (
    <div className="h-[450px] w-full p-6 rounded-3xl
        bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl flex flex-col">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
            <h3 className="text-xl font-bold text-slate-800">Integrity Risk Matrix</h3>
            <p className="text-sm text-slate-500 mt-1">Pressure vs. Defect Depth Distribution</p>
        </div>
        <div className="flex gap-2 text-[10px] font-medium bg-white/40 p-2 rounded-lg border border-white/30 backdrop-blur-md">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Immediate</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Scheduled</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
            <XAxis 
                type="number" 
                dataKey="Avg_Pressure_psi" 
                name="Pressure" 
                unit=" psi" 
                tick={{fontSize: 12, fill: '#64748b'}}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                label={{ value: 'Pressure (psi)', position: 'insideBottomRight', offset: -10, fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
                type="number" 
                dataKey="ILI_Defect_Depth_Percent" 
                name="Depth" 
                unit="%" 
                tick={{fontSize: 12, fill: '#64748b'}}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                label={{ value: 'Defect Depth (%)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                    <div className="bg-white/90 backdrop-blur-md p-4 border border-white/50 shadow-xl rounded-xl text-xs">
                        <p className="font-bold text-slate-800 mb-2 text-sm">Segment #{data.Segment_ID}</p>
                        <div className="space-y-1 text-slate-600">
                            <p>Pressure: <span className="font-semibold">{data.Avg_Pressure_psi} psi</span></p>
                            <p>Depth: <span className="font-semibold">{data.ILI_Defect_Depth_Percent.toFixed(1)}%</span></p>
                            <p>Status: <span className="font-bold" style={{ color: COLORS[data.Target_Repair_Class as keyof typeof COLORS] }}>{data.Target_Repair_Class}</span></p>
                        </div>
                    </div>
                    );
                }
                return null;
                }}
            />
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Critical Limit (80%)", position: "insideTopRight", fill: "#ef4444", fontSize: 11, fontWeight: 600 }} />
            <Scatter name="Segments" data={data}>
                {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.Target_Repair_Class] || '#cbd5e1'} 
                    stroke={entry.Target_Repair_Class === 'Immediate Repair' ? "#b91c1c" : "none"}
                    strokeWidth={entry.Target_Repair_Class === 'Immediate Repair' ? 2 : 0}
                />
                ))}
            </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskMatrix;

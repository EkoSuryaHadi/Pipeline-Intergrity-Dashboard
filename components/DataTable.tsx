import React from 'react';
import { PipelineSegment } from '../types';
import { AlertTriangle, Droplets, Clock } from 'lucide-react';

interface DataTableProps {
  data: PipelineSegment[];
  criticalRul: number;
  highCorrosion: number;
}

const DataTable: React.FC<DataTableProps> = ({ data, criticalRul, highCorrosion }) => {
  return (
    <div className="w-full overflow-hidden rounded-3xl mt-8
        bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl">
      <div className="bg-white/30 px-8 py-5 border-b border-white/20 flex justify-between items-center backdrop-blur-sm">
        <h3 className="text-lg font-bold text-slate-800">Raw Data View</h3>
        <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/10">
                 <Clock className="w-3.5 h-3.5 text-red-600" />
                 <span className="text-red-700">Low RUL (&lt;{criticalRul}y)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/10">
                 <Droplets className="w-3.5 h-3.5 text-orange-600" />
                 <span className="text-orange-700">High Corrosion (&gt;{highCorrosion})</span>
            </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-white/20 border-b border-white/10">
                <tr>
                    <th className="px-8 py-4">ID</th>
                    <th className="px-6 py-4">Soil Type</th>
                    <th className="px-6 py-4">RUL (Yrs)</th>
                    <th className="px-6 py-4">Pressure (psi)</th>
                    <th className="px-6 py-4">Defect Depth (%)</th>
                    <th className="px-6 py-4">Class</th>
                    <th className="px-6 py-4">Corrosion (in/yr)</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
                {data.slice(0, 50).map((row) => {
                    const isCriticalRul = row.Target_RUL_Years < criticalRul;
                    const isHighCorrosion = row.Corrosion_Rate_in_yr > highCorrosion;
                    const isAlert = isCriticalRul || isHighCorrosion;

                    return (
                        <tr key={row.Segment_ID} className={`transition-colors duration-200 ${isAlert ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-white/30'}`}>
                            <td className="px-8 py-4 font-bold text-slate-800 flex items-center gap-2">
                                {isAlert && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                {row.Segment_ID}
                            </td>
                            <td className="px-6 py-4 font-medium">{row.Soil_Type}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold ${isCriticalRul ? 'text-red-600' : 'text-slate-700'}`}>
                                        {row.Target_RUL_Years.toFixed(1)}
                                    </span>
                                    {isCriticalRul && <Clock className="w-3.5 h-3.5 text-red-500" />}
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium">{row.Avg_Pressure_psi}</td>
                            <td className="px-6 py-4 font-medium">{row.ILI_Defect_Depth_Percent.toFixed(1)}%</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm
                                    ${row.Target_Repair_Class === 'Immediate Repair' ? 'bg-red-100/80 text-red-800 border-red-200' : 
                                      row.Target_Repair_Class === 'Scheduled Repair' ? 'bg-orange-100/80 text-orange-800 border-orange-200' : 
                                      'bg-emerald-100/80 text-emerald-800 border-emerald-200'}`}>
                                    {row.Target_Repair_Class}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className={`font-medium ${isHighCorrosion ? 'text-orange-700 font-bold' : ''}`}>
                                        {row.Corrosion_Rate_in_yr.toFixed(4)}
                                    </span>
                                    {isHighCorrosion && <Droplets className="w-3.5 h-3.5 text-orange-500" />}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
      <div className="bg-white/30 px-8 py-4 border-t border-white/20 text-xs text-slate-500 font-medium flex justify-between items-center backdrop-blur-sm">
        <span>Showing first 50 rows of {data.length} total segments</span>
        <button className="text-blue-600 hover:text-blue-800 transition-colors font-bold uppercase tracking-wider">View Full Database</button>
      </div>
    </div>
  );
};

export default DataTable;

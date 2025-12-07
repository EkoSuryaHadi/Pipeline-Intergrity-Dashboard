import React, { useState, useMemo } from 'react';
import { Calculator, AlertTriangle, CheckCircle, AlertOctagon, Info, ArrowRight } from 'lucide-react';
import { PredictionInput, PipelineSegment } from '../types';

interface AiCalculatorProps {
    data: PipelineSegment[];
}

const AiCalculator: React.FC<AiCalculatorProps> = ({ data }) => {
  const [inputs, setInputs] = useState<PredictionInput>({
    pressure: 800,
    defectDepth: 10,
    soilResistivity: 5000,
    cpPotential: -950,
    cycles: 100,
    defectLength: 2.0
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [neighbors, setNeighbors] = useState<PipelineSegment[]>([]);

  // Calculate stats for normalization
  const stats = useMemo(() => {
    if (!data.length) return null;
    const calcStats = (key: keyof PipelineSegment) => {
        const vals = data.map(d => d[key] as number);
        return { min: Math.min(...vals), max: Math.max(...vals) };
    };
    return {
        pressure: calcStats('Avg_Pressure_psi'),
        depth: calcStats('ILI_Defect_Depth_Percent'),
        res: calcStats('Soil_Resistivity_ohm_cm'),
        cp: calcStats('CP_Potential_mV'),
        cycles: calcStats('Rainflow_Cycles_High'),
        len: calcStats('ILI_Defect_Length_in'),
    };
  }, [data]);

  const handleInputChange = (field: keyof PredictionInput, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateRul = () => {
    if (!data.length || !stats) {
        alert("No data available for model execution.");
        return;
    }

    // KNN Regression Logic
    const normalize = (val: number, range: {min: number, max: number}) => 
        (val - range.min) / (range.max - range.min || 1);

    const normInput = {
        pressure: normalize(inputs.pressure, stats.pressure),
        depth: normalize(inputs.defectDepth, stats.depth),
        res: normalize(inputs.soilResistivity, stats.res),
        cp: normalize(inputs.cpPotential, stats.cp),
        cycles: normalize(inputs.cycles, stats.cycles),
        len: normalize(inputs.defectLength, stats.len),
    };

    const distances = data.map(segment => {
        const dPressure = normalize(segment.Avg_Pressure_psi, stats.pressure) - normInput.pressure;
        const dDepth = normalize(segment.ILI_Defect_Depth_Percent, stats.depth) - normInput.depth;
        const dRes = normalize(segment.Soil_Resistivity_ohm_cm, stats.res) - normInput.res;
        const dCp = normalize(segment.CP_Potential_mV, stats.cp) - normInput.cp;
        const dCycles = normalize(segment.Rainflow_Cycles_High, stats.cycles) - normInput.cycles;
        const dLen = normalize(segment.ILI_Defect_Length_in, stats.len) - normInput.len;

        const distance = Math.sqrt(
            dPressure**2 + 
            (dDepth * 1.5)**2 + 
            dRes**2 + 
            dCp**2 + 
            dCycles**2 + 
            dLen**2
        );
        return { segment, distance };
    });

    const k = 10;
    distances.sort((a, b) => a.distance - b.distance);
    const topK = distances.slice(0, k).map(d => d.segment);

    const avgRul = topK.reduce((sum, item) => sum + item.Target_RUL_Years, 0) / k;

    setNeighbors(topK);
    setPrediction(avgRul);
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl
        bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="w-14 h-14 flex items-center justify-center bg-purple-500/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm shadow-sm">
            <Calculator className="w-8 h-8 text-purple-600" />
        </div>
        <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800">AI RUL Predictor</h3>
            <p className="text-sm text-slate-500 font-medium">KNN Inference Engine • {data.length} Historical Datapoints</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {[
            { label: 'Operating Pressure (psi)', key: 'pressure', type: 'number' },
            { label: 'Soil Resistivity (ohm-cm)', key: 'soilResistivity', type: 'number' },
            { label: 'CP Potential (mV)', key: 'cpPotential', type: 'number' },
            { label: 'Fatigue Cycles (High)', key: 'cycles', type: 'number' },
            { label: 'Defect Length (in)', key: 'defectLength', type: 'number' },
        ].map((field) => (
             <div key={field.key} className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">{field.label}</label>
                <input 
                    type="number"
                    value={inputs[field.key as keyof PredictionInput]}
                    onChange={e => handleInputChange(field.key as keyof PredictionInput, Number(e.target.value))}
                    className="w-full rounded-xl bg-white/50 border border-slate-200 p-3 text-slate-800 font-medium
                    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all outline-none"
                />
            </div>
        ))}
        
        {/* Slider Input */}
        <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ILI Defect Depth (%)</label>
            <div className="bg-white/50 rounded-xl border border-slate-200 p-3 px-4 flex items-center gap-4">
                 <input 
                    type="range" 
                    min="0" max="100"
                    value={inputs.defectDepth}
                    onChange={e => handleInputChange('defectDepth', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-bold text-slate-700 min-w-[3ch]">{inputs.defectDepth}%</span>
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 border-t border-slate-200/50 pt-8">
        <button 
            onClick={calculateRul}
            className="w-full lg:w-64 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
            <span>Run Prediction</span>
            <ArrowRight className="w-5 h-5" />
        </button>

        {prediction !== null && (
            <div className="flex-1 w-full bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-6 flex flex-col gap-6 animate-fade-in shadow-inner">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Predicted RUL</p>
                        <p className="text-4xl font-bold text-slate-800 tracking-tight">{prediction.toFixed(2)} <span className="text-lg font-medium text-slate-500">Years</span></p>
                    </div>
                    
                    <div className={`w-full sm:w-auto px-5 py-3 rounded-xl flex items-center gap-3 font-bold border backdrop-blur-md shadow-sm
                        ${prediction < 1 
                            ? 'bg-red-500/10 text-red-700 border-red-500/20' 
                            : prediction < 5 
                            ? 'bg-orange-500/10 text-orange-700 border-orange-500/20' 
                            : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'}`
                    }>
                        {prediction < 1 ? <AlertOctagon className="w-6 h-6 flex-shrink-0"/> : 
                        prediction < 5 ? <AlertTriangle className="w-6 h-6 flex-shrink-0"/> : 
                        <CheckCircle className="w-6 h-6 flex-shrink-0"/>}
                        
                        <span>
                            {prediction < 1 ? 'Critical Failure Risk' : 
                            prediction < 5 ? 'Schedule Maintenance' : 
                            'Normal Operation'}
                        </span>
                    </div>
                </div>

                {/* Explainability Section */}
                <div className="pt-4 border-t border-slate-200/50">
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mb-3 uppercase tracking-wider">
                        <Info className="w-3 h-3" /> Similar Historical Cases
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {neighbors.map(n => (
                            <div key={n.Segment_ID} className="min-w-[140px] p-3 bg-white/60 border border-white/50 rounded-xl text-xs shadow-sm hover:shadow-md transition-shadow">
                                <div className="font-bold text-slate-800 mb-1">{n.Segment_ID}</div>
                                <div className="text-slate-500 flex justify-between"><span>RUL:</span> <span className="font-semibold text-slate-700">{n.Target_RUL_Years.toFixed(1)}</span></div>
                                <div className="text-slate-500 flex justify-between"><span>Depth:</span> <span className="font-semibold text-slate-700">{n.ILI_Defect_Depth_Percent}%</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AiCalculator;

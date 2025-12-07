'use client';

import React, { useState } from 'react';
import { usePipelineData } from '../context/FilterContext';
import KpiCard from '../components/KpiCard';
import RiskMatrix from '../components/RiskMatrix';
import RulHistogram from '../components/RulHistogram';
import LinearProfile from '../components/LinearProfile';
import AiCalculator from '../components/AiCalculator';
import DataTable from '../components/DataTable';
import { AlertTriangle, Clock, Activity, Droplets, AlertOctagon } from 'lucide-react';

const CRITICAL_RUL_THRESHOLD = 5; // Years
const HIGH_CORROSION_THRESHOLD = 0.015; // in/yr

export default function DashboardPage() {
  const { filteredData, allData } = usePipelineData();
  const [activeTab, setActiveTab] = useState<'visuals' | 'profile' | 'calculator'>('visuals');

  // KPI Calculations
  const totalSegments = filteredData.length;
  const avgRul = totalSegments > 0 ? filteredData.reduce((acc, curr) => acc + curr.Target_RUL_Years, 0) / totalSegments : 0;
  const criticalCount = filteredData.filter(d => d.Target_Repair_Class === 'Immediate Repair').length;
  const avgCorrosion = totalSegments > 0 ? filteredData.reduce((acc, curr) => acc + curr.Corrosion_Rate_in_yr, 0) / totalSegments : 0;
  
  const alertsCount = filteredData.filter(d => 
    d.Target_RUL_Years < CRITICAL_RUL_THRESHOLD || 
    d.Corrosion_Rate_in_yr > HIGH_CORROSION_THRESHOLD
  ).length;

  return (
    <>
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <KpiCard 
                title="System Alerts" 
                value={alertsCount} 
                subValue={alertsCount > 0 ? "Action Required" : "All Clear"}
                icon={<AlertOctagon className="w-6 h-6 text-red-600"/>}
                color={alertsCount > 0 ? "red" : "green"}
            />
            <KpiCard 
                title="Avg RUL (Years)" 
                value={avgRul.toFixed(1)} 
                subValue={avgRul < 10 ? "Critical Trend" : "Stable"}
                icon={<Clock className="w-6 h-6 text-blue-600"/>}
                color={avgRul < 10 ? 'red' : 'blue'}
            />
            <KpiCard 
                title="Immediate Repair" 
                value={criticalCount}
                subValue={`${((criticalCount/totalSegments)*100 || 0).toFixed(1)}% of total`}
                icon={<AlertTriangle className="w-6 h-6 text-orange-600"/>}
                color="red"
            />
             <KpiCard 
                title="Avg Corrosion Rate" 
                value={`${avgCorrosion.toFixed(4)}`}
                subValue="in/yr"
                icon={<Droplets className="w-6 h-6 text-yellow-600"/>}
                color="yellow"
            />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-slate-200/20 overflow-x-auto">
            <nav className="flex space-x-8 min-w-max px-1">
                <button 
                    onClick={() => setActiveTab('visuals')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'visuals' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    Risk Analytics
                </button>
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'profile' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    Linear Profile
                </button>
                <button 
                    onClick={() => setActiveTab('calculator')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'calculator' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    AI Calculator
                </button>
            </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
            {activeTab === 'visuals' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <RiskMatrix data={filteredData} />
                    <RulHistogram data={filteredData} />
                </div>
            )}
            
            {activeTab === 'profile' && (
                <LinearProfile data={filteredData} />
            )}
            
            {activeTab === 'calculator' && (
                <AiCalculator data={allData} />
            )}
        </div>

        <DataTable 
            data={filteredData} 
            criticalRul={CRITICAL_RUL_THRESHOLD} 
            highCorrosion={HIGH_CORROSION_THRESHOLD}
        />
    </>
  );
}

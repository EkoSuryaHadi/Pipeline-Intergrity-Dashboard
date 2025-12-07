'use client'; // Next.js Client Component directive

import React, { useState } from 'react';
import { SoilType } from '../types';
import { Settings, Filter, Activity, Layers, Menu, X } from 'lucide-react';
import { usePipelineData } from '../context/FilterContext';

const Sidebar: React.FC = () => {
  const { filters, setFilters, uniqueSoilTypes, filteredData } = usePipelineData();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSoilChange = (soil: SoilType) => {
    setFilters(prev => {
      const isSelected = prev.selectedSoilTypes.includes(soil);
      if (isSelected) {
        return { ...prev, selectedSoilTypes: prev.selectedSoilTypes.filter(s => s !== soil) };
      } else {
        return { ...prev, selectedSoilTypes: [...prev.selectedSoilTypes, soil] };
      }
    });
  };

  const handleSelectAll = () => {
    if (filters.selectedSoilTypes.length === uniqueSoilTypes.length) {
      setFilters(prev => ({ ...prev, selectedSoilTypes: [] }));
    } else {
      setFilters(prev => ({ ...prev, selectedSoilTypes: [...uniqueSoilTypes] }));
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900/90 text-white border border-white/20 shadow-lg backdrop-blur-md md:hidden hover:bg-slate-800 transition-colors"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-screen w-72 flex flex-col z-40
        bg-slate-900/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl text-white overflow-hidden
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-white/10 mt-14 md:mt-0">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg shadow-blue-500/30">
             <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight">Integrity<span className="text-blue-400">Pro</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">AI Control Center</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* New KPI Section in Sidebar */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md shadow-inner">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 bg-blue-500/20 rounded-lg">
                      <Layers className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold uppercase text-blue-200 tracking-wider">Active Segments</span>
              </div>
              <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white tracking-tight">{filteredData.length}</span>
                  <span className="text-sm text-slate-400 mb-1">items</span>
              </div>
          </div>

          {/* Filters Section */}
          <div>
              <h2 className="text-xs uppercase text-slate-400 font-bold tracking-widest mb-4 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Smart Filters
              </h2>
              
              <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-slate-200">Soil Type</label>
                      <button 
                          onClick={handleSelectAll}
                          className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
                      >
                          {filters.selectedSoilTypes.length === uniqueSoilTypes.length ? 'Clear' : 'All'}
                      </button>
                  </div>
                  
                  <div className="space-y-2">
                      {uniqueSoilTypes.map(soil => (
                          <label key={soil} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-all">
                              <div className="relative flex items-center">
                                  <input 
                                      type="checkbox" 
                                      checked={filters.selectedSoilTypes.includes(soil)}
                                      onChange={() => handleSoilChange(soil)}
                                      className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-500 bg-slate-800 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400"
                                  />
                                  <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                              </div>
                              <span className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">{soil}</span>
                          </label>
                      ))}
                  </div>
              </div>

              <div className="mb-6">
                  <div className="flex justify-between items-end mb-3">
                      <label className="text-sm font-medium text-slate-200">Max RUL Limit</label>
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{filters.maxRul} yrs</span>
                  </div>
                  <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={filters.maxRul}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxRul: Number(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium">
                      <span>Critical (0)</span>
                      <span>Stable (50)</span>
                  </div>
              </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Settings className="w-3.5 h-3.5" />
              <span>System v2.4.0</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 pl-6">Glassmorphism UI</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

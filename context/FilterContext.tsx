import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { getPipelineData } from '../utils/dataGenerator';
import { PipelineSegment, FilterState, SoilType } from '../types';

// Define Context Type
interface FilterContextType {
    allData: PipelineSegment[];
    filteredData: PipelineSegment[];
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    uniqueSoilTypes: SoilType[];
    loading: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Simulate data loading
    const allData = useMemo(() => getPipelineData(), []);
    
    // Derived state for unique values
    const uniqueSoilTypes = useMemo(() => {
        const types = new Set(allData.map(d => d.Soil_Type));
        return Array.from(types).sort();
    }, [allData]);
    
    // Filter State
    const [filters, setFilters] = useState<FilterState>({
        selectedSoilTypes: [], // Initial empty, will be populated in effect or default
        maxRul: 50
    });

    // Initialize filters once data is ready (if needed)
    useMemo(() => {
        if (filters.selectedSoilTypes.length === 0 && uniqueSoilTypes.length > 0) {
             setFilters(prev => ({ ...prev, selectedSoilTypes: uniqueSoilTypes }));
        }
    }, [uniqueSoilTypes]);

    // Filtering Logic
    const filteredData = useMemo(() => {
        return allData.filter(item => 
            filters.selectedSoilTypes.includes(item.Soil_Type) &&
            item.Target_RUL_Years <= filters.maxRul
        );
    }, [allData, filters]);

    return (
        <FilterContext.Provider value={{ 
            allData, 
            filteredData, 
            filters, 
            setFilters, 
            uniqueSoilTypes,
            loading: false
        }}>
            {children}
        </FilterContext.Provider>
    );
};

// Custom Hook
export const usePipelineData = () => {
    const context = useContext(FilterContext);
    if (!context) throw new Error("usePipelineData must be used within a FilterProvider");
    return context;
};

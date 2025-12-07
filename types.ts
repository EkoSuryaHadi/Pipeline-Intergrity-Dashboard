export type SoilType = 'Gravel' | 'Loam' | 'Peat' | 'Sand' | 'Silt' | 'Clay';

export type RepairClass = 'Immediate Repair' | 'Scheduled Repair' | 'Monitored' | 'Normal';

export interface PipelineSegment {
  Segment_ID: string;
  Installation_Year?: number;
  Material_Grade?: string;
  Diameter_in?: number;
  Yield_Strength_psi?: number;
  Soil_Type: SoilType;
  Target_RUL_Years: number;
  Avg_Pressure_psi: number;
  ILI_Defect_Depth_Percent: number;
  ILI_Defect_Length_in: number;
  Target_Repair_Class: RepairClass;
  Corrosion_Rate_in_yr: number;
  Wall_Thickness_in: number;
  CP_Potential_mV: number;
  Rainflow_Cycles_High: number;
  Soil_Resistivity_ohm_cm: number;
}

export interface FilterState {
  selectedSoilTypes: SoilType[];
  maxRul: number;
}

export interface PredictionInput {
  pressure: number;
  defectDepth: number;
  soilResistivity: number;
  cpPotential: number;
  cycles: number;
  defectLength: number;
}
import { PipelineSegment, RepairClass, SoilType } from '../types';

// Parsing logic for the CSV data
// In a real application, this string would be loaded from an external file
const CSV_DATA = `Segment_ID,Installation_Year,Material_Grade,Diameter_in,Wall_Thickness_in,Yield_Strength_psi,Soil_Type,Soil_Resistivity_ohm_cm,CP_Potential_mV,Avg_Pressure_psi,Rainflow_Cycles_High,ILI_Defect_Depth_Percent,ILI_Defect_Length_in,Calc_Corrosion_Rate_in_yr,Target_RUL_Years,Target_Repair_Class
SEG_00000,2004,X52,4,0.2,52000,Loam,8474.1,-762.1,676.6,380,95,4.03,0.0161000,0,Immediate Repair
SEG_00001,1998,X60,1,0.2,60000,Clay,1126.6,-973,731.1,572,66.33,9.44,0.0051000,5.36,Scheduled Repair
SEG_00002,2010,X60,2,0.2,60000,Sand,11298,-845.2,999.1,252,90.62,2.97,0.0129000,0,Immediate Repair
SEG_00003,1995,X52,5,0.2,52000,Clay,592.4,-782.7,910.5,928,95,5.09,0.0579000,0,Immediate Repair
SEG_00004,2006,X52,2,0.2,52000,Sand,14193.6,-1066.4,756.5,378,41.75,9.05,0.0046000,16.63,Monitored
SEG_00005,2006,X52,5,0.2,52000,Silt,3761,-891.5,818.2,432,41.79,9.78,0.0046000,16.61,Monitored
SEG_00006,1993,X70,3,0.2,70000,Clay,781.5,-980.2,857.2,713,95,7.18,0.0129000,0,Immediate Repair
SEG_00007,1997,X60,1,0.2,60000,Clay,1137.4,-1049.8,1028.6,486,95,4.09,0.0074000,0,Immediate Repair
SEG_00008,1990,X70,2,0.2,70000,Clay,814.8,-843.9,766.6,952,95,7.44,0.0512000,0,Immediate Repair
SEG_00009,1998,X70,1,0.2,70000,Silt,4277.5,-925.8,744.6,494,82.83,3.44,0.0064000,0,Immediate Repair
SEG_00010,1992,X70,5,0.2,70000,Clay,1082.5,-890.8,629.8,640,89.37,3.5,0.0056000,0,Immediate Repair
SEG_00011,1999,X60,1,0.2,60000,Clay,1256,-967.9,1129.6,475,49.39,6.94,0.0040000,15.31,Monitored
SEG_00012,2002,X60,5,0.2,60000,Loam,7116.7,-970.6,646,638,69.42,4.54,0.0063000,3.36,Scheduled Repair
SEG_00013,1990,X60,5,0.2,60000,Silt,6374.7,-771.9,1191,612,95,6.62,0.0111000,0,Immediate Repair
SEG_00014,1999,X60,3,0.2,60000,Silt,8546.1,-1018.4,1027.3,625,54.23,9.76,0.0043000,11.99,Scheduled Repair
SEG_00015,2003,X70,1,0.2,70000,Peat,3830.6,-956.5,662,420,45.08,7.68,0.0043000,16.24,Monitored
SEG_00016,1990,X70,4,0.2,70000,Loam,4541.9,-978.5,618.3,714,68.05,8.23,0.0040000,5.98,Scheduled Repair
SEG_00017,2004,X70,2,0.2,70000,Sand,20332.6,-1184.9,1178.1,420,28.32,6.46,0.0028000,36.91,Monitored
SEG_00018,2006,X70,5,0.2,70000,Loam,6420,-970,799.8,396,34.81,5.64,0.0039000,23.17,Monitored
SEG_00019,2004,X52,1,0.2,52000,Clay,951.6,-1054.5,1189.7,340,95,7.93,0.0138000,0,Immediate Repair
SEG_00020,2011,X70,4,0.2,70000,Loam,9811.4,-935.4,1123.8,130,24.95,10.62,0.0038000,28.97,Monitored
SEG_00021,1992,X60,5,0.2,60000,Clay,823.1,-887.2,676.5,704,81.33,11.49,0.0051000,0,Immediate Repair
SEG_00022,2002,X60,2,0.2,60000,Clay,1365.3,-961.4,952.5,396,35.51,11.15,0.0032000,27.81,Monitored
SEG_00023,2000,X52,5,0.2,52000,Loam,5295.7,-956.1,635.4,432,61.64,8.12,0.0051000,7.2,Scheduled Repair
SEG_00024,1991,X70,3,0.2,70000,Loam,2100,-859.3,767.9,792,73.51,5.56,0.0045000,2.88,Scheduled Repair
SEG_00025,1998,X70,1,0.2,70000,Clay,1285,-889.3,622.6,442,59.17,8.66,0.0046000,9.06,Scheduled Repair
SEG_00026,1993,X70,2,0.2,70000,Clay,577.4,-1119.5,885,527,95,5.97,0.0126000,0,Immediate Repair
SEG_00027,1995,X52,5,0.2,52000,Loam,8785.9,-889.1,669.9,522,73.15,6.08,0.0050000,2.74,Scheduled Repair
SEG_00028,1997,X52,3,0.2,52000,Peat,2246.1,-800.2,688.5,540,95,2.81,0.0083000,0,Immediate Repair
SEG_00029,1993,X70,5,0.2,70000,Clay,1120.8,-1009.1,1182.2,558,72.48,28.68,0.0047000,3.2,Scheduled Repair
SEG_00030,2011,X60,5,0.2,60000,Loam,2385,-1118.8,1150.9,156,29.82,10.41,0.0046000,21.82,Monitored
SEG_00031,1996,X70,1,0.2,70000,Clay,583.8,-857.2,956.3,504,95,8.39,0.0132000,0,Immediate Repair
SEG_00032,2014,X52,4,0.2,52000,Clay,617.7,-932.8,998.9,170,62.08,4.31,0.0124000,2.89,Scheduled Repair
SEG_00033,2000,X60,2,0.2,60000,Peat,4432.8,-876.6,659,432,66.01,3.45,0.0055000,5.09,Scheduled Repair
SEG_00034,2008,X60,1,0.2,60000,Clay,1250.9,-889.4,1066.4,320,33.26,6.51,0.0042000,22.26,Monitored
SEG_00035,1997,X52,3,0.2,52000,Silt,2754.8,-1092,862.5,243,46.48,5.75,0.0034000,19.72,Monitored
SEG_00036,1994,X60,4,0.2,60000,Loam,3813.3,-990,615.1,780,95,8,0.0064000,0,Immediate Repair
SEG_00037,2011,X52,5,0.2,52000,Peat,8829.8,-833.8,968,195,93.76,5.45,0.0144000,0,Immediate Repair
SEG_00038,2006,X70,1,0.2,70000,Clay,770,-822.7,807.6,432,95,4.35,0.0353000,0,Immediate Repair
SEG_00039,1993,X70,2,0.2,70000,Silt,6108.2,-916.9,1109.6,527,91.38,4.57,0.0059000,0,Immediate Repair
SEG_00040,2011,X52,2,0.2,52000,Clay,1129.6,-1106.3,822.4,143,36.8,16.68,0.0057000,15.16,Monitored
SEG_00041,1993,X60,1,0.2,60000,Silt,4275.3,-1002.8,740.3,620,95,3.13,0.0064000,0,Immediate Repair
SEG_00042,2005,X70,2,0.2,70000,Silt,2729,-1000.2,610.5,513,47.47,13,0.0050000,13.01,Monitored
SEG_00043,2012,X60,3,0.2,60000,Loam,2559.6,-1112.7,1167.2,216,32.39,2.91,0.0054000,17.63,Monitored
SEG_00044,2001,X70,3,0.2,70000,Sand,21085,-848.4,1128,345,95,4.29,0.0198000,0,Immediate Repair
SEG_00045,1998,X52,2,0.2,52000,Clay,1235.4,-1011.7,925.7,520,80.86,4.6,0.0062000,0,Immediate Repair
SEG_00046,1991,X52,2,0.2,52000,Clay,595.7,-904.5,634.1,297,95,6.37,0.0170000,0,Immediate Repair
SEG_00047,2010,X60,4,0.2,60000,Clay,968,-924.5,970.6,280,95,19.26,0.0146000,0,Immediate Repair
SEG_00048,1990,X52,2,0.2,52000,Silt,8984.7,-949.2,1112,374,78.99,9.73,0.0046000,0.44,Scheduled Repair
SEG_00049,2006,X70,5,0.2,70000,Peat,6042.5,-954.7,931.7,468,49.91,7.94,0.0055000,10.94,Monitored
SEG_00050,2010,X52,2,0.2,52000,Clay,1167.7,-1000.8,800.9,392,22.66,4.93,0.0032000,35.84,Monitored
SEG_00051,2005,X60,1,0.2,60000,Sand,14412.8,-979.7,852,304,63.47,7.35,0.0067000,4.93,Scheduled Repair
SEG_00052,2009,X60,5,0.2,60000,Loam,4202.3,-922.6,661.7,420,56.98,4.14,0.0076000,6.06,Scheduled Repair
SEG_00053,2008,X60,5,0.2,60000,Silt,6345.2,-937.1,863,496,41.63,13.53,0.0052000,14.76,Monitored
SEG_00054,1994,X60,3,0.2,60000,Silt,5406.6,-908.7,784.7,420,81.29,8.45,0.0054000,0,Immediate Repair
SEG_00055,2001,X52,1,0.2,52000,Loam,5220.6,-1081.3,1121.6,552,76.65,7.48,0.0067000,1,Scheduled Repair
SEG_00056,2002,X52,1,0.2,52000,Sand,17565.4,-918.7,809.3,330,72.18,7.04,0.0066000,2.37,Scheduled Repair
SEG_00057,2001,X70,2,0.2,70000,Sand,28407.5,-1019.6,1196.8,345,57.03,10.02,0.0050000,9.19,Scheduled Repair
SEG_00058,1993,X60,4,0.2,60000,Sand,24537.8,-1153.5,729.4,558,36.94,10.23,0.0024000,35.88,Monitored
SEG_00059,2014,X52,3,0.2,52000,Loam,6807,-954.3,787.8,240,34.56,9.13,0.0069000,13.17,Monitored
SEG_00060,1995,X60,1,0.2,60000,Clay,605.3,-998.8,813.6,551,95,9.95,0.0111000,0,Immediate Repair
SEG_00061,2008,X52,4,0.2,52000,Clay,1057.4,-1004.5,894.5,336,28.87,13.05,0.0036000,28.41,Monitored
SEG_00062,1999,X70,4,0.2,70000,Clay,1229.2,-838.7,622.9,400,65.41,6.09,0.0052000,5.61,Scheduled Repair
SEG_00063,1994,X52,3,0.2,52000,Sand,12429.7,-994.5,1195.3,600,40.81,4.86,0.0027000,29.03,Monitored
SEG_00064,2014,X60,4,0.2,60000,Clay,1119.4,-1098.2,923.2,180,25.65,8.44,0.0051000,21.31,Monitored
SEG_00065,1993,X70,2,0.2,70000,Peat,9150.7,-945.1,916.3,651,63.02,8.51,0.0041000,8.28,Scheduled Repair
SEG_00066,2002,X70,2,0.2,70000,Clay,1128.5,-927,947.9,396,64.72,6.02,0.0059000,5.18,Scheduled Repair
SEG_00067,2012,X60,3,0.2,60000,Clay,611.3,-978.4,883.9,264,89.45,12.71,0.0149000,0,Immediate Repair
SEG_00068,1995,X70,1,0.2,70000,Loam,6200.6,-995.5,1155.7,609,47.22,4.12,0.0033000,19.87,Monitored
SEG_00069,2010,X52,4,0.2,52000,Clay,1055.2,-1022.2,998.8,280,23.03,6.28,0.0033000,34.53,Monitored
SEG_00070,2013,X52,4,0.2,52000,Loam,6472.2,-972,1133.1,154,15.38,8.83,0.0028000,46.16,Normal
SEG_00071,2001,X70,5,0.2,70000,Clay,963.5,-1067.1,895.8,253,95,6.81,0.0179000,0,Immediate Repair
SEG_00072,2008,X70,4,0.2,70000,Silt,3286.6,-907,636,288,53.97,13.92,0.0067000,7.77,Scheduled Repair
SEG_00073,2003,X52,4,0.2,52000,Loam,6070.4,-1088.4,858,294,71.54,5.48,0.0068000,2.49,Scheduled Repair
SEG_00074,2004,X70,1,0.2,70000,Sand,13621.5,-883.5,833.9,340,33.41,10.51,0.0033000,28.24,Monitored
SEG_00075,2005,X60,5,0.2,60000,Sand,19490,-959.1,988,266,54.62,9.5,0.0057000,8.91,Scheduled Repair
SEG_00076,1993,X52,4,0.2,52000,Sand,29682.8,-958.6,1048.2,465,74.08,7.55,0.0048000,2.47,Scheduled Repair
SEG_00077,1991,X60,4,0.2,60000,Loam,9548.1,-994.9,991.5,462,66.67,6.1,0.0040000,6.67,Scheduled Repair
SEG_00078,2002,X60,4,0.2,60000,Clay,1280.1,-1134.2,1160.7,528,42.65,5.57,0.0039000,19.15,Monitored
SEG_00079,2001,X60,2,0.2,60000,Peat,5949.6,-715.8,1158.2,414,95,4.7,0.0136000,0,Immediate Repair
SEG_00080,1994,X60,3,0.2,60000,Clay,1366.7,-875.6,861.6,570,58.87,10.44,0.0039000,10.84,Scheduled Repair
SEG_00081,1997,X60,1,0.2,60000,Clay,1172.2,-919.7,984.8,540,43.9,4.13,0.0033000,21.88,Monitored
SEG_00082,2000,X70,1,0.2,70000,Loam,9754.2,-1041.7,951.8,672,81.12,5.35,0.0068000,0,Immediate Repair
SEG_00083,2004,X52,5,0.2,52000,Loam,6732.8,-1021.9,895.1,300,73.14,4.12,0.0073000,1.88,Scheduled Repair
SEG_00084,1996,X70,4,0.2,70000,Clay,780.4,-894.9,635.2,476,95,7.5,0.0146000,0,Immediate Repair
SEG_00085,2006,X70,1,0.2,70000,Clay,1194.4,-990.9,1161.7,396,40.09,5.5,0.0045000,17.74,Monitored
SEG_00086,2011,X60,5,0.2,60000,Peat,5568.3,-870.4,861.4,338,40.57,6.37,0.0062000,12.72,Monitored
SEG_00087,1991,X52,4,0.2,52000,Clay,1302,-1045.9,654.8,660,28.41,10.31,0.0017000,60.69,Monitored
SEG_00088,2002,X70,5,0.2,70000,Clay,1190.1,-888.9,670.8,418,57.41,4.73,0.0052000,8.69,Scheduled Repair
SEG_00089,1992,X60,2,0.2,60000,Clay,610.9,-975.3,1154.9,736,95,2.27,0.0153000,0,Immediate Repair
SEG_00090,1997,X52,1,0.2,52000,Loam,5868.7,-982.4,674.8,540,48.73,11.28,0.0036000,17.37,Monitored
SEG_00091,1994,X70,2,0.2,70000,Sand,14061.3,-998.1,910.1,630,68.64,4.47,0.0046000,4.94,Scheduled Repair
SEG_00092,1994,X52,1,0.2,52000,Sand,28251.1,-1030.4,797.3,720,63.19,15.92,0.0042000,8,Scheduled Repair
SEG_00093,1995,X60,1,0.2,60000,Clay,979.2,-903.6,961.3,551,95,8.21,0.0182000,0,Immediate Repair
SEG_00094,1991,X70,1,0.2,70000,Clay,1360.6,-998.2,751.3,561,87.27,13.66,0.0053000,0,Immediate Repair
SEG_00095,2011,X60,3,0.2,60000,Sand,22522.4,-918.1,1184.6,247,34.4,9.19,0.0053000,17.21,Monitored
SEG_00096,1991,X52,2,0.2,52000,Loam,6715,-1012.6,1185.8,924,51.87,6.46,0.0031000,18.15,Scheduled Repair
SEG_00097,2002,X70,1,0.2,70000,Silt,4918.1,-980.1,1130.3,616,77.64,8.57,0.0071000,0.66,Scheduled Repair
SEG_00098,2006,X52,2,0.2,52000,Silt,6996.1,-978.3,930,432,40.24,4.09,0.0045000,17.67,Monitored
SEG_00099,2003,X52,2,0.2,52000,Sand,26798.1,-854.7,1062.6,336,64.7,23.93,0.0062000,4.94,Scheduled Repair
SEG_00100,2007,X70,4,0.2,70000,Sand,27717.5,-943.8,833.2,323,30.96,7.88,0.0036000,27.24,Monitored`;

export const getPipelineData = (): PipelineSegment[] => {
    // Parse the CSV string into PipelineSegment objects
    const lines = CSV_DATA.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const segment: any = {};
        
        headers.forEach((header, index) => {
            const value = values[index];
            
            // Map CSV headers to PipelineSegment properties
            if (header === 'Segment_ID') segment.Segment_ID = value;
            else if (header === 'Soil_Type') segment.Soil_Type = value as SoilType;
            else if (header === 'Target_Repair_Class') segment.Target_Repair_Class = value as RepairClass;
            else if (header === 'Material_Grade') segment.Material_Grade = value;
            else if (header === 'Calc_Corrosion_Rate_in_yr') segment.Corrosion_Rate_in_yr = parseFloat(value);
            else if (['Installation_Year', 'Diameter_in', 'Yield_Strength_psi', 'Rainflow_Cycles_High'].includes(header)) {
                 segment[header] = parseInt(value, 10);
            } else if (['Avg_Pressure_psi', 'ILI_Defect_Depth_Percent', 'ILI_Defect_Length_in', 'Wall_Thickness_in', 'CP_Potential_mV', 'Soil_Resistivity_ohm_cm', 'Target_RUL_Years'].includes(header)) {
                 // Ensure floats are parsed correctly
                 segment[header] = parseFloat(value);
            } else {
                 segment[header] = value;
            }
        });

        return segment as PipelineSegment;
    });
};

// Helper to bin data for the histogram
export const binDataForHistogram = (data: PipelineSegment[], key: keyof PipelineSegment, binCount: number = 20) => {
    const values = data.map(d => d[key] as number);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 50);
    const step = (max - min) / binCount;

    const bins = Array.from({ length: binCount }, (_, i) => {
        const start = min + i * step;
        const end = start + step;
        return {
            name: `${start.toFixed(0)}-${end.toFixed(0)}`,
            rangeStart: start,
            rangeEnd: end,
            count: 0,
            Gravel: 0,
            Loam: 0,
            Peat: 0,
            Sand: 0,
            Silt: 0,
            Clay: 0
        };
    });

    data.forEach(item => {
        const val = item[key] as number;
        const binIndex = Math.min(Math.floor((val - min) / step), binCount - 1);
        if (binIndex >= 0) {
            bins[binIndex].count++;
            if(item.Soil_Type) {
                 // @ts-ignore
                 if(bins[binIndex][item.Soil_Type] !== undefined) {
                     // @ts-ignore
                     bins[binIndex][item.Soil_Type]++;
                 }
            }
        }
    });

    return bins;
};

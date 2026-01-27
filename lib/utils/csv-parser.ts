import { SiteData, Zone, Authority, IntendedUse } from '@/types';

export interface CSVRow {
  projectName: string;
  plotArea: number;
  plotWidth: number;
  plotDepth: number;
  roadWidth: number;
  zone: Zone;
  isCornerPlot: boolean;
  premiumFSI: boolean;
  tdrFSI: number;
}

export function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    if (values.length !== headers.length) {
      console.warn(`Skipping row ${i + 1}: column count mismatch`);
      continue;
    }

    try {
      const row: CSVRow = {
        projectName: values[headers.indexOf('project_name')] || `Project ${i}`,
        plotArea: parseFloat(values[headers.indexOf('plot_area')]) || 0,
        plotWidth: parseFloat(values[headers.indexOf('plot_width')]) || 0,
        plotDepth: parseFloat(values[headers.indexOf('plot_depth')]) || 0,
        roadWidth: parseFloat(values[headers.indexOf('road_width')]) || 0,
        zone: (values[headers.indexOf('zone')] as Zone) || 'R1',
        isCornerPlot: values[headers.indexOf('corner_plot')]?.toLowerCase() === 'yes',
        premiumFSI: values[headers.indexOf('premium_fsi')]?.toLowerCase() === 'yes',
        tdrFSI: parseFloat(values[headers.indexOf('tdr_fsi')]) || 0,
      };

      rows.push(row);
    } catch (error) {
      console.warn(`Error parsing row ${i + 1}:`, error);
    }
  }

  return rows;
}

export function csvRowToSiteData(row: CSVRow): SiteData {
  return {
    projectName: row.projectName,
    address: 'Imported from CSV',
    location: {
      lat: 23.0225,
      lng: 72.5714,
    },
    authority: 'AUDA' as Authority,
    zone: row.zone,
    plotDimensions: {
      length: row.plotDepth,
      width: row.plotWidth,
      area: row.plotArea,
    },
    isCornerPlot: row.isCornerPlot,
    roadWidthPrimary: row.roadWidth,
    intendedUse: 'Residential-Single' as IntendedUse,
    specialConditions: {
      heritage: false,
      toz: false,
      sez: false,
    },
  };
}

export function generateCSVTemplate(): string {
  const headers = [
    'project_name',
    'plot_area',
    'plot_width',
    'plot_depth',
    'road_width',
    'zone',
    'corner_plot',
    'premium_fsi',
    'tdr_fsi',
  ];

  const sampleRows = [
    'Sample Project 1,500,20,25,12,R1,no,yes,0',
    'Sample Project 2,800,25,32,18,R2,yes,yes,0.5',
    'Commercial Complex,1200,30,40,24,Commercial,yes,yes,0',
  ];

  return [headers.join(','), ...sampleRows].join('\n');
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function exportProjectsToCSV(projects: any[]): string {
  const headers = [
    'Project Name',
    'Plot Area (sq.m)',
    'Zone',
    'Base FSI',
    'Max Height (m)',
    'Ground Coverage (%)',
    'Parking (ECS)',
    'Front Setback (m)',
    'Side Setback (m)',
    'Rear Setback (m)',
  ];

  const rows = projects.map((project) => {
    const result = project.regulationResult;
    const siteData = project.siteData;
    return [
      siteData?.projectName || 'N/A',
      siteData?.plotDimensions?.area || 0,
      siteData?.zone || 'N/A',
      result?.fsi?.base || 0,
      result?.height?.max || 0,
      result?.groundCoverage?.maxPercentage || 0,
      result?.parking?.required || 0,
      result?.setbacks?.front || 0,
      result?.setbacks?.side || 0,
      result?.setbacks?.rear || 0,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

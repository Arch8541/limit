// Core Types for LIMIT Platform

export type Authority = 'AUDA' | 'AMC';

export type Zone = 'R1' | 'R2' | 'Commercial' | 'Industrial' | 'Mixed-Use';

export type IntendedUse =
  | 'Residential-Single'
  | 'Residential-Multi'
  | 'Commercial-Office'
  | 'Commercial-Retail'
  | 'Commercial-Hospitality'
  | 'Mixed-Use';

export type ProjectStatus = 'draft' | 'processing' | 'completed' | 'error';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface PlotDimensions {
  length: number;
  width: number;
  area: number;
  boundaryCoordinates?: Array<{ x: number; y: number }>;
}

export interface SiteData {
  projectName: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  authority: Authority;
  zone: Zone;
  plotDimensions: PlotDimensions;
  isCornerPlot: boolean;
  roadWidthPrimary: number;
  roadWidthSecondary?: number;
  intendedUse: IntendedUse;
  specialConditions: {
    heritage: boolean;
    toz: boolean; // Traffic Optimization Zone
    sez: boolean; // Special Economic Zone
  };
}

export interface ExtractedDrawingData {
  plotDimensions: PlotDimensions;
  confidence: number;
  method: 'ai' | 'manual';
  extractedAt: string;
}

export interface RegulationResult {
  fsi: {
    base: number;
    premium: number;
    total: number;
    maxBuiltUpArea: number;
    calculation: string;
  };
  height: {
    max: number;
    formula: string;
    zoneLimit: number;
    calculation: string;
  };
  setbacks: {
    front: number;
    side: number;
    rear: number;
    calculations: string;
  };
  groundCoverage: {
    maxPercentage: number;
    maxArea: number;
    calculation: string;
  };
  parking: {
    required: number; // in ECS units
    areaRequired: number; // in sq.m
    calculation: string;
  };
  structural: {
    plinthHeight: number;
    floorHeight: number;
    parapet: number;
  };
  fireSafety: {
    required: boolean;
    requirements: string[];
  };
  accessibility: {
    rampRequired: boolean;
    liftRequired: boolean;
    requirements: string[];
  };
}

export interface GDCRClause {
  clauseNumber: string;
  description: string;
  category: string;
}

export interface Project {
  id: string;
  userId: string;
  siteData: SiteData;
  extractedData?: ExtractedDrawingData;
  regulationResult?: RegulationResult;
  gdcrClauses: GDCRClause[];
  status: ProjectStatus;
  reportId?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface BulkProject {
  rowNumber: number;
  siteData: SiteData;
  regulationResult?: RegulationResult;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ComparisonReport {
  projects: Project[];
  comparisonTable: Array<{
    parameter: string;
    values: Array<string | number>;
  }>;
  generatedAt: string;
}

export interface UploadedFile {
  file: File;
  type: 'dwg' | 'pdf' | 'jpg' | 'png';
  preview?: string;
}

// Form validation schemas will use these types
export interface SiteFormData extends SiteData { }

// Building Norms Types
export type NormCategory =
  | 'Room Dimensions'
  | 'Structural Elements'
  | 'Openings'
  | 'Services'
  | 'Fire Safety'
  | 'Accessibility'
  | 'Parking'
  | 'Common Areas';

export interface BuildingNormRequirements {
  [key: string]: number | string | boolean | number[] | string[];
}

export interface BuildingNorm {
  rule_id: string;
  category: NormCategory;
  element: string;
  requirements: BuildingNormRequirements;
  unit: string;
  applicable_to: IntendedUse[];
  source: string;
  notes?: string;
  zone_specific?: {
    [key in Zone]?: BuildingNormRequirements;
  };
}

export interface BuildingNormsData {
  version: string;
  lastUpdated: string;
  norms: BuildingNorm[];
}

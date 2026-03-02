import { Project, SiteData } from '@/types';

export function dbProjectToAppProject(dbProject: any): Project {
  const siteData: SiteData = {
    projectName: dbProject.name,
    address: dbProject.address || '',
    location: {
      lat: dbProject.latitude || 0,
      lng: dbProject.longitude || 0,
    },
    authority: dbProject.authority,
    zone: dbProject.zone,
    plotDimensions: {
      length: dbProject.plotLength,
      width: dbProject.plotWidth,
      area: dbProject.plotArea,
      boundaryCoordinates: dbProject.boundaryCoordinates || undefined,
    },
    isCornerPlot: dbProject.isCornerPlot,
    roadWidthPrimary: dbProject.roadWidthPrimary,
    roadWidthSecondary: dbProject.roadWidthSecondary,
    intendedUse: dbProject.intendedUse,
    specialConditions: {
      heritage: dbProject.heritage,
      toz: dbProject.toz,
      sez: dbProject.sez,
    },
  };

  return {
    id: dbProject.id,
    userId: dbProject.userId,
    siteData,
    extractedData: dbProject.extractedData,
    regulationResult: dbProject.regulationResult,
    gdcrClauses: dbProject.gdcrClauses || [],
    status: dbProject.status,
    reportId: dbProject.reportId,
    createdAt: dbProject.createdAt.toISOString(),
    updatedAt: dbProject.updatedAt.toISOString(),
    thumbnail: dbProject.thumbnail,
  };
}

import { Project, SiteData, RegulationResult, GDCRClause, ExtractedDrawingData } from '@/types';

const API_BASE = '/api/projects';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensure cookies are sent
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Get all projects for current user
export async function getAllProjects(): Promise<Project[]> {
  try {
    const data = await fetchWithAuth(API_BASE);
    return data.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

// Get projects for specific user (same as getAllProjects for current user)
export async function getUserProjects(userId: string): Promise<Project[]> {
  return getAllProjects();
}

// Get single project by ID
export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const data = await fetchWithAuth(`${API_BASE}/${projectId}`);
    return data.project || null;
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}

// Create new project
export async function createProject(userId: string, siteData: SiteData): Promise<Project> {
  const projectData = {
    name: siteData.projectName,
    address: siteData.address,
    latitude: siteData.location.lat,
    longitude: siteData.location.lng,
    authority: siteData.authority,
    zone: siteData.zone,
    plotLength: siteData.plotDimensions.length,
    plotWidth: siteData.plotDimensions.width,
    plotArea: siteData.plotDimensions.area,
    isCornerPlot: siteData.isCornerPlot,
    roadWidthPrimary: siteData.roadWidthPrimary,
    roadWidthSecondary: siteData.roadWidthSecondary,
    intendedUse: siteData.intendedUse,
    heritage: siteData.specialConditions.heritage,
    toz: siteData.specialConditions.toz,
    sez: siteData.specialConditions.sez,
  };

  const data = await fetchWithAuth(API_BASE, {
    method: 'POST',
    body: JSON.stringify(projectData),
  });

  return data.project;
}

// Update project
export async function updateProject(
  projectId: string,
  updates: Partial<Project>
): Promise<Project | null> {
  try {
    const data = await fetchWithAuth(`${API_BASE}/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.project;
  } catch (error) {
    console.error('Failed to update project:', error);
    return null;
  }
}

// Save or update project
export async function saveProject(project: Project): Promise<Project> {
  const result = await updateProject(project.id, project);
  if (!result) {
    throw new Error('Failed to save project');
  }
  return result;
}

// Add extracted data to project
export async function addExtractedData(
  projectId: string,
  extractedData: ExtractedDrawingData
): Promise<Project | null> {
  return updateProject(projectId, { extractedData });
}

// Add regulation results to project
export async function addRegulationResults(
  projectId: string,
  regulationResult: RegulationResult,
  gdcrClauses: GDCRClause[]
): Promise<Project | null> {
  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;

  return updateProject(projectId, {
    regulationResult,
    gdcrClauses,
    reportId,
    status: 'completed',
  });
}

// Delete project
export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    await fetchWithAuth(`${API_BASE}/${projectId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    return false;
  }
}

// Search projects
export async function searchProjects(userId: string, query: string): Promise<Project[]> {
  const allProjects = await getAllProjects();

  if (!query) return allProjects;

  const lowerQuery = query.toLowerCase();
  return allProjects.filter(
    p =>
      p.siteData.projectName.toLowerCase().includes(lowerQuery) ||
      p.siteData.address.toLowerCase().includes(lowerQuery) ||
      p.siteData.zone.toLowerCase().includes(lowerQuery)
  );
}

// Get user statistics
export async function getUserStats(userId: string) {
  const userProjects = await getAllProjects();

  return {
    totalProjects: userProjects.length,
    completedProjects: userProjects.filter(p => p.status === 'completed').length,
    draftProjects: userProjects.filter(p => p.status === 'draft').length,
    totalArea: userProjects.reduce((sum, p) => sum + p.siteData.plotDimensions.area, 0),
  };
}

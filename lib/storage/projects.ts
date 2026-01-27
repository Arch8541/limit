import { Project, SiteData, RegulationResult, GDCRClause, ExtractedDrawingData } from '@/types';
import { STORAGE_KEYS, getItem, setItem } from './index';

// Get all projects
export function getAllProjects(): Project[] {
  const projects = getItem<Project[]>(STORAGE_KEYS.PROJECTS);
  return projects || [];
}

// Get projects for specific user
export function getUserProjects(userId: string): Project[] {
  const allProjects = getAllProjects();
  return allProjects.filter(p => p.userId === userId);
}

// Get single project by ID
export function getProject(projectId: string): Project | null {
  const projects = getAllProjects();
  return projects.find(p => p.id === projectId) || null;
}

// Create new project
export function createProject(userId: string, siteData: SiteData): Project {
  const projects = getAllProjects();

  const newProject: Project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    siteData,
    gdcrClauses: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(newProject);
  setItem(STORAGE_KEYS.PROJECTS, projects);

  return newProject;
}

// Save or update project
export function saveProject(project: Project): Project {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === project.id);

  const savedProject = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  if (index === -1) {
    projects.push(savedProject);
  } else {
    projects[index] = savedProject;
  }

  setItem(STORAGE_KEYS.PROJECTS, projects);
  return savedProject;
}

// Update project
export function updateProject(
  projectId: string,
  updates: Partial<Project>
): Project | null {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === projectId);

  if (index === -1) return null;

  const updatedProject = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updatedProject;
  setItem(STORAGE_KEYS.PROJECTS, projects);

  return updatedProject;
}

// Add extracted data to project
export function addExtractedData(
  projectId: string,
  extractedData: ExtractedDrawingData
): Project | null {
  return updateProject(projectId, { extractedData });
}

// Add regulation results to project
export function addRegulationResults(
  projectId: string,
  regulationResult: RegulationResult,
  gdcrClauses: GDCRClause[]
): Project | null {
  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;

  return updateProject(projectId, {
    regulationResult,
    gdcrClauses,
    reportId,
    status: 'completed',
  });
}

// Delete project
export function deleteProject(projectId: string): boolean {
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== projectId);

  if (filtered.length === projects.length) {
    return false; // Project not found
  }

  setItem(STORAGE_KEYS.PROJECTS, filtered);
  return true;
}

// Search projects
export function searchProjects(userId: string, query: string): Project[] {
  const userProjects = getUserProjects(userId);

  if (!query) return userProjects;

  const lowerQuery = query.toLowerCase();
  return userProjects.filter(
    p =>
      p.siteData.projectName.toLowerCase().includes(lowerQuery) ||
      p.siteData.address.toLowerCase().includes(lowerQuery) ||
      p.siteData.zone.toLowerCase().includes(lowerQuery)
  );
}

// Get user statistics
export function getUserStats(userId: string) {
  const userProjects = getUserProjects(userId);

  return {
    totalProjects: userProjects.length,
    completedProjects: userProjects.filter(p => p.status === 'completed').length,
    draftProjects: userProjects.filter(p => p.status === 'draft').length,
    totalArea: userProjects.reduce((sum, p) => sum + p.siteData.plotDimensions.area, 0),
  };
}

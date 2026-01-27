'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { getUserProjects, deleteProject } from '@/lib/storage/projects-api';
import { Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Calendar,
  FileText,
  Trash2,
  LogOut,
  Upload
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      loadProjects();
    }
  }, [status, session, router]);

  const loadProjects = async () => {
    if (session?.user?.id) {
      setIsLoadingProjects(true);
      try {
        const userProjects = await getUserProjects(session.user.id);
        setProjects(userProjects);
        setFilteredProjects(userProjects);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (p) =>
          p.siteData.projectName.toLowerCase().includes(query.toLowerCase()) ||
          p.siteData.address.toLowerCase().includes(query.toLowerCase()) ||
          p.siteData.zone.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  const handleNavigation = (path: string) => {
    setNavigatingTo(path);
    router.push(path);
  };

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setDeletingProjectId(projectId);
      try {
        await deleteProject(projectId);
        await loadProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project');
      } finally {
        setDeletingProjectId(null);
      }
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'processing':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'error':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="border-b border-slate-200/60 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-extrabold gradient-text tracking-tight">LIMIT</span>
                <p className="text-xs text-slate-600 font-semibold tracking-wide">Building Compliance</p>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-600 font-medium">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={isLoggingOut} disabled={isLoggingOut}>
                {!isLoggingOut && <LogOut className="w-4 h-4 mr-2" />}
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Projects</h1>
            <p className="text-slate-600 mt-2 text-base font-medium">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              variant="secondary"
              onClick={() => handleNavigation('/bulk-analysis')}
              isLoading={navigatingTo === '/bulk-analysis'}
              disabled={navigatingTo !== null}
            >
              {navigatingTo !== '/bulk-analysis' && <Upload className="w-4 h-4 mr-2" />}
              Bulk Analysis
            </Button>
            <Button
              onClick={() => handleNavigation('/projects/new')}
              isLoading={navigatingTo === '/projects/new'}
              disabled={navigatingTo !== null}
            >
              {navigatingTo !== '/projects/new' && <Plus className="w-4 h-4 mr-2" />}
              New Project
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search projects by name, address, or zone..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Projects Grid */}
        {isLoadingProjects ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <p className="text-slate-600 font-medium">Loading projects...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card glass className="border border-slate-200/60">
            <CardContent className="py-20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-slate-600 mb-8 text-base leading-relaxed max-w-md mx-auto">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first project to start analyzing building regulations'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => handleNavigation('/projects/new')}
                  isLoading={navigatingTo === '/projects/new'}
                  disabled={navigatingTo !== null}
                >
                  {navigatingTo !== '/projects/new' && <Plus className="w-4 h-4 mr-2" />}
                  Create First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                hover
                glass
                className={`cursor-pointer border border-slate-200/60 ${navigatingTo === `/projects/${project.id}` ? 'opacity-50' : ''}`}
                onClick={() => handleNavigation(`/projects/${project.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3">
                        {project.siteData.projectName}
                      </CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0 text-slate-500" />
                      <span className="line-clamp-2 leading-relaxed">{project.siteData.address}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm py-2.5 px-3 bg-slate-50/80 rounded-lg">
                      <span className="text-slate-600 font-medium">Zone:</span>
                      <span className="font-bold text-slate-900">
                        {project.siteData.zone}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm py-2.5 px-3 bg-slate-50/80 rounded-lg">
                      <span className="text-slate-600 font-medium">Plot Area:</span>
                      <span className="font-bold text-slate-900">
                        {project.siteData.plotDimensions.area.toFixed(2)} sq.m
                      </span>
                    </div>

                    {project.regulationResult && (
                      <div className="flex items-center justify-between text-sm py-2.5 px-3 bg-cyan-50/80 rounded-lg border border-cyan-200/60">
                        <span className="text-cyan-700 font-medium">Max FSI:</span>
                        <span className="font-bold text-cyan-700">
                          {project.regulationResult.fsi.total.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-xs text-slate-500 pt-3 border-t border-slate-200 font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5 pt-5 border-t border-slate-200">
                    {project.regulationResult && (
                      <Button
                        size="sm"
                        variant="secondary"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(`/projects/${project.id}/report`);
                        }}
                        isLoading={navigatingTo === `/projects/${project.id}/report`}
                        disabled={navigatingTo !== null}
                      >
                        {navigatingTo !== `/projects/${project.id}/report` && <FileText className="w-4 h-4 mr-2" />}
                        Report
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      isLoading={deletingProjectId === project.id}
                      disabled={deletingProjectId === project.id}
                    >
                      {deletingProjectId === project.id ? (
                        <span className="text-xs">Deleting...</span>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

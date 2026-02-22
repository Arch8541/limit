'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { getUserProjects, deleteProject } from '@/lib/storage/projects-api';
import { Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, StatCard } from '@/components/ui/Card';
import { Input, SearchInput } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Calendar,
  FileText,
  Trash2,
  LogOut,
  Upload,
  MoreVertical,
  ArrowRight,
  FolderOpen,
  BarChart3,
  TrendingUp,
  Clock,
  ChevronRight,
  Ruler,
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

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
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

  // Stats calculations
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const draftProjects = projects.filter((p) => p.status === 'draft').length;
  const totalArea = projects.reduce((sum, p) => sum + (p.siteData.plotDimensions?.area || 0), 0);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-8 h-8 text-[var(--bg-primary)]" />
          </div>
          <p className="text-[var(--text-secondary)]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none opacity-50" />

      {/* Header */}
      <header className="relative z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0">
        <div className="container-full py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Nav */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5 text-[var(--bg-primary)]" />
                </div>
                <span className="text-xl font-bold tracking-tight hidden sm:block">LIMIT</span>
              </Link>

              {/* Nav links */}
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-hover)] rounded-[var(--radius-md)]"
                >
                  Projects
                </Link>
                <Link
                  href="/bulk-analysis"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)] transition-colors"
                >
                  Bulk Analysis
                </Link>
              </nav>
            </div>

            {/* User section */}
            <div className="flex items-center gap-4">
              {/* User info */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
              </div>

              {/* User avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[var(--bg-primary)] font-bold text-sm">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                isLoading={isLoggingOut}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container-full py-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <Badge variant="accent" className="mb-3">Dashboard</Badge>
            <h1 className="heading-2 text-[var(--text-primary)] mb-2">Your Projects</h1>
            <p className="text-[var(--text-secondary)]">
              Manage and analyze your building compliance projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => handleNavigation('/bulk-analysis')}
              isLoading={navigatingTo === '/bulk-analysis'}
            >
              <Upload className="w-4 h-4" />
              Bulk Import
            </Button>
            <Button
              variant="primary"
              onClick={() => handleNavigation('/projects/new')}
              isLoading={navigatingTo === '/projects/new'}
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Projects"
            value={projects.length}
            icon={<FolderOpen className="w-full h-full" />}
          />
          <StatCard
            label="Completed"
            value={completedProjects}
            icon={<BarChart3 className="w-full h-full" />}
          />
          <StatCard
            label="In Progress"
            value={draftProjects}
            icon={<Clock className="w-full h-full" />}
          />
          <StatCard
            label="Total Area"
            value={`${totalArea.toLocaleString()} m²`}
            icon={<Ruler className="w-full h-full" />}
          />
        </div>

        {/* Search & Filters */}
        <div className="mb-6">
          <SearchInput
            placeholder="Search projects by name, address, or zone..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Projects Grid */}
        {isLoadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} variant="default" padding="lg">
                <div className="animate-shimmer h-4 w-3/4 rounded mb-4" />
                <div className="animate-shimmer h-3 w-1/2 rounded mb-6" />
                <div className="space-y-3">
                  <div className="animate-shimmer h-3 w-full rounded" />
                  <div className="animate-shimmer h-3 w-2/3 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card variant="elevated" padding="lg" className="text-center py-16">
            <div className="w-20 h-20 rounded-[var(--radius-xl)] bg-[var(--bg-hover)] flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
            <h3 className="heading-3 text-[var(--text-primary)] mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search query to find what you\'re looking for.'
                : 'Create your first project to start analyzing building regulations.'}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                onClick={() => handleNavigation('/projects/new')}
                isLoading={navigatingTo === '/projects/new'}
              >
                <Plus className="w-4 h-4" />
                Create First Project
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                variant="default"
                padding="none"
                hover
                className={`overflow-hidden ${
                  navigatingTo === `/projects/${project.id}` ? 'opacity-50' : ''
                }`}
                onClick={() => handleNavigation(`/projects/${project.id}`)}
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--text-primary)] truncate mb-1">
                        {project.siteData.projectName}
                      </h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, project.id)}
                      disabled={deletingProjectId === project.id}
                      className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                    >
                      {deletingProjectId === project.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)] mb-4">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--text-muted)]" />
                    <span className="line-clamp-2">{project.siteData.address || 'No address specified'}</span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)]">
                      <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-1">Zone</div>
                      <div className="font-medium text-sm text-[var(--text-primary)]">{project.siteData.zone}</div>
                    </div>
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)]">
                      <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-1">Area</div>
                      <div className="font-medium text-sm text-[var(--text-primary)]">
                        {project.siteData.plotDimensions?.area?.toFixed(0) || '—'} m²
                      </div>
                    </div>
                  </div>

                  {/* FSI if available */}
                  {project.regulationResult && (
                    <div className="mt-3 p-3 rounded-[var(--radius-md)] bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--accent-primary)] font-mono uppercase tracking-wider">Max FSI</span>
                        <span className="font-bold text-[var(--accent-primary)]">
                          {project.regulationResult.fsi?.total?.toFixed(2) || '—'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    {project.regulationResult && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(`/projects/${project.id}/report`);
                        }}
                        isLoading={navigatingTo === `/projects/${project.id}/report`}
                      >
                        <FileText className="w-4 h-4" />
                        Report
                      </Button>
                    )}
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

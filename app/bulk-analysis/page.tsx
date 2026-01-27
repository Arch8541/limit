'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Building2, ArrowLeft, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseCSV, csvRowToSiteData, generateCSVTemplate, downloadCSV, exportProjectsToCSV } from '@/lib/utils/csv-parser';
import { calculateRegulations } from '@/lib/calculations/regulation-engine';
import { Project } from '@/types';
import { ComparativeView } from '@/components/comparative/ComparativeView';
import { Progress, CircularProgress } from '@/components/ui/Progress';
import { SuccessAnimation } from '@/components/ui/SuccessAnimation';
import { createProject, addRegulationResults } from '@/lib/storage/projects-api';

export default function BulkAnalysisPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedProjects, setProcessedProjects] = useState<Project[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setError(null);
      setProcessedProjects([]);
    }
  };

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    downloadCSV('limit-bulk-analysis-template.csv', template);
  };

  const handleProcess = async () => {
    if (!csvFile) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      if (!session?.user?.id) {
        throw new Error('Please login to use bulk analysis');
      }

      const text = await csvFile.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        throw new Error('No valid rows found in CSV file');
      }

      const projects: Project[] = [];
      const totalRows = rows.length;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const siteData = csvRowToSiteData(row);

        // Create project
        const project = await createProject(session.user.id, siteData);

        // Calculate regulations
        const { result, clauses } = calculateRegulations(siteData);

        // Add regulation results
        const updatedProject = await addRegulationResults(project.id, result, clauses);

        if (updatedProject) {
          projects.push(updatedProject);
        }

        setProgress(((i + 1) / totalRows) * 100);

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setProcessedProjects(projects);
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportResults = () => {
    if (processedProjects.length === 0) return;
    const csv = exportProjectsToCSV(processedProjects);
    downloadCSV('bulk-analysis-results.csv', csv);
  };

  const handleNavigation = (path: string) => {
    setNavigatingTo(path);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b border-stone-200 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/dashboard')}
                isLoading={navigatingTo === '/dashboard'}
                disabled={navigatingTo !== null}
              >
                {navigatingTo !== '/dashboard' && <ArrowLeft className="w-4 h-4" />}
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <FileSpreadsheet className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">Bulk Analysis</span>
                <p className="text-sm text-gray-600">Process multiple sites simultaneously</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {!processedProjects.length ? (
          <Card glass>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>
                Upload a CSV file with multiple site details for batch processing
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Instructions */}
                <div className="glass-dark rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                    How it works:
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Download the CSV template below</li>
                    <li>Fill in your site details (one row per site)</li>
                    <li>Upload the completed CSV file</li>
                    <li>Review and process all sites simultaneously</li>
                    <li>Download comparative analysis report</li>
                  </ol>
                </div>

                {/* Download Template */}
                <Button variant="secondary" onClick={handleDownloadTemplate} fullWidth>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV Template
                </Button>

                {/* File Upload */}
                <div className="border-2 border-dashed border-stone-300 rounded-3xl p-8 text-center hover:border-teal-400 transition-all smooth-transition hover:bg-stone-50">
                  <input
                    type="file"
                    id="csv-upload"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-teal-600" />
                    </div>
                    {csvFile ? (
                      <div>
                        <p className="text-base font-semibold text-gray-900 mb-1">{csvFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(csvFile.size / 1024).toFixed(2)} KB
                        </p>
                        <p className="text-sm text-teal-600 mt-2 font-medium">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base font-semibold text-gray-900 mb-1">
                          Click to upload CSV file
                        </p>
                        <p className="text-sm text-gray-600">or drag and drop</p>
                      </div>
                    )}
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 mb-1">Error Processing CSV</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Processing Sites...</h4>
                      <CircularProgress value={progress} size={60} showLabel />
                    </div>
                    <Progress value={progress} showLabel color="primary" />
                  </div>
                )}

                {/* CSV Format Reference */}
                <div className="glass-dark rounded-2xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Required Columns:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      Project Name
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      Plot Area (sq.m)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      Plot Width (m)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      Plot Depth (m)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      Road Width (m)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      Zone
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      Corner Plot (yes/no)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      Premium FSI (yes/no)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      TDR FSI
                    </div>
                  </div>
                </div>

                {/* Process Button */}
                <Button
                  onClick={handleProcess}
                  fullWidth
                  size="lg"
                  variant="gradient"
                  isLoading={isProcessing}
                  disabled={!csvFile || isProcessing}
                >
                  <FileSpreadsheet className="w-5 h-5 mr-2" />
                  Process Bulk Analysis
                </Button>

                {/* Note */}
                <p className="text-xs text-gray-500 text-center">
                  Processing time depends on the number of sites. You'll receive a detailed
                  comparative report when complete.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Success State */}
            <div className="glass rounded-3xl p-6 border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Processing Complete!</h3>
                    <p className="text-sm text-gray-600">
                      Successfully analyzed {processedProjects.length} sites
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={handleExportResults}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                  <Button variant="ghost" onClick={() => { setProcessedProjects([]); setNavigatingTo(null); }}>
                    Process New File
                  </Button>
                </div>
              </div>
            </div>

            {/* Comparative View */}
            <ComparativeView projects={processedProjects} maxProjects={4} />

            {/* Individual Projects */}
            <Card glass>
              <CardHeader>
                <CardTitle>Individual Site Reports</CardTitle>
                <CardDescription>Click on any site to view detailed report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processedProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`glass rounded-2xl p-5 hover-lift cursor-pointer border border-stone-200 ${navigatingTo === `/projects/${project.id}` ? 'opacity-50' : ''}`}
                      onClick={() => handleNavigation(`/projects/${project.id}`)}
                    >
                      <h4 className="font-bold text-gray-900 mb-3">{project.siteData?.projectName || 'Unnamed'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Zone:</span>
                          <span className="font-semibold text-gray-900">{project.siteData?.zone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max FSI:</span>
                          <span className="font-semibold text-teal-600">
                            {project.regulationResult?.fsi?.total.toFixed(2) || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Height:</span>
                          <span className="font-semibold text-teal-600">
                            {project.regulationResult?.height?.max.toFixed(2) || 'N/A'} m
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <SuccessAnimation
        show={showSuccess}
        title="Bulk Analysis Complete!"
        message={`Successfully processed ${processedProjects.length} sites`}
        onComplete={() => setShowSuccess(false)}
      />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProject } from '@/lib/storage/projects-api';
import { Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IsometricBuilding } from '@/components/3d/IsometricBuilding';
import { ApplicableNorms } from '@/components/norms/ApplicableNorms';
import { InfoTooltip } from '@/components/ui/Tooltip';
import { FSIAdjuster } from '@/components/ui/FSIAdjuster';
import { SetbackAdjuster } from '@/components/ui/SetbackAdjuster';
import { ParkingAreaCalculator } from '@/components/ui/ParkingAreaCalculator';
import gdcrRules from '@/lib/regulations/gdcr-2017.json';
import {
  Building2,
  ArrowLeft,
  FileText,
  MapPin,
  Ruler,
  Layers,
  Car,
  Flame,
  Accessibility,
  Download,
  Settings2,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  // Adjusted values
  const [adjustedFSI, setAdjustedFSI] = useState<number | null>(null);
  const [adjustedBuiltUpArea, setAdjustedBuiltUpArea] = useState<number | null>(null);
  const [adjustedSetbacks, setAdjustedSetbacks] = useState<{ front: number; side: number; rear: number } | null>(null);
  const [parkingAllocation, setParkingAllocation] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const loadProject = async () => {
      if (params.id) {
        setIsLoading(true);
        try {
          const proj = await getProject(params.id as string);
          setProject(proj);
        } catch (error) {
          console.error('Failed to load project:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProject();
  }, [params.id]);

  const handleNavigation = (path: string) => {
    setNavigatingTo(path);
    router.push(path);
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-10 h-10 text-[var(--bg-primary)]" />
          </div>
          <p className="text-[var(--text-secondary)] font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="text-center relative z-10">
          <p className="text-[var(--text-secondary)] font-medium">Project not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { siteData, regulationResult, gdcrClauses, reportId, status } = project;

  // Get zone rules for FSI limits
  const zoneRules = regulationResult ? gdcrRules.zones[siteData.zone] : null;

  // Calculate effective values (adjusted or original)
  const effectiveFSI = adjustedFSI ?? regulationResult?.fsi.total;
  const effectiveBuiltUpArea = adjustedBuiltUpArea ?? regulationResult?.fsi.maxBuiltUpArea;
  const effectiveSetbacks = adjustedSetbacks ?? regulationResult?.setbacks;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

      {/* Header */}
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/dashboard')}
                isLoading={navigatingTo === '/dashboard'}
                disabled={navigatingTo !== null}
              >
                {navigatingTo !== '/dashboard' && <ArrowLeft className="w-4 h-4" />}
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-[var(--accent-primary)]/30 transition-all">
                <Building2 className="w-7 h-7 text-[var(--bg-primary)]" />
              </div>
              <div>
                <span className="text-2xl font-extrabold gradient-text tracking-tight">{siteData.projectName}</span>
                <p className="text-xs text-[var(--text-secondary)] font-semibold tracking-wide">
                  {reportId ? `Report ID: ${reportId}` : 'Draft Project'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {regulationResult && (
                <Button
                  onClick={() => handleNavigation(`/projects/${project.id}/report`)}
                  isLoading={navigatingTo === `/projects/${project.id}/report`}
                  disabled={navigatingTo !== null}
                >
                  {navigatingTo !== `/projects/${project.id}/report` && <FileText className="w-4 h-4 mr-2" />}
                  View Report
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Site Information */}
        <Card className="mb-8 bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <CardHeader>
            <CardTitle className="text-3xl">Site Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)] font-semibold">Address</p>
                <p className="font-bold text-[var(--text-primary)] flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-[var(--text-muted)]" />
                  {siteData.address}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)] font-semibold">Authority</p>
                <p className="font-bold text-[var(--text-primary)] text-lg">{siteData.authority}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)] font-semibold">Zone</p>
                <Badge variant="info" className="text-sm py-1.5 px-4">{siteData.zone}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)] font-semibold">Plot Area</p>
                <p className="font-bold text-[var(--text-primary)] text-lg">
                  {siteData.plotDimensions.area.toFixed(2)} sq.m
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)] font-semibold">Plot Dimensions</p>
                <p className="font-bold text-[var(--text-primary)] text-lg">
                  {siteData.plotDimensions.length}m × {siteData.plotDimensions.width}m
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)] font-semibold">Road Width</p>
                <p className="font-bold text-[var(--text-primary)] text-lg">{siteData.roadWidthPrimary}m</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)] font-semibold">Intended Use</p>
                <p className="font-bold text-[var(--text-primary)] text-lg">{siteData.intendedUse}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)] font-semibold">Corner Plot</p>
                <p className="font-bold text-[var(--text-primary)] text-lg">
                  {siteData.isCornerPlot ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Isometric Building Visualization */}
        {regulationResult && (
          <IsometricBuilding
            plotWidth={siteData.plotDimensions.width}
            plotDepth={siteData.plotDimensions.length}
            buildingHeight={regulationResult.height.max}
            setbacks={{
              front: effectiveSetbacks?.front ?? regulationResult.setbacks.front,
              rear: effectiveSetbacks?.rear ?? regulationResult.setbacks.rear,
              side: effectiveSetbacks?.side ?? regulationResult.setbacks.side,
            }}
            groundCoverage={regulationResult.groundCoverage.maxPercentage}
            fsiUtilization={effectiveFSI !== undefined && zoneRules ? (effectiveFSI / zoneRules.maxFSI) * 100 : (regulationResult.fsi.total / (regulationResult.fsi.base + regulationResult.fsi.premium)) * 100}
            className="mb-8"
          />
        )}

        {/* Regulation Results */}
        {regulationResult && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FSI Card with Adjuster */}
            <Card className="bg-[var(--bg-elevated)] border border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Layers className="w-6 h-6 text-[var(--accent-primary)]" />
                  Floor Space Index (FSI)
                  <InfoTooltip content="FSI is the ratio of total built-up area to the plot area. It determines how much floor area can be constructed on a given plot." />
                  {adjustedFSI !== null && (
                    <Badge variant="warning" className="ml-auto text-xs">
                      <Settings2 className="w-3 h-3 mr-1" />
                      Adjusted
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {gdcrClauses.find((c) => c.category === 'FSI')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Calculated Values */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                      <p className="text-sm text-[var(--text-secondary)] font-semibold mb-2">Base FSI</p>
                      <p className="text-3xl font-extrabold text-[var(--text-primary)]">
                        {regulationResult.fsi.base}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--accent-subtle)] rounded-xl border border-[var(--accent-primary)]/30">
                      <p className="text-sm text-[var(--accent-primary)] font-semibold mb-2">Premium</p>
                      <p className="text-3xl font-extrabold text-[var(--accent-primary)]">
                        +{regulationResult.fsi.premium.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--success-bg)] rounded-xl border border-[var(--success)]/30">
                      <p className="text-sm text-[var(--success)] font-semibold mb-2">
                        {adjustedFSI !== null ? 'Calculated FSI' : 'Total FSI'}
                      </p>
                      <p className="text-3xl font-extrabold text-[var(--success)]">
                        {regulationResult.fsi.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--blueprint-subtle)] rounded-xl border border-[var(--blueprint)]/30">
                      <p className="text-sm text-[var(--blueprint)] font-semibold mb-2">
                        {adjustedBuiltUpArea !== null ? 'Calculated Area' : 'Max Built-up'}
                      </p>
                      <p className="text-3xl font-extrabold text-[var(--blueprint)]">
                        {regulationResult.fsi.maxBuiltUpArea.toFixed(0)}
                      </p>
                      <p className="text-xs text-[var(--blueprint)] font-medium mt-1">sq.m</p>
                    </div>
                  </div>

                  {/* FSI Adjuster */}
                  <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl border-2 border-[var(--accent-primary)]/30">
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                      <Settings2 className="w-5 h-5 text-[var(--accent-primary)]" />
                      Adjust FSI
                    </h4>
                    <FSIAdjuster
                      baseFSI={regulationResult.fsi.base}
                      currentFSI={regulationResult.fsi.total}
                      maxFSI={zoneRules?.maxFSI || regulationResult.fsi.total}
                      plotArea={siteData.plotDimensions.area}
                      onChange={(newFSI, newBuiltUpArea) => {
                        setAdjustedFSI(newFSI);
                        setAdjustedBuiltUpArea(newBuiltUpArea);
                      }}
                    />
                  </div>

                  <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-secondary)] whitespace-pre-line font-mono leading-relaxed">
                    {regulationResult.fsi.calculation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Height Card */}
            <Card className="bg-[var(--bg-elevated)] border border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Ruler className="w-6 h-6 text-[var(--accent-primary)]" />
                  Building Height
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {gdcrClauses.find((c) => c.category === 'Height')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--accent-primary)]/30">
                    <p className="text-sm text-[var(--text-secondary)] font-semibold mb-3">Maximum Permissible Height</p>
                    <p className="text-5xl font-extrabold gradient-text">
                      {regulationResult.height.max.toFixed(2)}m
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                      <p className="text-sm text-[var(--text-secondary)] font-semibold mb-2">Formula</p>
                      <p className="font-bold text-[var(--text-primary)]">{regulationResult.height.formula}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                      <p className="text-sm text-[var(--text-secondary)] font-semibold mb-2">Zone Limit</p>
                      <p className="font-bold text-[var(--text-primary)]">
                        {regulationResult.height.zoneLimit}m
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-secondary)] whitespace-pre-line font-mono leading-relaxed">
                    {regulationResult.height.calculation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Setbacks Card with Adjuster */}
            <Card className="bg-[var(--bg-elevated)] border border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Building2 className="w-6 h-6 text-[var(--blueprint)]" />
                  Setbacks
                  <InfoTooltip content="Setbacks are the mandatory open spaces that must be left between the building and the plot boundaries for light, ventilation, and fire safety." />
                  {adjustedSetbacks !== null && (
                    <Badge variant="warning" className="ml-auto text-xs">
                      <Settings2 className="w-3 h-3 mr-1" />
                      Adjusted
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {gdcrClauses.find((c) => c.category === 'Setbacks')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Calculated Values */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-[var(--blueprint-subtle)] rounded-xl border border-[var(--blueprint)]/30">
                      <p className="text-sm text-[var(--blueprint)] font-semibold mb-2">
                        {adjustedSetbacks !== null ? 'Min Front' : 'Front'}
                      </p>
                      <p className="text-3xl font-extrabold text-[var(--blueprint)]">
                        {regulationResult.setbacks.front}m
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--accent-subtle)] rounded-xl border border-[var(--accent-primary)]/30">
                      <p className="text-sm text-[var(--accent-primary)] font-semibold mb-2">
                        {adjustedSetbacks !== null ? 'Min Side' : 'Side'}
                      </p>
                      <p className="text-3xl font-extrabold text-[var(--accent-primary)]">
                        {regulationResult.setbacks.side}m
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--success-bg)] rounded-xl border border-[var(--success)]/30">
                      <p className="text-sm text-[var(--success)] font-semibold mb-2">
                        {adjustedSetbacks !== null ? 'Min Rear' : 'Rear'}
                      </p>
                      <p className="text-3xl font-extrabold text-[var(--success)]">
                        {regulationResult.setbacks.rear}m
                      </p>
                    </div>
                  </div>

                  {/* Setback Adjuster */}
                  <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl border-2 border-[var(--blueprint)]/30">
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                      <Settings2 className="w-5 h-5 text-[var(--blueprint)]" />
                      Adjust Setbacks
                    </h4>
                    <SetbackAdjuster
                      currentSetbacks={regulationResult.setbacks}
                      minimumSetbacks={regulationResult.setbacks}
                      onChange={(newSetbacks) => {
                        setAdjustedSetbacks(newSetbacks);
                      }}
                    />
                  </div>

                  <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-secondary)] whitespace-pre-line font-mono leading-relaxed">
                    {regulationResult.setbacks.calculations}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ground Coverage Card */}
            <Card className="bg-[var(--bg-elevated)] border border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Layers className="w-6 h-6 text-[var(--success)]" />
                  Ground Coverage
                  <InfoTooltip content="Ground Coverage is the percentage of the plot area that can be covered by the building footprint at ground level." />
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {gdcrClauses.find((c) => c.category === 'Ground Coverage')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--success-bg)] rounded-xl border border-[var(--success)]/30">
                      <p className="text-sm text-[var(--success)] font-semibold mb-2">Maximum %</p>
                      <p className="text-3xl font-extrabold text-[var(--success)]">
                        {regulationResult.groundCoverage.maxPercentage}%
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                      <p className="text-sm text-[var(--text-secondary)] font-semibold mb-2">Max Area</p>
                      <p className="text-3xl font-bold text-[var(--text-primary)]">
                        {regulationResult.groundCoverage.maxArea.toFixed(0)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">sq.m</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-secondary)] whitespace-pre-line font-mono leading-relaxed">
                    {regulationResult.groundCoverage.calculation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parking Card with Area Calculator */}
            <Card className="bg-[var(--bg-elevated)] border border-[var(--border-default)] lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Car className="w-6 h-6 text-[var(--blueprint)]" />
                  Parking Requirements
                  <InfoTooltip content="Parking requirements specify the minimum number of parking spaces needed based on the building use and area." />
                  {parkingAllocation !== null && (
                    <Badge variant="warning" className="ml-auto text-xs">
                      <Settings2 className="w-3 h-3 mr-1" />
                      Custom Allocation
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {gdcrClauses.find((c) => c.category === 'Parking')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Calculated ECS Values */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--blueprint-subtle)] rounded-xl border border-[var(--blueprint)]/30">
                      <p className="text-sm text-[var(--blueprint)] font-semibold mb-2 flex items-center gap-1">
                        Required ECS
                        <InfoTooltip content="ECS (Equivalent Car Space) is the standard unit for measuring parking requirements. One ECS typically measures 2.5m × 5m." position="right" />
                      </p>
                      <p className="text-3xl font-extrabold text-[var(--blueprint)]">
                        {regulationResult.parking.required}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--accent-subtle)] rounded-xl border border-[var(--accent-primary)]/30">
                      <p className="text-sm text-[var(--accent-primary)] font-semibold mb-2">Total Area Required</p>
                      <p className="text-3xl font-extrabold text-[var(--accent-primary)]">
                        {regulationResult.parking.areaRequired.toFixed(0)}
                      </p>
                      <p className="text-xs text-[var(--accent-primary)] font-medium mt-1">sq.m</p>
                    </div>
                  </div>

                  {/* Parking Area Calculator */}
                  <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl border-2 border-[var(--blueprint)]/30">
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                      <Settings2 className="w-5 h-5 text-[var(--blueprint)]" />
                      Parking Space Allocation
                    </h4>
                    <ParkingAreaCalculator
                      totalParkingArea={regulationResult.parking.areaRequired}
                      onAllocationChange={(allocation) => {
                        setParkingAllocation(allocation);
                      }}
                    />
                  </div>

                  <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-secondary)] whitespace-pre-line font-mono leading-relaxed">
                    {regulationResult.parking.calculation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fire Safety Card */}
            <Card className="bg-[var(--bg-elevated)] border border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Flame className="w-6 h-6 text-[var(--warning)]" />
                  Fire Safety
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {gdcrClauses.find((c) => c.category === 'Fire Safety')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className={regulationResult.fireSafety.required ? 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/30' : 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/30'}>
                    {regulationResult.fireSafety.required ? 'Required' : 'Basic Requirements'}
                  </Badge>
                  <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                    {regulationResult.fireSafety.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[var(--warning)] mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Applicable Building Norms */}
        {regulationResult && (
          <div className="mt-8">
            <ApplicableNorms
              zone={siteData.zone}
              intendedUse={siteData.intendedUse}
              className="border border-[var(--border-default)]"
            />
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 p-6 bg-[var(--warning-bg)] border-2 border-[var(--warning)]/30 rounded-2xl">
          <p className="text-base text-[var(--text-primary)] leading-relaxed">
            <strong className="font-bold text-[var(--warning)]">Disclaimer:</strong> This is an advisory document based on GDCR 2017 regulations.
            Always verify calculations and requirements with the local authority ({siteData.authority}) before proceeding with construction.
          </p>
        </div>
      </main>
    </div>
  );
}

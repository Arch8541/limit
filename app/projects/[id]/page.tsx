'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProject } from '@/lib/storage/projects';
import { Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IsometricBuilding } from '@/components/3d/IsometricBuilding';
import { ApplicableNorms } from '@/components/norms/ApplicableNorms';
import { InfoTooltip } from '@/components/ui/Tooltip';
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
} from 'lucide-react';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (params.id) {
      const proj = getProject(params.id as string);
      setProject(proj);
    }
  }, [params.id]);

  if (!mounted || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const { siteData, regulationResult, gdcrClauses, reportId, status } = project;

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="border-b border-slate-200/60 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-extrabold gradient-text tracking-tight">{siteData.projectName}</span>
                <p className="text-xs text-slate-600 font-semibold tracking-wide">
                  {reportId ? `Report ID: ${reportId}` : 'Draft Project'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {regulationResult && (
                <Button onClick={() => router.push(`/projects/${project.id}/report`)}>
                  <FileText className="w-4 h-4 mr-2" />
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
        <Card glass className="mb-8 border border-slate-200/60">
          <CardHeader>
            <CardTitle className="text-3xl">Site Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-semibold">Address</p>
                <p className="font-bold text-slate-900 flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  {siteData.address}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-semibold">Authority</p>
                <p className="font-bold text-slate-900 text-lg">{siteData.authority}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-semibold">Zone</p>
                <Badge variant="info" className="text-sm py-1.5 px-4">{siteData.zone}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-semibold">Plot Area</p>
                <p className="font-bold text-slate-900 text-lg">
                  {siteData.plotDimensions.area.toFixed(2)} sq.m
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-semibold">Plot Dimensions</p>
                <p className="font-bold text-slate-900 text-lg">
                  {siteData.plotDimensions.length}m × {siteData.plotDimensions.width}m
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-semibold">Road Width</p>
                <p className="font-bold text-slate-900 text-lg">{siteData.roadWidthPrimary}m</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-semibold">Intended Use</p>
                <p className="font-bold text-slate-900 text-lg">{siteData.intendedUse}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-semibold">Corner Plot</p>
                <p className="font-bold text-slate-900 text-lg">
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
              front: regulationResult.setbacks.front,
              rear: regulationResult.setbacks.rear,
              side: regulationResult.setbacks.side,
            }}
            groundCoverage={regulationResult.groundCoverage.maxPercentage}
            fsiUtilization={(regulationResult.fsi.total / (regulationResult.fsi.base + regulationResult.fsi.premium)) * 100}
            className="mb-8"
          />
        )}

        {/* Regulation Results */}
        {regulationResult && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FSI Card */}
            <Card glass className="border border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Layers className="w-6 h-6 text-cyan-600" />
                  Floor Space Index (FSI)
                  <InfoTooltip content="FSI is the ratio of total built-up area to the plot area. It determines how much floor area can be constructed on a given plot." />
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {gdcrClauses.find((c) => c.category === 'FSI')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/80 rounded-xl">
                      <p className="text-sm text-slate-600 font-semibold mb-2">Base FSI</p>
                      <p className="text-3xl font-extrabold text-slate-900">
                        {regulationResult.fsi.base}
                      </p>
                    </div>
                    <div className="p-4 bg-cyan-50/80 rounded-xl border border-cyan-200/60">
                      <p className="text-sm text-cyan-700 font-semibold mb-2">Premium</p>
                      <p className="text-3xl font-extrabold text-cyan-700">
                        +{regulationResult.fsi.premium.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200/60">
                      <p className="text-sm text-emerald-700 font-semibold mb-2">Total FSI</p>
                      <p className="text-3xl font-extrabold text-emerald-700">
                        {regulationResult.fsi.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200/60">
                      <p className="text-sm text-indigo-700 font-semibold mb-2">Max Built-up</p>
                      <p className="text-3xl font-extrabold text-indigo-700">
                        {regulationResult.fsi.maxBuiltUpArea.toFixed(0)}
                      </p>
                      <p className="text-xs text-indigo-600 font-medium mt-1">sq.m</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50/80 rounded-xl text-sm text-slate-700 whitespace-pre-line font-mono leading-relaxed">
                    {regulationResult.fsi.calculation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Height Card */}
            <Card glass className="border border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Ruler className="w-6 h-6 text-cyan-600" />
                  Building Height
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {gdcrClauses.find((c) => c.category === 'Height')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-cyan-50 to-indigo-50 rounded-2xl border border-cyan-200/60">
                    <p className="text-sm text-slate-700 font-semibold mb-3">Maximum Permissible Height</p>
                    <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-600 to-indigo-600">
                      {regulationResult.height.max.toFixed(2)}m
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/80 rounded-xl">
                      <p className="text-sm text-slate-600 font-semibold mb-2">Formula</p>
                      <p className="font-bold text-slate-900">{regulationResult.height.formula}</p>
                    </div>
                    <div className="p-4 bg-slate-50/80 rounded-xl">
                      <p className="text-sm text-slate-600 font-semibold mb-2">Zone Limit</p>
                      <p className="font-bold text-slate-900">
                        {regulationResult.height.zoneLimit}m
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50/80 rounded-xl text-sm text-slate-700 whitespace-pre-line font-mono leading-relaxed">
                    {regulationResult.height.calculation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Setbacks Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Setbacks
                  <InfoTooltip content="Setbacks are the mandatory open spaces that must be left between the building and the plot boundaries for light, ventilation, and fire safety." />
                </CardTitle>
                <CardDescription>
                  {gdcrClauses.find((c) => c.category === 'Setbacks')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Front</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {regulationResult.setbacks.front}m
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Side</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {regulationResult.setbacks.side}m
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rear</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {regulationResult.setbacks.rear}m
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700 whitespace-pre-line font-mono">
                    {regulationResult.setbacks.calculations}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ground Coverage Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  Ground Coverage
                  <InfoTooltip content="Ground Coverage is the percentage of the plot area that can be covered by the building footprint at ground level." />
                </CardTitle>
                <CardDescription>
                  {gdcrClauses.find((c) => c.category === 'Ground Coverage')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Maximum %</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {regulationResult.groundCoverage.maxPercentage}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Max Area</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {regulationResult.groundCoverage.maxArea.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">sq.m</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700 whitespace-pre-line font-mono">
                    {regulationResult.groundCoverage.calculation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parking Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Parking Requirements
                  <InfoTooltip content="Parking requirements specify the minimum number of parking spaces needed based on the building use and area." />
                </CardTitle>
                <CardDescription>
                  {gdcrClauses.find((c) => c.category === 'Parking')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        Required ECS
                        <InfoTooltip content="ECS (Equivalent Car Space) is the standard unit for measuring parking requirements. One ECS typically measures 2.5m × 5m." position="right" />
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {regulationResult.parking.required}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Area Required</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {regulationResult.parking.areaRequired.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">sq.m</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700 whitespace-pre-line font-mono">
                    {regulationResult.parking.calculation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fire Safety Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Fire Safety
                </CardTitle>
                <CardDescription>
                  {gdcrClauses.find((c) => c.category === 'Fire Safety')?.clauseNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className={regulationResult.fireSafety.required ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-green-100 text-green-700 border-green-200'}>
                    {regulationResult.fireSafety.required ? 'Required' : 'Basic Requirements'}
                  </Badge>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {regulationResult.fireSafety.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
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
              className="border border-slate-200/60"
            />
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 p-6 bg-amber-50/80 border-2 border-amber-200 rounded-2xl">
          <p className="text-base text-amber-900 leading-relaxed">
            <strong className="font-bold">Disclaimer:</strong> This is an advisory document based on GDCR 2017 regulations.
            Always verify calculations and requirements with the local authority ({siteData.authority}) before proceeding with construction.
          </p>
        </div>
      </main>
    </div>
  );
}

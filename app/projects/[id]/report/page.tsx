'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProject } from '@/lib/storage/projects-api';
import { Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { Building2, ArrowLeft, Printer, Download } from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

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

  const handlePrint = () => {
    window.print();
  };

  const handleNavigation = (path: string) => {
    setNavigatingTo(path);
    router.push(path);
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Report not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { siteData, regulationResult, gdcrClauses, reportId } = project;

  return (
    <>
      {/* No-print header */}
      <div className="no-print bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(`/projects/${project.id}`)}
              isLoading={navigatingTo === `/projects/${project.id}`}
              disabled={navigatingTo !== null}
            >
              {navigatingTo !== `/projects/${project.id}` && <ArrowLeft className="w-4 h-4 mr-2" />}
              Back to Project
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Printable content */}
      <div className="max-w-5xl mx-auto bg-white">
        {/* Cover Page */}
        <div className="page-break min-h-screen flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-50 to-white">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Building2 className="w-16 h-16 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Building Regulation Report
              </h1>
              <p className="text-xl text-gray-600">GDCR 2017 Compliance Analysis</p>
            </div>

            <div className="space-y-3 text-left max-w-md mx-auto border-t border-b border-gray-200 py-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Project:</span>
                <span className="font-semibold text-gray-900">{siteData.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Report ID:</span>
                <span className="font-semibold text-gray-900">{reportId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Generated:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Authority:</span>
                <span className="font-semibold text-gray-900">{siteData.authority}</span>
              </div>
            </div>

            <div className="pt-8">
              <p className="text-sm text-gray-500">
                Generated by LIMIT - Building Compliance Platform
              </p>
            </div>
          </div>
        </div>

        {/* Site Information Page */}
        <div className="page-break p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-blue-600">
            Site Information
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Project Name</p>
                <p className="text-lg text-gray-900">{siteData.projectName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Address</p>
                <p className="text-lg text-gray-900">{siteData.address}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Authority</p>
                <p className="text-lg text-gray-900">{siteData.authority}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Zone</p>
                <p className="text-lg text-gray-900">{siteData.zone}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Plot Details</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Dimensions</p>
                  <p className="text-lg text-gray-900">
                    {siteData.plotDimensions.length}m × {siteData.plotDimensions.width}m
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Total Area</p>
                  <p className="text-lg text-gray-900">
                    {siteData.plotDimensions.area.toFixed(2)} sq.m
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Corner Plot</p>
                  <p className="text-lg text-gray-900">{siteData.isCornerPlot ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Road Width</p>
                  <p className="text-lg text-gray-900">{siteData.roadWidthPrimary}m</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Intended Use</p>
                  <p className="text-lg text-gray-900">{siteData.intendedUse}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Location</p>
                  <p className="text-sm text-gray-900">
                    {siteData.location.lat.toFixed(6)}, {siteData.location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            {(siteData.specialConditions.heritage ||
              siteData.specialConditions.toz ||
              siteData.specialConditions.sez) && (
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Special Conditions</h3>
                <ul className="space-y-2">
                  {siteData.specialConditions.heritage && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Heritage Zone</span>
                    </li>
                  )}
                  {siteData.specialConditions.toz && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Traffic Optimization Zone (TOZ)</span>
                    </li>
                  )}
                  {siteData.specialConditions.sez && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Special Economic Zone (SEZ)</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Calculations Page */}
        {regulationResult && (
          <div className="page-break p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-blue-600">
              Regulation Calculations
            </h2>

            {/* FSI */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Floor Space Index (FSI)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {gdcrClauses.find((c) => c.category === 'FSI')?.clauseNumber}
              </p>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Base FSI</p>
                  <p className="text-2xl font-bold text-gray-900">{regulationResult.fsi.base}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Premium</p>
                  <p className="text-2xl font-bold text-blue-600">
                    +{regulationResult.fsi.premium.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Total FSI</p>
                  <p className="text-2xl font-bold text-green-600">
                    {regulationResult.fsi.total.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Max Built-up Area</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {regulationResult.fsi.maxBuiltUpArea.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500">sq.m</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded font-mono text-xs whitespace-pre-line">
                {regulationResult.fsi.calculation}
              </div>
            </div>

            {/* Height */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Building Height</h3>
              <p className="text-sm text-gray-600 mb-4">
                {gdcrClauses.find((c) => c.category === 'Height')?.clauseNumber}
              </p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Maximum Height</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {regulationResult.height.max.toFixed(2)}m
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Formula</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {regulationResult.height.formula}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Zone Limit</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {regulationResult.height.zoneLimit}m
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded font-mono text-xs whitespace-pre-line">
                {regulationResult.height.calculation}
              </div>
            </div>

            {/* Setbacks */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Setbacks</h3>
              <p className="text-sm text-gray-600 mb-4">
                {gdcrClauses.find((c) => c.category === 'Setbacks')?.clauseNumber}
              </p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Front Setback</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {regulationResult.setbacks.front}m
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Side Setback</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {regulationResult.setbacks.side}m
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Rear Setback</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {regulationResult.setbacks.rear}m
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded font-mono text-xs whitespace-pre-line">
                {regulationResult.setbacks.calculations}
              </div>
            </div>

            {/* Ground Coverage & Parking */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ground Coverage</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {gdcrClauses.find((c) => c.category === 'Ground Coverage')?.clauseNumber}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Maximum %</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {regulationResult.groundCoverage.maxPercentage}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Max Area</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {regulationResult.groundCoverage.maxArea.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500">sq.m</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Parking</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {gdcrClauses.find((c) => c.category === 'Parking')?.clauseNumber}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Required ECS</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {regulationResult.parking.required}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Area Required</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {regulationResult.parking.areaRequired.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500">sq.m</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fire Safety & Accessibility */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fire Safety</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {gdcrClauses.find((c) => c.category === 'Fire Safety')?.clauseNumber}
                </p>
                <ul className="space-y-2 text-sm">
                  {regulationResult.fireSafety.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessibility</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {gdcrClauses.find((c) => c.category === 'Accessibility')?.clauseNumber}
                </p>
                <ul className="space-y-2 text-sm">
                  {regulationResult.accessibility.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer Page */}
        <div className="page-break p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-yellow-600">
            Important Disclaimer
          </h2>

          <div className="space-y-6 text-gray-700">
            <div className="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-lg">
              <p className="font-semibold text-yellow-900 mb-3 text-lg">
                ADVISORY DOCUMENT ONLY
              </p>
              <p className="text-yellow-900">
                This report is generated automatically based on GDCR 2017 (Gujarat Development
                Control Regulations 2017) and is intended for preliminary advisory purposes only.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Verification Required</h3>
              <p>
                All calculations, requirements, and recommendations in this report must be verified
                with the local development authority ({siteData.authority}) before proceeding with
                any construction or development activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">No Liability</h3>
              <p>
                LIMIT and its operators assume no liability for decisions made based on this report.
                This document does not constitute official approval or clearance from any
                government authority.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Consultation</h3>
              <p>
                Always consult with licensed architects, structural engineers, and legal advisors
                for final building designs and regulatory compliance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Regulation Updates</h3>
              <p>
                Building regulations are subject to amendments and updates. Verify that you are
                using the most current version of GDCR applicable to your project.
              </p>
            </div>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600">
                Report ID: <span className="font-mono font-semibold">{reportId}</span>
                <br />
                Generated: {new Date(project.updatedAt).toLocaleString()}
                <br />
                Platform: LIMIT - Building Compliance Platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}

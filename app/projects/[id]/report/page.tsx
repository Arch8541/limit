'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProject } from '@/lib/storage/projects-api';
import { Project } from '@/types';
import { Building2, ArrowLeft, Printer, MapPin, Ruler, Layers, Car, Flame, Accessibility, Calendar, Hash, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (params.id) {
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

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Building2 style={{ width: 36, height: 36, color: '#ffffff' }} />
          </div>
          <p style={{ color: '#6b7280', fontWeight: 500 }}>Loading report…</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: 16 }}>Report not found</p>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '8px 20px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { siteData, regulationResult, gdcrClauses, reportId } = project;

  return (
    <>
      {/* ── Toolbar (screen only) ── */}
      <div className="no-print" style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push(`/projects/${project.id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#374151', background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to Project
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#9ca3af', fontFamily: 'monospace' }}>
              {reportId}
            </span>
            <button
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e40af', color: '#ffffff', border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
            >
              <Printer style={{ width: 16, height: 16 }} />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Report body ── */}
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '40px 20px' }} className="report-root">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* ── PAGE 1: Cover ── */}
          <div className="report-page" style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', marginBottom: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)' }}>
            {/* Blue top bar */}
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)', padding: '48px 56px 40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                  <Building2 style={{ width: 32, height: 32, color: '#ffffff' }} />
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.5px' }}>LIMIT</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>Building Compliance Platform</div>
                </div>
              </div>
              <h1 style={{ color: '#ffffff', fontSize: 34, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                Building Regulation Report
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, margin: 0 }}>
                GDCR 2017 Compliance Analysis — {siteData.authority}
              </p>
            </div>

            {/* Meta grid */}
            <div style={{ padding: '36px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24, borderBottom: '1px solid #f1f5f9' }}>
              {[
                { icon: <Hash style={{ width: 15, height: 15 }} />, label: 'Report ID', value: reportId || '—' },
                { icon: <Calendar style={{ width: 15, height: 15 }} />, label: 'Generated', value: new Date(project.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { icon: <Building2 style={{ width: 15, height: 15 }} />, label: 'Authority', value: siteData.authority },
                { icon: <MapPin style={{ width: 15, height: 15 }} />, label: 'Zone', value: siteData.zone },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    {item.icon}{item.label}
                  </div>
                  <div style={{ color: '#111827', fontWeight: 600, fontSize: 14 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Project name banner */}
            <div style={{ padding: '28px 56px', background: '#f8fafc' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Project Name</div>
              <div style={{ fontSize: 26, color: '#111827', fontWeight: 700, letterSpacing: '-0.3px' }}>{siteData.projectName}</div>
              {siteData.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: '#6b7280', fontSize: 14 }}>
                  <MapPin style={{ width: 14, height: 14 }} />
                  {siteData.address}
                </div>
              )}
            </div>
          </div>

          {/* ── PAGE 2: Site Information ── */}
          <div className="report-page" style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', marginBottom: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)' }}>
            <SectionHeader icon={<Ruler style={{ width: 18, height: 18 }} />} title="Site Information" />
            <div style={{ padding: '32px 40px' }}>

              {/* 2×2 top grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <InfoCard label="Project Name" value={siteData.projectName} />
                <InfoCard label="Site Address" value={siteData.address || '—'} />
                <InfoCard label="Authority" value={siteData.authority} />
                <InfoCard label="Intended Use" value={siteData.intendedUse} />
              </div>

              {/* Plot dimensions */}
              <SectionSubHeading title="Plot Details" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                <MetricCard
                  label="Plot Dimensions"
                  value={`${siteData.plotDimensions.length} × ${siteData.plotDimensions.width}`}
                  unit="m"
                  color="#1e40af"
                />
                <MetricCard
                  label="Total Plot Area"
                  value={siteData.plotDimensions.area.toFixed(2)}
                  unit="sq.m"
                  color="#1e40af"
                />
                <MetricCard
                  label="Primary Road Width"
                  value={siteData.roadWidthPrimary.toString()}
                  unit="m"
                  color="#0369a1"
                />
                {siteData.roadWidthSecondary && (
                  <MetricCard label="Secondary Road Width" value={siteData.roadWidthSecondary.toString()} unit="m" color="#0369a1" />
                )}
                <MetricCard
                  label="Corner Plot"
                  value={siteData.isCornerPlot ? 'Yes' : 'No'}
                  color={siteData.isCornerPlot ? '#15803d' : '#6b7280'}
                  icon={siteData.isCornerPlot ? <CheckCircle style={{ width: 14, height: 14 }} /> : undefined}
                />
                <MetricCard
                  label="Zone Classification"
                  value={siteData.zone}
                  color="#7c3aed"
                />
              </div>

              {/* GPS coordinates */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <MapPin style={{ width: 16, height: 16, color: '#6b7280' }} />
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>GPS Coordinates:</span>
                <span style={{ fontSize: 13, color: '#111827', fontFamily: 'monospace', fontWeight: 600 }}>
                  {siteData.location.lat.toFixed(6)}, {siteData.location.lng.toFixed(6)}
                </span>
              </div>

              {/* Special conditions */}
              {(siteData.specialConditions.heritage || siteData.specialConditions.toz || siteData.specialConditions.sez) && (
                <>
                  <SectionSubHeading title="Special Conditions" />
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {siteData.specialConditions.heritage && <SpecialBadge label="Heritage Zone" color="#b45309" bg="#fef3c7" />}
                    {siteData.specialConditions.toz && <SpecialBadge label="Traffic Optimization Zone (TOZ)" color="#0369a1" bg="#e0f2fe" />}
                    {siteData.specialConditions.sez && <SpecialBadge label="Special Economic Zone (SEZ)" color="#15803d" bg="#dcfce7" />}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── PAGE 3: Regulation Calculations ── */}
          {regulationResult && (
            <div className="report-page" style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', marginBottom: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <SectionHeader icon={<Layers style={{ width: 18, height: 18 }} />} title="Regulation Calculations" />
              <div style={{ padding: '32px 40px' }}>

                {/* FSI */}
                <CalcSection
                  title="Floor Space Index (FSI)"
                  clause={gdcrClauses?.find(c => c.category === 'FSI')?.clauseNumber}
                  color="#1e40af"
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
                    <NumberCard label="Base FSI" value={regulationResult.fsi.base.toString()} color="#64748b" />
                    <NumberCard label="Premium FSI" value={`+${regulationResult.fsi.premium.toFixed(2)}`} color="#0369a1" />
                    <NumberCard label="Total FSI" value={regulationResult.fsi.total.toFixed(2)} color="#15803d" highlight />
                    <NumberCard label="Max Built-up Area" value={`${regulationResult.fsi.maxBuiltUpArea.toFixed(0)} sq.m`} color="#1e40af" />
                  </div>
                  <CalcBox text={regulationResult.fsi.calculation} />
                </CalcSection>

                <Divider />

                {/* Height */}
                <CalcSection
                  title="Building Height"
                  clause={gdcrClauses?.find(c => c.category === 'Height')?.clauseNumber}
                  color="#0369a1"
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
                    <NumberCard label="Maximum Height" value={`${regulationResult.height.max.toFixed(2)} m`} color="#0369a1" highlight />
                    <NumberCard label="Zone Limit" value={`${regulationResult.height.zoneLimit} m`} color="#64748b" />
                    <NumberCard label="Formula" value={regulationResult.height.formula} color="#7c3aed" />
                  </div>
                  <CalcBox text={regulationResult.height.calculation} />
                </CalcSection>

                <Divider />

                {/* Setbacks */}
                <CalcSection
                  title="Setback Requirements"
                  clause={gdcrClauses?.find(c => c.category === 'Setbacks')?.clauseNumber}
                  color="#15803d"
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
                    <NumberCard label="Front Setback" value={`${regulationResult.setbacks.front} m`} color="#15803d" highlight />
                    <NumberCard label="Side Setback" value={`${regulationResult.setbacks.side} m`} color="#15803d" />
                    <NumberCard label="Rear Setback" value={`${regulationResult.setbacks.rear} m`} color="#15803d" />
                  </div>
                  <CalcBox text={regulationResult.setbacks.calculations} />
                </CalcSection>

                <Divider />

                {/* Ground Coverage + Parking side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <CalcSection
                    title="Ground Coverage"
                    clause={gdcrClauses?.find(c => c.category === 'Ground Coverage')?.clauseNumber}
                    color="#b45309"
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <NumberCard label="Max Coverage" value={`${regulationResult.groundCoverage.maxPercentage}%`} color="#b45309" highlight />
                      <NumberCard label="Max Area" value={`${regulationResult.groundCoverage.maxArea.toFixed(0)} sq.m`} color="#b45309" />
                    </div>
                  </CalcSection>

                  <CalcSection
                    title="Parking Requirements"
                    clause={gdcrClauses?.find(c => c.category === 'Parking')?.clauseNumber}
                    color="#7c3aed"
                    icon={<Car style={{ width: 16, height: 16 }} />}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <NumberCard label="Required ECS" value={regulationResult.parking.required.toString()} color="#7c3aed" highlight />
                      <NumberCard label="Area Required" value={`${regulationResult.parking.areaRequired.toFixed(0)} sq.m`} color="#7c3aed" />
                    </div>
                  </CalcSection>
                </div>

                <Divider />

                {/* Fire Safety + Accessibility */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <CalcSection
                    title="Fire Safety"
                    clause={gdcrClauses?.find(c => c.category === 'Fire Safety')?.clauseNumber}
                    color="#dc2626"
                    icon={<Flame style={{ width: 16, height: 16 }} />}
                  >
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {regulationResult.fireSafety.requirements.map((req: string, i: number) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', flexShrink: 0, marginTop: 6 }} />
                          <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CalcSection>

                  <CalcSection
                    title="Accessibility"
                    clause={gdcrClauses?.find(c => c.category === 'Accessibility')?.clauseNumber}
                    color="#0369a1"
                    icon={<Accessibility style={{ width: 16, height: 16 }} />}
                  >
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {regulationResult.accessibility.requirements.map((req: string, i: number) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0369a1', flexShrink: 0, marginTop: 6 }} />
                          <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CalcSection>
                </div>
              </div>
            </div>
          )}

          {/* ── PAGE 4: Disclaimer ── */}
          <div className="report-page" style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', marginBottom: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)' }}>
            <SectionHeader icon={<AlertTriangle style={{ width: 18, height: 18 }} />} title="Important Disclaimer" color="#b45309" bg="#fef3c7" />
            <div style={{ padding: '32px 40px' }}>
              <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <AlertTriangle style={{ width: 18, height: 18, color: '#92400e' }} />
                  <span style={{ fontWeight: 700, color: '#92400e', fontSize: 15 }}>ADVISORY DOCUMENT ONLY</span>
                </div>
                <p style={{ color: '#78350f', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  This report is generated automatically based on GDCR 2017 (Gujarat Development Control Regulations 2017)
                  and is intended for preliminary advisory purposes only.
                </p>
              </div>

              {[
                { title: 'Verification Required', text: `All calculations, requirements, and recommendations must be verified with the local development authority (${siteData.authority}) before proceeding with any construction or development activities.` },
                { title: 'No Liability', text: 'LIMIT and its operators assume no liability for decisions made based on this report. This document does not constitute official approval or clearance from any government authority.' },
                { title: 'Professional Consultation', text: 'Always consult with licensed architects, structural engineers, and legal advisors for final building designs and regulatory compliance.' },
                { title: 'Regulation Updates', text: 'Building regulations are subject to amendments and updates. Verify that you are using the most current version of GDCR applicable to your project.' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <h4 style={{ color: '#111827', fontWeight: 700, fontSize: 14, margin: '0 0 6px' }}>{item.title}</h4>
                  <p style={{ color: '#4b5563', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{item.text}</p>
                </div>
              ))}

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, marginTop: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Report ID', value: reportId || '—' },
                    { label: 'Generated', value: new Date(project.updatedAt).toLocaleString('en-IN') },
                    { label: 'Platform', value: 'LIMIT — Building Compliance Platform' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: '#374151', fontFamily: 'monospace' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .report-root, .report-root * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }
        body:has(.report-root) {
          background-color: #f3f4f6 !important;
          color: #111827 !important;
        }
        @media print {
          .no-print { display: none !important; }
          body { background-color: #ffffff !important; color: #111827 !important; margin: 0 !important; padding: 0 !important; }
          .report-root { background-color: #ffffff !important; padding: 0 !important; }
          .report-page { box-shadow: none !important; border-radius: 0 !important; margin-bottom: 0 !important; page-break-after: always; }
          .report-page:last-child { page-break-after: avoid; }
          @page { margin: 0; size: A4; }
          * { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
        }
      `}</style>
    </>
  );
}

/* ── Sub-components ── */

function SectionHeader({ icon, title, color = '#1e40af', bg = '#eff6ff' }: { icon: React.ReactNode; title: string; color?: string; bg?: string }) {
  return (
    <div style={{ background: bg, borderBottom: `3px solid ${color}`, padding: '18px 40px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ color }}>{icon}</span>
      <h2 style={{ color: '#111827', fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>{title}</h2>
    </div>
  );
}

function SectionSubHeading({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <h3 style={{ color: '#374151', fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 18px', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function MetricCard({ label, value, unit, color, icon }: { label: string; value: string; unit?: string; color: string; icon?: React.ReactNode }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 18px', border: `1px solid ${color}20`, borderLeft: `3px solid ${color}` }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        {icon && <span style={{ color }}>{icon}</span>}
        <span style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: '-0.5px' }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{unit}</span>}
      </div>
    </div>
  );
}

function CalcSection({ title, clause, color, children, icon }: { title: string; clause?: string; color: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ color }}>{icon}</span>}
          <h3 style={{ color: '#111827', fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</h3>
        </div>
        {clause && (
          <span style={{ fontSize: 11, color: '#6b7280', background: '#f1f5f9', padding: '3px 10px', borderRadius: 20, fontFamily: 'monospace', fontWeight: 600 }}>
            Clause {clause}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function NumberCard({ label, value, color, highlight }: { label: string; value: string; color: string; highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? `${color}08` : '#f8fafc', borderRadius: 10, padding: '14px 16px', border: highlight ? `1.5px solid ${color}30` : '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: highlight ? color : '#1e293b', letterSpacing: '-0.3px' }}>{value}</div>
    </div>
  );
}

function CalcBox({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#374151', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
      {text}
    </div>
  );
}

function SpecialBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ background: bg, color, fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20, border: `1px solid ${color}30` }}>
      {label}
    </span>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#f1f5f9', margin: '24px 0' }} />;
}

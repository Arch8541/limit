'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface IsometricBuildingProps {
  plotWidth: number;
  plotDepth: number;
  buildingHeight: number;
  setbacks: {
    front: number;
    rear: number;
    side: number;
  };
  groundCoverage: number;
  fsiUtilization?: number;
  className?: string;
}

export function IsometricBuilding({
  plotWidth,
  plotDepth,
  buildingHeight,
  setbacks,
  groundCoverage,
  fsiUtilization,
  className = '',
}: IsometricBuildingProps) {
  // Calculate building dimensions
  const buildingWidth = Math.max(plotWidth - setbacks.side * 2, 0);
  const buildingDepth = Math.max(plotDepth - setbacks.front - setbacks.rear, 0);

  // Calculate number of floors (assuming 3m per floor)
  const numFloors = Math.floor(buildingHeight / 3);

  // SVG isometric projection constants
  const ISO_ANGLE = Math.PI / 6; // 30 degrees
  const ISO_COS = Math.cos(ISO_ANGLE);
  const ISO_SIN = Math.sin(ISO_ANGLE);

  // Scale factor for visualization (fit within 600x500 view)
  const maxDimension = Math.max(plotWidth, plotDepth);
  const baseScale = Math.min(400 / maxDimension, 15);

  // Isometric projection helper functions
  const isoX = (x: number, y: number) => (x - y) * ISO_COS * baseScale;
  const isoY = (x: number, y: number, z: number) =>
    (x + y) * ISO_SIN * baseScale - z * baseScale * 0.8;

  // Calculate viewBox dimensions
  const viewWidth = 700;
  const viewHeight = 600;
  const centerX = viewWidth / 2;
  const centerY = viewHeight / 1.8;

  // Building coordinates in 3D space
  const plotX = plotWidth;
  const plotY = plotDepth;
  const buildX = buildingWidth;
  const buildY = buildingDepth;
  const buildZ = buildingHeight;

  // Plot corners in isometric projection
  const plotCorners = {
    origin: { x: centerX + isoX(0, 0), y: centerY + isoY(0, 0, 0) },
    frontRight: { x: centerX + isoX(plotX, 0), y: centerY + isoY(plotX, 0, 0) },
    backRight: { x: centerX + isoX(plotX, plotY), y: centerY + isoY(plotX, plotY, 0) },
    backLeft: { x: centerX + isoX(0, plotY), y: centerY + isoY(0, plotY, 0) },
  };

  // Building base position (with setbacks)
  const buildingOffsetX = setbacks.side;
  const buildingOffsetY = setbacks.front;

  // Building corners at ground level
  const buildingBase = {
    origin: {
      x: centerX + isoX(buildingOffsetX, buildingOffsetY),
      y: centerY + isoY(buildingOffsetX, buildingOffsetY, 0)
    },
    frontRight: {
      x: centerX + isoX(buildingOffsetX + buildX, buildingOffsetY),
      y: centerY + isoY(buildingOffsetX + buildX, buildingOffsetY, 0)
    },
    backRight: {
      x: centerX + isoX(buildingOffsetX + buildX, buildingOffsetY + buildY),
      y: centerY + isoY(buildingOffsetX + buildX, buildingOffsetY + buildY, 0)
    },
    backLeft: {
      x: centerX + isoX(buildingOffsetX, buildingOffsetY + buildY),
      y: centerY + isoY(buildingOffsetX, buildingOffsetY + buildY, 0)
    },
  };

  // Building corners at roof level
  const buildingTop = {
    origin: {
      x: centerX + isoX(buildingOffsetX, buildingOffsetY),
      y: centerY + isoY(buildingOffsetX, buildingOffsetY, buildZ)
    },
    frontRight: {
      x: centerX + isoX(buildingOffsetX + buildX, buildingOffsetY),
      y: centerY + isoY(buildingOffsetX + buildX, buildingOffsetY, buildZ)
    },
    backRight: {
      x: centerX + isoX(buildingOffsetX + buildX, buildingOffsetY + buildY),
      y: centerY + isoY(buildingOffsetX + buildX, buildingOffsetY + buildY, buildZ)
    },
    backLeft: {
      x: centerX + isoX(buildingOffsetX, buildingOffsetY + buildY),
      y: centerY + isoY(buildingOffsetX, buildingOffsetY + buildY, buildZ)
    },
  };

  // Road position (in front of plot)
  const roadWidth = 40;
  const roadStart = centerY + isoY(0, 0, 0) + 20;

  return (
    <Card className={`overflow-hidden border-slate-200/60 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 font-mono">Building Visualization</h3>
            <p className="text-sm text-slate-600 mt-1 font-mono">Isometric 3D View - GDCR Compliant Envelope</p>
          </div>
          {fsiUtilization && (
            <div className="text-right">
              <p className="text-sm text-slate-600 font-mono">FSI Utilization</p>
              <p className="text-3xl font-bold text-cyan-600 font-mono">{fsiUtilization.toFixed(1)}%</p>
            </div>
          )}
        </div>

        {/* SVG Isometric Visualization */}
        <div className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden border border-slate-200">
          <svg
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            className="w-full h-auto"
            style={{ minHeight: '500px' }}
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
              <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>
              <linearGradient id="buildingFrontGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="buildingSideGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0369a1" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="podiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
            </defs>

            {/* Road with dashed markings */}
            <rect
              x="50"
              y={roadStart}
              width={viewWidth - 100}
              height={roadWidth}
              fill="url(#roadGrad)"
            />
            {/* Dashed lane markings */}
            <line
              x1="50"
              y1={roadStart + roadWidth / 2}
              x2={viewWidth - 50}
              y2={roadStart + roadWidth / 2}
              stroke="white"
              strokeWidth="2"
              strokeDasharray="15,10"
              opacity="0.7"
            />

            {/* Plot ground */}
            <path
              d={`
                M ${plotCorners.origin.x} ${plotCorners.origin.y}
                L ${plotCorners.frontRight.x} ${plotCorners.frontRight.y}
                L ${plotCorners.backRight.x} ${plotCorners.backRight.y}
                L ${plotCorners.backLeft.x} ${plotCorners.backLeft.y}
                Z
              `}
              fill="url(#groundGrad)"
              stroke="#4b5563"
              strokeWidth="2"
            />

            {/* Setback boundary lines */}
            <path
              d={`
                M ${buildingBase.origin.x} ${buildingBase.origin.y}
                L ${buildingBase.frontRight.x} ${buildingBase.frontRight.y}
                L ${buildingBase.backRight.x} ${buildingBase.backRight.y}
                L ${buildingBase.backLeft.x} ${buildingBase.backLeft.y}
                Z
              `}
              fill="rgba(20, 184, 166, 0.05)"
              stroke="#14b8a6"
              strokeWidth="2"
              strokeDasharray="8,4"
            />

            {/* Ground floor podium (darker base) */}
            <g>
              {/* Front face of podium */}
              <path
                d={`
                  M ${buildingBase.origin.x} ${buildingBase.origin.y}
                  L ${buildingBase.frontRight.x} ${buildingBase.frontRight.y}
                  L ${buildingBase.frontRight.x} ${buildingBase.frontRight.y + baseScale * 0.5}
                  L ${buildingBase.origin.x} ${buildingBase.origin.y + baseScale * 0.5}
                  Z
                `}
                fill="url(#podiumGrad)"
                stroke="#4b5563"
                strokeWidth="1"
              />
              {/* Right face of podium */}
              <path
                d={`
                  M ${buildingBase.frontRight.x} ${buildingBase.frontRight.y}
                  L ${buildingBase.backRight.x} ${buildingBase.backRight.y}
                  L ${buildingBase.backRight.x} ${buildingBase.backRight.y + baseScale * 0.5}
                  L ${buildingBase.frontRight.x} ${buildingBase.frontRight.y + baseScale * 0.5}
                  Z
                `}
                fill="#6b7280"
                stroke="#4b5563"
                strokeWidth="1"
              />
            </g>

            {/* Main building structure */}
            {/* Front face - Blue glass with horizontal window bands */}
            <path
              d={`
                M ${buildingBase.origin.x} ${buildingBase.origin.y}
                L ${buildingBase.frontRight.x} ${buildingBase.frontRight.y}
                L ${buildingTop.frontRight.x} ${buildingTop.frontRight.y}
                L ${buildingTop.origin.x} ${buildingTop.origin.y}
                Z
              `}
              fill="url(#buildingFrontGrad)"
              stroke="#0369a1"
              strokeWidth="2"
            />

            {/* Horizontal window bands on front face */}
            {Array.from({ length: numFloors }).map((_, i) => {
              const floorRatio = (i + 1) / (numFloors + 1);
              const y1 = buildingBase.origin.y - buildZ * baseScale * 0.8 * floorRatio;
              const y2 = buildingBase.frontRight.y - buildZ * baseScale * 0.8 * floorRatio;

              return (
                <g key={`floor-${i}`}>
                  {/* Light blue window band */}
                  <line
                    x1={buildingBase.origin.x}
                    y1={y1}
                    x2={buildingBase.frontRight.x}
                    y2={y2}
                    stroke="#e0f2fe"
                    strokeWidth="4"
                    opacity="0.8"
                  />
                  {/* Dark structural line */}
                  <line
                    x1={buildingBase.origin.x}
                    y1={y1 + 2}
                    x2={buildingBase.frontRight.x}
                    y2={y2 + 2}
                    stroke="#0c4a6e"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* Vertical structural lines on front face */}
            {Array.from({ length: 5 }).map((_, i) => {
              const ratio = i / 4;
              const x1 = buildingBase.origin.x + (buildingBase.frontRight.x - buildingBase.origin.x) * ratio;
              const y1 = buildingBase.origin.y + (buildingBase.frontRight.y - buildingBase.origin.y) * ratio;
              const x2 = buildingTop.origin.x + (buildingTop.frontRight.x - buildingTop.origin.x) * ratio;
              const y2 = buildingTop.origin.y + (buildingTop.frontRight.y - buildingTop.origin.y) * ratio;

              return (
                <line
                  key={`vert-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#0369a1"
                  strokeWidth="1"
                  opacity="0.3"
                />
              );
            })}

            {/* Right side face - Darker blue glass */}
            <path
              d={`
                M ${buildingBase.frontRight.x} ${buildingBase.frontRight.y}
                L ${buildingBase.backRight.x} ${buildingBase.backRight.y}
                L ${buildingTop.backRight.x} ${buildingTop.backRight.y}
                L ${buildingTop.frontRight.x} ${buildingTop.frontRight.y}
                Z
              `}
              fill="url(#buildingSideGrad)"
              stroke="#0369a1"
              strokeWidth="2"
            />

            {/* Horizontal window bands on side face */}
            {Array.from({ length: numFloors }).map((_, i) => {
              const floorRatio = (i + 1) / (numFloors + 1);
              const y1 = buildingBase.frontRight.y - buildZ * baseScale * 0.8 * floorRatio;
              const y2 = buildingBase.backRight.y - buildZ * baseScale * 0.8 * floorRatio;

              return (
                <line
                  key={`side-floor-${i}`}
                  x1={buildingBase.frontRight.x}
                  y1={y1}
                  x2={buildingBase.backRight.x}
                  y2={y2}
                  stroke="#bae6fd"
                  strokeWidth="3"
                  opacity="0.5"
                />
              );
            })}

            {/* Roof - Light gray flat surface */}
            <path
              d={`
                M ${buildingTop.origin.x} ${buildingTop.origin.y}
                L ${buildingTop.frontRight.x} ${buildingTop.frontRight.y}
                L ${buildingTop.backRight.x} ${buildingTop.backRight.y}
                L ${buildingTop.backLeft.x} ${buildingTop.backLeft.y}
                Z
              `}
              fill="url(#roofGrad)"
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Mechanical equipment on roof */}
            {/* HVAC Unit 1 - Cylinder */}
            <ellipse
              cx={buildingTop.origin.x + 30}
              cy={buildingTop.origin.y - 5}
              rx="12"
              ry="6"
              fill="#64748b"
              stroke="#475569"
              strokeWidth="1"
            />
            <rect
              x={buildingTop.origin.x + 18}
              y={buildingTop.origin.y - 5}
              width="24"
              height="15"
              fill="#64748b"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* HVAC Unit 2 - Box */}
            <rect
              x={buildingTop.backLeft.x - 35}
              y={buildingTop.backLeft.y - 8}
              width="25"
              height="18"
              fill="#94a3b8"
              stroke="#64748b"
              strokeWidth="1"
              rx="2"
            />

            {/* Water Tank - Cylinder */}
            <ellipse
              cx={(buildingTop.frontRight.x + buildingTop.backRight.x) / 2 - 20}
              cy={(buildingTop.frontRight.y + buildingTop.backRight.y) / 2}
              rx="15"
              ry="8"
              fill="#475569"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Trees around building */}
            {/* Tree 1 - Front left */}
            <g transform={`translate(${plotCorners.origin.x + 40}, ${plotCorners.origin.y - 10})`}>
              {/* Trunk */}
              <rect x="-3" y="0" width="6" height="20" fill="#78350f" />
              {/* Foliage - triangular */}
              <path
                d="M 0,-25 L -15,5 L 15,5 Z"
                fill="#22c55e"
                stroke="#16a34a"
                strokeWidth="1"
              />
              <path
                d="M 0,-20 L -12,0 L 12,0 Z"
                fill="#4ade80"
                stroke="#22c55e"
                strokeWidth="1"
              />
            </g>

            {/* Tree 2 - Front right */}
            <g transform={`translate(${plotCorners.frontRight.x - 40}, ${plotCorners.frontRight.y - 10})`}>
              <rect x="-3" y="0" width="6" height="18" fill="#78350f" />
              <circle cx="0" cy="-10" r="14" fill="#22c55e" stroke="#16a34a" strokeWidth="1" />
              <circle cx="0" cy="-12" r="11" fill="#4ade80" stroke="#22c55e" strokeWidth="1" />
            </g>

            {/* Tree 3 - Back left */}
            <g transform={`translate(${plotCorners.backLeft.x + 35}, ${plotCorners.backLeft.y - 10})`}>
              <rect x="-2.5" y="0" width="5" height="16" fill="#78350f" />
              <path
                d="M 0,-22 L -13,3 L 13,3 Z"
                fill="#10b981"
                stroke="#059669"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>

        {/* Dimension Labels */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600">Plot Dimensions:</span>
              <span className="font-bold text-slate-900">{plotWidth}m × {plotDepth}m</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600">Building Size:</span>
              <span className="font-bold text-slate-900">
                {buildingWidth.toFixed(1)}m × {buildingDepth.toFixed(1)}m
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600">Height:</span>
              <span className="font-bold text-cyan-600">{buildingHeight.toFixed(1)}m</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600">Floors:</span>
              <span className="font-bold text-slate-900">~{numFloors}</span>
            </div>
          </div>

          <div className="glass rounded-xl p-4 font-mono text-xs space-y-2">
            <div className="font-bold text-slate-900 mb-2">Setbacks (m)</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-slate-600 text-[10px]">FRONT</div>
                <div className="font-bold text-cyan-600">{setbacks.front}</div>
              </div>
              <div>
                <div className="text-slate-600 text-[10px]">SIDE</div>
                <div className="font-bold text-cyan-600">{setbacks.side}</div>
              </div>
              <div>
                <div className="text-slate-600 text-[10px]">REAR</div>
                <div className="font-bold text-cyan-600">{setbacks.rear}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-sky-500 to-cyan-500 rounded border border-slate-300" />
            <span className="text-slate-700">Glass Facade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-slate-300 to-slate-400 rounded border border-slate-300" />
            <span className="text-slate-700">Roof</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-dashed border-teal-500 bg-teal-500/10 rounded" />
            <span className="text-slate-700">Setback Lines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-700 rounded border border-slate-300" />
            <span className="text-slate-700">Road</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

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

  // Scale for visualization (target 400px for average plot)
  const scale = Math.min(400 / Math.max(plotWidth, plotDepth), 20);

  // Scaled dimensions
  const plotW = plotWidth * scale;
  const plotD = plotDepth * scale;
  const buildingW = buildingWidth * scale;
  const buildingD = buildingDepth * scale;
  const buildingH = buildingHeight * scale * 1.5; // Height scale factor

  const setbackFront = setbacks.front * scale;
  const setbackSide = setbacks.side * scale;

  // Calculate number of floors for window bands (assuming 3m per floor)
  const numFloors = Math.floor(buildingHeight / 3);

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

        {/* Isometric Container */}
        <div className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden border border-slate-200">
          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          <div className="relative min-h-[500px] flex items-center justify-center p-8">
            <div
              className="relative"
              style={{
                transform: 'rotateX(60deg) rotateZ(-45deg)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Plot Ground */}
              <div
                className="relative"
                style={{
                  width: `${plotW}px`,
                  height: `${plotD}px`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Ground Surface */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-400 border-4 border-stone-500"
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }}
                />

                {/* Road on Front Side */}
                <div
                  className="absolute bg-slate-700"
                  style={{
                    width: `${plotW}px`,
                    height: '60px',
                    bottom: '-65px',
                    left: 0,
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Road Dashed Lines */}
                  <div
                    className="absolute top-1/2 left-0 right-0 h-0.5 bg-white opacity-80"
                    style={{
                      transform: 'translateY(-50%)',
                      backgroundImage: 'repeating-linear-gradient(90deg, white 0, white 15px, transparent 15px, transparent 25px)',
                    }}
                  />
                </div>

                {/* Setback Lines */}
                <div
                  className="absolute border-2 border-dashed border-teal-500 bg-teal-500/5"
                  style={{
                    left: `${setbackSide}px`,
                    top: `${setbackFront}px`,
                    width: `${buildingW}px`,
                    height: `${buildingD}px`,
                  }}
                />

                {/* Building Structure - Isometric 3D */}
                <div
                  className="absolute"
                  style={{
                    left: `${setbackSide}px`,
                    top: `${setbackFront}px`,
                    width: `${buildingW}px`,
                    height: `${buildingD}px`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Ground Floor Podium (Darker) */}
                  <div
                    className="absolute bottom-0 bg-gradient-to-br from-slate-400 to-slate-500"
                    style={{
                      width: '100%',
                      height: '100%',
                      transform: `translateZ(${scale * 0.45}px)`,
                      boxShadow: 'inset 0 -2px 8px rgba(0,0,0,0.2)',
                    }}
                  />

                  {/* Main Building Mass */}
                  {/* Front Face - Blue Glass */}
                  <div
                    className="absolute bottom-0 bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600"
                    style={{
                      width: `${buildingW}px`,
                      height: `${buildingH}px`,
                      transformOrigin: 'bottom',
                      transform: `translateZ(${buildingD}px)`,
                      boxShadow: 'inset 0 0 40px rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Horizontal Window Bands */}
                    {Array.from({ length: numFloors }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-white/40 via-white/60 to-white/40"
                        style={{
                          bottom: `${((i + 1) / numFloors) * 100}%`,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }}
                      />
                    ))}
                    {/* Vertical Grid Lines */}
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={`v${i}`}
                        className="absolute top-0 bottom-0 w-[2px] bg-white/20"
                        style={{
                          left: `${((i + 1) / 5) * 100}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Right Face - Blue Glass (Darker) */}
                  <div
                    className="absolute bottom-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"
                    style={{
                      width: `${buildingD}px`,
                      height: `${buildingH}px`,
                      transformOrigin: 'bottom left',
                      transform: 'rotateY(90deg)',
                      right: `-${buildingD}px`,
                      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Horizontal Window Bands */}
                    {Array.from({ length: numFloors }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-white/20 via-white/30 to-white/20"
                        style={{
                          bottom: `${((i + 1) / numFloors) * 100}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Roof - Gray with Equipment */}
                  <div
                    className="absolute bg-gradient-to-br from-slate-300 to-slate-400"
                    style={{
                      width: `${buildingW}px`,
                      height: `${buildingD}px`,
                      transformOrigin: 'bottom',
                      transform: `translateY(-${buildingH}px) rotateX(-90deg)`,
                      boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    {/* Mechanical Equipment Boxes */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-slate-500 rounded-sm shadow-lg" />
                    <div className="absolute top-4 right-4 w-6 h-12 bg-slate-500 rounded-sm shadow-lg" />
                    <div className="absolute bottom-4 left-1/3 w-10 h-6 bg-slate-500 rounded-sm shadow-lg" />
                  </div>
                </div>

                {/* Trees/Landscaping */}
                {/* Tree 1 - Front Left */}
                <div
                  className="absolute"
                  style={{
                    left: `${setbackSide * 0.3}px`,
                    top: `${setbackFront * 0.3}px`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="relative">
                    {/* Tree trunk */}
                    <div
                      className="w-2 h-12 bg-gradient-to-b from-amber-700 to-amber-800"
                      style={{ transform: 'translateZ(1px)' }}
                    />
                    {/* Tree foliage */}
                    <div
                      className="absolute -top-6 -left-3 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full"
                      style={{ transform: 'translateZ(2px)' }}
                    />
                  </div>
                </div>

                {/* Tree 2 - Front Right */}
                <div
                  className="absolute"
                  style={{
                    right: `${setbackSide * 0.4}px`,
                    top: `${setbackFront * 0.5}px`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="relative">
                    <div
                      className="w-2 h-10 bg-gradient-to-b from-amber-700 to-amber-800"
                      style={{ transform: 'translateZ(1px)' }}
                    />
                    <div
                      className="absolute -top-5 -left-2.5 w-7 h-7 bg-gradient-to-br from-green-400 to-green-700 rounded-full"
                      style={{ transform: 'translateZ(2px)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dimension Labels Overlay */}
          <div className="absolute top-6 left-6 glass rounded-xl p-4 font-mono text-xs space-y-2 max-w-xs">
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

          {/* Setback Indicators */}
          <div className="absolute bottom-6 right-6 glass rounded-xl p-4 font-mono text-xs space-y-2">
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
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-sky-500 to-blue-600 rounded border border-slate-300" />
            <span className="text-slate-700">Building Facade</span>
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

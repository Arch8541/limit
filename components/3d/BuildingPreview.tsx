'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Maximize2, Minimize2, RotateCw } from 'lucide-react';

interface BuildingPreviewProps {
  plotWidth: number;
  plotDepth: number;
  buildingHeight: number;
  setbacks: {
    front: number;
    rear: number;
    side: number;
  };
  groundCoverage: number;
  className?: string;
}

export function BuildingPreview({
  plotWidth,
  plotDepth,
  buildingHeight,
  setbacks,
  groundCoverage,
  className = '',
}: BuildingPreviewProps) {
  const [rotation, setRotation] = useState(0);
  const [is3D, setIs3D] = useState(true);

  const buildingWidth = plotWidth - setbacks.side * 2;
  const buildingDepth = plotDepth - setbacks.front - setbacks.rear;

  const scale = Math.min(300 / plotWidth, 300 / plotDepth);
  const heightScale = 2;

  const plotWidthScaled = plotWidth * scale;
  const plotDepthScaled = plotDepth * scale;
  const buildingWidthScaled = buildingWidth * scale;
  const buildingDepthScaled = buildingDepth * scale;
  const buildingHeightScaled = buildingHeight * heightScale;

  const frontSetbackScaled = setbacks.front * scale;
  const sideSetbackScaled = setbacks.side * scale;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Building Envelope Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setRotation((prev) => (prev + 45) % 360)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setIs3D(!is3D)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            title={is3D ? 'Switch to 2D' : 'Switch to 3D'}
          >
            {is3D ? <Minimize2 className="w-4 h-4 text-gray-600" /> : <Maximize2 className="w-4 h-4 text-gray-600" />}
          </button>
        </div>
      </div>

      <div
        className="relative w-full h-96 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl overflow-hidden"
        style={{ perspective: is3D ? '1000px' : 'none' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              transform: is3D
                ? `rotateX(60deg) rotateZ(${rotation}deg)`
                : `rotateZ(${rotation}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease',
            }}
          >
            {/* Plot Boundary */}
            <div
              className="relative border-4 border-stone-400 border-dashed bg-stone-200/30"
              style={{
                width: `${plotWidthScaled}px`,
                height: `${plotDepthScaled}px`,
              }}
            >
              {/* Setback Lines */}
              <div
                className="absolute border-2 border-teal-400 border-dashed bg-teal-50/20"
                style={{
                  left: `${sideSetbackScaled}px`,
                  top: `${frontSetbackScaled}px`,
                  width: `${buildingWidthScaled}px`,
                  height: `${buildingDepthScaled}px`,
                }}
              />

              {/* Building (3D representation) */}
              {is3D ? (
                <div
                  className="absolute"
                  style={{
                    left: `${sideSetbackScaled}px`,
                    top: `${frontSetbackScaled}px`,
                    width: `${buildingWidthScaled}px`,
                    height: `${buildingDepthScaled}px`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Building Front Face */}
                  <div
                    className="absolute bottom-0 left-0 bg-gradient-to-br from-teal-600 to-teal-500 opacity-90 border border-teal-700"
                    style={{
                      width: `${buildingWidthScaled}px`,
                      height: `${buildingHeightScaled}px`,
                      transformOrigin: 'bottom',
                      transform: `translateZ(${buildingDepthScaled / 2}px)`,
                    }}
                  >
                    {/* Windows pattern */}
                    <div className="grid grid-cols-4 gap-2 p-2 h-full">
                      {Array.from({ length: Math.floor(buildingHeight / 3) * 4 }).map((_, i) => (
                        <div key={i} className="bg-cyan-200 rounded-sm opacity-70" />
                      ))}
                    </div>
                  </div>

                  {/* Building Top Face */}
                  <div
                    className="absolute left-0 bg-gradient-to-br from-teal-700 to-teal-600 opacity-80 border border-teal-800"
                    style={{
                      width: `${buildingWidthScaled}px`,
                      height: `${buildingDepthScaled}px`,
                      transformOrigin: 'top',
                      transform: `translateY(-${buildingHeightScaled}px) rotateX(90deg)`,
                    }}
                  />

                  {/* Building Side Face */}
                  <div
                    className="absolute bottom-0 bg-gradient-to-br from-teal-500 to-teal-400 opacity-85 border border-teal-600"
                    style={{
                      width: `${buildingDepthScaled}px`,
                      height: `${buildingHeightScaled}px`,
                      transformOrigin: 'left',
                      transform: `rotateY(90deg) translateZ(0)`,
                    }}
                  >
                    {/* Windows pattern */}
                    <div className="grid grid-cols-3 gap-2 p-2 h-full">
                      {Array.from({ length: Math.floor(buildingHeight / 3) * 3 }).map((_, i) => (
                        <div key={i} className="bg-cyan-200 rounded-sm opacity-70" />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="absolute bg-gradient-to-br from-teal-600 to-teal-500 opacity-80 border-2 border-teal-700 rounded-lg"
                  style={{
                    left: `${sideSetbackScaled}px`,
                    top: `${frontSetbackScaled}px`,
                    width: `${buildingWidthScaled}px`,
                    height: `${buildingDepthScaled}px`,
                  }}
                >
                  {/* Top view grid */}
                  <div className="grid grid-cols-4 grid-rows-4 gap-1 p-2 h-full">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="bg-cyan-200 rounded-sm opacity-60" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-600">Plot:</span>{' '}
              <span className="font-semibold text-gray-900">
                {plotWidth} × {plotDepth} m
              </span>
            </div>
            <div>
              <span className="text-gray-600">Building:</span>{' '}
              <span className="font-semibold text-gray-900">
                {buildingWidth.toFixed(1)} × {buildingDepth.toFixed(1)} m
              </span>
            </div>
            <div>
              <span className="text-gray-600">Height:</span>{' '}
              <span className="font-semibold text-gray-900">{buildingHeight.toFixed(1)} m</span>
            </div>
            <div>
              <span className="text-gray-600">Coverage:</span>{' '}
              <span className="font-semibold text-gray-900">{groundCoverage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-stone-400 border-dashed" />
          <span className="text-gray-600">Plot Boundary</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-teal-400 border-dashed bg-teal-50" />
          <span className="text-gray-600">Setback Lines</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-teal-600 to-teal-500" />
          <span className="text-gray-600">Building Envelope</span>
        </div>
      </div>
    </Card>
  );
}

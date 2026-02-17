'use client';

import React, { useState } from 'react';
import { MapPolygonPicker } from '@/components/ui/MapPolygonPicker';
import { Building2, CheckCircle2 } from 'lucide-react';

export default function TestPolygonPage() {
  const [polygonValue, setPolygonValue] = useState<{
    center: { lat: number; lng: number };
    polygon: { lat: number; lng: number }[];
    area: number;
    perimeter: number;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-teal-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Polygon Drawing Test
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Test the MapPolygonPicker component with site boundary demarcation
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Draw Site Boundary</h2>
          <MapPolygonPicker
            value={polygonValue || undefined}
            onChange={(data) => {
              setPolygonValue(data);
              console.log('Polygon data updated:', data);
            }}
          />
        </div>

        {polygonValue && (
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Polygon Data Output</h2>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 font-mono text-xs overflow-auto">
              <pre>{JSON.stringify(polygonValue, null, 2)}</pre>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                <p className="text-xs text-teal-700 font-medium mb-1">Total Area</p>
                <p className="text-2xl font-bold text-teal-900">
                  {polygonValue.area.toFixed(2)}
                  <span className="text-sm font-normal ml-1">m²</span>
                </p>
                <p className="text-xs text-teal-600 mt-1">
                  {(polygonValue.area * 10.764).toFixed(2)} sq ft
                </p>
                <p className="text-xs text-teal-600">
                  {(polygonValue.area * 0.000247105).toFixed(4)} acres
                </p>
              </div>

              <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                <p className="text-xs text-cyan-700 font-medium mb-1">Perimeter</p>
                <p className="text-2xl font-bold text-cyan-900">
                  {polygonValue.perimeter.toFixed(2)}
                  <span className="text-sm font-normal ml-1">m</span>
                </p>
                <p className="text-xs text-cyan-600 mt-1">
                  {(polygonValue.perimeter * 3.28084).toFixed(2)} feet
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <p className="text-xs text-purple-700 font-medium mb-1">Vertices</p>
                <p className="text-2xl font-bold text-purple-900">
                  {polygonValue.polygon.length}
                  <span className="text-sm font-normal ml-1">points</span>
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Geodesic calculations used
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-2">Center Coordinates</p>
              <p className="text-sm text-blue-900 font-mono">
                Lat: {polygonValue.center.lat.toFixed(6)}, Lng: {polygonValue.center.lng.toFixed(6)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

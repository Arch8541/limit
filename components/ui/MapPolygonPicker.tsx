'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Search, Maximize2 } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

// Dynamic import to avoid SSR issues with Leaflet
const MapPolygonDrawer = dynamic(() => import('./MapPolygonDrawer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-stone-100 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="shimmer w-16 h-16 rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

interface PolygonData {
  coordinates: { lat: number; lng: number }[];
  area: number; // in square meters
  perimeter: number; // in meters
}

interface MapPolygonPickerProps {
  value?: {
    center?: { lat: number; lng: number };
    polygon?: { lat: number; lng: number }[];
    area?: number;
    perimeter?: number;
  };
  onChange: (data: {
    center: { lat: number; lng: number };
    polygon: { lat: number; lng: number }[];
    area: number;
    perimeter: number;
  }) => void;
  className?: string;
}

export function MapPolygonPicker({ value, onChange, className = '' }: MapPolygonPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [center, setCenter] = useState<{ lat: number; lng: number }>(
    value?.center || { lat: 23.0225, lng: 72.5714 } // Ahmedabad default
  );
  const [polygonData, setPolygonData] = useState<PolygonData | null>(
    value?.polygon && value.area && value.perimeter
      ? {
          coordinates: value.polygon,
          area: value.area,
          perimeter: value.perimeter,
        }
      : null
  );

  useEffect(() => {
    if (value?.center) {
      setCenter(value.center);
    }
    if (value?.polygon && value.area && value.perimeter) {
      setPolygonData({
        coordinates: value.polygon,
        area: value.area,
        perimeter: value.perimeter,
      });
    }
  }, [value]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Using Nominatim (OpenStreetMap) geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Ahmedabad, Gujarat, India'
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const newCenter = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        setCenter(newCenter);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePolygonComplete = (data: PolygonData) => {
    setPolygonData(data);
    onChange({
      center,
      polygon: data.coordinates,
      area: data.area,
      perimeter: data.perimeter,
    });
  };

  const handlePolygonDelete = () => {
    setPolygonData(null);
  };

  // Helper function to format area
  const formatArea = (areaInSqM: number) => {
    const sqMeters = areaInSqM.toFixed(2);
    const sqFeet = (areaInSqM * 10.764).toFixed(2);
    const acres = (areaInSqM * 0.000247105).toFixed(4);
    return { sqMeters, sqFeet, acres };
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search for plot location (e.g., Vastrapur, SG Highway)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button onClick={handleSearch} isLoading={isSearching} disabled={!searchQuery.trim()}>
            Search
          </Button>
        </div>

        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Map Center</p>
              <p className="text-xs text-gray-500 mt-1">
                {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
              </p>
            </div>
          </div>

          {polygonData && (
            <div className="pt-3 border-t border-stone-200">
              <div className="flex items-start gap-2">
                <Maximize2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Site Boundary Drawn</p>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Area</p>
                      <p className="text-sm font-semibold text-teal-700">
                        {formatArea(polygonData.area).sqMeters} m²
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatArea(polygonData.area).sqFeet} sq ft
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatArea(polygonData.area).acres} acres
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Perimeter</p>
                      <p className="text-sm font-semibold text-teal-700">
                        {polygonData.perimeter.toFixed(2)} m
                      </p>
                      <p className="text-xs text-gray-500">
                        {(polygonData.perimeter * 3.28084).toFixed(2)} ft
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Vertices: {polygonData.coordinates.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!polygonData && (
            <div className="pt-3 border-t border-stone-200">
              <p className="text-xs text-gray-600 text-center">
                No site boundary drawn yet. Use the polygon tool on the map.
              </p>
            </div>
          )}
        </div>

        <MapPolygonDrawer
          center={center}
          initialPolygon={polygonData?.coordinates}
          onPolygonComplete={handlePolygonComplete}
          onPolygonDelete={handlePolygonDelete}
        />
      </div>
    </div>
  );
}

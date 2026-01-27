'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Search } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-stone-100 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="shimmer w-16 h-16 rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapPickerProps {
  value?: { lat: number; lng: number; address?: string };
  onChange: (location: { lat: number; lng: number; address?: string }) => void;
  className?: string;
}

export function MapPicker({ value, onChange, className = '' }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    value || { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat' }
  );

  useEffect(() => {
    if (value) {
      setSelectedLocation(value);
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
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name,
        };
        setSelectedLocation(location);
        onChange(location);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      // Reverse geocoding to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      const location = {
        lat,
        lng,
        address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      };
      setSelectedLocation(location);
      onChange(location);
    } catch (error) {
      const location = { lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` };
      setSelectedLocation(location);
      onChange(location);
    }
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

        <div className="glass rounded-2xl p-4 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Selected Location</p>
              <p className="text-xs text-gray-600 truncate">
                {selectedLocation.address || 'Click on map to select location'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
          <MapComponent
            center={[selectedLocation.lat, selectedLocation.lng]}
            zoom={15}
            onLocationSelect={handleMapClick}
            markerPosition={[selectedLocation.lat, selectedLocation.lng]}
          />
        </div>

        <p className="text-xs text-gray-500 text-center">
          Click on the map to pinpoint the exact plot location
        </p>
      </div>
    </div>
  );
}

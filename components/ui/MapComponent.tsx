'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  markerPosition?: [number, number];
}

export default function MapComponent({
  center,
  zoom = 13,
  onLocationSelect,
  markerPosition,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onLocationSelectRef = useRef(onLocationSelect);

  // Keep callback ref updated
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add click event using ref to always get latest callback
    map.on('click', (e: L.LeafletMouseEvent) => {
      onLocationSelectRef.current(e.latlng.lat, e.latlng.lng);
    });

    // Add initial marker
    if (markerPosition) {
      markerRef.current = L.marker(markerPosition, { icon }).addTo(map);
    }

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update map center when center prop changes (from search)
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo(center, zoom, { duration: 1 });
  }, [center[0], center[1], zoom]);

  // Update marker position
  useEffect(() => {
    if (!mapRef.current || !markerPosition) return;

    if (markerRef.current) {
      markerRef.current.setLatLng(markerPosition);
    } else {
      markerRef.current = L.marker(markerPosition, { icon }).addTo(mapRef.current);
    }
  }, [markerPosition]);

  return <div ref={containerRef} className="w-full h-96" />;
}

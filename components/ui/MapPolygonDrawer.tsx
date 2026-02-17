'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

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

interface PolygonData {
  coordinates: { lat: number; lng: number }[];
  area: number; // in square meters
  perimeter: number; // in meters
}

interface MapPolygonDrawerProps {
  center?: { lat: number; lng: number };
  initialPolygon?: { lat: number; lng: number }[];
  onPolygonComplete: (data: PolygonData) => void;
  onPolygonDelete?: () => void;
  className?: string;
}

// Calculate area of a polygon using the Shoelace formula with Haversine distance for geodesic accuracy
function calculateGeodesicArea(coords: { lat: number; lng: number }[]): number {
  if (coords.length < 3) return 0;

  const earthRadius = 6378137; // Earth radius in meters

  // Convert to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  let area = 0;
  const n = coords.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const lat1 = toRad(coords[i].lat);
    const lat2 = toRad(coords[j].lat);
    const lng1 = toRad(coords[i].lng);
    const lng2 = toRad(coords[j].lng);

    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs((area * earthRadius * earthRadius) / 2);
  return area;
}

// Calculate perimeter using Haversine formula for geodesic distance
function calculateGeodesicPerimeter(coords: { lat: number; lng: number }[]): number {
  if (coords.length < 2) return 0;

  const earthRadius = 6378137; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  let perimeter = 0;
  const n = coords.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const lat1 = toRad(coords[i].lat);
    const lat2 = toRad(coords[j].lat);
    const lng1 = toRad(coords[i].lng);
    const lng2 = toRad(coords[j].lng);

    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    perimeter += earthRadius * c;
  }

  return perimeter;
}

export default function MapPolygonDrawer({
  center = { lat: 23.0225, lng: 72.5714 }, // Ahmedabad default
  initialPolygon,
  onPolygonComplete,
  onPolygonDelete,
  className = '',
}: MapPolygonDrawerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onPolygonCompleteRef = useRef(onPolygonComplete);
  const onPolygonDeleteRef = useRef(onPolygonDelete);

  const [currentLayer, setCurrentLayer] = useState<'osm' | 'satellite'>('osm');

  // Keep callback refs updated
  useEffect(() => {
    onPolygonCompleteRef.current = onPolygonComplete;
  }, [onPolygonComplete]);

  useEffect(() => {
    onPolygonDeleteRef.current = onPolygonDelete;
  }, [onPolygonDelete]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current).setView([center.lat, center.lng], 17);

    // Layer groups for different tile layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 22,
    });

    // Satellite layer using Esri World Imagery
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        maxZoom: 22,
      }
    );

    // Add default layer
    osmLayer.addTo(map);

    // FeatureGroup to store drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Draw control with custom styling
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: '#14b8a6', // Teal color
            fillColor: '#14b8a6',
            fillOpacity: 0.2,
            weight: 3,
          },
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);
    drawControlRef.current = drawControl;

    // Handle polygon creation
    map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;

      // Clear existing polygons (only one at a time)
      drawnItems.clearLayers();

      drawnItems.addLayer(layer);

      // Extract coordinates
      const latlngs = layer.getLatLngs()[0]; // Get first ring (outer boundary)
      const coordinates = latlngs.map((latlng: L.LatLng) => ({
        lat: latlng.lat,
        lng: latlng.lng,
      }));

      // Calculate area and perimeter
      const area = calculateGeodesicArea(coordinates);
      const perimeter = calculateGeodesicPerimeter(coordinates);

      // Show info popup
      const areaInSqM = area.toFixed(2);
      const areaInSqFt = (area * 10.764).toFixed(2); // Convert to sq ft
      const perimeterM = perimeter.toFixed(2);

      layer.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <strong style="color: #14b8a6;">Site Boundary</strong><br/>
          <span style="font-size: 12px;">
            Area: <strong>${areaInSqM} m²</strong> (${areaInSqFt} sq ft)<br/>
            Perimeter: <strong>${perimeterM} m</strong>
          </span>
        </div>
      `).openPopup();

      onPolygonCompleteRef.current({
        coordinates,
        area,
        perimeter,
      });
    });

    // Handle polygon edits
    map.on(L.Draw.Event.EDITED, (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: any) => {
        const latlngs = layer.getLatLngs()[0];
        const coordinates = latlngs.map((latlng: L.LatLng) => ({
          lat: latlng.lat,
          lng: latlng.lng,
        }));

        const area = calculateGeodesicArea(coordinates);
        const perimeter = calculateGeodesicPerimeter(coordinates);

        // Update popup
        const areaInSqM = area.toFixed(2);
        const areaInSqFt = (area * 10.764).toFixed(2);
        const perimeterM = perimeter.toFixed(2);

        layer.setPopupContent(`
          <div style="font-family: system-ui; padding: 4px;">
            <strong style="color: #14b8a6;">Site Boundary</strong><br/>
            <span style="font-size: 12px;">
              Area: <strong>${areaInSqM} m²</strong> (${areaInSqFt} sq ft)<br/>
              Perimeter: <strong>${perimeterM} m</strong>
            </span>
          </div>
        `);

        onPolygonCompleteRef.current({
          coordinates,
          area,
          perimeter,
        });
      });
    });

    // Handle polygon deletion
    map.on(L.Draw.Event.DELETED, () => {
      onPolygonDeleteRef.current?.();
    });

    // Add initial polygon if provided
    if (initialPolygon && initialPolygon.length >= 3) {
      const latlngs = initialPolygon.map((coord) => [coord.lat, coord.lng] as [number, number]);
      const polygon = L.polygon(latlngs, {
        color: '#14b8a6',
        fillColor: '#14b8a6',
        fillOpacity: 0.2,
        weight: 3,
      });
      drawnItems.addLayer(polygon);

      // Calculate and show info
      const area = calculateGeodesicArea(initialPolygon);
      const perimeter = calculateGeodesicPerimeter(initialPolygon);
      const areaInSqM = area.toFixed(2);
      const areaInSqFt = (area * 10.764).toFixed(2);
      const perimeterM = perimeter.toFixed(2);

      polygon.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <strong style="color: #14b8a6;">Site Boundary</strong><br/>
          <span style="font-size: 12px;">
            Area: <strong>${areaInSqM} m²</strong> (${areaInSqFt} sq ft)<br/>
            Perimeter: <strong>${perimeterM} m</strong>
          </span>
        </div>
      `);

      // Fit map to polygon bounds
      map.fitBounds(polygon.getBounds(), { padding: [50, 50] });
    }

    mapRef.current = map;

    // Custom layer switcher
    const LayerControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
          <div style="background: white; padding: 8px; border-radius: 4px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);">
            <select id="layer-switcher" style="border: 1px solid #ccc; border-radius: 4px; padding: 4px; font-size: 12px; cursor: pointer;">
              <option value="osm">Street Map</option>
              <option value="satellite">Satellite</option>
            </select>
          </div>
        `;

        L.DomEvent.disableClickPropagation(div);

        const select = div.querySelector('#layer-switcher') as HTMLSelectElement;
        select.addEventListener('change', (e) => {
          const value = (e.target as HTMLSelectElement).value;
          if (value === 'satellite') {
            map.removeLayer(osmLayer);
            map.addLayer(satelliteLayer);
            setCurrentLayer('satellite');
          } else {
            map.removeLayer(satelliteLayer);
            map.addLayer(osmLayer);
            setCurrentLayer('osm');
          }
        });

        return div;
      },
    });

    const layerControl = new LayerControl({ position: 'topleft' });
    layerControl.addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        drawControlRef.current = null;
        drawnItemsRef.current = null;
      }
    };
  }, []);

  // Update map center when center prop changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([center.lat, center.lng], 17, { duration: 1 });
  }, [center.lat, center.lng]);

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full h-[600px] rounded-2xl overflow-hidden border border-stone-200 shadow-lg" />
      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <p className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-teal-500 rounded-full"></span>
          <span>Click the polygon icon on the right to start drawing the site boundary</span>
        </p>
        <p className="ml-5">Click on map to add vertices, double-click or click first point to complete</p>
        <p className="ml-5">Use edit/delete tools to modify or remove the polygon</p>
        <p className="ml-5">Switch between street map and satellite imagery using the dropdown</p>
      </div>
    </div>
  );
}

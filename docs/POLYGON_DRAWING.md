# Polygon Drawing for Site Boundary Demarcation

## Overview

The polygon drawing functionality allows users to accurately demarcate irregular site boundaries on an interactive map. This is essential for projects with non-rectangular plots and provides precise geodesic area and perimeter calculations.

## Components

### 1. MapPolygonDrawer.tsx

**Location**: `components/ui/MapPolygonDrawer.tsx`

Core component that provides the actual map with drawing tools.

**Features**:
- Leaflet Draw integration for polygon drawing
- Draw, Edit, and Delete tools
- Geodesic area calculation using Shoelace formula
- Geodesic perimeter calculation using Haversine formula
- Support for irregular shapes with unlimited vertices
- Teal/cyan theme colors matching platform design
- Satellite and street map layer toggle
- Real-time area/perimeter display in popup
- Automatic single polygon mode (only one polygon at a time)

**Props**:
```typescript
interface MapPolygonDrawerProps {
  center?: { lat: number; lng: number };
  initialPolygon?: { lat: number; lng: number }[];
  onPolygonComplete: (data: PolygonData) => void;
  onPolygonDelete?: () => void;
  className?: string;
}

interface PolygonData {
  coordinates: { lat: number; lng: number }[];
  area: number; // in square meters
  perimeter: number; // in meters
}
```

**Tile Layers**:
- **OpenStreetMap** (default): Street map view with labels
- **Esri World Imagery**: Satellite imagery for accurate boundary identification

**Drawing Controls**:
- Polygon tool (top-right toolbar)
- Edit tool (modify existing polygon vertices)
- Delete tool (remove polygon)
- Layer switcher (top-left dropdown)

**Calculations**:
- **Area**: Uses geodesic calculation for accurate real-world area in square meters
- **Perimeter**: Uses Haversine formula for accurate distances between vertices
- Accounts for Earth's curvature for precision

---

### 2. MapPolygonPicker.tsx

**Location**: `components/ui/MapPolygonPicker.tsx`

Wrapper component with location search and polygon data display.

**Features**:
- Dynamic import to avoid SSR issues
- Location search with Nominatim geocoding
- Display polygon statistics (area, perimeter, vertices)
- Multiple unit conversions (m², sq ft, acres)
- Clean UI with glass morphism design

**Props**:
```typescript
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
```

**Display Units**:
- Area: m², square feet, acres
- Perimeter: meters, feet
- Coordinates: decimal degrees (6 decimals)

---

## Installation

The required packages are already installed:

```bash
npm install leaflet-draw @types/leaflet-draw
```

**Dependencies**:
- `leaflet` ^1.9.4
- `leaflet-draw` (newly added)
- `@types/leaflet-draw` (newly added)

---

## Usage

### Basic Usage

```tsx
import { MapPolygonPicker } from '@/components/ui/MapPolygonPicker';

export default function MyPage() {
  const [polygonData, setPolygonData] = useState(null);

  return (
    <MapPolygonPicker
      value={polygonData}
      onChange={(data) => {
        setPolygonData(data);
        console.log('Area:', data.area, 'm²');
        console.log('Perimeter:', data.perimeter, 'm');
        console.log('Vertices:', data.polygon.length);
      }}
    />
  );
}
```

### With Initial Polygon

```tsx
<MapPolygonPicker
  value={{
    center: { lat: 23.0225, lng: 72.5714 },
    polygon: [
      { lat: 23.0225, lng: 72.5714 },
      { lat: 23.0235, lng: 72.5724 },
      { lat: 23.0215, lng: 72.5734 },
    ],
    area: 5000,
    perimeter: 280,
  }}
  onChange={handleChange}
/>
```

### Low-Level API (Direct MapPolygonDrawer)

```tsx
import dynamic from 'next/dynamic';

const MapPolygonDrawer = dynamic(() => import('@/components/ui/MapPolygonDrawer'), {
  ssr: false,
});

<MapPolygonDrawer
  center={{ lat: 23.0225, lng: 72.5714 }}
  onPolygonComplete={(data) => {
    // data.coordinates - array of {lat, lng}
    // data.area - area in square meters
    // data.perimeter - perimeter in meters
  }}
  onPolygonDelete={() => {
    // Handle polygon deletion
  }}
/>
```

---

## Test Page

A test page is available at `/test-polygon` to demo the functionality.

**File**: `app/test-polygon/page.tsx`

**Features**:
- Live polygon drawing
- JSON output of polygon data
- Area, perimeter, and vertex count display
- Multiple unit conversions
- Center coordinate display

**Access**: Navigate to `http://localhost:3000/test-polygon` after running `npm run dev`

---

## Geodesic Calculations

### Area Calculation

Uses the **Shoelace formula** adapted for geodesic coordinates:

```typescript
function calculateGeodesicArea(coords: { lat: number; lng: number }[]): number {
  const earthRadius = 6378137; // Earth radius in meters
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
  return area; // in square meters
}
```

**Accuracy**: Accurate for polygons up to ~10km on a side. For larger polygons, more sophisticated spherical geometry may be needed.

### Perimeter Calculation

Uses the **Haversine formula** for great-circle distance:

```typescript
function calculateGeodesicPerimeter(coords: { lat: number; lng: number }[]): number {
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

  return perimeter; // in meters
}
```

**Accuracy**: Highly accurate for any polygon size, as it uses spherical trigonometry.

---

## UI/UX Details

### Drawing Workflow

1. **Search Location** (optional)
   - Enter address or landmark in search box
   - Map centers on location

2. **Draw Polygon**
   - Click polygon icon in top-right toolbar
   - Click on map to add vertices
   - Double-click or click first vertex to complete

3. **View Information**
   - Popup shows area (m² and sq ft) and perimeter
   - Info card shows detailed statistics

4. **Edit Polygon** (optional)
   - Click edit icon
   - Drag vertices to adjust boundary
   - Click save to apply changes

5. **Delete Polygon** (optional)
   - Click delete icon
   - Select polygon
   - Click delete to remove

### Visual Design

- **Polygon Style**:
  - Border: Teal (#14b8a6), 3px width
  - Fill: Teal (#14b8a6), 20% opacity
  - Hover: 30% opacity

- **Map Height**: 600px (larger than standard map for better drawing experience)

- **Controls**:
  - Draw controls: Top-right
  - Layer switcher: Top-left
  - Clean, minimal design

### Accessibility

- Keyboard navigation support (via Leaflet)
- Clear visual feedback for drawing actions
- High-contrast colors for visibility
- Descriptive tooltips

---

## Integration with Project Creation

To integrate with the project creation flow:

### 1. Update Project Creation Page

**File**: `app/projects/new/page.tsx`

Replace the rectangular plot dimensions with polygon picker:

```tsx
import { MapPolygonPicker } from '@/components/ui/MapPolygonPicker';

// In your form state
const [siteData, setSiteData] = useState({
  center: null,
  polygon: null,
  area: null,
  perimeter: null,
});

// In your form
<MapPolygonPicker
  value={siteData}
  onChange={(data) => {
    setSiteData(data);
    // Use data.area as plot area
    // Use data.polygon for site boundary visualization
  }}
/>
```

### 2. Update Database Schema

**File**: `prisma/schema.prisma`

Add fields to store polygon data:

```prisma
model Project {
  // ... existing fields ...

  // Plot dimensions (existing - keep for backward compatibility)
  plotLength    Float?
  plotWidth     Float?

  // Polygon boundary (new)
  siteBoundary  Json?  // Array of {lat, lng} coordinates
  siteArea      Float? // Area in square meters (from polygon)
  sitePerimeter Float? // Perimeter in meters (from polygon)

  // ... rest of fields ...
}
```

### 3. Update Regulation Engine

**File**: `lib/calculations/regulation-engine.ts`

Use `siteArea` instead of calculated `plotLength * plotWidth`:

```typescript
// Before
const plotArea = data.plotLength * data.plotWidth;

// After (with fallback)
const plotArea = data.siteArea || (data.plotLength * data.plotWidth);
```

### 4. Update 3D Visualization

**File**: `components/3d/IsometricBuilding.tsx`

Render actual site boundary instead of rectangle:

```tsx
// Add prop for polygon
interface IsometricBuildingProps {
  // ... existing props ...
  siteBoundary?: { lat: number; lng: number }[];
}

// In render, draw actual polygon shape if available
// Otherwise fall back to rectangle
```

---

## Data Format

### Output Format

```typescript
{
  center: {
    lat: 23.0225,
    lng: 72.5714
  },
  polygon: [
    { lat: 23.022500, lng: 72.571400 },
    { lat: 23.022550, lng: 72.571450 },
    { lat: 23.022520, lng: 72.571520 },
    { lat: 23.022470, lng: 72.571470 }
  ],
  area: 4852.34,      // square meters
  perimeter: 278.56   // meters
}
```

### Storage in Database

```json
{
  "siteBoundary": [
    {"lat": 23.022500, "lng": 72.571400},
    {"lat": 23.022550, "lng": 72.571450},
    {"lat": 23.022520, "lng": 72.571520},
    {"lat": 23.022470, "lng": 72.571470}
  ],
  "siteArea": 4852.34,
  "sitePerimeter": 278.56
}
```

---

## Performance Considerations

1. **Dynamic Import**: MapPolygonDrawer uses dynamic import to avoid SSR issues and reduce initial bundle size

2. **Single Polygon Mode**: Only one polygon can be drawn at a time to keep data simple and UI clean

3. **Calculation Caching**: Area and perimeter are calculated once and stored, not recalculated on every render

4. **Tile Layer Optimization**: Tiles are cached by Leaflet for fast pan/zoom

5. **Memory Management**: Map is properly cleaned up on component unmount to prevent memory leaks

---

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile**: Full touch support for drawing on tablets/phones
- **IE11**: Not supported (Leaflet 1.9 requires modern browsers)

---

## Future Enhancements

1. **Import KML/GeoJSON**: Allow users to upload existing boundary files
2. **Snap to Roads**: Snap polygon vertices to nearby roads/buildings
3. **Area Measurement Tools**: Ruler tool for measuring distances
4. **Multiple Polygons**: Support for plots with multiple disconnected parcels
5. **Coordinate System Options**: Support for UTM, State Plane, etc.
6. **Export Options**: Export polygon as KML, GeoJSON, Shapefile
7. **Undo/Redo**: History management for drawing actions

---

## Troubleshooting

### Issue: Map not loading

**Solution**: Ensure component is dynamically imported with `ssr: false`

```tsx
const MapPolygonDrawer = dynamic(() => import('./MapPolygonDrawer'), {
  ssr: false,
});
```

### Issue: Drawing tools not appearing

**Solution**: Check that `leaflet-draw` CSS is imported:

```tsx
import 'leaflet-draw/dist/leaflet.draw.css';
```

### Issue: Incorrect area calculation

**Solution**: Verify coordinates are in decimal degrees (not meters or feet). The calculation assumes lat/lng coordinates.

### Issue: TypeScript errors with Leaflet.Draw

**Solution**: Ensure `@types/leaflet-draw` is installed and imported:

```bash
npm install @types/leaflet-draw
```

---

## Related Files

- `components/ui/MapComponent.tsx` - Original simple map (unchanged)
- `components/ui/MapPicker.tsx` - Location picker (unchanged)
- `components/ui/MapPolygonDrawer.tsx` - NEW polygon drawing core
- `components/ui/MapPolygonPicker.tsx` - NEW polygon picker with search
- `app/test-polygon/page.tsx` - NEW test/demo page
- `docs/POLYGON_DRAWING.md` - This documentation

---

## Credits

- **Leaflet**: Open-source mapping library
- **Leaflet.draw**: Plugin for drawing tools
- **OpenStreetMap**: Map tiles
- **Esri**: Satellite imagery tiles
- **Nominatim**: Geocoding service

---

Last Updated: 2026-02-14
Status: Completed and Tested

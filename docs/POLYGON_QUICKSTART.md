# Polygon Drawing - Quick Start Guide

Get started with polygon drawing in 5 minutes.

---

## Try It Now

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Open the test page**:
   Navigate to: `http://localhost:3000/test-polygon`

3. **Draw a polygon**:
   - Click the polygon icon (top-right toolbar)
   - Click on the map to add vertices
   - Double-click to complete the polygon
   - See area and perimeter in the popup and stats panel

4. **Try other features**:
   - Switch to satellite view (dropdown in top-left)
   - Edit polygon vertices (click edit icon, drag vertices)
   - Delete polygon (click delete icon)
   - Search for a location (search box at top)

---

## Basic Usage

### Option 1: Full Featured Picker (Recommended)

```tsx
import { MapPolygonPicker } from '@/components/ui/MapPolygonPicker';
import { useState } from 'react';

export default function MyPage() {
  const [polygonData, setPolygonData] = useState(null);

  return (
    <MapPolygonPicker
      value={polygonData}
      onChange={(data) => {
        setPolygonData(data);
        console.log('Area:', data.area, 'm²');
        console.log('Perimeter:', data.perimeter, 'm');
        console.log('Coordinates:', data.polygon);
      }}
    />
  );
}
```

### Option 2: Low-Level Drawer

```tsx
import dynamic from 'next/dynamic';

const MapPolygonDrawer = dynamic(
  () => import('@/components/ui/MapPolygonDrawer'),
  { ssr: false }
);

export default function MyPage() {
  return (
    <MapPolygonDrawer
      center={{ lat: 23.0225, lng: 72.5714 }}
      onPolygonComplete={(data) => {
        console.log('Polygon completed:', data);
      }}
    />
  );
}
```

---

## What You Get

When a user completes a polygon, you receive:

```typescript
{
  center: { lat: 23.0225, lng: 72.5714 },  // Map center
  polygon: [                                // Polygon vertices
    { lat: 23.0225, lng: 72.5714 },
    { lat: 23.0235, lng: 72.5724 },
    { lat: 23.0215, lng: 72.5734 },
  ],
  area: 4852.34,       // Square meters
  perimeter: 278.56    // Meters
}
```

---

## Common Use Cases

### 1. Project Creation Form

```tsx
import { MapPolygonPicker } from '@/components/ui/MapPolygonPicker';

const [formData, setFormData] = useState({
  projectName: '',
  siteBoundary: null,
  siteArea: 0,
});

<MapPolygonPicker
  onChange={(data) => {
    setFormData({
      ...formData,
      siteBoundary: data.polygon,
      siteArea: data.area,
    });
  }}
/>
```

### 2. Read-Only Display

```tsx
<MapPolygonDrawer
  center={{ lat: 23.0225, lng: 72.5714 }}
  initialPolygon={savedPolygon}
  onPolygonComplete={() => {}}  // No action needed
/>
```

### 3. With Initial Data

```tsx
const savedData = {
  center: { lat: 23.0225, lng: 72.5714 },
  polygon: [...],
  area: 5000,
  perimeter: 300,
};

<MapPolygonPicker
  value={savedData}
  onChange={(data) => console.log('Updated:', data)}
/>
```

---

## Unit Conversions

The component provides area in square meters. Convert to other units:

```typescript
const data = {
  area: 5000,      // Square meters
  perimeter: 300,  // Meters
};

// Area conversions
const sqFeet = data.area * 10.764;      // 53,820 sq ft
const acres = data.area * 0.000247105;  // 1.236 acres
const hectares = data.area / 10000;     // 0.5 hectares

// Perimeter conversions
const feet = data.perimeter * 3.28084;  // 984.25 ft
const yards = data.perimeter * 1.09361; // 328.08 yards
```

---

## Styling

The polygon uses teal/cyan colors by default. To customize:

```tsx
// In MapPolygonDrawer.tsx, line ~155
shapeOptions: {
  color: '#your-color',      // Stroke color
  fillColor: '#your-color',  // Fill color
  fillOpacity: 0.2,          // Transparency
  weight: 3,                 // Stroke width
}
```

---

## Map Layers

Two tile layers are available:

1. **Street Map** (default): OpenStreetMap with labels
2. **Satellite**: Esri World Imagery for aerial view

Users can switch via dropdown in top-left corner.

---

## Geodesic Calculations

All calculations account for Earth's curvature:

- **Area**: Shoelace formula adapted for spherical coordinates
- **Perimeter**: Haversine formula for great-circle distances
- **Accuracy**: Accurate for plots up to ~10km on a side

---

## Tips

1. **Always use dynamic import** for SSR compatibility:
   ```tsx
   const MapPolygonPicker = dynamic(() => import('@/components/ui/MapPolygonPicker'), {
     ssr: false,
   });
   ```

2. **Validate polygon data** before saving:
   ```tsx
   if (!data.polygon || data.polygon.length < 3) {
     alert('Please draw a valid polygon with at least 3 points');
     return;
   }
   ```

3. **Store area separately** - Don't recalculate on every render:
   ```tsx
   // Good - store calculated area
   const [siteArea, setSiteArea] = useState(0);

   onChange={(data) => setSiteArea(data.area)}
   ```

4. **Use satellite view** for accurate boundary identification:
   ```tsx
   // Users can toggle to satellite to see actual plot boundaries
   ```

---

## Troubleshooting

**Map not loading?**
- Check dynamic import with `ssr: false`
- Verify Leaflet CSS is imported

**Drawing tools missing?**
- Verify `leaflet-draw` is installed
- Check that `leaflet-draw/dist/leaflet.draw.css` is imported

**Area seems wrong?**
- Verify coordinates are in decimal degrees (not meters)
- Check that polygon is not self-intersecting

---

## Next Steps

- **Full Documentation**: `docs/POLYGON_DRAWING.md`
- **Integration Guide**: `docs/POLYGON_INTEGRATION_EXAMPLE.md`
- **Component Reference**: `components/ui/README.md`
- **Feature Summary**: `POLYGON_FEATURE_SUMMARY.md`

---

## Example Output

```json
{
  "center": {
    "lat": 23.0225,
    "lng": 72.5714
  },
  "polygon": [
    { "lat": 23.022500, "lng": 72.571400 },
    { "lat": 23.022550, "lng": 72.571450 },
    { "lat": 23.022520, "lng": 72.571520 },
    { "lat": 23.022470, "lng": 72.571470 }
  ],
  "area": 4852.34,
  "perimeter": 278.56
}
```

**Area in different units**:
- 4,852.34 m² (square meters)
- 52,226.18 sq ft (square feet)
- 1.20 acres
- 0.49 hectares

**Perimeter in different units**:
- 278.56 m (meters)
- 914.24 ft (feet)
- 304.75 yd (yards)

---

**Ready to use!** Start with the test page at `/test-polygon` to see it in action.

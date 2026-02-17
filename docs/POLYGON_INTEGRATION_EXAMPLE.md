# Polygon Drawing Integration Example

## Quick Integration Guide

This guide shows how to integrate the polygon drawing functionality into the existing project creation workflow.

---

## Step 1: Update Project Form State

Add polygon-related fields to your form state:

```tsx
// Before
const [formData, setFormData] = useState({
  name: '',
  address: '',
  location: { lat: 23.0225, lng: 72.5714 },
  plotLength: 0,
  plotWidth: 0,
  // ... other fields
});

// After
const [formData, setFormData] = useState({
  name: '',
  address: '',
  location: { lat: 23.0225, lng: 72.5714 },

  // Keep these for backward compatibility
  plotLength: 0,
  plotWidth: 0,

  // Add new polygon fields
  siteBoundary: null as { lat: number; lng: number }[] | null,
  siteArea: 0,
  sitePerimeter: 0,

  // ... other fields
});
```

---

## Step 2: Add Polygon Picker to Form

Replace or supplement the current plot dimension inputs:

```tsx
import { MapPolygonPicker } from '@/components/ui/MapPolygonPicker';

// In your component JSX
<div className="space-y-6">
  {/* Existing fields */}
  <Input
    label="Project Name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />

  <Input
    label="Address"
    value={formData.address}
    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
  />

  {/* New Polygon Picker */}
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-2">
      Site Boundary
    </label>
    <MapPolygonPicker
      value={
        formData.siteBoundary
          ? {
              center: formData.location,
              polygon: formData.siteBoundary,
              area: formData.siteArea,
              perimeter: formData.sitePerimeter,
            }
          : undefined
      }
      onChange={(data) => {
        setFormData({
          ...formData,
          location: data.center,
          siteBoundary: data.polygon,
          siteArea: data.area,
          sitePerimeter: data.perimeter,
          // Auto-calculate approximate length/width for backward compatibility
          plotLength: Math.sqrt(data.area),
          plotWidth: Math.sqrt(data.area),
        });
      }}
    />
  </div>

  {/* Optional: Show calculated area */}
  {formData.siteArea > 0 && (
    <div className="glass rounded-2xl p-4">
      <p className="text-sm text-gray-600">
        Site Area: <strong>{formData.siteArea.toFixed(2)} m²</strong>
        {' '}({(formData.siteArea * 10.764).toFixed(2)} sq ft)
      </p>
    </div>
  )}
</div>
```

---

## Step 3: Update Database Schema

Run migration to add polygon fields:

```bash
npx prisma migrate dev --name add_site_boundary
```

**Schema changes** (`prisma/schema.prisma`):

```prisma
model Project {
  // ... existing fields ...

  // Plot dimensions (existing - keep for backward compatibility)
  plotLength    Float?
  plotWidth     Float?

  // NEW: Polygon boundary fields
  siteBoundary  Json?  // Array of {lat, lng} coordinates
  siteArea      Float? // Area in square meters (from polygon)
  sitePerimeter Float? // Perimeter in meters (from polygon)

  // ... rest of fields ...
}
```

---

## Step 4: Update API Route

Modify the project creation API to accept polygon data:

**File**: `app/api/projects/route.ts`

```typescript
// In POST handler
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate polygon data if provided
    const polygonData = body.siteBoundary
      ? {
          siteBoundary: body.siteBoundary,
          siteArea: body.siteArea,
          sitePerimeter: body.sitePerimeter,
        }
      : {};

    const project = await prisma.project.create({
      data: {
        // ... existing fields ...
        plotLength: body.plotLength,
        plotWidth: body.plotWidth,

        // Add polygon data
        ...polygonData,

        // ... other fields ...
      },
    });

    return Response.json(project, { status: 201 });
  } catch (error) {
    // ... error handling
  }
}
```

---

## Step 5: Update Regulation Engine

Use polygon area instead of calculated area:

**File**: `lib/calculations/regulation-engine.ts`

```typescript
export function calculateGDCR(data: ProjectData): RegulationResult {
  // Before
  const plotArea = data.plotLength * data.plotWidth;

  // After (with fallback for old projects)
  const plotArea = data.siteArea || (data.plotLength * data.plotWidth);

  // Rest of calculation remains the same
  // ...
}
```

---

## Step 6: Update 3D Visualization (Optional)

Show actual site boundary in isometric view:

**File**: `components/3d/IsometricBuilding.tsx`

```tsx
interface IsometricBuildingProps {
  // ... existing props ...
  siteBoundary?: { lat: number; lng: number }[];
}

export default function IsometricBuilding({
  // ... existing props ...
  siteBoundary,
}: IsometricBuildingProps) {
  // If siteBoundary is provided, render actual polygon shape
  // Otherwise fall back to rectangle

  const plotShape = siteBoundary
    ? renderPolygonShape(siteBoundary)
    : renderRectangle(plotLength, plotWidth);

  // ... rest of component
}

function renderPolygonShape(boundary: { lat: number; lng: number }[]) {
  // Convert lat/lng to local coordinates
  // Project to isometric
  // Return SVG path

  // This is a complex conversion - may need separate implementation
  // For now, can continue using rectangle as simplified view
}
```

---

## Step 7: Display Polygon in Project Details

Show the site boundary on the project detail page:

**File**: `app/projects/[id]/page.tsx`

```tsx
import dynamic from 'next/dynamic';

const MapPolygonDrawer = dynamic(
  () => import('@/components/ui/MapPolygonDrawer'),
  { ssr: false }
);

// In your component
{project.siteBoundary && (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3">Site Boundary</h3>
    <MapPolygonDrawer
      center={project.location}
      initialPolygon={project.siteBoundary}
      onPolygonComplete={() => {}} // Read-only, no action needed
    />
  </div>
)}
```

---

## Complete Example: Modified Project Creation Page

**File**: `app/projects/new/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPolygonPicker } from '@/components/ui/MapPolygonPicker';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    location: { lat: 23.0225, lng: 72.5714 },
    siteBoundary: null as { lat: number; lng: number }[] | null,
    siteArea: 0,
    sitePerimeter: 0,
    plotLength: 0,
    plotWidth: 0,
    authority: 'AMC',
    zone: 'Residential',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.siteBoundary || formData.siteArea === 0) {
      alert('Please draw the site boundary on the map');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create project');

      const project = await response.json();
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Project Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Address"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Site Boundary <span className="text-red-500">*</span>
          </label>
          <MapPolygonPicker
            value={
              formData.siteBoundary
                ? {
                    center: formData.location,
                    polygon: formData.siteBoundary,
                    area: formData.siteArea,
                    perimeter: formData.sitePerimeter,
                  }
                : undefined
            }
            onChange={(data) => {
              setFormData({
                ...formData,
                location: data.center,
                siteBoundary: data.polygon,
                siteArea: data.area,
                sitePerimeter: data.perimeter,
                plotLength: Math.sqrt(data.area),
                plotWidth: Math.sqrt(data.area),
              });
            }}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}
```

---

## Validation Schema (Optional)

If using Zod for validation:

```typescript
import { z } from 'zod';

const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  address: z.string().min(1, 'Address is required'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  siteBoundary: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    )
    .min(3, 'Site boundary must have at least 3 points')
    .nullable(),
  siteArea: z.number().min(0),
  sitePerimeter: z.number().min(0),
  plotLength: z.number().optional(),
  plotWidth: z.number().optional(),
  // ... other fields
});
```

---

## Migration for Existing Projects

For projects created before polygon feature was added:

```typescript
// In your project detail page or migration script
async function migrateLegacyProject(project: Project) {
  // If no siteBoundary but has plotLength/plotWidth
  if (!project.siteBoundary && project.plotLength && project.plotWidth) {
    // Create approximate rectangular boundary
    const center = project.location;
    const halfLength = (project.plotLength / 2) * 0.00001; // Rough conversion
    const halfWidth = (project.plotWidth / 2) * 0.00001;

    const siteBoundary = [
      { lat: center.lat + halfLength, lng: center.lng - halfWidth },
      { lat: center.lat + halfLength, lng: center.lng + halfWidth },
      { lat: center.lat - halfLength, lng: center.lng + halfWidth },
      { lat: center.lat - halfLength, lng: center.lng - halfWidth },
    ];

    await prisma.project.update({
      where: { id: project.id },
      data: {
        siteBoundary,
        siteArea: project.plotLength * project.plotWidth,
      },
    });
  }
}
```

---

## Testing Checklist

- [ ] Draw irregular polygon with 5+ vertices
- [ ] Verify area calculation is accurate
- [ ] Edit polygon vertices and confirm recalculation
- [ ] Delete polygon and redraw
- [ ] Save project and reload - polygon persists
- [ ] Switch between street map and satellite view
- [ ] Search for location and draw polygon
- [ ] View polygon on project detail page
- [ ] Test on mobile/tablet (touch drawing)
- [ ] Test with existing projects (backward compatibility)

---

## Common Issues

### Issue: Polygon not saving

**Check**:
1. Database field `siteBoundary` is type `Json`
2. API route is accepting `siteBoundary` in request body
3. No validation errors in API response

### Issue: Old projects breaking

**Solution**: Always check if `siteBoundary` exists before using it:

```typescript
const plotArea = project.siteArea || (project.plotLength * project.plotWidth);
```

### Issue: Coordinates look wrong

**Verify**: Coordinates are in decimal degrees (not meters):
- Ahmedabad: lat ~23, lng ~72
- Not: lat ~2300000, lng ~7200000

---

Last Updated: 2026-02-14
Status: Ready for Integration

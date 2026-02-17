# UI Components

Complete reference for all UI components in the LIMIT platform.

---

## Map Components

### MapComponent.tsx
Basic Leaflet map with click-to-select location.

**Props**:
```typescript
interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  markerPosition?: [number, number];
}
```

**Usage**:
```tsx
<MapComponent
  center={[23.0225, 72.5714]}
  zoom={15}
  onLocationSelect={(lat, lng) => console.log(lat, lng)}
  markerPosition={[23.0225, 72.5714]}
/>
```

---

### MapPicker.tsx
Map with location search and geocoding.

**Props**:
```typescript
interface MapPickerProps {
  value?: { lat: number; lng: number; address?: string };
  onChange: (location: { lat: number; lng: number; address?: string }) => void;
  className?: string;
}
```

**Usage**:
```tsx
<MapPicker
  value={location}
  onChange={(loc) => setLocation(loc)}
/>
```

---

### MapPolygonDrawer.tsx (NEW)
Interactive polygon drawing for site boundaries with geodesic calculations.

**Props**:
```typescript
interface MapPolygonDrawerProps {
  center?: { lat: number; lng: number };
  initialPolygon?: { lat: number; lng: number }[];
  onPolygonComplete: (data: {
    coordinates: { lat: number; lng: number }[];
    area: number;
    perimeter: number;
  }) => void;
  onPolygonDelete?: () => void;
  className?: string;
}
```

**Features**:
- Draw/edit/delete polygon tools
- Geodesic area & perimeter calculation
- Street map and satellite imagery layers
- Teal/cyan theme colors
- Real-time measurements

**Usage**:
```tsx
import dynamic from 'next/dynamic';

const MapPolygonDrawer = dynamic(() => import('./MapPolygonDrawer'), {
  ssr: false,
});

<MapPolygonDrawer
  center={{ lat: 23.0225, lng: 72.5714 }}
  onPolygonComplete={(data) => {
    console.log('Area:', data.area, 'm²');
    console.log('Perimeter:', data.perimeter, 'm');
  }}
/>
```

---

### MapPolygonPicker.tsx (NEW)
Complete polygon drawing solution with search and statistics.

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

**Features**:
- All MapPolygonDrawer features
- Location search with geocoding
- Statistics display (area, perimeter, vertices)
- Unit conversions (m², sq ft, acres)
- Glass morphism design

**Usage**:
```tsx
<MapPolygonPicker
  value={polygonData}
  onChange={(data) => setPolygonData(data)}
/>
```

**See**: `docs/POLYGON_DRAWING.md` for complete documentation

---

## Form Components

### Input.tsx
Styled text input with label and icon support.

**Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}
```

**Usage**:
```tsx
<Input
  label="Project Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  icon={<Building2 />}
  error={errors.name}
/>
```

---

### Button.tsx
Primary button with loading state and variants.

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}
```

**Usage**:
```tsx
<Button
  onClick={handleSubmit}
  isLoading={isSubmitting}
  icon={<Save />}
>
  Save Project
</Button>
```

---

### Select.tsx
Styled dropdown select.

**Props**:
```typescript
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}
```

**Usage**:
```tsx
<Select
  label="Authority"
  value={authority}
  onChange={(e) => setAuthority(e.target.value)}
  options={[
    { value: 'AMC', label: 'Ahmedabad Municipal Corporation' },
    { value: 'AUDA', label: 'AUDA' },
  ]}
/>
```

---

## File Upload Components

### FileUpload.tsx
Basic file upload with drag-and-drop.

**Props**:
```typescript
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
}
```

**Usage**:
```tsx
<FileUpload
  onFileSelect={(file) => console.log(file)}
  accept=".pdf,.dwg,.jpg,.png"
  maxSize={10 * 1024 * 1024} // 10MB
/>
```

---

### FileUploadWithAI.tsx
Enhanced file upload with AI extraction simulation.

**Props**:
```typescript
interface FileUploadWithAIProps {
  onExtractionComplete: (data: {
    plotDimensions: { length: number; width: number };
    confidence: number;
  }) => void;
  accept?: string;
}
```

**Features**:
- Drag-and-drop file upload
- AI extraction simulation (2-3s delay)
- Confidence score display
- User verification workflow
- Visual feedback (uploading → extracting → verifying → success)

**Usage**:
```tsx
<FileUploadWithAI
  onExtractionComplete={(data) => {
    setPlotLength(data.plotDimensions.length);
    setPlotWidth(data.plotDimensions.width);
  }}
  accept=".pdf,.dwg,.jpg,.png"
/>
```

---

## Layout Components

### Card.tsx
Glass morphism card container.

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

**Usage**:
```tsx
<Card padding="lg">
  <h3>Project Details</h3>
  <p>Content here...</p>
</Card>
```

---

### Badge.tsx
Colored badge for status/labels.

**Props**:
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}
```

**Usage**:
```tsx
<Badge variant="success">Compliant</Badge>
<Badge variant="error">Non-Compliant</Badge>
```

---

### Modal.tsx
Dialog/modal overlay.

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
```

**Usage**:
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
>
  <p>Are you sure?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

---

## 3D Visualization

### IsometricBuilding.tsx
SVG isometric building visualization.

**Props**:
```typescript
interface IsometricBuildingProps {
  plotLength: number;
  plotWidth: number;
  buildingHeight: number;
  floors: number;
  setbacks: {
    front: number;
    rear: number;
    side1: number;
    side2: number;
  };
  fsi: number;
}
```

**Features**:
- True isometric projection (30° angles)
- Blue glass facade with window bands
- Flat roof with HVAC equipment
- Ground plot with roads and trees
- Dynamic scaling based on plot size

**Usage**:
```tsx
<IsometricBuilding
  plotLength={20}
  plotWidth={15}
  buildingHeight={45}
  floors={12}
  setbacks={{ front: 3, rear: 3, side1: 3, side2: 3 }}
  fsi={2.5}
/>
```

---

## Utility Components

### LoadingSpinner.tsx
Loading indicator.

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}
```

**Usage**:
```tsx
<LoadingSpinner size="lg" />
```

---

### EmptyState.tsx
Empty state placeholder.

**Props**:
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

**Usage**:
```tsx
<EmptyState
  icon={<Inbox />}
  title="No projects yet"
  description="Create your first project to get started"
  action={<Button onClick={handleCreate}>Create Project</Button>}
/>
```

---

## Design System

### Colors

**Primary**: Teal/Cyan
- `bg-teal-500` - Primary actions
- `bg-cyan-600` - Accents
- `text-teal-700` - Links

**Background**:
- `bg-stone-50` - Page background
- `glass` - Glass morphism cards

**Text**:
- `text-gray-900` - Headings
- `text-gray-600` - Body
- `text-gray-500` - Muted

### Typography

**Headings**:
- `text-3xl font-bold` - Page title
- `text-xl font-semibold` - Section title
- `text-lg font-medium` - Subsection

**Body**:
- `text-base` - Regular text
- `text-sm` - Small text
- `text-xs` - Captions

### Spacing

- `space-y-6` - Vertical spacing between sections
- `gap-4` - Grid/flex gaps
- `p-8` - Page padding
- `p-4` - Card padding

### Shadows

- `shadow-sm` - Subtle elevation
- `shadow-lg` - Prominent elevation
- `shadow-xl` - Modal/overlay

### Borders

- `rounded-2xl` - Cards
- `rounded-xl` - Inputs
- `border border-stone-200` - Subtle borders

---

## Accessibility

All components support:
- Keyboard navigation
- ARIA labels
- Focus indicators
- Screen reader compatibility
- High contrast mode

---

## Performance

- Components use `React.memo` where appropriate
- Dynamic imports for heavy components (maps, 3D)
- Lazy loading for images
- Debounced inputs for search

---

## Testing

Each component should have:
- Unit tests for logic
- Integration tests for user flows
- Accessibility tests
- Visual regression tests

---

Last Updated: 2026-02-14

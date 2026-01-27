'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createProject } from '@/lib/storage/projects';
import { calculateRegulations } from '@/lib/calculations/regulation-engine';
import { addRegulationResults } from '@/lib/storage/projects';
import { SiteData, Authority, Zone, IntendedUse } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { MapPicker } from '@/components/ui/MapPicker';
import { FileUpload } from '@/components/ui/FileUpload';
import { Building2, ArrowLeft, Save, Calculator } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [projectName, setProjectName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('23.0225');
  const [longitude, setLongitude] = useState('72.5714');
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string }>({ lat: 23.0225, lng: 72.5714, address: '' });
  const [authority, setAuthority] = useState<Authority>('AUDA');
  const [zone, setZone] = useState<Zone>('R1');
  const [plotLength, setPlotLength] = useState('');
  const [plotWidth, setPlotWidth] = useState('');
  const [isCornerPlot, setIsCornerPlot] = useState(false);
  const [roadWidthPrimary, setRoadWidthPrimary] = useState('');
  const [roadWidthSecondary, setRoadWidthSecondary] = useState('');
  const [intendedUse, setIntendedUse] = useState<IntendedUse>('Residential-Single');
  const [heritage, setHeritage] = useState(false);
  const [toz, setToz] = useState(false);
  const [sez, setSez] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const user = getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const length = parseFloat(plotLength);
      const width = parseFloat(plotWidth);
      const area = length * width;

      const siteData: SiteData = {
        projectName,
        address,
        location: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
        },
        authority,
        zone,
        plotDimensions: {
          length,
          width,
          area,
        },
        isCornerPlot,
        roadWidthPrimary: parseFloat(roadWidthPrimary),
        roadWidthSecondary: roadWidthSecondary ? parseFloat(roadWidthSecondary) : undefined,
        intendedUse,
        specialConditions: {
          heritage,
          toz,
          sez,
        },
      };

      // Create project
      const project = createProject(user.id, siteData);

      // Calculate regulations
      const { result, clauses } = calculateRegulations(siteData);

      // Add regulation results
      addRegulationResults(project.id, result, clauses);

      // Navigate to project detail
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = projectName && address && plotLength && plotWidth && roadWidthPrimary;

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="border-b border-slate-200/60 glass sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-extrabold gradient-text tracking-tight">New Project</span>
                <p className="text-xs text-slate-600 font-semibold tracking-wide">GDCR 2017 Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card glass className="border border-slate-200/60">
          <CardHeader>
            <CardTitle className="text-3xl">Site Information</CardTitle>
            <CardDescription className="text-base">
              Enter plot details to calculate building regulations compliance
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="space-y-5">
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">Project Details</h3>

                <Input
                  label="Project Name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Building Project"
                  required
                />

                <Input
                  label="Site Address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 123, Sector 45, Ahmedabad"
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Plot Location</label>
                  <MapPicker
                    value={location}
                    onChange={(loc) => {
                      setLocation(loc);
                      setLatitude(loc.lat.toString());
                      setLongitude(loc.lng.toString());
                      if (loc.address && !address) {
                        setAddress(loc.address);
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Authority"
                    value={authority}
                    onChange={(e) => setAuthority(e.target.value as Authority)}
                    options={[
                      { value: 'AUDA', label: 'AUDA - Ahmedabad Urban Development Authority' },
                      { value: 'AMC', label: 'AMC - Ahmedabad Municipal Corporation' },
                    ]}
                  />

                  <Select
                    label="Zone"
                    value={zone}
                    onChange={(e) => setZone(e.target.value as Zone)}
                    options={[
                      { value: 'R1', label: 'R1 - Residential Zone 1' },
                      { value: 'R2', label: 'R2 - Residential Zone 2' },
                      { value: 'Commercial', label: 'Commercial Zone' },
                      { value: 'Industrial', label: 'Industrial Zone' },
                      { value: 'Mixed-Use', label: 'Mixed-Use Zone' },
                    ]}
                  />
                </div>
              </div>

              {/* Plot Dimensions */}
              <div className="space-y-5 pt-6 border-t border-slate-200">
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">Plot Dimensions</h3>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Plot Length (m)"
                    type="number"
                    step="0.01"
                    value={plotLength}
                    onChange={(e) => setPlotLength(e.target.value)}
                    placeholder="30.00"
                    required
                  />
                  <Input
                    label="Plot Width (m)"
                    type="number"
                    step="0.01"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(e.target.value)}
                    placeholder="20.00"
                    required
                  />
                </div>

                {plotLength && plotWidth && (
                  <div className="p-4 bg-cyan-50/80 border-2 border-cyan-200 rounded-xl">
                    <p className="text-base text-cyan-900 font-semibold">
                      <span className="font-bold">Plot Area:</span>{' '}
                      {(parseFloat(plotLength) * parseFloat(plotWidth)).toFixed(2)} sq.m
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="cornerPlot"
                    checked={isCornerPlot}
                    onChange={(e) => setIsCornerPlot(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="cornerPlot" className="text-sm text-gray-700">
                    Corner Plot (eligible for FSI bonus)
                  </label>
                </div>
              </div>

              {/* Road Widths */}
              <div className="space-y-5 pt-6 border-t border-slate-200">
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">Road Information</h3>

                <Input
                  label="Primary Road Width (m)"
                  type="number"
                  step="0.01"
                  value={roadWidthPrimary}
                  onChange={(e) => setRoadWidthPrimary(e.target.value)}
                  placeholder="9.00"
                  required
                  helpText="Width of the main road facing the plot"
                />

                {isCornerPlot && (
                  <Input
                    label="Secondary Road Width (m)"
                    type="number"
                    step="0.01"
                    value={roadWidthSecondary}
                    onChange={(e) => setRoadWidthSecondary(e.target.value)}
                    placeholder="6.00"
                    helpText="Width of the secondary road (for corner plots)"
                  />
                )}
              </div>

              {/* Intended Use */}
              <div className="space-y-5 pt-6 border-t border-slate-200">
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">Intended Use</h3>

                <Select
                  label="Building Use Type"
                  value={intendedUse}
                  onChange={(e) => setIntendedUse(e.target.value as IntendedUse)}
                  options={[
                    { value: 'Residential-Single', label: 'Residential - Single Family' },
                    { value: 'Residential-Multi', label: 'Residential - Multi Family' },
                    { value: 'Commercial-Office', label: 'Commercial - Office' },
                    { value: 'Commercial-Retail', label: 'Commercial - Retail' },
                    { value: 'Commercial-Hospitality', label: 'Commercial - Hospitality' },
                    { value: 'Mixed-Use', label: 'Mixed-Use Development' },
                  ]}
                />
              </div>

              {/* Survey Drawings Upload */}
              <div className="space-y-5 pt-6 border-t border-slate-200">
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">Survey Drawings (Optional)</h3>
                <p className="text-base text-slate-600">Upload plot survey drawings, site plans, or existing building plans</p>
                <FileUpload
                  onFilesSelected={(files) => {
                    // Files will be stored for future backend integration
                    console.log('Survey files uploaded:', files.map(f => f.name));
                  }}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg'],
                    'application/pdf': ['.pdf'],
                    'application/dwg': ['.dwg'],
                  }}
                  maxSize={10485760}
                  maxFiles={5}
                />
              </div>

              {/* Special Conditions */}
              <div className="space-y-5 pt-6 border-t border-slate-200">
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">Special Conditions</h3>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="heritage"
                      checked={heritage}
                      onChange={(e) => setHeritage(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="heritage" className="text-sm text-gray-700">
                      Heritage Zone (additional restrictions may apply)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="toz"
                      checked={toz}
                      onChange={(e) => setToz(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="toz" className="text-sm text-gray-700">
                      Traffic Optimization Zone (TOZ)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sez"
                      checked={sez}
                      onChange={(e) => setSez(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="sez" className="text-sm text-gray-700">
                      Special Economic Zone (SEZ)
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-8 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={!isStep1Valid || isLoading}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Regulations
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

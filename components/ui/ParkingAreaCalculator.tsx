'use client';

import { useState } from 'react';
import { Car, Bike } from 'lucide-react';

interface ParkingAllocation {
  carSpaces: number;
  carArea: number;
  twoWheelerSpaces: number;
  twoWheelerArea: number;
  totalUsedArea: number;
}

interface ParkingAreaCalculatorProps {
  totalParkingArea: number; // in sq.m
  onAllocationChange: (allocation: ParkingAllocation) => void;
}

const CAR_SPACE_AREA = 12.5; // sq.m (2.5m x 5m)
const TWO_WHEELER_SPACE_AREA = 1.75; // sq.m (0.75m x 2.3m)

export function ParkingAreaCalculator({
  totalParkingArea,
  onAllocationChange,
}: ParkingAreaCalculatorProps) {
  // Calculate initial 70-30 split
  const initialCarArea = totalParkingArea * 0.7;
  const initialCarSpaces = Math.floor(initialCarArea / CAR_SPACE_AREA);
  const initialTwoWheelerArea = totalParkingArea * 0.3;
  const initialTwoWheelerSpaces = Math.floor(initialTwoWheelerArea / TWO_WHEELER_SPACE_AREA);

  const [carSpaces, setCarSpaces] = useState(initialCarSpaces);
  const [twoWheelerSpaces, setTwoWheelerSpaces] = useState(initialTwoWheelerSpaces);

  const carArea = carSpaces * CAR_SPACE_AREA;
  const twoWheelerArea = twoWheelerSpaces * TWO_WHEELER_SPACE_AREA;
  const totalUsedArea = carArea + twoWheelerArea;
  const remainingArea = totalParkingArea - totalUsedArea;
  const utilizationPercentage = (totalUsedArea / totalParkingArea) * 100;

  const handleCarSpacesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const spaces = parseInt(e.target.value) || 0;
    const maxCarSpaces = Math.floor(totalParkingArea / CAR_SPACE_AREA);
    const validSpaces = Math.min(Math.max(0, spaces), maxCarSpaces);
    setCarSpaces(validSpaces);

    const allocation: ParkingAllocation = {
      carSpaces: validSpaces,
      carArea: validSpaces * CAR_SPACE_AREA,
      twoWheelerSpaces,
      twoWheelerArea: twoWheelerSpaces * TWO_WHEELER_SPACE_AREA,
      totalUsedArea: validSpaces * CAR_SPACE_AREA + twoWheelerSpaces * TWO_WHEELER_SPACE_AREA,
    };
    onAllocationChange(allocation);
  };

  const handleTwoWheelerSpacesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const spaces = parseInt(e.target.value) || 0;
    const maxTwoWheelerSpaces = Math.floor(totalParkingArea / TWO_WHEELER_SPACE_AREA);
    const validSpaces = Math.min(Math.max(0, spaces), maxTwoWheelerSpaces);
    setTwoWheelerSpaces(validSpaces);

    const allocation: ParkingAllocation = {
      carSpaces,
      carArea: carSpaces * CAR_SPACE_AREA,
      twoWheelerSpaces: validSpaces,
      twoWheelerArea: validSpaces * TWO_WHEELER_SPACE_AREA,
      totalUsedArea: carSpaces * CAR_SPACE_AREA + validSpaces * TWO_WHEELER_SPACE_AREA,
    };
    onAllocationChange(allocation);
  };

  const handlePresetSplit = (carPercentage: number) => {
    const carAreaAllocation = totalParkingArea * (carPercentage / 100);
    const twoWheelerAreaAllocation = totalParkingArea * ((100 - carPercentage) / 100);

    const newCarSpaces = Math.floor(carAreaAllocation / CAR_SPACE_AREA);
    const newTwoWheelerSpaces = Math.floor(twoWheelerAreaAllocation / TWO_WHEELER_SPACE_AREA);

    setCarSpaces(newCarSpaces);
    setTwoWheelerSpaces(newTwoWheelerSpaces);

    const allocation: ParkingAllocation = {
      carSpaces: newCarSpaces,
      carArea: newCarSpaces * CAR_SPACE_AREA,
      twoWheelerSpaces: newTwoWheelerSpaces,
      twoWheelerArea: newTwoWheelerSpaces * TWO_WHEELER_SPACE_AREA,
      totalUsedArea: newCarSpaces * CAR_SPACE_AREA + newTwoWheelerSpaces * TWO_WHEELER_SPACE_AREA,
    };
    onAllocationChange(allocation);
  };

  return (
    <div className="space-y-6">
      {/* Total Parking Area Display */}
      <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--blueprint)]/30">
        <p className="text-sm text-[var(--text-secondary)] font-semibold mb-2">Total Parking Area Required</p>
        <p className="text-5xl font-extrabold gradient-text">
          {totalParkingArea.toFixed(0)} sq.m
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--blueprint)] to-[var(--accent-primary)] transition-all duration-300"
                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-bold text-[var(--text-secondary)]">
            {utilizationPercentage.toFixed(1)}% used
          </span>
        </div>
      </div>

      {/* Preset Splits */}
      <div>
        <p className="text-sm text-[var(--text-secondary)] font-semibold mb-3">Quick Allocation Presets</p>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handlePresetSplit(80)}
            className="px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-semibold rounded-lg transition-colors text-sm"
          >
            80% Car / 20% 2W
          </button>
          <button
            onClick={() => handlePresetSplit(70)}
            className="px-4 py-2 bg-[var(--accent-subtle)] hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-semibold rounded-lg transition-colors text-sm"
          >
            70% Car / 30% 2W
          </button>
          <button
            onClick={() => handlePresetSplit(60)}
            className="px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-semibold rounded-lg transition-colors text-sm"
          >
            60% Car / 40% 2W
          </button>
        </div>
      </div>

      {/* Allocation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Car Parking */}
        <div className="p-5 bg-[var(--blueprint-subtle)] border-2 border-[var(--blueprint)]/30 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[var(--blueprint)] rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-[var(--bg-primary)]" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-primary)]">Car Parking</h4>
              <p className="text-xs text-[var(--text-muted)]">
                {CAR_SPACE_AREA} sq.m per space
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Number of Spaces
              </label>
              <input
                type="number"
                min="0"
                value={carSpaces}
                onChange={handleCarSpacesChange}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--blueprint)] focus:border-[var(--blueprint)] font-bold text-lg text-[var(--text-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                <p className="text-[var(--text-muted)] mb-1">Area Used</p>
                <p className="text-xl font-bold text-[var(--blueprint)]">
                  {carArea.toFixed(1)}
                </p>
                <p className="text-xs text-[var(--text-muted)]">sq.m</p>
              </div>
              <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                <p className="text-[var(--text-muted)] mb-1">Allocation</p>
                <p className="text-xl font-bold text-[var(--blueprint)]">
                  {((carArea / totalParkingArea) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Wheeler Parking */}
        <div className="p-5 bg-[var(--accent-subtle)] border-2 border-[var(--accent-primary)]/30 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center">
              <Bike className="w-6 h-6 text-[var(--bg-primary)]" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-primary)]">Two-Wheeler Parking</h4>
              <p className="text-xs text-[var(--text-muted)]">
                {TWO_WHEELER_SPACE_AREA} sq.m per space
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Number of Spaces
              </label>
              <input
                type="number"
                min="0"
                value={twoWheelerSpaces}
                onChange={handleTwoWheelerSpacesChange}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] font-bold text-lg text-[var(--text-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                <p className="text-[var(--text-muted)] mb-1">Area Used</p>
                <p className="text-xl font-bold text-[var(--accent-primary)]">
                  {twoWheelerArea.toFixed(1)}
                </p>
                <p className="text-xs text-[var(--text-muted)]">sq.m</p>
              </div>
              <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                <p className="text-[var(--text-muted)] mb-1">Allocation</p>
                <p className="text-xl font-bold text-[var(--accent-primary)]">
                  {((twoWheelerArea / totalParkingArea) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-5 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Total Used</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {totalUsedArea.toFixed(1)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">sq.m</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Remaining</p>
            <p className={`text-2xl font-bold ${remainingArea < 0 ? 'text-[var(--error)]' : 'text-[var(--success)]'}`}>
              {remainingArea.toFixed(1)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">sq.m</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Total Spaces</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {carSpaces + twoWheelerSpaces}
            </p>
            <p className="text-xs text-[var(--text-muted)]">spaces</p>
          </div>
        </div>

        {remainingArea < 0 && (
          <div className="mt-4 p-3 bg-[var(--error-bg)] border border-[var(--error)]/30 rounded-lg">
            <p className="text-sm text-[var(--error)]">
              <strong>Warning:</strong> Allocated area exceeds total parking area by {Math.abs(remainingArea).toFixed(1)} sq.m
            </p>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="p-4 bg-[var(--warning-bg)] border border-[var(--warning)]/30 rounded-xl text-sm text-[var(--text-primary)]">
        <p>
          <strong className="text-[var(--warning)]">Standard Dimensions (GDCR):</strong>
        </p>
        <ul className="mt-2 space-y-1 ml-4 list-disc text-[var(--text-secondary)]">
          <li>Car: 2.5m × 5m = {CAR_SPACE_AREA} sq.m (excluding circulation)</li>
          <li>Two-wheeler: 0.75m × 2.3m ≈ {TWO_WHEELER_SPACE_AREA} sq.m</li>
          <li>Add 30-40% circulation area for actual layout design</li>
        </ul>
      </div>
    </div>
  );
}

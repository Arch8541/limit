'use client';

import { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface FSIAdjusterProps {
  baseFSI: number;
  currentFSI: number;
  maxFSI: number;
  plotArea: number;
  onChange: (newFSI: number, newBuiltUpArea: number) => void;
}

export function FSIAdjuster({
  baseFSI,
  currentFSI,
  maxFSI,
  plotArea,
  onChange,
}: FSIAdjusterProps) {
  const [adjustedFSI, setAdjustedFSI] = useState(currentFSI);
  const step = 0.1;

  const handleIncrease = () => {
    const newFSI = Math.min(adjustedFSI + step, maxFSI);
    const rounded = Math.round(newFSI * 10) / 10;
    setAdjustedFSI(rounded);
    onChange(rounded, rounded * plotArea);
  };

  const handleDecrease = () => {
    const newFSI = Math.max(adjustedFSI - step, baseFSI);
    const rounded = Math.round(newFSI * 10) / 10;
    setAdjustedFSI(rounded);
    onChange(rounded, rounded * plotArea);
  };

  const handleReset = () => {
    setAdjustedFSI(currentFSI);
    onChange(currentFSI, currentFSI * plotArea);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFSI = parseFloat(e.target.value);
    setAdjustedFSI(newFSI);
    onChange(newFSI, newFSI * plotArea);
  };

  const isAdjusted = adjustedFSI !== currentFSI;
  const builtUpArea = adjustedFSI * plotArea;

  return (
    <div className="space-y-4">
      {/* FSI Value Display */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)] font-semibold mb-1">Current FSI</p>
          <p className="text-4xl font-extrabold text-[var(--accent-primary)]">
            {adjustedFSI.toFixed(2)}
          </p>
          {isAdjusted && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Original: {currentFSI.toFixed(2)}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--text-secondary)] font-semibold mb-1">Max Built-up Area</p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            {builtUpArea.toFixed(0)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">sq.m</p>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>Base: {baseFSI}</span>
          <span>Max: {maxFSI}</span>
        </div>
        <input
          type="range"
          min={baseFSI}
          max={maxFSI}
          step={0.1}
          value={adjustedFSI}
          onChange={handleSliderChange}
          className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
          style={{
            background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${((adjustedFSI - baseFSI) / (maxFSI - baseFSI)) * 100}%, var(--bg-tertiary) ${((adjustedFSI - baseFSI) / (maxFSI - baseFSI)) * 100}%, var(--bg-tertiary) 100%)`,
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDecrease}
          disabled={adjustedFSI <= baseFSI}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-secondary)] font-semibold rounded-xl transition-colors"
        >
          <Minus className="w-4 h-4" />
          Decrease
        </button>
        <button
          onClick={handleIncrease}
          disabled={adjustedFSI >= maxFSI}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent-subtle)] hover:bg-[var(--accent-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--accent-primary)] font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Increase
        </button>
        {isAdjusted && (
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-[var(--warning-bg)] hover:bg-[var(--warning)]/20 text-[var(--warning)] font-semibold rounded-xl transition-colors flex items-center gap-2"
            title="Reset to calculated value"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Information */}
      <div className="p-4 bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/30 rounded-xl">
        <p className="text-sm text-[var(--text-primary)]">
          <strong>Range:</strong> Base FSI ({baseFSI}) to Maximum FSI ({maxFSI})
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Adjust FSI in increments of 0.1 to optimize your building design while staying within regulatory limits.
        </p>
      </div>
    </div>
  );
}

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
          <p className="text-sm text-slate-600 font-semibold mb-1">Current FSI</p>
          <p className="text-4xl font-extrabold text-cyan-600">
            {adjustedFSI.toFixed(2)}
          </p>
          {isAdjusted && (
            <p className="text-xs text-slate-500 mt-1">
              Original: {currentFSI.toFixed(2)}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600 font-semibold mb-1">Max Built-up Area</p>
          <p className="text-3xl font-bold text-slate-900">
            {builtUpArea.toFixed(0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">sq.m</p>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600">
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
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          style={{
            background: `linear-gradient(to right, rgb(8 145 178) 0%, rgb(8 145 178) ${((adjustedFSI - baseFSI) / (maxFSI - baseFSI)) * 100}%, rgb(226 232 240) ${((adjustedFSI - baseFSI) / (maxFSI - baseFSI)) * 100}%, rgb(226 232 240) 100%)`,
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDecrease}
          disabled={adjustedFSI <= baseFSI}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-semibold rounded-xl transition-colors"
        >
          <Minus className="w-4 h-4" />
          Decrease
        </button>
        <button
          onClick={handleIncrease}
          disabled={adjustedFSI >= maxFSI}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-100 hover:bg-cyan-200 disabled:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-cyan-700 font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Increase
        </button>
        {isAdjusted && (
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-xl transition-colors flex items-center gap-2"
            title="Reset to calculated value"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Information */}
      <div className="p-4 bg-cyan-50/80 border border-cyan-200 rounded-xl">
        <p className="text-sm text-cyan-900">
          <strong>Range:</strong> Base FSI ({baseFSI}) to Maximum FSI ({maxFSI})
        </p>
        <p className="text-xs text-cyan-700 mt-1">
          Adjust FSI in increments of 0.1 to optimize your building design while staying within regulatory limits.
        </p>
      </div>
    </div>
  );
}

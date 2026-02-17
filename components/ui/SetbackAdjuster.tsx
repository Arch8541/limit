'use client';

import { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface SetbackAdjusterProps {
  currentSetbacks: { front: number; side: number; rear: number };
  minimumSetbacks: { front: number; side: number; rear: number };
  onChange: (newSetbacks: { front: number; side: number; rear: number }) => void;
}

export function SetbackAdjuster({
  currentSetbacks,
  minimumSetbacks,
  onChange,
}: SetbackAdjusterProps) {
  const [adjustedSetbacks, setAdjustedSetbacks] = useState(currentSetbacks);
  const step = 0.5; // 0.5m increments

  const handleAdjust = (side: 'front' | 'side' | 'rear', delta: number) => {
    const newValue = Math.max(
      adjustedSetbacks[side] + delta,
      minimumSetbacks[side]
    );
    const rounded = Math.round(newValue * 2) / 2; // Round to nearest 0.5
    const newSetbacks = { ...adjustedSetbacks, [side]: rounded };
    setAdjustedSetbacks(newSetbacks);
    onChange(newSetbacks);
  };

  const handleReset = () => {
    setAdjustedSetbacks(currentSetbacks);
    onChange(currentSetbacks);
  };

  const isAdjusted =
    adjustedSetbacks.front !== currentSetbacks.front ||
    adjustedSetbacks.side !== currentSetbacks.side ||
    adjustedSetbacks.rear !== currentSetbacks.rear;

  const SetbackControl = ({
    label,
    side,
    color,
  }: {
    label: string;
    side: 'front' | 'side' | 'rear';
    color: string;
  }) => {
    const isChanged = adjustedSetbacks[side] !== currentSetbacks[side];

    return (
      <div className={`p-4 rounded-xl border-2 ${color} transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Min: {minimumSetbacks[side]}m
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-slate-900">
              {adjustedSetbacks[side].toFixed(1)}m
            </p>
            {isChanged && (
              <p className="text-xs text-cyan-600 font-semibold">
                +{(adjustedSetbacks[side] - currentSetbacks[side]).toFixed(1)}m
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleAdjust(side, -step)}
            disabled={adjustedSetbacks[side] <= minimumSetbacks[side]}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-semibold rounded-lg transition-colors text-sm"
          >
            <Minus className="w-3 h-3" />
            0.5m
          </button>
          <button
            onClick={() => handleAdjust(side, step)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-semibold rounded-lg transition-colors text-sm"
          >
            <Plus className="w-3 h-3" />
            0.5m
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Setback Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SetbackControl
          label="Front Setback"
          side="front"
          color="bg-indigo-50 border-indigo-200"
        />
        <SetbackControl
          label="Side Setback"
          side="side"
          color="bg-cyan-50 border-cyan-200"
        />
        <SetbackControl
          label="Rear Setback"
          side="rear"
          color="bg-emerald-50 border-emerald-200"
        />
      </div>

      {/* Reset Button */}
      {isAdjusted && (
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Calculated Values
        </button>
      )}

      {/* Information */}
      <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl">
        <p className="text-sm text-slate-700">
          <strong>Note:</strong> Setbacks can only be increased from the minimum calculated values. Reducing below regulatory minimums is not permitted.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-600">Min Front:</span>
            <span className="ml-2 font-bold text-indigo-700">
              {minimumSetbacks.front}m
            </span>
          </div>
          <div>
            <span className="text-slate-600">Min Side:</span>
            <span className="ml-2 font-bold text-cyan-700">
              {minimumSetbacks.side}m
            </span>
          </div>
          <div>
            <span className="text-slate-600">Min Rear:</span>
            <span className="ml-2 font-bold text-emerald-700">
              {minimumSetbacks.rear}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

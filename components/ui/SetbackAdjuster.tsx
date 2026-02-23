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
    colorClass,
  }: {
    label: string;
    side: 'front' | 'side' | 'rear';
    colorClass: string;
  }) => {
    const isChanged = adjustedSetbacks[side] !== currentSetbacks[side];

    return (
      <div className={`p-4 rounded-xl border-2 ${colorClass} transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{label}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Min: {minimumSetbacks[side]}m
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-[var(--text-primary)]">
              {adjustedSetbacks[side].toFixed(1)}m
            </p>
            {isChanged && (
              <p className="text-xs text-[var(--accent-primary)] font-semibold">
                +{(adjustedSetbacks[side] - currentSetbacks[side]).toFixed(1)}m
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleAdjust(side, -step)}
            disabled={adjustedSetbacks[side] <= minimumSetbacks[side]}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-secondary)] font-semibold rounded-lg transition-colors text-sm"
          >
            <Minus className="w-3 h-3" />
            0.5m
          </button>
          <button
            onClick={() => handleAdjust(side, step)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[var(--accent-subtle)] hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-semibold rounded-lg transition-colors text-sm"
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
          colorClass="bg-[var(--blueprint-subtle)] border-[var(--blueprint)]/30"
        />
        <SetbackControl
          label="Side Setback"
          side="side"
          colorClass="bg-[var(--accent-subtle)] border-[var(--accent-primary)]/30"
        />
        <SetbackControl
          label="Rear Setback"
          side="rear"
          colorClass="bg-[var(--success-bg)] border-[var(--success)]/30"
        />
      </div>

      {/* Reset Button */}
      {isAdjusted && (
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--warning-bg)] hover:bg-[var(--warning)]/20 text-[var(--warning)] font-semibold rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Calculated Values
        </button>
      )}

      {/* Information */}
      <div className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl">
        <p className="text-sm text-[var(--text-secondary)]">
          <strong className="text-[var(--text-primary)]">Note:</strong> Setbacks can only be increased from the minimum calculated values. Reducing below regulatory minimums is not permitted.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[var(--text-muted)]">Min Front:</span>
            <span className="ml-2 font-bold text-[var(--blueprint)]">
              {minimumSetbacks.front}m
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Min Side:</span>
            <span className="ml-2 font-bold text-[var(--accent-primary)]">
              {minimumSetbacks.side}m
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Min Rear:</span>
            <span className="ml-2 font-bold text-[var(--success)]">
              {minimumSetbacks.rear}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

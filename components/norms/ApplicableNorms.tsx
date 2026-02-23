'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronDown, ChevronRight, Filter, Search } from 'lucide-react';
import { IntendedUse, Zone, BuildingNorm, NormCategory } from '@/types';
import buildingNormsData from '@/lib/regulations/gdcr-building-norms.json';

interface ApplicableNormsProps {
  zone: Zone;
  intendedUse: IntendedUse;
  className?: string;
}

const CATEGORY_ICONS: Record<NormCategory, string> = {
  'Room Dimensions': '📐',
  'Structural Elements': '🏗️',
  'Openings': '🪟',
  'Services': '🔧',
  'Fire Safety': '🔥',
  'Accessibility': '♿',
  'Parking': '🚗',
  'Common Areas': '🏛️',
};

const CATEGORY_COLORS: Record<NormCategory, string> = {
  'Room Dimensions': 'bg-[var(--blueprint-subtle)] border-[var(--blueprint)]/30 text-[var(--blueprint)]',
  'Structural Elements': 'bg-[var(--bg-tertiary)] border-[var(--border-default)] text-[var(--text-secondary)]',
  'Openings': 'bg-[var(--accent-subtle)] border-[var(--accent-primary)]/30 text-[var(--accent-primary)]',
  'Services': 'bg-[var(--accent-subtle)] border-[var(--accent-primary)]/30 text-[var(--accent-primary)]',
  'Fire Safety': 'bg-[var(--warning-bg)] border-[var(--warning)]/30 text-[var(--warning)]',
  'Accessibility': 'bg-[var(--blueprint-subtle)] border-[var(--blueprint)]/30 text-[var(--blueprint)]',
  'Parking': 'bg-[var(--blueprint-subtle)] border-[var(--blueprint)]/30 text-[var(--blueprint)]',
  'Common Areas': 'bg-[var(--success-bg)] border-[var(--success)]/30 text-[var(--success)]',
};

export function ApplicableNorms({ zone, intendedUse, className = '' }: ApplicableNormsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<NormCategory>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NormCategory | 'all'>('all');

  // Filter applicable norms based on zone and intended use
  const applicableNorms = useMemo(() => {
    const norms = buildingNormsData.norms as unknown as BuildingNorm[];
    return norms.filter(norm =>
      norm.applicable_to.includes(intendedUse)
    );
  }, [intendedUse]);

  // Group norms by category
  const normsByCategory = useMemo(() => {
    const grouped = new Map<NormCategory, BuildingNorm[]>();

    applicableNorms.forEach(norm => {
      if (!grouped.has(norm.category)) {
        grouped.set(norm.category, []);
      }
      grouped.get(norm.category)!.push(norm);
    });

    return grouped;
  }, [applicableNorms]);

  // Filter norms based on search query and selected category
  const filteredCategories = useMemo(() => {
    const filtered = new Map<NormCategory, BuildingNorm[]>();

    normsByCategory.forEach((norms, category) => {
      if (selectedCategory !== 'all' && category !== selectedCategory) {
        return;
      }

      const matchingNorms = norms.filter(norm => {
        const searchLower = searchQuery.toLowerCase();
        return (
          norm.element.toLowerCase().includes(searchLower) ||
          norm.rule_id.toLowerCase().includes(searchLower) ||
          norm.source.toLowerCase().includes(searchLower) ||
          (norm.notes && norm.notes.toLowerCase().includes(searchLower))
        );
      });

      if (matchingNorms.length > 0) {
        filtered.set(category, matchingNorms);
      }
    });

    return filtered;
  }, [normsByCategory, searchQuery, selectedCategory]);

  const toggleCategory = (category: NormCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => {
    setExpandedCategories(new Set(Array.from(normsByCategory.keys())));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const formatRequirement = (key: string, value: any): string => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  return (
    <Card className={`bg-[var(--bg-elevated)] ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl font-mono">Applicable Building Norms</CardTitle>
            <p className="text-sm text-[var(--text-secondary)] mt-2 font-mono">
              GDCR 2017 Requirements for <Badge variant="info" className="ml-1">{zone}</Badge>{' '}
              <Badge variant="default" className="ml-1">{intendedUse}</Badge>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs font-mono font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-subtle)] rounded-lg transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search norms by element, ID, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-secondary)] font-mono font-semibold">Filter:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              All ({applicableNorms.length})
            </button>
            {Array.from(normsByCategory.keys()).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  selectedCategory === category
                    ? CATEGORY_COLORS[category]
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {CATEGORY_ICONS[category]} {category} ({normsByCategory.get(category)?.length || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-4 text-sm text-[var(--text-secondary)] font-mono">
            Found {Array.from(filteredCategories.values()).reduce((sum, norms) => sum + norms.length, 0)} norms
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </div>
        )}

        {/* Norms by Category */}
        <div className="space-y-4">
          {Array.from(filteredCategories.entries()).map(([category, norms]) => (
            <div
              key={category}
              className={`border-2 rounded-xl overflow-hidden transition-all ${CATEGORY_COLORS[category]}`}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--bg-primary)]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                  <div className="text-left">
                    <h3 className="font-bold text-lg font-mono">{category}</h3>
                    <p className="text-xs opacity-80 font-mono">{norms.length} applicable norms</p>
                  </div>
                </div>
                {expandedCategories.has(category) ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>

              {/* Category Content */}
              {expandedCategories.has(category) && (
                <div className="px-5 pb-5 space-y-3 bg-[var(--bg-primary)]/20">
                  {norms.map((norm) => (
                    <div
                      key={norm.rule_id}
                      className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Norm Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-[var(--text-primary)] text-base font-mono">{norm.element}</h4>
                          <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">ID: {norm.rule_id}</p>
                        </div>
                        <Badge variant="default" className="font-mono text-xs">
                          {norm.unit}
                        </Badge>
                      </div>

                      {/* Requirements */}
                      <div className="space-y-2 mb-3">
                        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide font-mono">
                          Requirements:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(norm.requirements).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between bg-[var(--bg-tertiary)] px-3 py-2 rounded-md"
                            >
                              <span className="text-xs text-[var(--text-secondary)] font-mono">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                                {formatRequirement(key, value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Source */}
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xs text-[var(--text-secondary)] font-semibold font-mono">Source:</span>
                        <span className="text-xs text-[var(--accent-primary)] font-mono">{norm.source}</span>
                      </div>

                      {/* Notes */}
                      {norm.notes && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-default)]">
                          <p className="text-xs text-[var(--text-secondary)] italic font-mono leading-relaxed">
                            <span className="font-semibold not-italic text-[var(--text-primary)]">Note:</span> {norm.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.size === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-[var(--text-secondary)] font-mono">
              No norms found matching your search criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-lg hover:opacity-90 transition-colors font-mono text-sm font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-[var(--warning-bg)] border-2 border-[var(--warning)]/30 rounded-xl">
          <p className="text-sm text-[var(--text-primary)] font-mono leading-relaxed">
            <strong className="font-bold text-[var(--warning)]">Note:</strong> These norms are based on GDCR 2017 regulations.
            Always verify with the local authority and obtain necessary approvals before construction.
            Requirements may vary based on specific site conditions and local amendments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

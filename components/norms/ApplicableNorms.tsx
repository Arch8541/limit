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
  'Room Dimensions': 'bg-blue-50 border-blue-200 text-blue-700',
  'Structural Elements': 'bg-slate-50 border-slate-200 text-slate-700',
  'Openings': 'bg-cyan-50 border-cyan-200 text-cyan-700',
  'Services': 'bg-teal-50 border-teal-200 text-teal-700',
  'Fire Safety': 'bg-orange-50 border-orange-200 text-orange-700',
  'Accessibility': 'bg-purple-50 border-purple-200 text-purple-700',
  'Parking': 'bg-indigo-50 border-indigo-200 text-indigo-700',
  'Common Areas': 'bg-emerald-50 border-emerald-200 text-emerald-700',
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
    <Card className={`border-slate-200/60 ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl font-mono">Applicable Building Norms</CardTitle>
            <p className="text-sm text-slate-600 mt-2 font-mono">
              GDCR 2017 Requirements for <Badge variant="info" className="ml-1">{zone}</Badge>{' '}
              <Badge variant="default" className="ml-1">{intendedUse}</Badge>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs font-mono font-semibold text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50 rounded-lg transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search norms by element, ID, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600 font-mono font-semibold">Filter:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
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
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {CATEGORY_ICONS[category]} {category} ({normsByCategory.get(category)?.length || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-4 text-sm text-slate-600 font-mono">
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
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
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
                <div className="px-5 pb-5 space-y-3 bg-white/30">
                  {norms.map((norm) => (
                    <div
                      key={norm.rule_id}
                      className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Norm Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 text-base font-mono">{norm.element}</h4>
                          <p className="text-xs text-slate-500 mt-1 font-mono">ID: {norm.rule_id}</p>
                        </div>
                        <Badge variant="default" className="font-mono text-xs">
                          {norm.unit}
                        </Badge>
                      </div>

                      {/* Requirements */}
                      <div className="space-y-2 mb-3">
                        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide font-mono">
                          Requirements:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(norm.requirements).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-md"
                            >
                              <span className="text-xs text-slate-600 font-mono">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-xs font-bold text-slate-900 font-mono">
                                {formatRequirement(key, value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Source */}
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xs text-slate-600 font-semibold font-mono">Source:</span>
                        <span className="text-xs text-cyan-700 font-mono">{norm.source}</span>
                      </div>

                      {/* Notes */}
                      {norm.notes && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs text-slate-700 italic font-mono leading-relaxed">
                            <span className="font-semibold not-italic">Note:</span> {norm.notes}
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
            <p className="text-slate-600 font-mono">
              No norms found matching your search criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-mono text-sm font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
          <p className="text-sm text-amber-900 font-mono leading-relaxed">
            <strong className="font-bold">Note:</strong> These norms are based on GDCR 2017 regulations.
            Always verify with the local authority and obtain necessary approvals before construction.
            Requirements may vary based on specific site conditions and local amendments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

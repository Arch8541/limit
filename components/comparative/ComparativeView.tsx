'use client';

import React, { useState } from 'react';
import { Project } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpDown, CheckCircle2, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/Tooltip';

interface ComparativeViewProps {
  projects: Project[];
  maxProjects?: number;
}

type SortKey = 'fsi' | 'height' | 'coverage' | 'parking' | 'area';
type SortOrder = 'asc' | 'desc';

export function ComparativeView({ projects, maxProjects = 4 }: ComparativeViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('fsi');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const displayProjects = projects.slice(0, maxProjects);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedProjects = [...displayProjects].sort((a, b) => {
    let aValue = 0;
    let bValue = 0;

    switch (sortKey) {
      case 'fsi':
        aValue = a.regulationResult?.fsi?.total || 0;
        bValue = b.regulationResult?.fsi?.total || 0;
        break;
      case 'height':
        aValue = a.regulationResult?.height?.max || 0;
        bValue = b.regulationResult?.height?.max || 0;
        break;
      case 'coverage':
        aValue = a.regulationResult?.groundCoverage?.maxPercentage || 0;
        bValue = b.regulationResult?.groundCoverage?.maxPercentage || 0;
        break;
      case 'parking':
        aValue = a.regulationResult?.parking?.required || 0;
        bValue = b.regulationResult?.parking?.required || 0;
        break;
      case 'area':
        aValue = a.siteData?.plotDimensions?.area || 0;
        bValue = b.siteData?.plotDimensions?.area || 0;
        break;
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const getComparisonIndicator = (value: number, max: number, min: number) => {
    if (value === max) {
      return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    } else if (value === min) {
      return <TrendingDown className="w-4 h-4 text-orange-600" />;
    }
    return null;
  };

  const maxFSI = Math.max(...sortedProjects.map((p) => p.regulationResult?.fsi?.total || 0));
  const minFSI = Math.min(...sortedProjects.map((p) => p.regulationResult?.fsi?.total || 0));
  const maxHeight = Math.max(...sortedProjects.map((p) => p.regulationResult?.height?.max || 0));
  const minHeight = Math.min(...sortedProjects.map((p) => p.regulationResult?.height?.max || 0));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Site Comparison</h2>
        <div className="flex gap-2">
          <Badge variant="default">Comparing {sortedProjects.length} sites</Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-3xl border border-stone-200 glass">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-gradient-to-r from-teal-50 to-cyan-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Parameter
                  </th>
                  {sortedProjects.map((project) => (
                    <th
                      key={project.id}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="truncate max-w-[200px]">{project.siteData?.projectName || 'Unnamed'}</span>
                        <Badge variant="default" className="w-fit">
                          {project.siteData?.zone || 'N/A'}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-100">
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort('area')}
                        className="flex items-center gap-1 font-medium text-gray-900 hover:text-teal-600"
                      >
                        Plot Area
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  {sortedProjects.map((project) => (
                    <td key={project.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {(project.siteData?.plotDimensions?.area || 0).toLocaleString()} sq.m
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort('fsi')}
                        className="flex items-center gap-1 font-medium text-gray-900 hover:text-teal-600"
                      >
                        Max FSI
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                      <InfoTooltip content="Floor Space Index - Maximum allowed built-up area divided by plot area" />
                    </div>
                  </td>
                  {sortedProjects.map((project) => {
                    const fsi = project.regulationResult?.fsi?.total || 0;
                    return (
                      <td key={project.id} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{fsi.toFixed(2)}</span>
                          {getComparisonIndicator(fsi, maxFSI, minFSI)}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort('height')}
                        className="flex items-center gap-1 font-medium text-gray-900 hover:text-teal-600"
                      >
                        Max Height
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                      <InfoTooltip content="Maximum building height allowed as per GDCR 2017 regulations" />
                    </div>
                  </td>
                  {sortedProjects.map((project) => {
                    const height = project.regulationResult?.height?.max || 0;
                    return (
                      <td key={project.id} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{height.toFixed(2)} m</span>
                          {getComparisonIndicator(height, maxHeight, minHeight)}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort('coverage')}
                        className="flex items-center gap-1 font-medium text-gray-900 hover:text-teal-600"
                      >
                        Ground Coverage
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  {sortedProjects.map((project) => (
                    <td key={project.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {project.regulationResult?.groundCoverage?.maxPercentage || 0}%
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Front Setback</span>
                    </div>
                  </td>
                  {sortedProjects.map((project) => (
                    <td key={project.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {project.regulationResult?.setbacks?.front || 0} m
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Side Setback</span>
                    </div>
                  </td>
                  {sortedProjects.map((project) => (
                    <td key={project.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {project.regulationResult?.setbacks?.side || 0} m
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Rear Setback</span>
                    </div>
                  </td>
                  {sortedProjects.map((project) => (
                    <td key={project.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {project.regulationResult?.setbacks?.rear || 0} m
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort('parking')}
                        className="flex items-center gap-1 font-medium text-gray-900 hover:text-teal-600"
                      >
                        Parking (ECS)
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                      <InfoTooltip content="Equivalent Car Spaces - 1 ECS = 27.5 sq.m minimum" />
                    </div>
                  </td>
                  {sortedProjects.map((project) => (
                    <td key={project.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {project.regulationResult?.parking?.required || 0} spaces
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Corner Plot Bonus</span>
                    </div>
                  </td>
                  {sortedProjects.map((project) => (
                    <td key={project.id} className="px-6 py-4 whitespace-nowrap">
                      {project.siteData?.isCornerPlot ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Comparison Legend</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-gray-600">Highest value in comparison</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-orange-600" />
            <span className="text-gray-600">Lowest value in comparison</span>
          </div>
        </div>
      </div>
    </div>
  );
}

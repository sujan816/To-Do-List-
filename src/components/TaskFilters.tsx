/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterType } from '../types';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  count: number;
}

export default function TaskFilters({ currentFilter, onFilterChange, count }: TaskFiltersProps) {
  const filters: FilterType[] = ['all', 'completed', 'pending'];

  return (
    <div className="flex items-center justify-between mb-6 px-2" id="task-filters">
      <div className="flex gap-2 p-1 bg-anime-surface/30 rounded-xl border border-white/5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
              currentFilter === f
                ? 'bg-anime-surface text-anime-primary shadow-sm border border-white/5'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            id={`filter-${f}`}
          >
            {f}
          </button>
        ))}
      </div>
      
      <div className="text-right">
        <span className="text-[10px] uppercase font-mono text-slate-500 tracking-widest block leading-none">
          Active Missions
        </span>
        <span className="text-2xl font-bold text-slate-200 mt-1 block">
          {count}
        </span>
      </div>
    </div>
  );
}

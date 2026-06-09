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
    <div className="flex items-center justify-between mb-4 px-1" id="task-filters">
      <div className="flex gap-1.5 p-1 bg-slate-900/40 rounded-xl border border-white/5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
              currentFilter === f
                ? 'bg-slate-800 text-indigo-400 font-bold border border-white/5 shadow-inner shadow-black/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            id={`filter-${f}`}
          >
            {f}
          </button>
        ))}
      </div>
      
      <div className="text-right">
        <span className="text-[9px] uppercase font-mono text-slate-500 tracking-widest block leading-none">
          Active Quests
        </span>
        <span className="text-xl font-bold text-slate-200 mt-1 block font-mono">
          {count}
        </span>
      </div>
    </div>
  );
}

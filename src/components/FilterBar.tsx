"use client";

import { CATEGORIES, type Category } from "@/types/expense";

export interface Filters {
  search: string;
  category: Category | "All";
  startDate: string;
  endDate: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  resultCount: number;
}

export default function FilterBar({ filters, onChange, onReset, resultCount }: FilterBarProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "All" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label htmlFor="search" className="mb-1.5 block text-xs font-medium text-slate-500">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search description..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label htmlFor="category-filter" className="mb-1.5 block text-xs font-medium text-slate-500">
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(e) =>
              onChange({ ...filters, category: e.target.value as Category | "All" })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="start-date" className="mb-1.5 block text-xs font-medium text-slate-500">
            From
          </label>
          <input
            id="start-date"
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label htmlFor="end-date" className="mb-1.5 block text-xs font-medium text-slate-500">
            To
          </label>
          <input
            id="end-date"
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {resultCount} result{resultCount === 1 ? "" : "s"}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

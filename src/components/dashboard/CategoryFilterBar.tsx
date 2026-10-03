'use client';

import * as React from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFilterSheet } from '@/hooks/useFilterSheet';
import { FilterAndSortModal } from '@/components/dashboard/FilterAndSortModal';

interface CategoryFilterBarProps {
  matchingCount?: number;
}

export function CategoryFilterBar({ matchingCount = 0 }: CategoryFilterBarProps) {
  const filterController = useFilterSheet();
  const {
    openFilterSheet,
    activeFiltersCount,
    hasActiveFilters,
    filter,
    activeFilterBadges,
    setSearchQuery,
    removeFilter,
    resetAllFilters,
  } = filterController;

  return (
    <div id="category-filter-section" className="space-y-3 mb-6 sm:mb-8 scroll-mt-20">
      {/* Airbnb / App Store Style Unified Search & Filter Toolbar (Single Row) */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Full-width Search Input with integrated clear button */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search products, brands, IMEI, registration..."
            value={filter.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-9 bg-white border-slate-200/90 text-xs sm:text-sm h-11 rounded-2xl shadow-2xs w-full focus-visible:ring-2 focus-visible:ring-blue-500/20"
          />
          {filter.searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear search text"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Airbnb Style Filter & Sort Trigger Button */}
        <Button
          type="button"
          variant="outline"
          onClick={openFilterSheet}
          className={`h-11 px-3.5 sm:px-4 rounded-2xl border text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer flex items-center gap-2 ${
            activeFiltersCount > 0
              ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600/30 hover:bg-blue-100/70'
              : 'border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
          aria-label="Open filters and sort options"
        >
          <SlidersHorizontal className="h-4 w-4 text-slate-600" />
          <span className="hidden sm:inline">Filters & Sort</span>
          <span className="sm:hidden">Filter</span>
          {activeFiltersCount > 0 && (
            <span
              suppressHydrationWarning
              className="h-5 min-w-[1.25rem] px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center leading-none"
            >
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Active Filter Tags Row (Only shown when filters are active to keep page 100% clean) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Active:
          </span>

          {activeFilterBadges.map((badge) => (
            <div
              key={badge.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs shrink-0 select-none"
            >
              <span>{badge.label}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFilter(badge.type)}
                className="h-4 w-4 p-0 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer ml-0.5"
                aria-label={`Remove filter ${badge.label}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {filter.searchQuery && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-2xs shrink-0 select-none">
              <span className="truncate max-w-[120px]">&ldquo;{filter.searchQuery}&rdquo;</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="h-4 w-4 p-0 rounded-full hover:bg-blue-200/60 text-blue-600 hover:text-blue-900 cursor-pointer ml-0.5"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <Button
            type="button"
            variant="link"
            onClick={resetAllFilters}
            className="h-auto p-0 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 ml-1 shrink-0 cursor-pointer px-1 py-0.5"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Pop-up Filter & Sort Modal */}
      <FilterAndSortModal
        filterController={filterController}
        matchingCount={matchingCount}
      />
    </div>
  );
}

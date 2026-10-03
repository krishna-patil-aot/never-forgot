'use client';

import * as React from 'react';
import {
  Layers,
  ShieldCheck,
  Wrench,
  HeartHandshake,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ArrowUpDown,
  Clock,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFilterSheet } from '@/hooks/useFilterSheet';
import { AssetCategory, ExpiryStatus, SortOption } from '@/types/asset.types';

interface FilterAndSortModalProps {
  filterController: ReturnType<typeof useFilterSheet>;
  matchingCount: number;
}

export function FilterAndSortModal({
  filterController,
  matchingCount,
}: FilterAndSortModalProps) {
  const {
    isFilterSheetOpen,
    closeFilterSheet,
    filter,
    metrics,
    activeFiltersCount,
    setFilterCategory,
    setFilterStatus,
    setSortBy,
    resetAllFilters,
  } = filterController;

  const categories: Array<{
    id: AssetCategory | 'all';
    label: string;
    icon: React.ElementType;
    count: number;
  }> = [
    { id: 'all', label: 'All Items', icon: Layers, count: metrics.totalAssetsCount },
    {
      id: 'electronics',
      label: 'Electronics',
      icon: ShieldCheck,
      count: metrics.categoryBreakdown.electronics,
    },
    {
      id: 'vehicle',
      label: 'Vehicles',
      icon: Wrench,
      count: metrics.categoryBreakdown.vehicle,
    },
    {
      id: 'health_insurance',
      label: 'Health & Life',
      icon: HeartHandshake,
      count:
        metrics.categoryBreakdown.health_insurance +
        metrics.categoryBreakdown.life_insurance,
    },
    {
      id: 'home_amc',
      label: 'Home AMC',
      icon: CheckCircle2,
      count: metrics.categoryBreakdown.home_amc,
    },
    {
      id: 'personal_doc',
      label: 'Documents',
      icon: FileText,
      count: metrics.categoryBreakdown.personal_doc,
    },
  ];

  const statuses: Array<{
    id: ExpiryStatus | 'all';
    label: string;
    badgeColor: string;
  }> = [
    { id: 'all', label: 'All Passes', badgeColor: 'bg-slate-400' },
    { id: 'expiring_soon', label: 'Expiring Soon', badgeColor: 'bg-amber-500' },
    { id: 'active', label: 'Active Only', badgeColor: 'bg-emerald-500' },
    { id: 'expired', label: 'Expired', badgeColor: 'bg-rose-500' },
  ];

  const sortOptions: Array<{
    id: SortOption;
    label: string;
    subtitle: string;
  }> = [
    { id: 'expiry_asc', label: 'Expiry: Soonest', subtitle: 'Upcoming renewals first' },
    { id: 'expiry_desc', label: 'Expiry: Furthest', subtitle: 'Longest coverage first' },
    { id: 'name_asc', label: 'Name: A to Z', subtitle: 'Alphabetical order' },
    { id: 'recently_added', label: 'Recently Added', subtitle: 'Latest created items' },
  ];

  return (
    <Dialog open={isFilterSheetOpen} onOpenChange={closeFilterSheet}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 bg-white border-border shadow-2xl">
        <DialogHeader className="pr-10 text-left space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                Filter & Sort Passes
              </DialogTitle>
              {activeFiltersCount > 0 && (
                <span className="text-[11px] font-semibold text-blue-600">
                  {activeFiltersCount} active {activeFiltersCount === 1 ? 'filter' : 'filters'}
                </span>
              )}
            </div>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Customize which passes are displayed in your digital vault and change their order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Section 1: Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              <span>Category</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = filter.category === cat.id;
                return (
                  <Button
                    key={cat.id}
                    type="button"
                    variant="outline"
                    onClick={() => setFilterCategory(cat.id)}
                    className={`h-auto w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer select-none font-normal whitespace-normal ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs font-bold ring-1 ring-blue-600/30 hover:bg-blue-100/70'
                        : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-xs truncate">{cat.label}</span>
                    </div>
                    <span
                      suppressHydrationWarning
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Expiry Status */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Expiry Urgency</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statuses.map((s) => {
                const isSelected = filter.status === s.id;
                return (
                  <Button
                    key={s.id}
                    type="button"
                    variant="outline"
                    onClick={() => setFilterStatus(s.id)}
                    className={`h-auto w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs transition-all cursor-pointer select-none font-normal ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-bold hover:bg-slate-800 hover:text-white'
                        : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full shrink-0 ${s.badgeColor}`} />
                    <span className="truncate">{s.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Sort Order */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-600" />
              <span>Sort Order</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sortOptions.map((opt) => {
                const isSelected = filter.sortBy === opt.id;
                return (
                  <Button
                    key={opt.id}
                    type="button"
                    variant="outline"
                    onClick={() => setSortBy(opt.id)}
                    className={`h-auto w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer select-none font-normal whitespace-normal ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs font-bold ring-1 ring-blue-600/30 hover:bg-blue-100/70'
                        : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{opt.subtitle}</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-blue-600 shrink-0" />}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <DialogFooter className="flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 h-10 px-3 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={closeFilterSheet}
            className="flex-1 sm:flex-initial text-xs font-bold h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
          >
            <span>Show Passes ({matchingCount})</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

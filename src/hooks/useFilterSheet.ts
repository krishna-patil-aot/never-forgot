'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAssetStore } from '@/stores/useAssetStore';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { AssetCategory, ExpiryStatus, SortOption } from '@/types/asset.types';
import { IActiveFilterBadge } from '@/types/filter.types';

export function useFilterSheet() {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);

  const filter = useAssetStore((state) => state.filter);
  const setFilterCategory = useAssetStore((state) => state.setFilterCategory);
  const setFilterStatus = useAssetStore((state) => state.setFilterStatus);
  const setSearchQuery = useAssetStore((state) => state.setSearchQuery);
  const setSortBy = useAssetStore((state) => state.setSortBy);

  const metrics = useDashboardMetrics();

  const openFilterSheet = useCallback(() => setIsFilterSheetOpen(true), []);
  const closeFilterSheet = useCallback(() => setIsFilterSheetOpen(false), []);

  // Compute number of non-default filters applied
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filter.category !== 'all') count += 1;
    if (filter.status !== 'all') count += 1;
    if (filter.sortBy !== 'expiry_asc') count += 1;
    return count;
  }, [filter.category, filter.status, filter.sortBy]);

  const hasActiveFilters = activeFiltersCount > 0 || filter.searchQuery.trim().length > 0;

  // Reset all filters back to clean defaults
  const resetAllFilters = useCallback(() => {
    setFilterCategory('all');
    setFilterStatus('all');
    setSortBy('expiry_asc');
    setSearchQuery('');
  }, [setFilterCategory, setFilterStatus, setSortBy, setSearchQuery]);

  // Remove individual filter chip
  const removeFilter = useCallback(
    (type: 'category' | 'status' | 'sort' | 'search') => {
      switch (type) {
        case 'category':
          setFilterCategory('all');
          break;
        case 'status':
          setFilterStatus('all');
          break;
        case 'sort':
          setSortBy('expiry_asc');
          break;
        case 'search':
          setSearchQuery('');
          break;
      }
    },
    [setFilterCategory, setFilterStatus, setSortBy, setSearchQuery]
  );

  // Generate readable badge tags for applied filters
  const activeFilterBadges = useMemo(() => {
    const badges: IActiveFilterBadge[] = [];

    if (filter.category !== 'all') {
      const categoryLabels: Record<AssetCategory, string> = {
        electronics: 'Electronics',
        vehicle: 'Vehicles',
        health_insurance: 'Health Insurance',
        life_insurance: 'Life Insurance',
        home_amc: 'Home AMC',
        personal_doc: 'Documents',
      };
      badges.push({
        id: 'category',
        type: 'category',
        label: categoryLabels[filter.category] || filter.category,
      });
    }

    if (filter.status !== 'all') {
      const statusLabels: Record<ExpiryStatus, string> = {
        expiring_soon: 'Expiring Soon',
        active: 'Active Only',
        expired: 'Expired Passes',
      };
      badges.push({
        id: 'status',
        type: 'status',
        label: statusLabels[filter.status] || filter.status,
      });
    }

    if (filter.sortBy !== 'expiry_asc') {
      const sortLabels: Record<SortOption, string> = {
        expiry_asc: 'Expiry: Soonest',
        expiry_desc: 'Expiry: Furthest',
        name_asc: 'Name: A to Z',
        recently_added: 'Recently Added',
      };
      badges.push({
        id: 'sort',
        type: 'sort',
        label: sortLabels[filter.sortBy] || filter.sortBy,
      });
    }

    return badges;
  }, [filter.category, filter.status, filter.sortBy]);

  return {
    isFilterSheetOpen,
    openFilterSheet,
    closeFilterSheet,
    activeFiltersCount,
    hasActiveFilters,
    filter,
    metrics,
    activeFilterBadges,
    setFilterCategory,
    setFilterStatus,
    setSearchQuery,
    setSortBy,
    resetAllFilters,
    removeFilter,
  };
}

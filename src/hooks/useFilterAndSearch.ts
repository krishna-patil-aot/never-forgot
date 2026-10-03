'use client';

import { useMemo } from 'react';
import { useAssetStore } from '@/stores/useAssetStore';
import { IUniversalAsset } from '@/types/asset.types';

export function useFilterAndSearch(): {
  filteredAssets: IUniversalAsset[];
  totalFilteredCount: number;
} {
  const assets = useAssetStore((state) => state.assets);
  const filter = useAssetStore((state) => state.filter);

  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Filter by Category
    if (filter.category !== 'all') {
      result = result.filter((item) => item.category === filter.category);
    }

    // Filter by Expiry Status
    if (filter.status !== 'all') {
      result = result.filter((item) => item.status === filter.status);
    }

    // Filter by Search Query
    if (filter.searchQuery.trim().length > 0) {
      const query = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.providerOrBrand.toLowerCase().includes(query) ||
          (item.identifierNumber &&
            item.identifierNumber.toLowerCase().includes(query)) ||
          (item.notes && item.notes.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (filter.sortBy === 'expiry_asc') {
        return (
          new Date(a.expiryOrRenewalDate).getTime() -
          new Date(b.expiryOrRenewalDate).getTime()
        );
      }
      if (filter.sortBy === 'expiry_desc') {
        return (
          new Date(b.expiryOrRenewalDate).getTime() -
          new Date(a.expiryOrRenewalDate).getTime()
        );
      }
      if (filter.sortBy === 'name_asc') {
        return a.title.localeCompare(b.title);
      }
      if (filter.sortBy === 'recently_added') {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

    return result;
  }, [assets, filter]);

  return {
    filteredAssets,
    totalFilteredCount: filteredAssets.length,
  };
}

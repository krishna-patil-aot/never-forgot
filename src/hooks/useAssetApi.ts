'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  IApiResponse,
  IPaginatedData,
  ICreateAssetDto,
  IUpdateAssetDto,
} from '@/types/api.types';
import { IUniversalAsset, IServiceMilestone } from '@/types/asset.types';
import { useAssetStore } from '@/stores/useAssetStore';
import { useAuthStore } from '@/stores/useAuthStore';

export interface IUseAssetApiReturn {
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refreshAssets: () => Promise<void>;
  createAsset: (dto: ICreateAssetDto) => Promise<IUniversalAsset | null>;
  updateAsset: (id: string, dto: IUpdateAssetDto) => Promise<IUniversalAsset | null>;
  deleteAsset: (id: string) => Promise<boolean>;
  toggleMilestone: (assetId: string, milestoneId: string) => Promise<IServiceMilestone | null>;
}

export function useAssetApi(): IUseAssetApiReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const filter = useAssetStore((state) => state.filter);
  const setStoreAssets = useAssetStore((state) => state.addAsset);
  const user = useAuthStore((state) => state.user);

  // Initial load and filter change trigger via async subscription
  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (filter.category && filter.category !== 'all') {
      params.set('category', filter.category);
    }
    if (filter.status && filter.status !== 'all') {
      params.set('status', filter.status);
    }
    if (filter.searchQuery) {
      params.set('searchQuery', filter.searchQuery);
    }
    if (filter.sortBy) {
      params.set('sortBy', filter.sortBy);
    }

    fetch(`/api/assets?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<IApiResponse<IPaginatedData<IUniversalAsset>>>;
      })
      .then((json) => {
        if (!ignore && json.success && json.data) {
          useAssetStore.setState({ assets: json.data.items });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Unknown network error';
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [filter.category, filter.status, filter.searchQuery, filter.sortBy, user?.id]);

  // Explicit user-triggered refresh
  const refreshAssets = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filter.category && filter.category !== 'all') {
      params.set('category', filter.category);
    }
    if (filter.status && filter.status !== 'all') {
      params.set('status', filter.status);
    }
    if (filter.searchQuery) {
      params.set('searchQuery', filter.searchQuery);
    }
    if (filter.sortBy) {
      params.set('sortBy', filter.sortBy);
    }

    try {
      const res = await fetch(`/api/assets?${params.toString()}`);
      if (res.ok) {
        const json = (await res.json()) as IApiResponse<IPaginatedData<IUniversalAsset>>;
        if (json.success && json.data) {
          useAssetStore.setState({ assets: json.data.items });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [filter.category, filter.status, filter.searchQuery, filter.sortBy]);

  // Create new asset via API
  const createAsset = useCallback(
    async (dto: ICreateAssetDto): Promise<IUniversalAsset | null> => {
      setIsMutating(true);
      setError(null);
      try {
        const res = await fetch('/api/assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        if (!res.ok) {
          throw new Error(`Create failed: HTTP ${res.status}`);
        }

        const json: IApiResponse<IUniversalAsset> =
          (await res.json()) as IApiResponse<IUniversalAsset>;

        if (json.success && json.data) {
          setStoreAssets(json.data);
          return json.data;
        } else {
          throw new Error(json.error || 'Failed to register asset');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error creating asset';
        setError(msg);
        return null;
      } finally {
        setIsMutating(false);
      }
    },
    [setStoreAssets]
  );

  // Update asset via API
  const updateAsset = useCallback(
    async (id: string, dto: IUpdateAssetDto): Promise<IUniversalAsset | null> => {
      setIsMutating(true);
      setError(null);
      try {
        const res = await fetch(`/api/assets/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        if (!res.ok) {
          throw new Error(`Update failed: HTTP ${res.status}`);
        }

        const json: IApiResponse<IUniversalAsset> =
          (await res.json()) as IApiResponse<IUniversalAsset>;

        if (json.success && json.data) {
          useAssetStore.getState().updateAsset(id, json.data);
          return json.data;
        } else {
          throw new Error(json.error || 'Failed to update asset');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error updating asset';
        setError(msg);
        return null;
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  // Delete asset via API
  const deleteAsset = useCallback(async (id: string): Promise<boolean> => {
    setIsMutating(true);
    setError(null);
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Delete failed: HTTP ${res.status}`);
      }

      const json: IApiResponse<{ id: string }> =
        (await res.json()) as IApiResponse<{ id: string }>;

      if (json.success) {
        useAssetStore.getState().deleteAsset(id);
        return true;
      } else {
        throw new Error(json.error || 'Failed to delete asset');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error deleting asset';
      setError(msg);
      return false;
    } finally {
      setIsMutating(false);
    }
  }, []);

  // Toggle milestone via API
  const toggleMilestone = useCallback(
    async (assetId: string, milestoneId: string): Promise<IServiceMilestone | null> => {
      // Optimistic update in UI store
      useAssetStore.getState().toggleMilestoneStatus(assetId, milestoneId);

      try {
        const res = await fetch(`/api/assets/${assetId}/milestones/${milestoneId}`, {
          method: 'PATCH',
        });

        if (!res.ok) {
          throw new Error(`Milestone toggle failed: HTTP ${res.status}`);
        }

        const json: IApiResponse<IServiceMilestone> =
          (await res.json()) as IApiResponse<IServiceMilestone>;

        return json.data || null;
      } catch (err) {
        // Rollback optimistic update
        useAssetStore.getState().toggleMilestoneStatus(assetId, milestoneId);
        const msg = err instanceof Error ? err.message : 'Error updating milestone';
        setError(msg);
        return null;
      }
    },
    []
  );

  return {
    isLoading,
    isMutating,
    error,
    refreshAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    toggleMilestone,
  };
}

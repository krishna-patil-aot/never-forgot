'use client';

import { create } from 'zustand';
import {
  AssetCategory,
  ExpiryStatus,
  IAssetFilter,
  IUniversalAsset,
  SortOption,
} from '@/types/asset.types';

interface AssetState {
  assets: IUniversalAsset[];
  filter: IAssetFilter;
  selectedAssetId: string | null;
  isAddModalOpen: boolean;
  isDetailsModalOpen: boolean;
  assetToDelete: IUniversalAsset | null;
  isDeleteModalOpen: boolean;

  // Actions
  setFilterCategory: (category: AssetCategory | 'all') => void;
  setFilterStatus: (status: ExpiryStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  setSelectedAssetId: (id: string | null) => void;
  setIsAddModalOpen: (open: boolean) => void;
  setIsDetailsModalOpen: (open: boolean) => void;
  setAssetToDelete: (asset: IUniversalAsset | null) => void;
  setIsDeleteModalOpen: (open: boolean) => void;

  // Asset CRUD
  addAsset: (asset: IUniversalAsset) => void;
  updateAsset: (id: string, updated: Partial<IUniversalAsset>) => void;
  deleteAsset: (id: string) => void;
  toggleMilestoneStatus: (assetId: string, milestoneId: string) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  assets: [], // Pure live data — initialized empty, loaded from database API
  filter: {
    category: 'all',
    status: 'all',
    searchQuery: '',
    sortBy: 'expiry_asc',
  },
  selectedAssetId: null,
  isAddModalOpen: false,
  isDetailsModalOpen: false,
  assetToDelete: null,
  isDeleteModalOpen: false,

  setFilterCategory: (category) =>
    set((state) => ({ filter: { ...state.filter, category } })),

  setFilterStatus: (status) =>
    set((state) => ({ filter: { ...state.filter, status } })),

  setSearchQuery: (searchQuery) =>
    set((state) => ({ filter: { ...state.filter, searchQuery } })),

  setSortBy: (sortBy) =>
    set((state) => ({ filter: { ...state.filter, sortBy } })),

  setSelectedAssetId: (selectedAssetId) => set({ selectedAssetId }),
  setIsAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
  setIsDetailsModalOpen: (isDetailsModalOpen) => set({ isDetailsModalOpen }),
  setAssetToDelete: (assetToDelete) => set({ assetToDelete }),
  setIsDeleteModalOpen: (isDeleteModalOpen) => set({ isDeleteModalOpen }),

  addAsset: (newAsset) =>
    set((state) => ({ assets: [newAsset, ...state.assets] })),

  updateAsset: (id, updated) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id
          ? { ...asset, ...updated, updatedAt: new Date().toISOString() }
          : asset
      ),
    })),

  deleteAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((asset) => asset.id !== id),
      selectedAssetId:
        state.selectedAssetId === id ? null : state.selectedAssetId,
    })),

  toggleMilestoneStatus: (assetId, milestoneId) =>
    set((state) => ({
      assets: state.assets.map((asset) => {
        if (asset.id !== assetId || !asset.serviceMilestones) return asset;
        return {
          ...asset,
          serviceMilestones: asset.serviceMilestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  status:
                    m.status === 'completed'
                      ? 'pending'
                      : ('completed' as const),
                }
              : m
          ),
          updatedAt: new Date().toISOString(),
        };
      }),
    })),
}));

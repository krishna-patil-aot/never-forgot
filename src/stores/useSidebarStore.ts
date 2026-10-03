'use client';

import { create } from 'zustand';
import { ConsumerTab, IConsumerLayoutState } from '@/types/layout.types';

export const useConsumerLayoutStore = create<IConsumerLayoutState>((set) => ({
  activeTab: 'vault',
  setActiveTab: (activeTab: ConsumerTab) => set({ activeTab }),
  isSearchOpen: false,
  setIsSearchOpen: (isSearchOpen: boolean) => set({ isSearchOpen }),
}));

// Backward compatibility alias
export const useSidebarStore = useConsumerLayoutStore;

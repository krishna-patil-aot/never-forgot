'use client';

import { useConsumerLayoutStore } from '@/stores/useSidebarStore';
import { ConsumerTab } from '@/types/layout.types';

/**
 * Custom hook to control consumer navigation, active tabs, and modals.
 */
export function useConsumerLayout() {
  const activeTab = useConsumerLayoutStore((state) => state.activeTab);
  const setActiveTab = useConsumerLayoutStore((state) => state.setActiveTab);
  const isSearchOpen = useConsumerLayoutStore((state) => state.isSearchOpen);
  const setIsSearchOpen = useConsumerLayoutStore((state) => state.setIsSearchOpen);

  return {
    activeTab,
    setActiveTab: (tab: ConsumerTab) => setActiveTab(tab),
    isSearchOpen,
    setIsSearchOpen,
  };
}

// Backward compatibility alias
export const useSidebar = useConsumerLayout;

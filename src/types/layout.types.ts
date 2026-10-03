import { ElementType } from 'react';
import { AssetCategory } from './asset.types';

export type ConsumerTab = 'vault' | 'categories' | 'scan' | 'alerts' | 'profile';

export interface INavigationCategory {
  id: AssetCategory | 'all';
  label: string;
  shortLabel: string;
  icon: ElementType;
  emoji: string;
  description: string;
}

export interface IConsumerLayoutState {
  activeTab: ConsumerTab;
  setActiveTab: (tab: ConsumerTab) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

import { AssetCategory, ExpiryStatus, SortOption } from './asset.types';

export interface IActiveFilterBadge {
  id: string;
  type: 'category' | 'status' | 'sort';
  label: string;
}

export interface IFilterOptionsConfig {
  categories: Array<{
    id: AssetCategory | 'all';
    label: string;
    icon: string;
    count: number;
  }>;
  statuses: Array<{
    id: ExpiryStatus | 'all';
    label: string;
    color: string;
  }>;
  sortOptions: Array<{
    id: SortOption;
    label: string;
    description: string;
  }>;
}

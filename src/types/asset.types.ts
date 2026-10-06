export type AssetCategory =
  | 'electronics'
  | 'vehicle'
  | 'health_insurance'
  | 'life_insurance'
  | 'home_amc'
  | 'personal_doc';

export type ExpiryStatus = 'active' | 'expiring_soon' | 'expired';

export interface IServiceMilestone {
  id: string;
  title: string;
  dueDate: string; // ISO 8601 string
  isFree: boolean;
  status: 'pending' | 'completed' | 'missed';
  cost?: number;
  notes?: string;
}

export interface IPolicyDetails {
  policyNumber: string;
  sumInsured?: number;
  premiumAmount: number;
  premiumDueDate: string; // ISO 8601 string
  tpaHelpline?: string;
  cashlessHospitalUrl?: string;
}

export interface IUniversalAsset {
  id: string;
  userId: string;
  title: string;
  providerOrBrand: string;
  category: AssetCategory;
  identifierNumber?: string; // Serial / IMEI / Reg No / Policy No
  startDate: string; // ISO 8601 string
  expiryOrRenewalDate: string; // ISO 8601 string
  validityMonths: number;
  documentUrl?: string;
  documentName?: string;
  status: ExpiryStatus;
  price?: number;
  serviceMilestones?: IServiceMilestone[];
  policyDetails?: IPolicyDetails;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'expiry_asc' | 'expiry_desc' | 'name_asc' | 'recently_added';

export interface IAssetFilter {
  category: AssetCategory | 'all';
  status: ExpiryStatus | 'all';
  searchQuery: string;
  sortBy: SortOption;
}

export interface IAssetFormData {
  title: string;
  providerOrBrand: string;
  category: AssetCategory;
  identifierNumber?: string;
  startDate: string;
  validityMonths: number;
  expiryOrRenewalDate: string;
  price?: number;
  notes?: string;
  policyNumber?: string;
  sumInsured?: number;
  premiumAmount?: number;
  tpaHelpline?: string;
}

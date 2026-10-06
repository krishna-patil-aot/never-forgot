import {
  AssetCategory,
  ExpiryStatus,
  SortOption,
} from './asset.types';
import { IAiExtractionResult } from './ai.types';

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginatedData<T> {
  items: T[];
  pagination: IPaginationMeta;
}

export interface IAssetFilterQuery {
  category?: AssetCategory | 'all';
  status?: ExpiryStatus | 'all';
  searchQuery?: string;
  sortBy?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface ICreateMilestoneDto {
  title: string;
  dueDate: string;
  isFree: boolean;
  status?: 'pending' | 'completed' | 'missed';
  cost?: number;
  notes?: string;
}

export interface ICreatePolicyDetailsDto {
  policyNumber: string;
  sumInsured?: number;
  premiumAmount: number;
  premiumDueDate: string;
  tpaHelpline?: string;
  cashlessHospitalUrl?: string;
}

export interface ICreateAssetDto {
  title: string;
  providerOrBrand: string;
  category: AssetCategory;
  identifierNumber?: string;
  startDate: string;
  expiryOrRenewalDate: string;
  validityMonths: number;
  documentUrl?: string;
  documentName?: string;
  price?: number;
  notes?: string;
  serviceMilestones?: ICreateMilestoneDto[];
  policyDetails?: ICreatePolicyDetailsDto;
}

export interface IUpdateAssetDto {
  title?: string;
  providerOrBrand?: string;
  category?: AssetCategory;
  identifierNumber?: string;
  startDate?: string;
  expiryOrRenewalDate?: string;
  validityMonths?: number;
  documentUrl?: string;
  documentName?: string;
  status?: ExpiryStatus;
  price?: number;
  notes?: string;
  serviceMilestones?: ICreateMilestoneDto[];
  policyDetails?: ICreatePolicyDetailsDto;
}

export interface IScanDocumentRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl?: string;
}

export interface IScanDocumentResult {
  extraction: IAiExtractionResult;
  processingEngine: 'gemini-vision-ai' | 'smart-heuristic-ocr';
  extractedAt: string;
  confidenceScore: number;
}

export interface IAnalyticsSummary {
  totalAssetsTracked: number;
  activeCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  totalProtectedValue: number;
  categoryBreakdown: Record<AssetCategory, number>;
  upcomingMilestonesCount: number;
  daysToNextExpiry: number | null;
  nextExpiringAssetTitle: string | null;
}

export interface ISystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptimeSeconds: number;
  timestamp: string;
  database: {
    connected: boolean;
    provider: string;
    totalAssets: number;
  };
  aiEngine: {
    geminiConfigured: boolean;
    mode: 'gemini' | 'heuristic-fallback';
  };
}

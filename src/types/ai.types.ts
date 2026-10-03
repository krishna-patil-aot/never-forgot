import { AssetCategory, IPolicyDetails } from './asset.types';

export type ScanStatus = 'idle' | 'uploading' | 'scanning' | 'review' | 'success' | 'error';

export interface IAiSuggestedMilestone {
  title: string;
  dueDate: string;
  isFree: boolean;
}

export interface IAiExtractionResult {
  title: string;
  providerOrBrand: string;
  category: AssetCategory;
  identifierNumber: string | null;
  startDate: string; // YYYY-MM-DD
  validityMonths: number;
  expiryOrRenewalDate: string; // YYYY-MM-DD
  price: number | null;
  suggestedMilestones: IAiSuggestedMilestone[] | null;
  policyDetails: IPolicyDetails | null;
  confidenceScore: number;
  rawSummary: string;
}

export interface IScanPayload {
  fileName: string;
  fileSize: number;
  fileType: string;
  dataUrl?: string;
}

import { AssetCategory } from './asset.types';

export interface IAdminMetrics {
  totalUsers: number;
  totalAssetsTracked: number;
  totalProtectedValue: number;
  notificationsSentToday: number;
  aiScanSuccessRate: number; // e.g. 98.6
  expiringThisMonthCount: number;
}

export interface IServiceTemplateMilestone {
  title: string;
  daysAfterStart: number;
  isFree: boolean;
}

export interface IServiceTemplate {
  id: string;
  brand: string;
  modelName: string;
  category: AssetCategory;
  defaultWarrantyMonths: number;
  suggestedMilestones: IServiceTemplateMilestone[];
}

export interface IAiAuditLog {
  id: string;
  documentName: string;
  detectedCategory: AssetCategory;
  confidence: number;
  extractedAt: string;
  status: 'accurate' | 'corrected_by_user' | 'failed';
  originalTitle: string;
  correctedTitle?: string;
}

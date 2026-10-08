import { AssetCategory } from './asset.types';

export type NotificationType =
  | 'warranty_expiry'
  | 'service_due'
  | 'policy_renewal'
  | 'emi_reminder_7d'
  | 'emi_reminder_1d';
export type NotificationPriority = 'high' | 'medium' | 'low';

export interface INotification {
  id: string;
  assetId?: string;
  emiId?: string;
  assetTitle: string;
  category: AssetCategory;
  type: NotificationType;
  title: string;
  message: string;
  dueDate: string; // ISO 8601 string
  daysRemaining: number;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: string;
}

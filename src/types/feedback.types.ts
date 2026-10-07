export type FeedbackCategory =
  | 'bug_report'
  | 'feature_request'
  | 'ui_experience'
  | 'general';

export interface IDeviceDiagnosticInfo {
  os?: string;
  browser?: string;
  screenResolution?: string;
  currentPath?: string;
  userAgent?: string;
}

export interface IFeedbackSubmissionDto {
  rating: number; // 1 to 5
  category: FeedbackCategory;
  message: string;
  userName: string;
  userEmail: string;
  selectedTags?: string[];
  deviceInfo?: IDeviceDiagnosticInfo;
}

export interface IFeedbackApiResponse {
  success: boolean;
  message: string;
  feedbackId?: string;
  deliveredMode?: string;
}

export interface IFeedbackCategoryOption {
  value: FeedbackCategory;
  label: string;
  description: string;
  iconName: string;
  badgeClass: string;
}

export interface IRatingTier {
  stars: number;
  label: string;
  emoji: string;
  colorClass: string;
}

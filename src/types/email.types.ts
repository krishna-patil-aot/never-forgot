export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface ISendEmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
  deliveredMode: 'smtp' | 'resend' | 'preview_fallback';
}

export interface IWarrantyExpiryEmailData {
  recipientName: string;
  recipientEmail: string;
  assetTitle: string;
  brandOrProvider: string;
  category: string;
  expiryDate: string;
  daysRemaining: number;
  identifierNumber?: string;
  price?: number;
  actionUrl: string;
}

export interface IWelcomeEmailData {
  userName: string;
  userEmail: string;
  appUrl?: string;
}

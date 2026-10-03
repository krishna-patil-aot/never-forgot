export type UserRole = 'user' | 'admin';

export interface IUserProfile {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  isProfileComplete: boolean;
  notificationEmailEnabled: boolean;
  notificationInAppEnabled: boolean;
}

export type AuthMode = 'email' | 'phone';
export type AuthStep = 'identifier_input' | 'otp_verification' | 'profile_completion' | 'authenticated';

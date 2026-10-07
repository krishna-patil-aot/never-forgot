export type UserRole = 'user' | 'admin';
export type AuthProvider = 'credentials' | 'google' | 'otp';
export type AuthMode = 'password' | 'otp' | 'google';
export type AuthTab = 'login' | 'register' | 'forgot_password';
export type OtpPurpose = 'login' | 'reset_password' | 'register';

export interface IUserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: UserRole;
  authProvider: AuthProvider;
  avatarUrl?: string | null;
  emailVerified: boolean;
  isProfileComplete: boolean;
  notificationEmailEnabled: boolean;
  notificationInAppEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginCredentialsDto {
  email: string;
  password?: string;
}

export interface IRegisterDto {
  email: string;
  fullName: string;
  password?: string;
  phone?: string;
}

export interface ISendOtpDto {
  email: string;
  purpose: OtpPurpose;
}

export interface IVerifyOtpDto {
  email: string;
  code: string;
  purpose: OtpPurpose;
  fullName?: string;
}

export interface IForgotPasswordDto {
  email: string;
}

export interface IResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
}

export interface IGoogleAuthDto {
  email: string;
  fullName: string;
  avatarUrl?: string;
  googleId?: string;
  credential?: string;
}

export interface IUpdateProfileDto {
  fullName?: string;
  phone?: string;
  notificationEmailEnabled?: boolean;
  notificationInAppEnabled?: boolean;
  avatarUrl?: string;
}

export interface IAuthApiResponse {
  success: boolean;
  message: string;
  user?: IUserProfile;
  alreadyRegistered?: boolean;
}


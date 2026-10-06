export interface IGoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

export interface IGoogleDecodedToken {
  iss?: string;
  sub: string;
  email: string;
  email_verified: boolean | string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface IGoogleOAuthTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
}

export interface IGoogleOAuthError {
  type: string;
  message?: string;
}

export interface IGooglePromptMomentNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
}

export interface IGoogleUserInfo {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface IGoogleAuthStore {
  isLoading: boolean;
  authError: string | null;
  setLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  resetState: () => void;
}

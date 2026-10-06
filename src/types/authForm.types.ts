
export interface IAuthFormState {
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  otpCode: string;
  showPassword: boolean;
  isOtpLoginMode: boolean;
  isOtpSent: boolean;
}

export interface IAuthFormActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setNewPassword: (newPassword: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setFullName: (fullName: string) => void;
  setPhone: (phone: string) => void;
  setOtpCode: (otpCode: string) => void;
  setShowPassword: (showPassword: boolean) => void;
  setIsOtpLoginMode: (isOtpLoginMode: boolean) => void;
  setIsOtpSent: (isOtpSent: boolean) => void;
  resetPasswordsAndOtp: () => void;
  resetAll: () => void;
}

export type IAuthFormStore = IAuthFormState & IAuthFormActions;

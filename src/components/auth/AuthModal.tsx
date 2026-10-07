'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthModalForm } from '@/hooks/useAuthModalForm';
import { AppLogo } from '@/components/ui/AppLogo';
import {
  Lock,
  Mail,
  User,
  Phone,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Bell,
  Wrench,
} from 'lucide-react';

export function AuthModal() {
  const {
    register,
    handleSubmit,
    isAuthModalOpen,
    activeTab,
    isLoading,
    isGoogleLoading,
    error,
    successMessage,
    alreadyRegistered,
    otpCooldown,
    showPassword,
    isOtpLoginMode,
    isOtpSent,
    handleTabChange,
    toggleShowPassword,
    toggleOtpLoginMode,
    handleGoogleSignIn,
    handleResendOtp,
    handleChangeEmail,
    handleCloseModal,
  } = useAuthModalForm();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
      <DialogContent className="w-[calc(100%-1rem)] sm:w-full sm:max-w-2xl md:max-w-4xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-cyan-150 shadow-2xl bg-white max-h-[90dvh] flex flex-col gap-0 my-auto">
        {/* Desktop 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Aesthetic App Highlight Panel (Visible on Tablet/Desktop) */}
          <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-cyan-50 via-teal-50/50 to-slate-50 border-r border-cyan-150/70 p-8 flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* App Brand */}
              <div className="flex items-center gap-3">
                <AppLogo size={42} className="rounded-2xl shadow-md shadow-cyan-600/20" />
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    NeverForgot
                  </h3>
                  <p className="text-xs text-cyan-800 font-semibold">
                    Simple Bill & Warranty Keeper
                  </p>
                </div>
              </div>

              {/* Purpose Explainer */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  Never lose money on expired warranties.
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Keep all your receipts, free bike service schedules, and policy renewal dates organized in one clean place.
                </p>
              </div>

              {/* 3 Friendly Benefits */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/85 border border-cyan-100 shadow-2xs">
                  <div className="h-8 w-8 rounded-xl bg-cyan-100/90 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Timely Reminders</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      We let you know 30 days before a warranty or renewal ends.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/85 border border-cyan-100 shadow-2xs">
                  <div className="h-8 w-8 rounded-xl bg-teal-100/90 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Free Vehicle Services</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Automatic 45, 180, and 365-day service dates for your bike or car.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/85 border border-cyan-100 shadow-2xs">
                  <div className="h-8 w-8 rounded-xl bg-cyan-100/90 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Safe & Private</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Your bills and details are protected and accessible anywhere.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Proof Quote */}
            <div className="pt-6 border-t border-cyan-150/70 text-[11px] text-slate-500 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              <span>Free to use • No complicated steps</span>
            </div>
          </div>

          {/* Right Column: Interactive Clean Auth Form (Scrollable Container) */}
          <div className="col-span-1 md:col-span-7 flex flex-col min-h-0 overflow-y-auto overscroll-contain">
            {/* Header Ribbon */}
            <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100/90 sticky top-0 bg-white/95 backdrop-blur-md z-10 pr-12 sm:pr-14">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex md:hidden items-center gap-1.5 mr-1">
                    <AppLogo size={20} className="rounded-md" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-cyan-200/70">
                    {activeTab === 'login' && 'Sign In'}
                    {activeTab === 'register' && 'New Account'}
                    {activeTab === 'forgot_password' && 'Password Help'}
                  </span>
                </div>
              </div>

              <DialogHeader className="text-left space-y-1">
                <DialogTitle className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {activeTab === 'login' && (isOtpLoginMode ? 'Sign In with 6-Digit Code' : 'Welcome Back')}
                  {activeTab === 'register' && 'Create Your Account'}
                  {activeTab === 'forgot_password' && 'Reset Your Password'}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-medium leading-normal line-clamp-2 sm:line-clamp-none">
                  {activeTab === 'login' && 'Sign in to see and manage your bills, warranties, and service dates.'}
                  {activeTab === 'register' && 'Create a free account in 30 seconds to start saving your bills.'}
                  {activeTab === 'forgot_password' && 'Enter your registered email to receive a password reset code.'}
                </DialogDescription>
              </DialogHeader>

              {/* Navigation Tabs Pill Bar */}
              <div className="flex gap-1 sm:gap-1.5 p-1 bg-slate-100/90 rounded-xl sm:rounded-2xl mt-3 sm:mt-4">
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white text-cyan-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-white text-cyan-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('forgot_password')}
                  className={`py-1.5 px-3 text-xs font-semibold rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                    activeTab === 'forgot_password'
                      ? 'bg-white text-cyan-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Forgot?
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 flex-1 pb-6 sm:pb-6">
              {/* Status & Error Banners */}
              {error && (
                <div
                  className={`p-3.5 rounded-2xl flex items-start gap-2.5 text-xs ${
                    alreadyRegistered
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                  <div className="space-y-2 flex-1">
                    <p className="font-semibold leading-relaxed">{error}</p>
                    {alreadyRegistered && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-[11px] bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-2.5 cursor-pointer font-bold"
                          onClick={() => handleTabChange('login')}
                        >
                          Sign In with Password
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] border-cyan-300 text-cyan-800 hover:bg-cyan-50 rounded-lg px-2.5 cursor-pointer font-bold"
                          onClick={() => {
                            handleTabChange('login');
                            toggleOtpLoginMode();
                          }}
                        >
                          Sign In with OTP
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-900 border border-cyan-200 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
                  <p className="font-medium leading-relaxed">{successMessage}</p>
                </div>
              )}

              {/* Google Fast 1-Click Sign In */}
              {activeTab !== 'forgot_password' && (
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-2xl border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2.5 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-cyan-600 border-t-transparent animate-spin" />
                        <span>Connecting to Google...</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase">
                      <span className="bg-white px-2 text-slate-400 font-semibold">Or with your email</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Core Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name & Phone in Responsive Grid (Register tab) */}
                {activeTab === 'register' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-slate-700">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          required
                          type="text"
                          placeholder="e.g. Krishna Patil"
                          {...register('fullName')}
                          className="pl-9 h-10 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-slate-700">Phone Number (Optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          {...register('phone')}
                          className="pl-9 h-10 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Address Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
                    {isOtpSent && (
                      <button
                        type="button"
                        onClick={handleChangeEmail}
                        className="text-[11px] text-cyan-700 hover:text-cyan-800 font-semibold cursor-pointer"
                      >
                        Change Email
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      required
                      type="email"
                      readOnly={isOtpSent}
                      placeholder="name@example.com"
                      {...register('email')}
                      className={`pl-9 h-10 rounded-xl text-xs ${
                        isOtpSent ? 'bg-slate-50 text-slate-600 border-slate-200' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Password for Login Mode */}
                {activeTab === 'login' && !isOtpLoginMode && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-slate-700">Password</Label>
                      <button
                        type="button"
                        onClick={() => handleTabChange('forgot_password')}
                        className="text-[11px] text-cyan-700 hover:text-cyan-800 font-semibold cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        required
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        {...register('password')}
                        className="pl-9 pr-9 h-10 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Password for Register Mode */}
                {activeTab === 'register' && (
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">Choose Password (Min 6 chars)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        required
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        {...register('password')}
                        className="pl-9 pr-9 h-10 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Flow for Login or Forgot Password */}
                {((activeTab === 'login' && isOtpLoginMode) || activeTab === 'forgot_password') && (
                  <>
                    {isOtpSent && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold text-slate-700">6-Digit Code</Label>
                          <button
                            type="button"
                            disabled={otpCooldown > 0 || isLoading}
                            onClick={handleResendOtp}
                            className="text-[11px] text-cyan-700 hover:text-cyan-800 font-semibold disabled:text-slate-400 cursor-pointer"
                          >
                            {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Resend Code'}
                          </button>
                        </div>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            required
                            type="text"
                            maxLength={6}
                            autoFocus
                            autoComplete="one-time-code"
                            placeholder="Enter 6-digit code"
                            {...register('otpCode')}
                            className="pl-9 h-11 rounded-xl text-base font-mono tracking-widest text-cyan-900 border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500 font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'forgot_password' && isOtpSent && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700">New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              required
                              type="password"
                              placeholder="Min 6 characters"
                              {...register('newPassword')}
                              className="pl-9 h-10 rounded-xl text-xs"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              required
                              type="password"
                              placeholder="Re-enter password"
                              {...register('confirmPassword')}
                              className="pl-9 h-10 rounded-xl text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Switch between Password & OTP for Login */}
                {activeTab === 'login' && (
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={toggleOtpLoginMode}
                      className="text-[11px] text-cyan-700 hover:text-cyan-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                      {isOtpLoginMode ? 'Switch to Password Sign In' : 'Sign In with 6-Digit Code instead'}
                    </button>
                  </div>
                )}

                {/* Primary Action Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 cursor-pointer mt-3"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Please wait...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>
                        {activeTab === 'login' &&
                          (!isOtpLoginMode
                            ? 'Sign In'
                            : isOtpSent
                            ? 'Verify Code & Enter'
                            : 'Send 6-Digit Code')}
                        {activeTab === 'register' && 'Create Free Account'}
                        {activeTab === 'forgot_password' &&
                          (isOtpSent ? 'Set New Password' : 'Send Reset Code')}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

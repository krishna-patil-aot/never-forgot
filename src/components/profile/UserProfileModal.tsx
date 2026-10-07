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
import { Badge } from '@/components/ui/badge';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useAssetStore } from '@/stores/useAssetStore';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Bell,
  LogOut,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Package,
  MessageSquareHeart,
  Sparkles,
} from 'lucide-react';
import { useFeedbackStore } from '@/stores/useFeedbackStore';

export function UserProfileModal() {
  const {
    user,
    isProfileModalOpen,
    isLoading,
    error,
    successMessage,
    register,
    handleSubmit,
    handleLogout,
    closeProfileModal,
  } = useProfileForm();

  const openFeedbackModal = useFeedbackStore((state) => state.openFeedbackModal);
  const totalAssets = useAssetStore((state) => state.assets.length);

  if (!user) return null;

  const initials =
    user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <Dialog open={isProfileModalOpen} onOpenChange={(open) => !open && closeProfileModal()}>
      <DialogContent className="w-[calc(100%-1.25rem)] sm:w-full sm:max-w-md max-h-[90dvh] overflow-y-auto overflow-x-hidden overscroll-contain bg-white rounded-3xl p-0 border border-slate-200/90 shadow-2xl my-auto box-border min-w-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Account Profile</DialogTitle>
          <DialogDescription>Manage your name, phone, and reminder settings</DialogDescription>
        </DialogHeader>

        {/* Profile Header Hero */}
        <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-800 p-4 sm:p-6 text-white relative min-w-0 overflow-hidden rounded-t-3xl">
          {/* Top user row with clearance from close button via pr-10 sm:pr-12 */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-10 sm:pr-12">
            {/* Avatar */}
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg sm:text-xl font-extrabold text-white shadow-md ring-2 ring-white/30 select-none shrink-0">
              {initials}
            </div>

            <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white truncate max-w-full">
                  {user.fullName}
                </h3>
                <Badge className="bg-white/20 text-white border-white/30 text-[9px] sm:text-[10px] font-bold uppercase shrink-0 px-2 py-0.5">
                  {user.role}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-cyan-100 min-w-0 overflow-hidden">
                <Mail className="h-3.5 w-3.5 shrink-0 text-cyan-200" />
                <span className="truncate text-[11px] sm:text-xs" title={user.email}>
                  {user.email}
                </span>
                {user.emailVerified && (
                  <span title="Verified Email" className="shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-white/15 min-w-0">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 sm:p-2.5 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
              <Package className="h-4 w-4 text-cyan-200 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-cyan-100 font-medium truncate">Tracked Items</p>
                <p className="text-xs font-bold text-white truncate">{totalAssets} Saved</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 sm:p-2.5 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
              <Calendar className="h-4 w-4 text-cyan-200 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-cyan-100 font-medium truncate">Joined</p>
                <p className="text-xs font-bold text-white truncate">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 min-w-0 overflow-hidden">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2 text-xs min-w-0">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <p className="font-semibold break-words [overflow-wrap:anywhere] min-w-0 flex-1">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-900 border border-cyan-200 flex items-center gap-2 text-xs min-w-0">
              <CheckCircle2 className="h-4 w-4 text-cyan-600 shrink-0" />
              <p className="font-medium break-words [overflow-wrap:anywhere] min-w-0 flex-1">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 min-w-0">
            <div className="space-y-1 min-w-0">
              <Label className="text-xs font-semibold text-slate-700">Full Name</Label>
              <div className="relative min-w-0">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 shrink-0" />
                <Input
                  required
                  type="text"
                  {...register('fullName')}
                  className="pl-9 h-10 rounded-xl text-xs sm:text-sm w-full min-w-0"
                />
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <Label className="text-xs font-semibold text-slate-700">Phone Number</Label>
              <div className="relative min-w-0">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 shrink-0" />
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register('phone')}
                  className="pl-9 h-10 rounded-xl text-xs sm:text-sm w-full min-w-0"
                />
              </div>
            </div>

            {/* Notification Preference Toggles */}
            <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 min-w-0">
                <Bell className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                <span className="truncate">Reminder Notifications</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 gap-2 min-w-0">
                <span className="text-slate-600 font-medium truncate">Email Expiry Reminders</span>
                <input
                  type="checkbox"
                  {...register('notificationEmailEnabled')}
                  className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer shrink-0"
                />
              </div>

              <div className="flex items-center justify-between text-xs gap-2 min-w-0">
                <span className="text-slate-600 font-medium truncate">In-App Notification Badges</span>
                <input
                  type="checkbox"
                  {...register('notificationInAppEnabled')}
                  className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer shrink-0"
                />
              </div>
            </div>

            {/* User Feedback & Suggestions Button */}
            <div className="pt-0.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  closeProfileModal();
                  openFeedbackModal();
                }}
                className="w-full h-12 rounded-2xl border-cyan-200/90 bg-gradient-to-r from-cyan-50/70 via-teal-50/40 to-slate-50 hover:bg-cyan-100/60 text-slate-800 font-bold text-xs flex items-center justify-between px-3.5 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <MessageSquareHeart className="h-4 w-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                      Share Feedback & Experience
                    </p>
                    <p className="text-[10px] text-cyan-800 font-medium truncate">
                      Rate app (1-5★) or report any issue
                    </p>
                  </div>
                </div>
                <Sparkles className="h-4 w-4 text-cyan-600 shrink-0 group-hover:rotate-12 transition-transform" />
              </Button>
            </div>

            {/* Responsive Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 sm:gap-2.5 pt-2 min-w-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="w-full sm:w-auto h-11 sm:h-10 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold text-xs sm:text-sm cursor-pointer px-4 flex items-center justify-center gap-1.5 min-w-0"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Sign Out</span>
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 h-11 sm:h-10 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs min-w-0 flex items-center justify-center"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

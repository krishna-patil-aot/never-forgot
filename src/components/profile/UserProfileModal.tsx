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
} from 'lucide-react';

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
      <DialogContent className="sm:max-w-md p-0 overflow-y-auto max-h-[90vh] rounded-3xl border-slate-200/80 shadow-2xl bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Account Profile</DialogTitle>
          <DialogDescription>Manage your name, phone, and reminder settings</DialogDescription>
        </DialogHeader>

        {/* Profile Header Hero */}
        <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-800 p-6 text-white relative">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-extrabold text-white shadow-md ring-2 ring-white/30 select-none">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-white">{user.fullName}</h3>
                <Badge className="bg-white/20 text-white border-white/30 text-[10px] font-bold uppercase">
                  {user.role}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-cyan-100">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email}</span>
                {user.emailVerified && (
                  <span title="Verified Email">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 flex items-center gap-2.5">
              <Package className="h-4 w-4 text-cyan-200" />
              <div>
                <p className="text-[10px] text-cyan-100 font-medium">Tracked Items</p>
                <p className="text-xs font-bold text-white">{totalAssets} Saved</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-cyan-200" />
              <div>
                <p className="text-[10px] text-cyan-100 font-medium">Joined</p>
                <p className="text-xs font-bold text-white">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2 text-xs">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-900 border border-cyan-200 flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-cyan-600 shrink-0" />
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  required
                  type="text"
                  {...register('fullName')}
                  className="pl-9 h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Phone Number</Label>
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

            {/* Notification Preference Toggles */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Bell className="h-3.5 w-3.5 text-cyan-600" />
                <span>Reminder Notifications</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600 font-medium">Email Expiry Reminders</span>
                <input
                  type="checkbox"
                  {...register('notificationEmailEnabled')}
                  className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">In-App Notification Badges</span>
                <input
                  type="checkbox"
                  {...register('notificationInAppEnabled')}
                  className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-10 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="h-10 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold text-xs cursor-pointer px-3"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Sign Out
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

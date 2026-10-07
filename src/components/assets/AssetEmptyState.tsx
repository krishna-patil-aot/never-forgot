'use client';

import * as React from 'react';
import { LogIn, Sparkles, ScanLine, Plus, Lock, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssetEmptyStateProps {
  isAuthenticated: boolean;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenScan: () => void;
  onOpenAdd: () => void;
}

export function AssetEmptyState({
  isAuthenticated,
  onOpenLogin,
  onOpenRegister,
  onOpenScan,
  onOpenAdd,
}: AssetEmptyStateProps) {
  if (!isAuthenticated) {
    return (
      <div className="relative overflow-hidden py-12 sm:py-16 px-5 sm:px-8 text-center rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/50 to-cyan-50/20 shadow-xs flex flex-col items-center justify-center space-y-4">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full bg-cyan-100/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md">
          {/* Lock Icon Emblem */}
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-cyan-600/25">
            <Lock className="h-7 w-7" />
          </div>

          {/* Simple Clean Message */}
          <div className="space-y-1.5">
            <h4 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
              First login to access
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              Sign in to view, save, and manage your bills, warranties, and renewal reminders.
            </p>
          </div>

          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 w-full sm:w-auto">
            <Button
              variant="default"
              size="default"
              className="w-full sm:w-auto text-xs font-bold h-11 px-6 rounded-xl shadow-md shadow-cyan-600/20 bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transition-all active:scale-[0.98]"
              onClick={onOpenLogin}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button
              variant="outline"
              size="default"
              className="w-full sm:w-auto text-xs font-semibold h-11 px-5 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition-all"
              onClick={onOpenRegister}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-cyan-600" />
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Empty Store State
  return (
    <div className="relative overflow-hidden py-12 sm:py-16 px-5 sm:px-8 text-center rounded-3xl border border-dashed border-slate-200/90 bg-white shadow-xs flex flex-col items-center justify-center space-y-4">
      {/* Ambient background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md">
        {/* Empty Store Illustration Badge */}
        <div className="h-16 w-16 rounded-2xl bg-cyan-50 border border-cyan-150 flex items-center justify-center text-cyan-700 shadow-2xs">
          <PackageOpen className="h-8 w-8" />
        </div>

        {/* Beautiful Empty Store Narrative */}
        <div className="space-y-1.5">
          <h4 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
            Your store is empty
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            No bills, warranties, or service dates added yet. Add your first item manually or take a quick photo of your receipt.
          </p>
        </div>

        {/* Quick Action CTA Suite */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 w-full sm:w-auto">
          <Button
            variant="default"
            size="default"
            className="w-full sm:w-auto text-xs font-bold h-11 px-6 rounded-xl shadow-md shadow-cyan-600/20 bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transition-all active:scale-[0.98]"
            onClick={onOpenScan}
          >
            <ScanLine className="h-4 w-4 mr-2" />
            Scan a Bill
          </Button>
          <Button
            variant="outline"
            size="default"
            className="w-full sm:w-auto text-xs font-semibold h-11 px-5 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition-all"
            onClick={onOpenAdd}
          >
            <Plus className="h-4 w-4 mr-1.5 text-cyan-600" />
            Add Manually
          </Button>
        </div>
      </div>
    </div>
  );
}

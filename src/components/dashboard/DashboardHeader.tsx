'use client';

import * as React from 'react';
import { ScanLine, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProtectedAction } from '@/hooks/useProtectedAction';

export function DashboardHeader() {
  const user = useAuthStore((state) => state.user);
  const { handleOpenAddModal, handleOpenScanModal } = useProtectedAction();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b border-slate-200/80">
      {/* Title & Consumer Greeting */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Vault Protected</span>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            • Auto-sync enabled
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          My Digital Passes & Warranties
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
          Hi <span className="font-semibold text-slate-800">{user?.fullName?.split(' ')[0] || 'there'}</span> 👋 Your gadgets, bike services, and insurance policies are organized and monitored.
        </p>
      </div>

      {/* Primary Consumer Actions (Desktop/Tablet only; Mobile uses the native bottom bar) */}
      <div className="hidden md:flex items-center gap-2.5 shrink-0 pt-1 md:pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-bold h-10 px-4 rounded-xl border-slate-200 shadow-2xs hover:bg-slate-50 cursor-pointer"
          onClick={handleOpenAddModal}
        >
          <Plus className="h-4 w-4 text-cyan-600" />
          <span>Add Card</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-bold h-10 px-4 rounded-xl shadow-sm shadow-cyan-600/25 bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
          onClick={handleOpenScanModal}
        >
          <ScanLine className="h-4 w-4" />
          <span>Scan Invoice / Bill</span>
          <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
        </Button>
      </div>
    </div>
  );
}

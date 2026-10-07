'use client';

import * as React from 'react';
import {
  ScanLine,
  Sparkles,
  Plus,
  ShieldCheck,
  Clock,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLogo } from '@/components/ui/AppLogo';
import { useProtectedAction } from '@/hooks/useProtectedAction';

export function HeroSection() {
  const { handleOpenAddModal, handleOpenScanModal } = useProtectedAction();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-50/90 via-teal-50/50 to-white text-slate-900 shadow-sm border border-cyan-150/80 p-5 sm:p-8 md:p-10">
      {/* Ambient background soft glow */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal-200/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-5 sm:space-y-6">
        {/* Top Feature Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="bg-white/90 text-cyan-800 border-cyan-200 px-3 py-1 text-xs font-bold gap-1.5 shadow-2xs"
          >
            <AppLogo size={16} className="rounded-xs" />
            <span>NeverForgot</span>
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-800">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            Active Reminders Ready
          </span>
        </div>

        {/* Hero Main Heading & Narrative */}
        <div className="space-y-2.5 sm:space-y-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
            Never lose track of your{' '}
            <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent underline decoration-cyan-300 decoration-wavy decoration-2">
              bills, warranties & services.
            </span>
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
            Keep your electronics warranties, bike free service schedules, and insurance renewal dates in one safe place. We remind you on time so you never lose money.
          </p>
        </div>

        {/* Mobile View: Quick Action Guide Prompt (sm:hidden) */}
        <div className="sm:hidden flex items-center gap-3 p-3.5 rounded-2xl bg-white/85 border border-cyan-200/80 shadow-2xs backdrop-blur-xs">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="h-4.5 w-4.5 text-cyan-100" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-800">Quick Actions Ready</p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Use the scan or add button at the bottom navigation anytime.
            </p>
          </div>
        </div>

        {/* Desktop / Tablet Action Buttons Suite (hidden sm:flex) */}
        <div className="hidden sm:flex flex-row items-center gap-3 pt-1">
          <Button
            size="lg"
            onClick={handleOpenScanModal}
            className="h-11 sm:h-12 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-md shadow-cyan-600/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 text-sm"
          >
            <ScanLine className="h-4.5 w-4.5 text-white" />
            <span>Scan Bill or Invoice</span>
            <Sparkles className="h-4 w-4 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleOpenAddModal}
            className="h-11 sm:h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 font-semibold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-sm shadow-2xs"
          >
            <Plus className="h-4.5 w-4.5 text-cyan-600" />
            <span>Add Item Manually</span>
          </Button>
        </div>

        {/* Key Feature Benefits Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-cyan-150/90">
          <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
            <div className="h-7 w-7 rounded-lg bg-cyan-100/80 text-cyan-800 flex items-center justify-center shrink-0">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span>Early Expiry Reminders</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
            <div className="h-7 w-7 rounded-lg bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
              <Wrench className="h-3.5 w-3.5" />
            </div>
            <span>Free Vehicle Service Tracking</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
            <div className="h-7 w-7 rounded-lg bg-cyan-100/80 text-cyan-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <span>Safe Cloud Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
}

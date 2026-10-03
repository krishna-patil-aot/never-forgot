'use client';

import * as React from 'react';
import {
  ScanLine,
  Sparkles,
  Plus,
  ShieldCheck,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLogo } from '@/components/ui/AppLogo';
import { useAssetStore } from '@/stores/useAssetStore';
import { useAiScanStore } from '@/stores/useAiScanStore';

export function HeroSection() {
  const setIsAddModalOpen = useAssetStore((state) => state.setIsAddModalOpen);
  const setIsScanModalOpen = useAiScanStore((state) => state.setIsScanModalOpen);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white shadow-xl shadow-blue-900/20 border border-blue-500/20 p-5 sm:p-8 md:p-10">
      {/* Ambient background glow & radial highlights */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6 sm:space-y-7">
        {/* Top Feature Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="cyan"
            className="bg-white/15 text-white border-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold gap-1.5 shadow-sm"
          >
            <AppLogo size={16} className="rounded-sm" />
            <span>NeverForgot AI Sentinel</span>
          </Badge>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Expiry Monitoring
          </span>
        </div>

        {/* Hero Main Heading & Narrative */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15]">
            I Can Never Forget Your{' '}
            <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-white bg-clip-text text-transparent underline decoration-sky-400/40 decoration-wavy decoration-2">
              Bill & Warranty Dates
            </span>
          </h1>
          <p className="text-xs sm:text-base text-blue-100/90 max-w-2xl leading-relaxed font-normal">
            Your personal automated vault for gadgets, vehicle services, home AMC contracts, and policy renewals.
            Never lose money to surprise lapsed coverage or expired warranty claim windows again.
          </p>
        </div>

        {/* Action Buttons Suite */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <Button
            size="lg"
            onClick={() => setIsScanModalOpen(true)}
            className="h-11 sm:h-12 px-6 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-bold shadow-lg shadow-black/15 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 text-sm"
          >
            <ScanLine className="h-4.5 w-4.5 text-blue-600" />
            <span>Scan Bill or Invoice with AI</span>
            <Sparkles className="h-4 w-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsAddModalOpen(true)}
            className="h-11 sm:h-12 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-md font-semibold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="h-4.5 w-4.5 text-sky-300" />
            <span>Add Bill or Card Manually</span>
          </Button>
        </div>

        {/* Key Feature Benefits Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/15">
          <div className="flex items-center gap-2.5 text-xs text-blue-100 font-medium">
            <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
            </div>
            <span>Auto-Calculated Expiry Dates</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-blue-100 font-medium">
            <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Clock className="h-3.5 w-3.5 text-sky-300" />
            </div>
            <span>Early 30-Day Renewal Alerts</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-blue-100 font-medium">
            <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <span>100% Private Device Vault</span>
          </div>
        </div>
      </div>
    </div>
  );
}

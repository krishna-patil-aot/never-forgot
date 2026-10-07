'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  LayoutGrid,
  SearchX,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLogo } from '@/components/ui/AppLogo';

export default function NotFound() {
  return (
    <div className="relative min-h-[78vh] w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden select-none">
      {/* Ambient glowing background aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-200/35 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-teal-200/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center space-y-6 sm:space-y-8">
        {/* Top Feature Pill */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-white/90 text-cyan-800 border-cyan-200/90 px-3 py-1 text-xs font-bold gap-1.5 shadow-2xs"
          >
            <AppLogo size={16} className="rounded-xs" />
            <span>NeverForgot Vault</span>
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/80">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
            Error 404 • Page Not Found
          </span>
        </div>

        {/* 404 Floating Hero Graphic */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Subtle pulsating outer halo */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-6 rounded-full bg-gradient-to-r from-cyan-200/30 via-teal-200/20 to-cyan-200/30 blur-2xl pointer-events-none"
          />

          {/* 404 Digits Graphic with Overlay Icon */}
          <div className="relative py-2">
            <h1 className="text-7xl sm:text-9xl font-black tracking-tighter bg-gradient-to-br from-slate-900 via-cyan-900 to-teal-800 bg-clip-text text-transparent select-none">
              404
            </h1>

            {/* Floating Search Icon Badge */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 -right-2 sm:-right-4 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white border border-cyan-200/90 shadow-lg shadow-cyan-600/15 flex items-center justify-center text-cyan-700"
            >
              <SearchX className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-600" />
            </motion.div>
          </div>
        </div>

        {/* Narrative & Explanation */}
        <div className="space-y-2.5 max-w-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            This document isn&apos;t in your vault.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            The link you clicked might be outdated, the bill or warranty record may have been relocated, or the URL address was typed incorrectly.
          </p>
        </div>

        {/* 2-Card Suggestion Grid for Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
          <Link
            href="/"
            className="group flex items-start gap-3.5 p-4 rounded-2xl bg-white/90 border border-slate-200/90 hover:border-cyan-300 shadow-2xs hover:shadow-md hover:shadow-cyan-600/10 transition-all cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-50 border border-cyan-150 flex items-center justify-center text-cyan-700 shrink-0 group-hover:scale-105 transition-transform">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-cyan-800 transition-colors">
                Main Vault Dashboard
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                See all your saved bills, active warranties &amp; renewal timelines.
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="group flex items-start gap-3.5 p-4 rounded-2xl bg-white/90 border border-slate-200/90 hover:border-teal-300 shadow-2xs hover:shadow-md hover:shadow-teal-600/10 transition-all cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-150 flex items-center justify-center text-teal-700 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-800 transition-colors">
                Scan &amp; Track Bills
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Easily scan receipts or add warranty items with auto-reminders.
              </p>
            </div>
          </Link>
        </div>

        {/* Primary Action Button Suite */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-11 sm:h-12 px-7 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-600/20 active:scale-[0.98] transition-all cursor-pointer gap-2"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs gap-1.5"
          >
            <Link href="/#about-neverforgot">
              <HelpCircle className="h-4 w-4 text-cyan-600" />
              <span>How NeverForgot Works</span>
            </Link>
          </Button>
        </div>

        {/* Vault Assurance Footer */}
        <div className="pt-3 border-t border-slate-200/80 w-full flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            Vault Safe &amp; Encrypted
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <Clock className="h-3.5 w-3.5 text-cyan-600" />
            Timely Expiry Alerts
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            AI Invoice Scanner
          </span>
        </div>
      </div>
    </div>
  );
}

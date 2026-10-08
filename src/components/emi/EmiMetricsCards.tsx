'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useEmiMetrics } from '@/hooks/useEmiMetrics';

export function EmiMetricsCards() {
  const metrics = useEmiMetrics();

  const stats = [
    {
      id: 'outflow',
      label: 'Monthly EMI Outflow',
      value: `₹${metrics.totalMonthlyOutflow.toLocaleString('en-IN')}`,
      badge: 'Monthly',
      badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      icon: IndianRupee,
      iconColor: 'text-cyan-700',
      iconBg: 'bg-cyan-50 border border-cyan-150',
    },
    {
      id: 'active',
      label: 'Active Loans',
      value: `${metrics.activeCount}`,
      badge: 'Protected',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: CreditCard,
      iconColor: 'text-blue-700',
      iconBg: 'bg-blue-50 border border-blue-150',
    },
    {
      id: 'upcoming',
      label: 'Due in 7 Days',
      value: `${metrics.upcomingDueCount + metrics.urgentDueCount}`,
      badge:
        metrics.urgentDueCount > 0
          ? 'Urgent Notice'
          : metrics.upcomingDueCount > 0
          ? 'Due Soon'
          : 'All Clear',
      badgeColor:
        metrics.urgentDueCount > 0
          ? 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
          : metrics.upcomingDueCount > 0
          ? 'bg-amber-50 text-amber-800 border-amber-300'
          : 'bg-slate-100 text-slate-600 border-slate-200',
      icon: metrics.urgentDueCount > 0 ? AlertTriangle : Clock,
      iconColor: metrics.urgentDueCount > 0 ? 'text-rose-600' : 'text-amber-600',
      iconBg: metrics.urgentDueCount > 0 ? 'bg-rose-50 border border-rose-100' : 'bg-amber-50 border border-amber-100',
    },
    {
      id: 'paid',
      label: 'Paid this Month',
      value: `${metrics.paidThisMonthCount}`,
      badge: 'Settled',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-50 border border-emerald-150',
    },
  ];

  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile: Horizontal scrollable snapshot */}
      <div className="flex md:hidden items-center gap-3 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-3.5 px-3.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] shrink-0 min-w-[160px] max-w-[190px] space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${stat.badgeColor}`}
                >
                  {stat.badge}
                </span>
              </div>
              <div
                suppressHydrationWarning
                className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate min-w-0"
              >
                {stat.value}
              </div>
              <p className="text-[11px] font-semibold text-slate-500 truncate">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet: 4-Column Grid */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-cyan-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 min-w-0"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                  {stat.label}
                </span>
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2 pt-1 min-w-0">
                <div
                  suppressHydrationWarning
                  className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold tracking-tight text-slate-900 truncate min-w-0"
                >
                  {stat.value}
                </div>
                <span
                  suppressHydrationWarning
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${stat.badgeColor}`}
                >
                  {stat.badge}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

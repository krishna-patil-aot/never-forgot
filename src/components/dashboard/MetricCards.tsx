'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Wrench,
  IndianRupee,
} from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { formatCurrencyINR } from '@/lib/dateUtils';

export function MetricCards() {
  const metrics = useDashboardMetrics();
  const formattedValue = formatCurrencyINR(metrics.totalProtectedValue);

  const stats = [
    {
      id: 'active',
      label: 'Active Passes',
      value: `${metrics.activeCount}`,
      badge: 'Protected',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border border-emerald-100',
    },
    {
      id: 'expiring',
      label: 'Expiring Soon',
      value: `${metrics.expiringSoonCount}`,
      badge: metrics.expiringSoonCount > 0 ? 'Action Needed' : 'All Safe',
      badgeColor:
        metrics.expiringSoonCount > 0
          ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
          : 'bg-slate-100 text-slate-600 border-slate-200',
      icon: ShieldAlert,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border border-amber-100',
    },
    {
      id: 'services',
      label: 'Free Services Due',
      value: `${metrics.upcomingServicesCount}`,
      badge: 'Schedule',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Wrench,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50 border border-sky-100',
    },
    {
      id: 'value',
      label: 'Total Value Covered',
      value: formattedValue,
      badge: 'Full Cover',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      icon: IndianRupee,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50 border border-violet-100',
    },
  ];

  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile: Tactile, swipeable consumer snapshot strip */}
      <div className="flex md:hidden items-center gap-3 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-3.5 px-3.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] shrink-0 min-w-[160px] max-w-[185px] space-y-1.5"
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
                title={stat.value}
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

      {/* Desktop / Tablet: Responsive 2-col on tablets (768-1200px) and 4-col on wide screens (1200px+) */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 min-w-0"
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
                  title={stat.value}
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

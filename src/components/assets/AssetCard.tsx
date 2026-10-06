'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Clock,
  PhoneCall,
  Trash2,
  FileSpreadsheet,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { IUniversalAsset } from '@/types/asset.types';
import { formatDisplayDate } from '@/lib/dateUtils';
import { useAssetCard } from '@/hooks/useAssetCard';

interface AssetCardProps {
  asset: IUniversalAsset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const {
    percentageElapsed,
    diffDays,
    catDetails,
    handleOpenDetails,
    handleDelete,
  } = useAssetCard(asset);

  const CategoryIcon = catDetails.icon;

  const renderStatusBadge = () => {
    if (diffDays < 0) {
      return (
        <span
          suppressHydrationWarning
          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs shrink-0 whitespace-nowrap"
        >
          <Clock className="h-3 w-3" />
          Expired ({Math.abs(diffDays)}d ago)
        </span>
      );
    }
    if (diffDays <= 30) {
      return (
        <span
          suppressHydrationWarning
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs shrink-0 whitespace-nowrap animate-pulse"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Expiring in {diffDays} {diffDays === 1 ? 'day' : 'days'}
        </span>
      );
    }
    return (
      <span
        suppressHydrationWarning
        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-2xs shrink-0 whitespace-nowrap"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
        Active ({diffDays}d left)
      </span>
    );
  };

  const getIndicatorColor = () => {
    if (diffDays < 0) return 'bg-rose-500';
    if (diffDays <= 30) return 'bg-amber-500';
    return 'bg-cyan-500';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="h-full flex"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenDetails}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenDetails();
          }
        }}
        className="group relative flex flex-col justify-between w-full h-full rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:border-cyan-300/80 transition-all duration-200 overflow-hidden cursor-pointer active:scale-[0.99] text-left select-none"
      >
        {/* Top Digital Card Color Accent Strip */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${catDetails.gradientBar}`} />

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
          {/* Card Top: Brand, Pass Type & Status Badge */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border ${catDetails.accentBg}`}
                >
                  <CategoryIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 truncate">
                      {asset.providerOrBrand}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      • {catDetails.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md truncate max-w-[220px] sm:max-w-none">
                      {asset.identifierNumber || 'Personal Pass'}
                    </span>
                  </div>
                </div>
              </div>

              {renderStatusBadge()}
            </div>

            {/* Product Title */}
            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug line-clamp-2">
              {asset.title}
            </h3>
          </div>

          {/* Card Body: Highlights (Valid Thru, Progress, Milestones/Policy) */}
          <div className="space-y-3 pt-1">
            {/* Validity Timeline Pass Strip */}
            <div className="bg-slate-50 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 space-y-2">
              <div
                suppressHydrationWarning
                className="flex items-center justify-between text-xs text-slate-600"
              >
                <span className="flex items-center gap-1 font-medium text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Valid Thru</span>
                </span>
                <span className="font-extrabold text-slate-900">
                  {formatDisplayDate(asset.expiryOrRenewalDate)}
                </span>
              </div>

              <Progress
                suppressHydrationWarning
                value={percentageElapsed}
                indicatorClassName={getIndicatorColor()}
                className="h-2 bg-slate-200 rounded-full"
              />

              <div
                suppressHydrationWarning
                className="flex items-center justify-between text-[11px] text-slate-500 font-medium"
              >
                <span>{percentageElapsed}% duration passed</span>
                <span>{asset.validityMonths} mos cover</span>
              </div>
            </div>

            {/* Vehicle Milestone Card Highlight */}
            {asset.category === 'vehicle' &&
              asset.serviceMilestones &&
              asset.serviceMilestones.length > 0 && (
                <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/80 flex items-center justify-between gap-2">
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      Next Service Schedule
                    </span>
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {asset.serviceMilestones.find((m) => m.status === 'pending')
                        ?.title || 'All scheduled services completed'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                    Free
                  </span>
                </div>
              )}

            {/* Insurance Policy Sum Insured Card Highlight */}
            {asset.policyDetails && (
              <div className="bg-purple-50/70 rounded-2xl p-3 border border-purple-200/80 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                    Sum Insured Protection
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 block truncate">
                    ₹{(asset.policyDetails.sumInsured || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {asset.policyDetails.tpaHelpline && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${asset.policyDetails?.tpaHelpline}`;
                    }}
                    className="h-auto flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 bg-white border-purple-200 px-2.5 py-1.5 rounded-xl font-bold shadow-2xs hover:bg-purple-50 transition-colors shrink-0 cursor-pointer whitespace-nowrap"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Call TPA</span>
                  </Button>
                )}
              </div>
            )}

            {/* Document Receipt Attachment Pill */}
            {asset.documentName && (
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100/70 px-3 py-1.5 rounded-xl border border-slate-200/60 min-w-0">
                <FileSpreadsheet className="h-3.5 w-3.5 text-cyan-700 shrink-0" />
                <span className="truncate flex-1 font-medium min-w-0">{asset.documentName}</span>
                <span className="text-[10px] text-cyan-700 font-bold shrink-0 whitespace-nowrap">
                  Receipt Attached
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Quick Pass Actions */}
        <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-700 group-hover:text-cyan-800 whitespace-nowrap">
            <span>View Details</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete item"
            aria-label="Delete item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

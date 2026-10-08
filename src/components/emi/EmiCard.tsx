'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  IndianRupee,
  CheckCircle2,
  Circle,
  Trash2,
  ArrowUpRight,
  FileText,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IEmiReminder } from '@/types/emi.types';
import { useEmiCard } from '@/hooks/useEmiCard';
import { DocumentViewerModal } from '@/components/ui/DocumentViewerModal';
import { formatDisplayDate } from '@/lib/dateUtils';

interface EmiCardProps {
  emi: IEmiReminder;
}

export function EmiCard({ emi }: EmiCardProps) {
  const {
    visualMeta,
    dueLabel,
    isDocViewerOpen,
    setIsDocViewerOpen,
    handleOpenDetails,
    handleTogglePaid,
    handleDelete,
    handleOpenDoc,
  } = useEmiCard(emi);

  const IconComponent = visualMeta.icon;

  const renderStatusBadge = () => {
    if (emi.isPaidThisMonth) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs shrink-0 whitespace-nowrap">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          Paid for this Month
        </span>
      );
    }

    if (emi.isUrgent) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs shrink-0 whitespace-nowrap animate-pulse">
          <AlertTriangle className="h-3 w-3 text-rose-600" />
          {dueLabel}
        </span>
      );
    }

    if (emi.isDueSoon) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs shrink-0 whitespace-nowrap">
          <Clock className="h-3 w-3 text-amber-600" />
          {dueLabel}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-2xs shrink-0 whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
        {dueLabel}
      </span>
    );
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
        {/* Accent Color Strip */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${visualMeta.gradientBar}`} />

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
          {/* Header Row: Lender, Loan Type & Status Badge */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border ${visualMeta.accentBg}`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 truncate">
                      {emi.lenderName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      • {visualMeta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md truncate max-w-[200px] sm:max-w-none">
                      {emi.accountNumber ? `A/c: ${emi.accountNumber}` : 'Standard Loan'}
                    </span>
                  </div>
                </div>
              </div>

              {renderStatusBadge()}
            </div>

            {/* Loan Title */}
            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug line-clamp-2">
              {emi.title}
            </h3>
          </div>

          {/* Amount & Due Date Hero Box */}
          <div className="space-y-3 pt-1">
            <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200/70 space-y-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Monthly Installment
                  </span>
                  <div className="flex items-baseline gap-1 text-xl sm:text-2xl font-extrabold text-slate-900">
                    <IndianRupee className="h-4 w-4 text-cyan-700" />
                    <span>{emi.emiAmount.toLocaleString('en-IN')}</span>
                    <span className="text-xs font-semibold text-slate-500">/ mo</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Due Every
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                    {emi.dueDay}th of month
                  </span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Next Due:</span>
                  <strong className="text-slate-800">
                    {formatDisplayDate(emi.nextDueDate)}
                  </strong>
                </span>
                {emi.autoDebit && (
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Auto-Debit On
                  </span>
                )}
              </div>
            </div>

            {/* Financial Summary Strip */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {emi.totalLoanAmount && (
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 block">Total Principal</span>
                  <span className="font-bold text-slate-900">
                    ₹{emi.totalLoanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {emi.interestRate && (
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 block">Interest Rate</span>
                  <span className="font-bold text-slate-900">{emi.interestRate}% p.a.</span>
                </div>
              )}
            </div>

            {/* Document Receipt Attachment Pill */}
            {(emi.documentName || emi.documentUrl) && (
              <div className="flex items-center justify-between gap-2 text-xs text-slate-700 bg-slate-100/80 px-3 py-2 rounded-xl border border-slate-200/70 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="h-3.5 w-3.5 text-cyan-700 shrink-0" />
                  <span className="truncate font-semibold text-slate-800 text-[11px]">
                    {emi.documentName || 'Sanction Letter Attached'}
                  </span>
                </div>
                {emi.documentUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenDoc}
                    className="h-6 px-2 text-[10px] font-bold rounded-lg bg-white border border-slate-200 text-cyan-800 hover:bg-cyan-50 shrink-0 cursor-pointer shadow-2xs"
                  >
                    View Doc
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Quick Actions */}
        <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Quick Mark Paid Action Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTogglePaid}
            className={`h-8 px-2.5 text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 ${
              emi.isPaidThisMonth
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
            }`}
          >
            {emi.isPaidThisMonth ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Paid for this Month</span>
              </>
            ) : (
              <>
                <Circle className="h-3.5 w-3.5 text-slate-400" />
                <span>Mark Paid</span>
              </>
            )}
          </Button>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-xs font-bold text-cyan-700 group-hover:text-cyan-800 whitespace-nowrap pl-1">
              <span>Details</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete EMI"
              aria-label="Delete EMI"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Embedded Loan Document Viewer Modal */}
      {emi.documentUrl && (
        <DocumentViewerModal
          open={isDocViewerOpen}
          onOpenChange={setIsDocViewerOpen}
          documentUrl={emi.documentUrl}
          documentName={emi.documentName || 'Loan Document'}
          title={emi.title}
          subtitle={`${emi.lenderName} • Loan Agreement / Sanction Letter`}
        />
      )}
    </motion.div>
  );
}

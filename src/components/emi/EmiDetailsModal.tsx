'use client';

import * as React from 'react';
import {
  IndianRupee,
  CheckCircle2,
  Circle,
  Trash2,
  FileText,
  Clock,
  Eye,
  ImageIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEmiStore } from '@/stores/useEmiStore';
import { useEmiApi } from '@/hooks/useEmiApi';
import { getLoanVisualMeta } from '@/hooks/useEmiCard';
import { DocumentViewerModal } from '@/components/ui/DocumentViewerModal';
import { formatDisplayDate } from '@/lib/dateUtils';

export function EmiDetailsModal() {
  const selectedEmiId = useEmiStore((state) => state.selectedEmiId);
  const isEmiDetailsModalOpen = useEmiStore((state) => state.isEmiDetailsModalOpen);
  const setIsEmiDetailsModalOpen = useEmiStore(
    (state) => state.setIsEmiDetailsModalOpen
  );
  const emis = useEmiStore((state) => state.emis);
  const { togglePaidEmi, deleteEmi } = useEmiApi();
  const [isDocViewerOpen, setIsDocViewerOpen] = React.useState<boolean>(false);

  const emi = emis.find((e) => e.id === selectedEmiId);

  const isImageDoc = React.useMemo(() => {
    const url = (emi?.documentUrl || '').toLowerCase();
    const name = (emi?.documentName || '').toLowerCase();
    return (
      url.startsWith('data:image') ||
      url.includes('/image/upload/') ||
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.png') ||
      url.endsWith('.webp') ||
      name.endsWith('.jpg') ||
      name.endsWith('.jpeg') ||
      name.endsWith('.png') ||
      name.endsWith('.webp')
    );
  }, [emi?.documentUrl, emi?.documentName]);

  if (!emi) return null;

  const visualMeta = getLoanVisualMeta(emi.loanType);
  const IconComponent = visualMeta.icon;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${emi.title}"?`)) {
      setIsEmiDetailsModalOpen(false);
      void deleteEmi(emi.id);
    }
  };

  return (
    <Dialog open={isEmiDetailsModalOpen} onOpenChange={setIsEmiDetailsModalOpen}>
      <DialogContent className="w-[calc(100%-1.25rem)] sm:w-full sm:max-w-xl max-h-[90dvh] overflow-y-auto overflow-x-hidden overscroll-contain bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-2xl my-auto box-border min-w-0">
        <DialogHeader className="pr-10 sm:pr-12 text-left space-y-2 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 min-w-0">
            <span className="text-[10px] sm:text-[11px] uppercase font-extrabold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200/80 w-fit max-w-[220px] truncate">
              {emi.lenderName} • {visualMeta.label}
            </span>

            <div className="w-fit shrink-0">
              {emi.isPaidThisMonth ? (
                <Badge variant="success" className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5">
                  Paid for this Month
                </Badge>
              ) : emi.isUrgent ? (
                <Badge variant="destructive" className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 animate-pulse">
                  Due {emi.daysUntilDue === 0 ? 'Today' : 'Tomorrow'}
                </Badge>
              ) : emi.isDueSoon ? (
                <Badge variant="warning" className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5">
                  Due in {emi.daysUntilDue} days
                </Badge>
              ) : (
                <Badge variant="cyan" className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5">
                  Due in {emi.daysUntilDue} days
                </Badge>
              )}
            </div>
          </div>

          <DialogTitle className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug break-words min-w-0">
            {emi.title}
          </DialogTitle>

          <DialogDescription className="text-xs text-slate-500 font-medium leading-normal flex items-center gap-1.5 min-w-0">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
            <span className="truncate">
              {emi.accountNumber ? `Loan A/c: ${emi.accountNumber}` : 'Active Loan Facility'}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body */}
        <div className="space-y-3.5 sm:space-y-4 py-2 text-sm min-w-0">
          {/* Main Installment Box */}
          <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-cyan-800 font-bold uppercase tracking-wider block">
                  Monthly Installment
                </span>
                <div className="flex items-baseline gap-1 text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                  <IndianRupee className="h-5 w-5 text-cyan-700" />
                  <span>{emi.emiAmount.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-semibold text-slate-500">/ month</span>
                </div>
              </div>

              {/* Monthly payment toggle button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void togglePaidEmi(emi.id)}
                className={`h-9 px-3 text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-2xs ${
                  emi.isPaidThisMonth
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-emerald-400 hover:text-emerald-700'
                }`}
              >
                {emi.isPaidThisMonth ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    <span>Paid this Month</span>
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>Mark as Paid</span>
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-200/70 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-medium">Due Every:</span>
                <p className="font-extrabold text-slate-900">{emi.dueDay}th of month</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium">Next Due Date:</span>
                <p className="font-extrabold text-slate-900">{formatDisplayDate(emi.nextDueDate)}</p>
              </div>
            </div>
          </div>

          {/* Loan Financial Parameters Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3">
            <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <IconComponent className="h-3.5 w-3.5 text-cyan-700" />
              Loan Facility Details
            </h5>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {emi.totalLoanAmount && (
                <div>
                  <span className="text-[10px] text-slate-500">Total Principal:</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">
                    ₹{emi.totalLoanAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              {emi.interestRate && (
                <div>
                  <span className="text-[10px] text-slate-500">Interest Rate:</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">
                    {emi.interestRate}% p.a.
                  </p>
                </div>
              )}

              {emi.tenureMonths && (
                <div>
                  <span className="text-[10px] text-slate-500">Tenure:</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">
                    {emi.tenureMonths} Months
                  </p>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-500">Start Date:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {formatDisplayDate(emi.startDate)}
                </p>
              </div>

              {emi.endDate && (
                <div>
                  <span className="text-[10px] text-slate-500">Expected End Date:</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {formatDisplayDate(emi.endDate)}
                  </p>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-500">Auto-Debit:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {emi.autoDebit ? '✅ Enabled' : 'Manual'}
                </p>
              </div>
            </div>

            {emi.debitAccount && (
              <div className="pt-2 border-t border-slate-200/70 text-xs">
                <span className="text-[10px] text-slate-500">Debit Account / NACH:</span>
                <p className="font-medium text-slate-800 mt-0.5">{emi.debitAccount}</p>
              </div>
            )}
          </div>

          {/* Reminder Schedule Info Card */}
          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-950">
            <Clock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-blue-900">Automated Alert Schedule Active</p>
              <p className="text-[11px] text-blue-800/90 leading-relaxed">
                You will automatically receive an in-app reminder and email notification <strong>7 days before</strong> and an urgent final notice <strong>1 day before</strong> your monthly due date.
              </p>
            </div>
          </div>

          {/* Attached Document Card */}
          {(emi.documentName || emi.documentUrl) && (
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3 min-w-0 overflow-hidden">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                  {isImageDoc && emi.documentUrl ? (
                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-cyan-200 bg-white shrink-0 flex items-center justify-center shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={emi.documentUrl}
                        alt="Document thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-cyan-50 border border-cyan-150 flex items-center justify-center text-cyan-700 shrink-0">
                      {isImageDoc ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                  )}

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate" title={emi.documentName}>
                      {emi.documentName || 'Loan Agreement / Sanction Letter'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {isImageDoc ? 'Image Document Attached' : 'Official PDF Document Attached'}
                    </p>
                  </div>
                </div>

                {emi.documentUrl && (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => setIsDocViewerOpen(true)}
                    className="h-8 px-3 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{isImageDoc ? 'View Image' : 'View PDF'}</span>
                  </Button>
                )}
              </div>

              {/* Inline interactive thumbnail preview for images */}
              {isImageDoc && emi.documentUrl && (
                <div
                  onClick={() => setIsDocViewerOpen(true)}
                  className="group relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={emi.documentUrl}
                    alt={emi.documentName || 'Loan Document'}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-2xs">
                    <Eye className="h-4 w-4" />
                    <span>Click to open full view</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {emi.notes && (
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Notes & Terms
              </span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 leading-relaxed break-words min-w-0">
                {emi.notes}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 pt-3 border-t border-slate-100 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="w-full sm:w-auto h-11 sm:h-10 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer flex items-center justify-center gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Loan</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => setIsEmiDetailsModalOpen(false)}
            className="w-full sm:w-auto h-11 sm:h-10 text-xs sm:text-sm font-semibold rounded-xl border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Embedded Document Viewer Modal */}
      {emi.documentUrl && (
        <DocumentViewerModal
          open={isDocViewerOpen}
          onOpenChange={setIsDocViewerOpen}
          documentUrl={emi.documentUrl}
          documentName={emi.documentName || 'Loan Document'}
          title={emi.title}
          subtitle={`${emi.lenderName} • Attached Loan Document`}
        />
      )}
    </Dialog>
  );
}

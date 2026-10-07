'use client';

import * as React from 'react';
import {
  CheckCircle,
  Circle,
  FileSpreadsheet,
  Trash2,
  Wrench,
  ExternalLink,
  Calendar,
  ShieldCheck,
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
import { useAssetStore } from '@/stores/useAssetStore';
import { formatDisplayDate } from '@/lib/dateUtils';
import { useAssetApi } from '@/hooks/useAssetApi';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';

export function AssetDetailsModal() {
  const selectedAssetId = useAssetStore((state) => state.selectedAssetId);
  const isDetailsModalOpen = useAssetStore((state) => state.isDetailsModalOpen);
  const setIsDetailsModalOpen = useAssetStore(
    (state) => state.setIsDetailsModalOpen
  );
  const assets = useAssetStore((state) => state.assets);
  const { toggleMilestone } = useAssetApi();
  const { openDeleteModal } = useDeleteConfirm();

  const asset = assets.find((a) => a.id === selectedAssetId);

  if (!asset) return null;

  const now = new Date().getTime();
  const expiryTime = new Date(asset.expiryOrRenewalDate).getTime();
  const diffDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
      <DialogContent className="w-[calc(100%-1.25rem)] sm:w-full sm:max-w-xl max-h-[90dvh] overflow-y-auto overflow-x-hidden overscroll-contain bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-2xl my-auto box-border min-w-0">
        {/* Header Ribbon: Safe clearance from top-right close X button */}
        <DialogHeader className="pr-10 sm:pr-12 text-left space-y-2 min-w-0 overflow-hidden">
          {/* Brand Pill & Expiry Status: Stacks cleanly on mobile without horizontal push */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 min-w-0">
            <span className="text-[10px] sm:text-[11px] uppercase font-extrabold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200/80 w-fit max-w-[220px] truncate">
              {asset.providerOrBrand}
            </span>
            <div className="w-fit shrink-0">
              {diffDays < 0 ? (
                <Badge
                  suppressHydrationWarning
                  variant="destructive"
                  className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5"
                >
                  Expired
                </Badge>
              ) : diffDays <= 30 ? (
                <Badge
                  suppressHydrationWarning
                  variant="warning"
                  className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5"
                >
                  Expiring in {diffDays} days
                </Badge>
              ) : (
                <Badge
                  suppressHydrationWarning
                  variant="success"
                  className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5"
                >
                  Active ({diffDays} days left)
                </Badge>
              )}
            </div>
          </div>

          <DialogTitle className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug break-words [overflow-wrap:anywhere] min-w-0">
            {asset.title}
          </DialogTitle>

          <DialogDescription className="text-xs text-slate-500 font-medium leading-normal flex items-center gap-1.5 min-w-0">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
            <span className="truncate">{asset.identifierNumber || 'Registered Vault Item'}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body: Responsive, strictly bounded, no horizontal overflow */}
        <div className="space-y-3.5 sm:space-y-4 py-2 text-sm min-w-0 overflow-hidden">
          {/* Timeline Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80">
            <div className="flex items-start gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                <Calendar className="h-4 w-4 text-cyan-700" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                  Start / Purchase Date
                </p>
                <p suppressHydrationWarning className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5">
                  {formatDisplayDate(asset.startDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200/80 sm:pl-3">
              <div className="h-8 w-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                <ShieldCheck className="h-4 w-4 text-teal-700" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                  Expiry / Renewal Date
                </p>
                <p suppressHydrationWarning className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5">
                  {formatDisplayDate(asset.expiryOrRenewalDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Insurance Policy Details Card */}
          {asset.policyDetails && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3">
              <h5 className="font-bold text-[11px] uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-700" />
                Policy Coverage Details
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500">Policy Number:</span>
                  <p className="font-mono text-xs font-bold text-slate-800 truncate">
                    {asset.policyDetails.policyNumber}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Sum Insured:</span>
                  <p className="text-xs font-extrabold text-slate-800">
                    ₹{(asset.policyDetails.sumInsured || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Annual Premium:</span>
                  <p className="text-xs font-semibold text-slate-800">
                    ₹{(asset.policyDetails.premiumAmount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                {asset.policyDetails.tpaHelpline && (
                  <div>
                    <span className="text-[11px] text-slate-500">TPA Helpline:</span>
                    <a
                      href={`tel:${asset.policyDetails.tpaHelpline}`}
                      className="text-xs font-bold text-purple-700 hover:underline block"
                    >
                      {asset.policyDetails.tpaHelpline}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vehicle Service Milestone Checklist */}
          {asset.serviceMilestones && asset.serviceMilestones.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-amber-600" />
                  Service Schedule & Milestones
                </h5>
                <span className="text-[10px] text-slate-400">
                  Tap to mark done
                </span>
              </div>

              <div className="space-y-2">
                {asset.serviceMilestones.map((milestone) => {
                  const isDone = milestone.status === 'completed';
                  return (
                    <div
                      key={milestone.id}
                      onClick={() => void toggleMilestone(asset.id, milestone.id)}
                      className={`flex items-start justify-between gap-2 p-3 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-slate-50 border-slate-200/80 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold truncate ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {milestone.title}
                          </p>
                          <p suppressHydrationWarning className="text-[11px] text-slate-500 mt-0.5">
                            Due: {formatDisplayDate(milestone.dueDate)}
                          </p>
                          {milestone.notes && (
                            <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
                              {milestone.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant={milestone.isFree ? 'cyan' : 'secondary'}
                        className="text-[10px] uppercase shrink-0 font-bold"
                      >
                        {milestone.isFree ? 'Free Coupon' : 'Paid Service'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Attached Document / Invoice Card */}
          {asset.documentName && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-2 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                <div className="h-9 w-9 rounded-xl bg-cyan-50 border border-cyan-150 flex items-center justify-center text-cyan-700 shrink-0">
                  <FileSpreadsheet className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate" title={asset.documentName}>
                    {asset.documentName}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">Official Receipt Attached</p>
                </div>
              </div>
              {asset.documentUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-[11px] font-bold rounded-lg shrink-0 cursor-pointer"
                >
                  <a href={asset.documentUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Notes & Terms Box */}
          {asset.notes && (
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Notes & Terms
              </span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 leading-relaxed break-words [overflow-wrap:anywhere] min-w-0">
                {asset.notes}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer: Responsive Action Buttons */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 pt-3 border-t border-slate-100 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="w-full sm:w-auto h-11 sm:h-10 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer flex items-center justify-center gap-2"
            onClick={() => {
              setIsDetailsModalOpen(false);
              openDeleteModal(asset);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Item</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => setIsDetailsModalOpen(false)}
            className="w-full sm:w-auto h-11 sm:h-10 text-xs sm:text-sm font-semibold rounded-xl border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

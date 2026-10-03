'use client';

import * as React from 'react';
import {
  CheckCircle,
  Circle,
  FileSpreadsheet,
  Trash2,
  Wrench,
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

export function AssetDetailsModal() {
  const selectedAssetId = useAssetStore((state) => state.selectedAssetId);
  const isDetailsModalOpen = useAssetStore((state) => state.isDetailsModalOpen);
  const setIsDetailsModalOpen = useAssetStore(
    (state) => state.setIsDetailsModalOpen
  );
  const assets = useAssetStore((state) => state.assets);
  const deleteAsset = useAssetStore((state) => state.deleteAsset);
  const toggleMilestoneStatus = useAssetStore(
    (state) => state.toggleMilestoneStatus
  );

  const asset = assets.find((a) => a.id === selectedAssetId);

  if (!asset) return null;

  const now = new Date().getTime();
  const expiryTime = new Date(asset.expiryOrRenewalDate).getTime();
  const diffDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
      <DialogContent className="sm:max-w-xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto bg-white border-border shadow-2xl">
        <DialogHeader className="pr-8 sm:pr-10 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
              {asset.providerOrBrand}
            </span>
            <div className="shrink-0 mr-1">
              {diffDays < 0 ? (
                <Badge suppressHydrationWarning variant="destructive" className="text-xs font-semibold px-2.5 py-0.5">
                  Expired
                </Badge>
              ) : diffDays <= 30 ? (
                <Badge suppressHydrationWarning variant="warning" className="text-xs font-semibold px-2.5 py-0.5">
                  Expiring in {diffDays} days
                </Badge>
              ) : (
                <Badge suppressHydrationWarning variant="success" className="text-xs font-semibold px-2.5 py-0.5">
                  Active ({diffDays} days left)
                </Badge>
              )}
            </div>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold text-foreground mt-1 break-words">
            {asset.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-normal">
            {asset.identifierNumber || 'Registered Vault Item'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Timeline Overview */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="text-[11px] text-slate-500 uppercase font-semibold">
                Start / Purchase Date
              </p>
              <p suppressHydrationWarning className="font-semibold text-foreground mt-0.5">
                {formatDisplayDate(asset.startDate)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase font-semibold">
                Expiry / Renewal Date
              </p>
              <p suppressHydrationWarning className="font-semibold text-foreground mt-0.5">
                {formatDisplayDate(asset.expiryOrRenewalDate)}
              </p>
            </div>
          </div>

          {/* Insurance Policy Specifics */}
          {asset.policyDetails && (
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-3">
              <h5 className="font-semibold text-xs uppercase tracking-wider text-purple-700">
                Policy Coverage Details
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500">Policy Number:</span>
                  <p className="font-mono text-xs font-semibold text-foreground">
                    {asset.policyDetails.policyNumber}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Sum Insured:</span>
                  <p className="text-xs font-bold text-foreground">
                    ₹{(asset.policyDetails.sumInsured || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Annual Premium:</span>
                  <p className="text-xs font-semibold text-foreground">
                    ₹{(asset.policyDetails.premiumAmount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                {asset.policyDetails.tpaHelpline && (
                  <div>
                    <span className="text-[11px] text-slate-500">TPA Helpline:</span>
                    <p className="text-xs font-semibold text-purple-700">
                      {asset.policyDetails.tpaHelpline}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vehicle Service Milestone Checklist */}
          {asset.serviceMilestones && asset.serviceMilestones.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Wrench className="h-4 w-4 text-amber-600" />
                  Service Schedule & Milestones
                </h5>
                <span className="text-[11px] text-slate-500">
                  Tap to mark done
                </span>
              </div>

              <div className="space-y-2">
                {asset.serviceMilestones.map((milestone) => {
                  const isDone = milestone.status === 'completed';
                  return (
                    <div
                      key={milestone.id}
                      onClick={() => toggleMilestoneStatus(asset.id, milestone.id)}
                      className={`flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-slate-50 border-slate-200/80 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {isDone ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-semibold ${
                              isDone ? 'line-through text-slate-400' : 'text-foreground'
                            }`}
                          >
                            {milestone.title}
                          </p>
                          <p suppressHydrationWarning className="text-[11px] text-slate-500 mt-0.5">
                            Due: {formatDisplayDate(milestone.dueDate)}
                          </p>
                          {milestone.notes && (
                            <p className="text-[11px] text-slate-500 italic mt-1">
                              {milestone.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant={milestone.isFree ? 'cyan' : 'secondary'}
                        className="text-[10px] uppercase shrink-0"
                      >
                        {milestone.isFree ? 'Free Coupon' : 'Paid Service'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Attached Document / Invoice */}
          {asset.documentName && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium text-foreground truncate max-w-[240px]">
                  {asset.documentName}
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-white">
                Attached Receipt
              </Badge>
            </div>
          )}

          {/* Notes */}
          {asset.notes && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-slate-500">
                Notes & Terms
              </span>
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                {asset.notes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDetailsModalOpen(false)}
            className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            Close
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5"
            onClick={() => {
              deleteAsset(asset.id);
              setIsDetailsModalOpen(false);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Item</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

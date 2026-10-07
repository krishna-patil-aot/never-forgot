'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { formatDisplayDate } from '@/lib/dateUtils';
import { Trash2, AlertTriangle, Calendar, Tag, AlertCircle } from 'lucide-react';

export function DeleteConfirmModal() {
  const {
    assetToDelete,
    isDeleteModalOpen,
    isDeleting,
    error,
    closeDeleteModal,
    confirmDelete,
  } = useDeleteConfirm();

  if (!assetToDelete) return null;

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={(open) => !open && closeDeleteModal()}>
      <DialogContent className="w-[calc(100%-1.25rem)] sm:w-full sm:max-w-md p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-rose-150 shadow-2xl bg-white overflow-hidden my-auto">
        <DialogHeader className="text-left space-y-3 pr-8 sm:pr-9">
          {/* Warning Icon Emblem */}
          <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Delete Item Permanently?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              Are you sure you want to delete this record? This will permanently remove the bill and all reminder notifications from your database.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Selected Item Preview Pill */}
        <div className="my-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200/60 inline-block mb-1">
                {assetToDelete.providerOrBrand}
              </span>
              <h4 className="text-sm font-extrabold text-slate-800 truncate">
                {assetToDelete.title}
              </h4>
            </div>
            {assetToDelete.price !== undefined && assetToDelete.price !== null && (
              <span className="text-xs font-bold text-slate-700 shrink-0">
                ₹{assetToDelete.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3 w-3 text-slate-400" />
              <span className="capitalize">{assetToDelete.category.replace('_', ' ')}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span>Expiry: {formatDisplayDate(assetToDelete.expiryOrRenewalDate)}</span>
            </span>
          </div>
        </div>

        {/* Error notification banner if API fails */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={closeDeleteModal}
            className="w-full sm:w-auto h-11 sm:h-10 text-xs sm:text-sm font-semibold rounded-xl border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void confirmDelete()}
            className="w-full sm:w-auto h-11 sm:h-10 text-xs sm:text-sm font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Deleting permanently...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Yes, Delete Permanently</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

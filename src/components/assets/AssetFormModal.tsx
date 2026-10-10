'use client';

import * as React from 'react';
import {
  PlusCircle,
  Pencil,
  Wrench,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  FileText,
  UploadCloud,
  Trash2,
  AlertCircle,
  Loader2,
  Sparkles,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useAssetStore } from '@/stores/useAssetStore';
import { useAssetFormModal } from '@/hooks/useAssetFormModal';
import { AssetCategory, IUniversalAsset } from '@/types/asset.types';
import { formatBytes } from '@/lib/compression';

interface AssetFormBodyProps {
  assetToEdit: IUniversalAsset | null;
  onClose: () => void;
}

function AssetFormBody({ assetToEdit, onClose }: AssetFormBodyProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    mode,
    register,
    handleSubmit,
    setValue,
    errors,
    isSubmitting,
    isVehicle,
    isInsurance,
    currentCategory,
    currentStartDate,
    currentValidityMonths,
    currentExpiryDate,
    attachedDoc,
    docError,
    milestones,
    handleDocumentSelect,
    handleRemoveDocument,
    handleUpdateMilestone,
    handleAddMilestone,
    handleRemoveMilestone,
    handleRecalculateMilestones,
    updateStartDateOrMonths,
    handleCategoryChange,
    handleNonNegativeKeyDown,
  } = useAssetFormModal({ assetToEdit, onClose });

  const categories: Array<{
    id: AssetCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'electronics', label: 'Electronics', icon: ShieldCheck },
    { id: 'vehicle', label: 'Vehicle / Bike', icon: Wrench },
    { id: 'health_insurance', label: 'Health Policy', icon: HeartHandshake },
    { id: 'home_amc', label: 'Home & AMC', icon: CheckCircle2 },
    { id: 'personal_doc', label: 'Personal Doc', icon: FileText },
  ];

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-slate-200 shadow-2xl rounded-3xl p-4 sm:p-6">
      <DialogHeader className="text-left pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              mode === 'edit'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-cyan-50 text-cyan-700 border-cyan-200'
            }`}
          >
            {mode === 'edit' ? (
              <Pencil className="h-5 w-5" />
            ) : (
              <PlusCircle className="h-5 w-5" />
            )}
          </div>
          <div>
            <DialogTitle className="text-base sm:text-lg font-extrabold text-slate-900">
              {mode === 'edit' ? 'Edit Item & Warranty' : 'Add New Item & Warranty'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-0.5">
              {mode === 'edit'
                ? 'Update item details, warranty periods, attached bills, or policy values.'
                : 'Save your bills, warranty guarantee, free service dates, or insurance details.'}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-left">
        {/* Category Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Category
          </Label>
          <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = currentCategory === cat.id;
              return (
                <Button
                  type="button"
                  key={cat.id}
                  variant="outline"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`h-12 flex flex-col items-center justify-center gap-1 p-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer touch-press ${
                    isSelected
                      ? 'bg-cyan-50/80 text-cyan-800 border-cyan-400 ring-2 ring-cyan-200 shadow-2xs font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isSelected ? 'text-cyan-700' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate w-full text-center px-1">
                    {cat.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Primary Product Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2 space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              Item / Product Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              {...register('title')}
              placeholder="e.g. Sony Bravia 55 OLED, Royal Enfield Hunter 350"
              className="h-10 text-xs sm:text-sm bg-slate-50/60 focus:bg-white"
            />
            {errors.title && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              Brand / Manufacturer <span className="text-rose-500">*</span>
            </Label>
            <Input
              {...register('providerOrBrand')}
              placeholder="e.g. Sony, Apple, Samsung, Honda"
              className="h-10 text-xs sm:text-sm bg-slate-50/60 focus:bg-white"
            />
            {errors.providerOrBrand && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.providerOrBrand.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              {isVehicle
                ? 'Registration / Plate No.'
                : isInsurance
                ? 'Policy / Member ID'
                : 'Serial / Model / IMEI No.'}
            </Label>
            <Input
              {...register('identifierNumber')}
              placeholder={
                isVehicle
                  ? 'MH-12-AB-1234'
                  : isInsurance
                  ? 'POL-98234-XYZ'
                  : 'SN-98726190'
              }
              className="h-10 text-xs sm:text-sm bg-slate-50/60 focus:bg-white uppercase font-mono"
            />
          </div>
        </div>

        {/* Dates & Validity Section */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Warranty & Validity Timeline
            </Label>
            <span className="text-[11px] text-cyan-700 font-semibold">
              Auto-calculates expiry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-slate-600">
                Purchase / Start Date *
              </Label>
              <DatePicker
                value={currentStartDate}
                onChange={(val) => {
                  if (val) {
                    updateStartDateOrMonths(
                      val,
                      Number(currentValidityMonths) || 12
                    );
                  }
                }}
                className="h-9 text-xs bg-white"
              />
              {errors.startDate && (
                <p className="text-[10px] text-destructive font-medium">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-slate-600">
                Duration (Months)
              </Label>
              <Input
                type="number"
                min="1"
                max="240"
                value={currentValidityMonths || 12}
                onKeyDown={handleNonNegativeKeyDown}
                onChange={(e) =>
                  updateStartDateOrMonths(
                    currentStartDate || new Date().toISOString().split('T')[0],
                    Math.max(1, parseInt(e.target.value, 10) || 1)
                  )
                }
                className="h-9 text-xs bg-white font-semibold"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-slate-600">
                Expiry / Renewal Date *
              </Label>
              <DatePicker
                value={currentExpiryDate}
                minDate={currentStartDate}
                onChange={(val) => {
                  if (val) {
                    setValue('expiryOrRenewalDate', val, {
                      shouldValidate: true,
                    });
                  }
                }}
                className="h-9 text-xs bg-white"
              />
              {errors.expiryOrRenewalDate && (
                <p className="text-[10px] text-destructive font-medium">
                  {errors.expiryOrRenewalDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Quick preset duration buttons */}
          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
            <span className="text-[11px] text-slate-500 mr-1">Presets:</span>
            {[
              { label: '+6 Mos', months: 6 },
              { label: '+1 Year', months: 12 },
              { label: '+2 Years', months: 24 },
              { label: '+3 Years', months: 36 },
              { label: '+5 Years', months: 60 },
            ].map((preset) => (
              <button
                type="button"
                key={preset.label}
                onClick={() =>
                  updateStartDateOrMonths(
                    currentStartDate || new Date().toISOString().split('T')[0],
                    preset.months
                  )
                }
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-800 transition-colors touch-press cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Service Schedule (User-customizable dates & intervals according to their vehicle manual) */}
        {isVehicle && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1.5 border-b border-amber-200/70">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-700 shrink-0" />
                <Label className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Vehicle Service Schedule & Due Dates
                </Label>
              </div>
              <button
                type="button"
                onClick={handleRecalculateMilestones}
                className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold underline decoration-dotted self-start sm:self-auto cursor-pointer"
                title="Reset milestone dates based on purchase date"
              >
                Auto-suggest from purchase date
              </button>
            </div>

            <p className="text-[11px] text-amber-900/80 leading-relaxed">
              Set exact due dates from your vehicle warranty booklet or service card. We send reminders before each due date so you never miss a free service or void your guarantee.
            </p>

            <div className="space-y-2">
              {milestones.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl bg-white border border-amber-200/90 shadow-2xs"
                >
                  {/* Service Title */}
                  <div className="flex-1 min-w-0">
                    <Input
                      value={m.title}
                      placeholder="e.g. 1st Free Service (500 km)"
                      onChange={(e) =>
                        handleUpdateMilestone(idx, 'title', e.target.value)
                      }
                      className="h-8 text-xs bg-slate-50/50"
                    />
                  </div>

                  {/* Due Date picker */}
                  <div className="w-full sm:w-44 shrink-0">
                    <DatePicker
                      value={m.dueDate}
                      minDate={currentStartDate}
                      onChange={(val) =>
                        handleUpdateMilestone(idx, 'dueDate', val || '')
                      }
                      className="h-8 text-xs bg-white font-medium"
                    />
                  </div>

                  {/* Free vs Paid Toggle */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateMilestone(idx, 'isFree', !m.isFree)
                      }
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer touch-press ${
                        m.isFree
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {m.isFree ? 'Free' : 'Paid'}
                    </button>

                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Remove this service"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMilestone}
              className="w-full h-8 rounded-xl border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-100/60 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer touch-press"
            >
              <PlusCircle className="h-3.5 w-3.5 text-amber-700" />
              <span>Add Another Scheduled Service</span>
            </Button>
          </div>
        )}

        {/* Cost & Policy Specific Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              Purchase Price (₹)
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 54990"
              onKeyDown={handleNonNegativeKeyDown}
              {...register('price', { valueAsNumber: true })}
              className="h-10 text-xs sm:text-sm bg-slate-50/60 focus:bg-white"
            />
          </div>

          {isInsurance && (
            <>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">
                  Sum Insured / Coverage (₹)
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 500000"
                  onKeyDown={handleNonNegativeKeyDown}
                  {...register('sumInsured', { valueAsNumber: true })}
                  className="h-10 text-xs sm:text-sm bg-slate-50/60 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">
                  Annual Premium (₹)
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 14500"
                  onKeyDown={handleNonNegativeKeyDown}
                  {...register('premiumAmount', { valueAsNumber: true })}
                  className="h-10 text-xs sm:text-sm bg-slate-50/60 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">
                  TPA / Cashless Helpline
                </Label>
                <Input
                  {...register('tpaHelpline')}
                  placeholder="1800-102-4488"
                  className="h-10 text-xs sm:text-sm bg-slate-50/60 focus:bg-white"
                />
              </div>
            </>
          )}
        </div>

        {/* Invoice / Bill Upload & Compression */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Bill, Invoice or Warranty Card (PDF / Image)
          </Label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleDocumentSelect(file);
            }}
            className="hidden"
          />

          {!attachedDoc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-cyan-400 bg-slate-50/50 hover:bg-cyan-50/30 rounded-2xl p-4 text-center cursor-pointer transition-all touch-press group"
            >
              <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 text-slate-500 group-hover:text-cyan-600 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Click to attach Bill or Invoice
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PDF, JPG, PNG or WebP • Automatic client-side compression reduces size by up to 70%
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-cyan-100/70 text-cyan-800 flex items-center justify-center shrink-0">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {attachedDoc.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {attachedDoc.compressedSize > 0 && (
                      <span className="text-[10px] text-slate-500">
                        {formatBytes(attachedDoc.compressedSize)}
                      </span>
                    )}
                    {attachedDoc.savedPercentage > 0 && (
                      <Badge variant="cyan" className="text-[9px] px-1.5 py-0">
                        Saved {attachedDoc.savedPercentage}%
                      </Badge>
                    )}
                    {attachedDoc.isUploading && (
                      <span className="text-[10px] text-cyan-600 flex items-center gap-1 font-semibold">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Uploading
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveDocument}
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Remove document"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {docError && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {docError}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <Label className="text-xs font-bold text-slate-700">
            Notes / Warranty Conditions (Optional)
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="e.g. Includes 3 free services. Extended warranty valid on compressor only."
            rows={2}
            className="text-xs sm:text-sm bg-slate-50/60 focus:bg-white resize-none"
          />
        </div>

        {/* Modal Actions Footer */}
        <DialogFooter className="pt-3 border-t border-slate-100 flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-xl text-xs font-bold touch-press cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`h-10 px-5 rounded-xl font-bold text-xs text-white touch-press cursor-pointer flex items-center gap-2 ${
              mode === 'edit'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{mode === 'edit' ? 'Updating...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-white/80" />
                <span>
                  {mode === 'edit' ? 'Save Changes' : 'Save Item & Warranty'}
                </span>
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function AssetFormModal() {
  const isAddModalOpen = useAssetStore((state) => state.isAddModalOpen);
  const isEditModalOpen = useAssetStore((state) => state.isEditModalOpen);
  const assetToEdit = useAssetStore((state) => state.assetToEdit);
  const setIsAddModalOpen = useAssetStore((state) => state.setIsAddModalOpen);
  const setIsEditModalOpen = useAssetStore((state) => state.setIsEditModalOpen);
  const setAssetToEdit = useAssetStore((state) => state.setAssetToEdit);

  const isOpen = isAddModalOpen || isEditModalOpen;

  const handleClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setAssetToEdit(null);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AssetFormBody
        key={assetToEdit ? `edit-${assetToEdit.id}` : 'create-new-asset'}
        assetToEdit={assetToEdit}
        onClose={handleClose}
      />
    </Dialog>
  );
}

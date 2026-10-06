'use client';

import * as React from 'react';
import {
  PlusCircle,
  Wrench,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  FileText,
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
import { DatePicker } from '@/components/ui/date-picker';
import { useAssetStore } from '@/stores/useAssetStore';
import { useAssetOperations } from '@/hooks/useAssetOperations';
import { AssetCategory } from '@/types/asset.types';

export function AddAssetModal() {
  const isAddModalOpen = useAssetStore((state) => state.isAddModalOpen);
  const setIsAddModalOpen = useAssetStore((state) => state.setIsAddModalOpen);

  const {
    register,
    handleSubmit,
    formData,
    formErrors,
    updateField,
    updateStartDateOrMonths,
    handleCategoryChange,
    isVehicle,
    isInsurance,
    isSubmitting,
    handleNonNegativeKeyDown,
  } = useAssetOperations();

  return (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogContent className="sm:max-w-xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto bg-white border-border shadow-2xl">
        <DialogHeader>
          <div className="flex items-start gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-sm sm:text-base md:text-lg font-bold leading-snug break-words">
                Add an Item
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-normal">
                Save your bill, warranty period, free service dates, or policy renewal details.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Category Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Category</Label>
            <div className="grid grid-cols-2 min-[440px]:grid-cols-3 gap-1.5 sm:gap-2">
              {[
                { id: 'electronics', label: 'Electronics', icon: ShieldCheck },
                { id: 'vehicle', label: 'Vehicle / Bike', icon: Wrench },
                { id: 'health_insurance', label: 'Health Policy', icon: HeartHandshake },
                { id: 'home_amc', label: 'Home & AMC', icon: CheckCircle2 },
                { id: 'personal_doc', label: 'Personal Doc', icon: FileText },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <Button
                    type="button"
                    key={cat.id}
                    variant="outline"
                    onClick={() => handleCategoryChange(cat.id as AssetCategory)}
                    className={`h-auto flex items-center justify-start gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl border text-left cursor-pointer transition-all font-normal whitespace-normal ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-50/80 text-cyan-900 font-semibold shadow-xs ring-1 ring-cyan-600/30 hover:bg-cyan-100/70'
                        : 'border-slate-200 bg-slate-50/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-600" />
                    <span className="text-[11px] sm:text-xs font-medium leading-tight whitespace-normal break-words">{cat.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <Label>Item or Policy Name *</Label>
              <Input
                {...register('title')}
                placeholder={
                  formData.category === 'vehicle'
                    ? 'e.g. Royal Enfield Hunter 350'
                    : isInsurance
                    ? 'e.g. Star Health Family Care'
                    : 'e.g. MacBook Pro M3 or iPhone 15'
                }
                className="text-sm"
              />
              {formErrors.title && (
                <p className="text-xs text-destructive">{formErrors.title}</p>
              )}
            </div>

            {/* Provider or Brand */}
            <div className="space-y-1">
              <Label>Brand or Company *</Label>
              <Input
                {...register('providerOrBrand')}
                placeholder={
                  formData.category === 'vehicle'
                    ? 'e.g. Royal Enfield'
                    : isInsurance
                    ? 'e.g. Star Health'
                    : 'e.g. Apple / Samsung'
                }
                className="text-sm"
              />
              {formErrors.providerOrBrand && (
                <p className="text-xs text-destructive">{formErrors.providerOrBrand}</p>
              )}
            </div>

            {/* Serial / Reg / Policy Number */}
            <div className="space-y-1">
              <Label>
                {formData.category === 'vehicle'
                  ? 'Registration / Chasis No.'
                  : isInsurance
                  ? 'Policy Number'
                  : 'Serial / IMEI Number'}
              </Label>
              <Input
                {...register('identifierNumber')}
                placeholder="Optional ID / Serial"
                className="text-sm"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <Label>Purchase or Policy Start Date *</Label>
              <DatePicker
                value={formData.startDate}
                onChange={(val) => {
                  if (val) {
                    updateStartDateOrMonths(val, formData.validityMonths);
                  }
                }}
              />
              {formErrors.startDate && (
                <p className="text-xs text-destructive">{formErrors.startDate}</p>
              )}
            </div>

            {/* Validity Preset Buttons */}
            <div className="space-y-1">
              <Label>Warranty Duration (Months)</Label>
              <div className="flex gap-1.5 flex-wrap">
                {[6, 12, 24, 36].map((months) => (
                  <Badge
                    key={months}
                    variant={formData.validityMonths === months ? 'cyan' : 'outline'}
                    className={`cursor-pointer px-2.5 py-1 text-xs font-semibold ${
                      formData.validityMonths === months
                        ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                        : 'hover:bg-slate-100'
                    }`}
                    onClick={() =>
                      updateStartDateOrMonths(formData.startDate, months)
                    }
                  >
                    {months === 12
                      ? '1 Year'
                      : months === 24
                      ? '2 Years'
                      : months === 36
                      ? '3 Years'
                      : `${months}m`}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Calculated Expiry / Renewal Date */}
            <div className="sm:col-span-2 space-y-1">
              <Label>Calculated End Date *</Label>
              <DatePicker
                value={formData.expiryOrRenewalDate}
                onChange={(val) => {
                  if (val) {
                    updateField('expiryOrRenewalDate', val);
                  }
                }}
              />
              {formErrors.expiryOrRenewalDate && (
                <p className="text-xs text-destructive">
                  {formErrors.expiryOrRenewalDate}
                </p>
              )}
            </div>

            {/* Insurance Policy Specific Fields */}
            {isInsurance && (
              <>
                <div className="space-y-1">
                  <Label>Coverage Sum (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    onKeyDown={handleNonNegativeKeyDown}
                    {...register('sumInsured', {
                      setValueAs: (v) =>
                        v === '' || isNaN(Number(v)) ? undefined : Math.max(0, Number(v)),
                    })}
                    placeholder="e.g. 500000"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Annual Premium (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    onKeyDown={handleNonNegativeKeyDown}
                    {...register('premiumAmount', {
                      setValueAs: (v) =>
                        v === '' || isNaN(Number(v)) ? undefined : Math.max(0, Number(v)),
                    })}
                    placeholder="e.g. 12500"
                    className="text-sm"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label>TPA Helpline Contact Number</Label>
                  <Input
                    {...register('tpaHelpline')}
                    placeholder="e.g. 1800 425 2255"
                    className="text-sm"
                  />
                </div>
              </>
            )}

            {/* Vehicle Schedule Note Banner */}
            {isVehicle && (
              <div className="sm:col-span-2 p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl flex items-center gap-2">
                <Wrench className="h-4 w-4 text-cyan-700 shrink-0" />
                <p className="text-xs text-cyan-900 font-medium">
                  <strong>Free Service Schedule Included:</strong> We automatically set up your 1st Free Service (45 days), 2nd Free Service (180 days), and 3rd Free Service (365 days).
                </p>
              </div>
            )}

            {/* Price (optional) */}
            {!isInsurance && (
              <div className="sm:col-span-2 space-y-1">
                <Label>Purchase Cost (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  onKeyDown={handleNonNegativeKeyDown}
                  {...register('price', {
                    setValueAs: (v) =>
                      v === '' || isNaN(Number(v)) ? undefined : Math.max(0, Number(v)),
                  })}
                  placeholder="e.g. 85000"
                  className="text-sm"
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm font-semibold cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs"
            >
              {isSubmitting ? 'Saving...' : 'Save Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

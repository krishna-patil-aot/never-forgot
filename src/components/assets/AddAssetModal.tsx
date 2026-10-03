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
    formData,
    formErrors,
    updateField,
    updateStartDateOrMonths,
    handleCategoryChange,
    handleSubmit,
  } = useAssetOperations();

  const isVehicle = formData.category === 'vehicle';
  const isInsurance =
    formData.category === 'health_insurance' ||
    formData.category === 'life_insurance';

  return (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogContent className="sm:max-w-xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto bg-white border-border shadow-2xl">
        <DialogHeader>
          <div className="flex items-start gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-sm sm:text-base md:text-lg font-bold leading-snug break-words">
                Add Item to Vault Manually
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-normal">
                Track warranty, periodic free service dates, or insurance renewal deadlines.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4 py-2"
        >
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
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-xs hover:bg-blue-100/70 hover:text-blue-800'
                        : 'border-slate-200 bg-slate-50/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                    <span className="text-[11px] sm:text-xs font-medium leading-tight whitespace-normal break-words">{cat.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <Label>Product or Policy Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. iPhone 15 Pro, Royal Enfield Classic 350, Star Health Floater"
                className="text-sm"
              />
              {formErrors.title && (
                <p className="text-[11px] text-destructive">{formErrors.title}</p>
              )}
            </div>

            {/* Brand / Provider */}
            <div className="space-y-1">
              <Label>Brand or Provider *</Label>
              <Input
                value={formData.providerOrBrand}
                onChange={(e) => updateField('providerOrBrand', e.target.value)}
                placeholder="e.g. Apple, TVS, HDFC ERGO"
                className="text-sm"
              />
              {formErrors.providerOrBrand && (
                <p className="text-[11px] text-destructive">
                  {formErrors.providerOrBrand}
                </p>
              )}
            </div>

            {/* Identifier / Serial / Policy # */}
            <div className="space-y-1">
              <Label>Serial / IMEI / Reg # / Policy #</Label>
              <Input
                value={formData.identifierNumber || ''}
                onChange={(e) =>
                  updateField('identifierNumber', e.target.value)
                }
                placeholder="e.g. Serial, Chassis No or Reg Number"
                className="text-sm"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <Label>Purchase / Start Date</Label>
              <DatePicker
                value={formData.startDate}
                onChange={(dateStr) =>
                  updateStartDateOrMonths(dateStr, formData.validityMonths)
                }
                placeholder="Pick start date"
              />
            </div>

            {/* Validity Months */}
            <div className="space-y-1">
              <Label>Validity Period (Months)</Label>
              <Input
                type="number"
                min={1}
                value={formData.validityMonths}
                onChange={(e) =>
                  updateStartDateOrMonths(formData.startDate, Number(e.target.value))
                }
                className="text-sm"
              />
            </div>

            {/* Expiry Date */}
            <div className="sm:col-span-2 space-y-1 p-2.5 rounded-lg bg-blue-50/50 border border-blue-200/70">
              <div className="flex justify-between items-center">
                <Label className="text-blue-700 font-semibold">Calculated Expiry Date</Label>
                <Badge variant="cyan" className="text-[9px]">
                  Auto
                </Badge>
              </div>
              <DatePicker
                value={formData.expiryOrRenewalDate}
                onChange={(dateStr) =>
                  updateField('expiryOrRenewalDate', dateStr)
                }
                placeholder="Pick expiry date"
                className="bg-white"
              />
            </div>

            {/* Insurance specific fields */}
            {isInsurance && (
              <>
                <div className="space-y-1">
                  <Label>Sum Insured (₹)</Label>
                  <Input
                    type="number"
                    value={formData.sumInsured || ''}
                    onChange={(e) =>
                      updateField('sumInsured', Number(e.target.value))
                    }
                    placeholder="e.g. 1000000"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label>Annual Premium (₹)</Label>
                  <Input
                    type="number"
                    value={formData.premiumAmount || ''}
                    onChange={(e) =>
                      updateField('premiumAmount', Number(e.target.value))
                    }
                    placeholder="e.g. 18500"
                    className="text-sm"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label>TPA Cashless Support Helpline</Label>
                  <Input
                    value={formData.tpaHelpline || ''}
                    onChange={(e) => updateField('tpaHelpline', e.target.value)}
                    placeholder="e.g. 1800-102-4477"
                    className="text-sm"
                  />
                </div>
              </>
            )}

            {/* Vehicle Helper Alert */}
            {isVehicle && (
              <div className="sm:col-span-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Wrench className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Vehicle Service Schedule Auto-Generated:</strong> We will automatically configure 1st Free Service (45 days), 2nd Free Service (180 days), and 3rd Free Service (365 days) for you.
                </p>
              </div>
            )}

            {/* Price (optional) */}
            {!isInsurance && (
              <div className="sm:col-span-2 space-y-1">
                <Label>Purchase Cost (₹)</Label>
                <Input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) =>
                    updateField(
                      'price',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
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
              className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              Save to Vault
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

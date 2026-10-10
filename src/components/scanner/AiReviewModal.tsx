'use client';

import * as React from 'react';
import {
  Sparkles,
  FileCheck,
  CheckCircle,
  Eye,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInvoiceScanner } from '@/hooks/useInvoiceScanner';
import { AssetCategory } from '@/types/asset.types';
import { DocumentViewerModal } from '@/components/ui/DocumentViewerModal';

export function AiReviewModal() {
  const {
    isReviewModalOpen,
    isViewDocOpen,
    scanPayload,
    extractedData,
    setIsReviewModalOpen,
    setIsViewDocOpen,
    updateExtractedField,
    handleConfirmAndSave,
    isSaving,
    resetScan,
    handleNonNegativeKeyDown,
    handlePriceChange,
  } = useInvoiceScanner();

  if (!extractedData) return null;

  // Auto update expiry date when validity or start date changes
  const handleValidityChange = (months: number) => {
    updateExtractedField('validityMonths', months);
    try {
      const start = new Date(extractedData.startDate);
      if (!isNaN(start.getTime())) {
        const expiry = new Date(start);
        expiry.setMonth(expiry.getMonth() + months);
        updateExtractedField(
          'expiryOrRenewalDate',
          expiry.toISOString().split('T')[0]
        );
      }
    } catch {
      // Fallback
    }
  };

  const handleStartDateChange = (startDate: string) => {
    updateExtractedField('startDate', startDate);
    try {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        const expiry = new Date(start);
        expiry.setMonth(expiry.getMonth() + extractedData.validityMonths);
        updateExtractedField(
          'expiryOrRenewalDate',
          expiry.toISOString().split('T')[0]
        );
      }
    } catch {
      // Fallback
    }
  };

  return (
    <Dialog
      open={isReviewModalOpen}
      onOpenChange={(open) => {
        setIsReviewModalOpen(open);
        if (!open) resetScan();
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto bg-white border-border shadow-2xl">
        <DialogHeader>
          <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <FileCheck className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold leading-snug break-words">
                Review AI Extracted Details
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2 self-start min-[480px]:self-auto">
              {(scanPayload?.dataUrl || scanPayload?.cloudinaryUrl) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewDocOpen(true)}
                  className="h-7 px-2.5 text-xs font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border-cyan-200 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Eye className="h-3.5 w-3.5 text-cyan-700" />
                  <span>View Bill</span>
                </Button>
              )}
              <Badge variant="success" className="text-xs font-semibold px-2 py-0.5">
                <Sparkles className="h-3 w-3 mr-1" />
                {extractedData.confidenceScore}% Confidence
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-normal">
            Please verify the extracted values below. You can view your original document to verify the information.
          </DialogDescription>
        </DialogHeader>

        {/* AI Insight Pill & Document Verification Strip */}
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-cyan-50/80 border border-cyan-200/80 text-xs text-cyan-950 flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{extractedData.rawSummary}</p>
          </div>

          {(scanPayload?.dataUrl || scanPayload?.cloudinaryUrl) && (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Eye className="h-4 w-4 text-cyan-700 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">
                  {scanPayload?.fileName || 'Attached Bill / Receipt'}
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  • Click to verify document
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsViewDocOpen(true)}
                className="h-7 px-2.5 text-xs font-bold rounded-lg border-cyan-300 text-cyan-800 hover:bg-cyan-50 shrink-0 cursor-pointer"
              >
                View Document
              </Button>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          {/* Title */}
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Product or Policy Name</Label>
            <Input
              value={extractedData.title}
              onChange={(e) => updateExtractedField('title', e.target.value)}
              placeholder="e.g. iPhone 15 Pro, Royal Enfield Hunter"
              className="text-sm"
            />
          </div>

          {/* Provider / Brand */}
          <div className="space-y-1.5">
            <Label>Brand or Issuer</Label>
            <Input
              value={extractedData.providerOrBrand}
              onChange={(e) =>
                updateExtractedField('providerOrBrand', e.target.value)
              }
              placeholder="e.g. Apple, Star Health, Hero"
              className="text-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={extractedData.category}
              onValueChange={(val) =>
                updateExtractedField('category', val as AssetCategory)
              }
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-border bg-white text-sm cursor-pointer">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-white shadow-xl">
                <SelectItem value="electronics" className="text-sm cursor-pointer">
                  Electronics & Gadgets
                </SelectItem>
                <SelectItem value="vehicle" className="text-sm cursor-pointer">
                  Vehicle & Two-Wheeler
                </SelectItem>
                <SelectItem value="health_insurance" className="text-sm cursor-pointer">
                  Health Insurance
                </SelectItem>
                <SelectItem value="life_insurance" className="text-sm cursor-pointer">
                  Life Insurance
                </SelectItem>
                <SelectItem value="home_amc" className="text-sm cursor-pointer">
                  Home Appliance AMC
                </SelectItem>
                <SelectItem value="personal_doc" className="text-sm cursor-pointer">
                  Personal Document
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Identifier / Serial / Policy # */}
          <div className="space-y-1.5">
            <Label>Serial / IMEI / Policy #</Label>
            <Input
              value={extractedData.identifierNumber || ''}
              onChange={(e) =>
                updateExtractedField('identifierNumber', e.target.value)
              }
              placeholder="e.g. Serial, IMEI or Reg Number"
              className="text-sm"
            />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label>Purchase Price / Premium (₹)</Label>
            <Input
              type="number"
              min="0"
              step="any"
              value={extractedData.price ?? ''}
              onKeyDown={handleNonNegativeKeyDown}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="e.g. 50000"
              className="text-sm"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <Label>Purchase / Start Date</Label>
            <DatePicker
              value={extractedData.startDate}
              onChange={(dateStr) => handleStartDateChange(dateStr)}
              placeholder="Pick start date"
            />
          </div>

          {/* Validity Months */}
          <div className="space-y-1.5">
            <Label>Warranty Validity (Months)</Label>
            <Input
              type="number"
              min={1}
              value={extractedData.validityMonths}
              onChange={(e) => handleValidityChange(Number(e.target.value))}
              className="text-sm"
            />
          </div>

          {/* Expiry Date */}
          <div className="sm:col-span-2 space-y-1.5 p-3 rounded-xl bg-cyan-50/60 border border-cyan-200/70">
            <div className="flex justify-between items-center">
              <Label className="text-cyan-800 font-semibold">Calculated Expiry / Renewal Date</Label>
              <Badge variant="cyan" className="text-[10px] bg-cyan-100 text-cyan-800 border-cyan-200">
                Auto Calculated
              </Badge>
            </div>
            <DatePicker
              value={extractedData.expiryOrRenewalDate}
              minDate={extractedData.startDate}
              onChange={(dateStr) =>
                updateExtractedField('expiryOrRenewalDate', dateStr)
              }
              placeholder="Pick expiry date"
              className="font-semibold text-foreground bg-white"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-border/40">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsReviewModalOpen(false);
              resetScan();
            }}
            className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            Discard
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isSaving}
            className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs"
            onClick={handleConfirmAndSave}
          >
            {isSaving ? (
              <>
                <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-1" />
                <span>Saving Item...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Confirm & Save Item</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Verification Document Viewer Dialog */}
      <DocumentViewerModal
        open={isViewDocOpen}
        onOpenChange={setIsViewDocOpen}
        documentUrl={scanPayload?.dataUrl || scanPayload?.cloudinaryUrl}
        documentName={scanPayload?.fileName || 'Scanned Bill / Receipt'}
        title="Verify Original Bill / Invoice"
        subtitle="Cross-check details against your uploaded invoice"
      />
    </Dialog>
  );
}

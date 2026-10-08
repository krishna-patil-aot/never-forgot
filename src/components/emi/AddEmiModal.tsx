"use client";

import * as React from "react";
import {
  CreditCard,
  Home,
  Car,
  Bike,
  User,
  GraduationCap,
  Coins,
  Tv,
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { useEmiStore } from "@/stores/useEmiStore";
import { useEmiForm } from "@/hooks/useEmiForm";
import { LoanType } from "@/types/emi.types";
import { formatBytes } from "@/lib/compression";

export function AddEmiModal() {
  const isAddEmiModalOpen = useEmiStore((state) => state.isAddEmiModalOpen);
  const setIsAddEmiModalOpen = useEmiStore(
    (state) => state.setIsAddEmiModalOpen,
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formErrors,
    isSubmitting,
    currentLoanType,
    currentStartDate,
    currentTenureMonths,
    currentAutoDebit,
    currentDueDay,
    attachedDoc,
    docError,
    updateTenureOrStartDate,
    handleDocumentSelect,
    handleRemoveDocument,
    handleNonNegativeKeyDown,
  } = useEmiForm();

  const loanOptions: Array<{
    id: LoanType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "home_loan", label: "Home Loan", icon: Home },
    { id: "car_loan", label: "Car Loan", icon: Car },
    { id: "bike_loan", label: "Bike / 2W", icon: Bike },
    { id: "personal_loan", label: "Personal Loan", icon: User },
    { id: "education_loan", label: "Education", icon: GraduationCap },
    { id: "gold_loan", label: "Gold Loan", icon: Coins },
    { id: "consumer_loan", label: "Gadget / Durables", icon: Tv },
    { id: "other", label: "Other Loan", icon: CreditCard },
  ];

  return (
    <Dialog open={isAddEmiModalOpen} onOpenChange={setIsAddEmiModalOpen}>
      <DialogContent className="sm:max-w-xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto bg-white border-border shadow-2xl">
        <DialogHeader>
          <div className="flex items-start gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-150 flex items-center justify-center shrink-0 mt-0.5">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-sm sm:text-base md:text-lg font-bold leading-snug break-words">
                Add Loan & EMI Reminder
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-normal">
                Accepts Home, Car, Personal, or any loan. We remind you 7 days
                and 1 day before every due date.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Loan Category Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Loan Type *
            </Label>
            <div className="grid grid-cols-2 min-[440px]:grid-cols-4 gap-1.5 sm:gap-2">
              {loanOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = currentLoanType === opt.id;
                return (
                  <Button
                    type="button"
                    key={opt.id}
                    variant="outline"
                    onClick={() =>
                      setValue("loanType", opt.id, { shouldValidate: true })
                    }
                    className={`h-auto flex items-center justify-start gap-1.5 sm:gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all font-normal ${
                      isSelected
                        ? "border-cyan-600 bg-cyan-50/80 text-cyan-900 font-semibold shadow-xs ring-1 ring-cyan-600/30"
                        : "border-slate-200 bg-slate-50/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-600" />
                    <span className="text-[11px] font-medium leading-tight truncate">
                      {opt.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <Label>Loan Title or Purpose *</Label>
              <Input
                {...register("title")}
                placeholder={
                  currentLoanType === "home_loan"
                    ? "e.g. Dream 3BHK Apartment Home Loan"
                    : currentLoanType === "car_loan"
                      ? "e.g. Tata Nexon EV Car Loan"
                      : "e.g. HDFC Personal Loan"
                }
                className="text-sm"
              />
              {formErrors.title && (
                <p className="text-xs text-destructive">{formErrors.title}</p>
              )}
            </div>

            {/* Lender Name */}
            <div className="space-y-1">
              <Label>Bank or Lending Institution *</Label>
              <Input
                {...register("lenderName")}
                placeholder="e.g. HDFC Bank, SBI, ICICI, Bajaj"
                className="text-sm"
              />
              {formErrors.lenderName && (
                <p className="text-xs text-destructive">
                  {formErrors.lenderName}
                </p>
              )}
            </div>

            {/* Account / Loan Number */}
            <div className="space-y-1">
              <Label>Loan Account / Agreement No.</Label>
              <Input
                {...register("accountNumber")}
                placeholder="e.g. HL-98234-2024"
                className="text-sm"
              />
            </div>

            {/* Monthly EMI Amount */}
            <div className="space-y-1">
              <Label className="text-cyan-900 font-bold">
                Monthly EMI Amount (₹) *
              </Label>
              <Input
                type="number"
                min="1"
                step="any"
                onKeyDown={handleNonNegativeKeyDown}
                {...register("emiAmount", {
                  setValueAs: (v) => (v === "" ? 0 : Math.max(0, Number(v))),
                })}
                placeholder="e.g. 24500"
                className="text-sm font-bold text-slate-900 border-cyan-300 focus-visible:ring-cyan-500/20"
              />
              {formErrors.emiAmount && (
                <p className="text-xs text-destructive">
                  {formErrors.emiAmount}
                </p>
              )}
            </div>

            {/* Due Day of Month */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label>Monthly Due Day (1 - 31) *</Label>
                <span className="text-[10px] text-slate-500 font-mono">
                  Day {currentDueDay || 5}
                </span>
              </div>
              <Input
                type="number"
                min="1"
                max="31"
                {...register("dueDay", {
                  setValueAs: (v) => Math.max(1, Math.min(31, Number(v) || 1)),
                })}
                placeholder="e.g. 5 (5th of every month)"
                className="text-sm font-semibold"
              />
              {formErrors.dueDay && (
                <p className="text-xs text-destructive">{formErrors.dueDay}</p>
              )}
            </div>

            {/* Total Principal / Loan Amount */}
            <div className="space-y-1">
              <Label>Total Loan Amount / Principal (₹)</Label>
              <Input
                type="number"
                min="0"
                step="any"
                onKeyDown={handleNonNegativeKeyDown}
                {...register("totalLoanAmount", {
                  setValueAs: (v) =>
                    v === "" || isNaN(Number(v))
                      ? undefined
                      : Math.max(0, Number(v)),
                })}
                placeholder="e.g. 3500000"
                className="text-sm"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-1">
              <Label>Interest Rate (% p.a.)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                onKeyDown={handleNonNegativeKeyDown}
                {...register("interestRate", {
                  setValueAs: (v) =>
                    v === "" || isNaN(Number(v))
                      ? undefined
                      : Math.max(0, Number(v)),
                })}
                placeholder="e.g. 8.5"
                className="text-sm"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <Label>Loan Start Date *</Label>
              <DatePicker
                value={currentStartDate}
                onChange={(val) => {
                  if (val) updateTenureOrStartDate(val, currentTenureMonths);
                }}
              />
              {formErrors.startDate && (
                <p className="text-xs text-destructive">
                  {formErrors.startDate}
                </p>
              )}
            </div>

            {/* Tenure Months */}
            <div className="space-y-1">
              <Label>Tenure (Total Months)</Label>
              <Input
                type="number"
                min="1"
                value={currentTenureMonths ?? 60}
                onChange={(e) =>
                  updateTenureOrStartDate(
                    currentStartDate,
                    Number(e.target.value) || 12,
                  )
                }
                placeholder="e.g. 60 (5 years)"
                className="text-sm"
              />
            </div>

            {/* Auto-Debit Settings */}
            <div className="sm:col-span-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">
                    Auto-Debit / NACH Setup
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Is this EMI deducted automatically from your account?
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue("autoDebit", !currentAutoDebit)}
                  className={`h-7 px-3 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                    currentAutoDebit
                      ? "bg-teal-50 text-teal-800 border-teal-300"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  {currentAutoDebit ? "Enabled" : "Manual Payment"}
                </Button>
              </div>

              {currentAutoDebit && (
                <Input
                  {...register("debitAccount")}
                  placeholder="e.g. Auto-debited from HDFC Salary Account (XXXX 4589)"
                  className="text-xs bg-white"
                />
              )}
            </div>

            {/* Sanction Letter / Loan Agreement Attachment (with Compression) */}
            <div className="sm:col-span-2 space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700">
                  Loan Agreement / Sanction Letter Attachment
                </Label>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    void handleDocumentSelect(e.target.files[0]);
                  }
                }}
              />

              {docError && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{docError}</span>
                </div>
              )}

              {attachedDoc ? (
                <div className="p-3 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {attachedDoc.file.type.startsWith("image/") ? (
                      <div className="h-10 w-10 rounded-xl overflow-hidden bg-white border border-cyan-200 shrink-0 flex items-center justify-center shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={attachedDoc.dataUrl}
                          alt="Sanction letter"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-white border border-cyan-200 text-cyan-700 shrink-0 flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {attachedDoc.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5 flex-wrap">
                        <span>{formatBytes(attachedDoc.originalSize)}</span>
                        <span>→</span>
                        <strong className="text-cyan-800">
                          {formatBytes(attachedDoc.compressedSize)}
                        </strong>
                        {attachedDoc.savedPercentage > 0 && (
                          <Badge
                            variant="success"
                            className="text-[9px] px-1.5 py-0 font-bold bg-emerald-100 text-emerald-800 border-emerald-300"
                          >
                            {attachedDoc.savedPercentage}% saved
                          </Badge>
                        )}
                        {attachedDoc.isUploading && (
                          <span className="text-cyan-600 animate-pulse font-medium">
                            • Syncing to cloud...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveDocument}
                    className="h-8 w-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
                    title="Remove attachment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 sm:p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-cyan-400 bg-slate-50/70 hover:bg-cyan-50/30 transition-all cursor-pointer flex items-center justify-center gap-3 text-center group"
                >
                  <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 text-cyan-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-800 transition-colors">
                      Attach Sanction Letter or Document
                    </p>
                    <p className="text-[11px] text-slate-500">
                      JPG, PNG, WebP or PDF
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="sm:col-span-2 space-y-1">
              <Label>Notes & Details</Label>
              <Input
                {...register("notes")}
                placeholder="Optional notes or lender contact details"
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddEmiModalOpen(false)}
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
              {isSubmitting ? "Saving..." : "Save EMI Reminder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

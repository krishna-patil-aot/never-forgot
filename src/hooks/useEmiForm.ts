'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEmiStore } from '@/stores/useEmiStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEmiApi } from './useEmiApi';
import { ICreateEmiDto } from '@/types/emi.types';
import { IAttachedDocument } from '@/types/asset.types';
import { compressDocument } from '@/lib/compression';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { isDateAfterOrEqual } from '@/lib/dateUtils';

export const emiFormSchema = z
  .object({
    title: z.string().min(2, 'Loan or EMI title is required'),
    loanType: z.enum([
      'home_loan',
      'car_loan',
      'personal_loan',
      'bike_loan',
      'education_loan',
      'gold_loan',
      'consumer_loan',
      'business_loan',
      'other',
    ]),
    lenderName: z.string().min(2, 'Bank or Lender name is required'),
    accountNumber: z.string().optional(),
    emiAmount: z.number().min(1, 'Monthly EMI amount must be greater than 0'),
    dueDay: z
      .number()
      .min(1, 'Due day must be between 1 and 31')
      .max(31, 'Due day must be between 1 and 31'),
    totalLoanAmount: z.number().min(0, 'Total loan amount cannot be negative').optional(),
    interestRate: z.number().min(0, 'Interest rate cannot be negative').optional(),
    tenureMonths: z.number().min(1, 'Tenure must be at least 1 month').optional(),
    startDate: z.string().min(4, 'Start date is required'),
    endDate: z.string().optional(),
    autoDebit: z.boolean(),
    debitAccount: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return isDateAfterOrEqual(data.endDate, data.startDate);
    },
    {
      message: 'Loan completion end date cannot be before loan start date',
      path: ['endDate'],
    }
  );

export type EmiFormData = z.infer<typeof emiFormSchema>;

const defaultEmiFormValues: EmiFormData = {
  title: '',
  loanType: 'home_loan',
  lenderName: '',
  accountNumber: '',
  emiAmount: 15000,
  dueDay: 5,
  totalLoanAmount: undefined,
  interestRate: 8.5,
  tenureMonths: 60,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5))
    .toISOString()
    .split('T')[0],
  autoDebit: true,
  debitAccount: '',
  notes: '',
};

export function useEmiForm() {
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const isAddEmiModalOpen = useEmiStore((state) => state.isAddEmiModalOpen);
  const setIsAddEmiModalOpen = useEmiStore((state) => state.setIsAddEmiModalOpen);
  const { createEmi } = useEmiApi();

  const [attachedDoc, setAttachedDoc] = useState<IAttachedDocument | null>(null);
  const [docError, setDocError] = useState<string | null>(null);

  useEffect(() => {
    if (isAddEmiModalOpen && !user) {
      setIsAddEmiModalOpen(false);
      openLoginModal();
    }
  }, [isAddEmiModalOpen, user, setIsAddEmiModalOpen, openLoginModal]);

  const form = useForm<EmiFormData>({
    resolver: zodResolver(emiFormSchema),
    defaultValues: defaultEmiFormValues,
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit: hookFormSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const currentLoanType = useWatch({ control, name: 'loanType' });
  const currentStartDate = useWatch({ control, name: 'startDate' });
  const currentTenureMonths = useWatch({ control, name: 'tenureMonths' });
  const currentAutoDebit = useWatch({ control, name: 'autoDebit' });
  const currentDueDay = useWatch({ control, name: 'dueDay' });

  // Recalculate end date whenever start date or tenure months changes
  const updateTenureOrStartDate = useCallback(
    (startDate: string, months?: number) => {
      setValue('startDate', startDate, { shouldValidate: true });
      if (months && months > 0) {
        setValue('tenureMonths', months, { shouldValidate: true });
        try {
          const start = new Date(startDate);
          if (!isNaN(start.getTime())) {
            const end = new Date(start);
            end.setMonth(end.getMonth() + months);
            setValue('endDate', end.toISOString().split('T')[0]);
          }
        } catch {
          // ignore date parse issues
        }
      }
    },
    [setValue]
  );

  const handleDocumentSelect = useCallback(async (file: File) => {
    setDocError(null);
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      setDocError('Please upload an image (JPG, PNG, WebP) or PDF file.');
      return;
    }

    try {
      const compressed = await compressDocument(file);
      const docItem: IAttachedDocument = {
        file: compressed.file,
        dataUrl: compressed.dataUrl,
        name: file.name,
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
        savedPercentage: compressed.savedPercentage,
        isUploading: true,
      };
      setAttachedDoc(docItem);

      void uploadToCloudinary(compressed.file, file.name).then((res) => {
        if (res?.secureUrl) {
          setAttachedDoc((prev) =>
            prev ? { ...prev, uploadedUrl: res.secureUrl, isUploading: false } : null
          );
        } else {
          setAttachedDoc((prev) => (prev ? { ...prev, isUploading: false } : null));
        }
      });
    } catch {
      setDocError('Failed to process document.');
    }
  }, []);

  const handleRemoveDocument = useCallback(() => {
    setAttachedDoc(null);
    setDocError(null);
  }, []);

  const handleNonNegativeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    },
    []
  );

  const onValidSubmit: SubmitHandler<EmiFormData> = useCallback(
    async (formData) => {
      const effectiveDocUrl = attachedDoc?.uploadedUrl || attachedDoc?.dataUrl || undefined;
      const effectiveDocName = attachedDoc?.name || undefined;

      const dto: ICreateEmiDto = {
        title: formData.title,
        loanType: formData.loanType,
        lenderName: formData.lenderName,
        accountNumber: formData.accountNumber || undefined,
        emiAmount: formData.emiAmount,
        dueDay: formData.dueDay,
        totalLoanAmount: formData.totalLoanAmount,
        interestRate: formData.interestRate,
        tenureMonths: formData.tenureMonths,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        autoDebit: formData.autoDebit,
        debitAccount: formData.debitAccount || undefined,
        documentName: effectiveDocName,
        documentUrl: effectiveDocUrl,
        notes: formData.notes || undefined,
      };

      const success = await createEmi(dto);
      if (success) {
        setAttachedDoc(null);
        setDocError(null);
        setIsAddEmiModalOpen(false);
        reset(defaultEmiFormValues);
      }
    },
    [attachedDoc, createEmi, setIsAddEmiModalOpen, reset]
  );

  const formErrorsRecord: Record<string, string> = {};
  Object.entries(errors).forEach(([k, err]) => {
    if (err?.message) formErrorsRecord[k] = err.message;
  });

  return {
    form,
    register,
    handleSubmit: hookFormSubmit(onValidSubmit),
    setValue,
    reset,
    errors,
    formErrors: formErrorsRecord,
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
  };
}

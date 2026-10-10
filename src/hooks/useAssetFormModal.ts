'use client';

import { useCallback, useId, useState } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAssetStore } from '@/stores/useAssetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  AssetCategory,
  ExpiryStatus,
  IServiceMilestone,
  IUniversalAsset,
  IAttachedDocument,
} from '@/types/asset.types';
import {
  ICreateAssetDto,
  IUpdateAssetDto,
  IApiResponse,
} from '@/types/api.types';
import { compressDocument } from '@/lib/compression';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { isDateAfterOrEqual } from '@/lib/dateUtils';

export const assetFormSchema = z
  .object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    providerOrBrand: z.string().min(1, 'Brand or Provider is required'),
    category: z.enum([
      'electronics',
      'vehicle',
      'health_insurance',
      'life_insurance',
      'home_amc',
      'personal_doc',
    ]),
    identifierNumber: z.string().optional(),
    startDate: z.string().min(4, 'Valid start date required'),
    validityMonths: z.number().min(1, 'Validity must be at least 1 month'),
    expiryOrRenewalDate: z.string().min(4, 'Expiry date required'),
    price: z.number().min(0, 'Purchase cost cannot be negative').optional(),
    notes: z.string().optional(),

    // Policy specific
    policyNumber: z.string().optional(),
    sumInsured: z.number().min(0, 'Coverage sum cannot be negative').optional(),
    premiumAmount: z.number().min(0, 'Premium amount cannot be negative').optional(),
    tpaHelpline: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.expiryOrRenewalDate) return true;
      return isDateAfterOrEqual(data.expiryOrRenewalDate, data.startDate);
    },
    {
      message: 'Expiry or renewal date must be on or after the purchase date',
      path: ['expiryOrRenewalDate'],
    }
  );

export type AssetFormData = z.infer<typeof assetFormSchema>;

export interface IEditableMilestone {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  isFree: boolean;
  cost?: number;
}

export function computeDefaultMilestones(
  startDateStr: string,
  prefix: string
): IEditableMilestone[] {
  const start = new Date(startDateStr);
  const base = isNaN(start.getTime()) ? new Date() : start;

  const m1 = new Date(base);
  m1.setDate(m1.getDate() + 45);

  const m2 = new Date(base);
  m2.setDate(m2.getDate() + 180);

  const m3 = new Date(base);
  m3.setDate(m3.getDate() + 365);

  return [
    {
      id: `srv-${prefix}-1`,
      title: '1st Free Service (500km / 45 Days)',
      dueDate: m1.toISOString().split('T')[0],
      isFree: true,
      cost: 0,
    },
    {
      id: `srv-${prefix}-2`,
      title: '2nd Free Service (3,000km / 180 Days)',
      dueDate: m2.toISOString().split('T')[0],
      isFree: true,
      cost: 0,
    },
    {
      id: `srv-${prefix}-3`,
      title: '3rd Free Service (6,000km / 365 Days)',
      dueDate: m3.toISOString().split('T')[0],
      isFree: true,
      cost: 0,
    },
  ];
}

interface UseAssetFormModalProps {
  assetToEdit?: IUniversalAsset | null;
  onClose?: () => void;
}

export function useAssetFormModal(props?: UseAssetFormModalProps) {
  const assetToEdit = props?.assetToEdit ?? null;
  const mode: 'create' | 'edit' = assetToEdit ? 'edit' : 'create';
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const addAsset = useAssetStore((state) => state.addAsset);
  const updateAssetInStore = useAssetStore((state) => state.updateAsset);
  const setIsAddModalOpen = useAssetStore((state) => state.setIsAddModalOpen);
  const setIsEditModalOpen = useAssetStore((state) => state.setIsEditModalOpen);
  const milestoneIdPrefix = useId();

  const handleClose = useCallback(() => {
    if (props?.onClose) {
      props.onClose();
    } else {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    }
  }, [props, setIsAddModalOpen, setIsEditModalOpen]);

  const [attachedDoc, setAttachedDoc] = useState<IAttachedDocument | null>(() => {
    if (assetToEdit?.documentUrl) {
      return {
        file: new File([], assetToEdit.documentName || 'Document'),
        dataUrl: assetToEdit.documentUrl,
        name: assetToEdit.documentName || 'Attached Document',
        originalSize: 0,
        compressedSize: 0,
        savedPercentage: 0,
        uploadedUrl: assetToEdit.documentUrl,
      };
    }
    return null;
  });

  const [docError, setDocError] = useState<string | null>(null);

  const [milestones, setMilestones] = useState<IEditableMilestone[]>(() => {
    if (
      assetToEdit?.serviceMilestones &&
      assetToEdit.serviceMilestones.length > 0
    ) {
      return assetToEdit.serviceMilestones.map((m) => ({
        id: m.id,
        title: m.title,
        dueDate: m.dueDate
          ? m.dueDate.split('T')[0]
          : new Date().toISOString().split('T')[0],
        isFree: m.isFree,
        cost: m.cost,
      }));
    }
    return computeDefaultMilestones(
      assetToEdit?.startDate || new Date().toISOString().split('T')[0],
      milestoneIdPrefix
    );
  });

  const handleUpdateMilestone = useCallback(
    <K extends keyof IEditableMilestone>(
      index: number,
      field: K,
      value: IEditableMilestone[K]
    ) => {
      setMilestones((prev) => {
        const copy = [...prev];
        if (copy[index]) {
          copy[index] = { ...copy[index], [field]: value };
        }
        return copy;
      });
    },
    []
  );

  const handleAddMilestone = useCallback(() => {
    setMilestones((prev) => {
      const last = prev[prev.length - 1];
      let nextDate = new Date();
      if (last?.dueDate) {
        const d = new Date(last.dueDate);
        if (!isNaN(d.getTime())) {
          d.setDate(d.getDate() + 90);
          nextDate = d;
        }
      }
      return [
        ...prev,
        {
          id: `srv-${milestoneIdPrefix}-${Date.now()}`,
          title: `${prev.length + 1}th Scheduled Service`,
          dueDate: nextDate.toISOString().split('T')[0],
          isFree: false,
          cost: 0,
        },
      ];
    });
  }, [milestoneIdPrefix]);

  const handleRemoveMilestone = useCallback((index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const initialValues: AssetFormData = assetToEdit
    ? {
        title: assetToEdit.title,
        providerOrBrand: assetToEdit.providerOrBrand,
        category: assetToEdit.category,
        identifierNumber: assetToEdit.identifierNumber || '',
        startDate: assetToEdit.startDate.split('T')[0],
        validityMonths: assetToEdit.validityMonths,
        expiryOrRenewalDate: assetToEdit.expiryOrRenewalDate.split('T')[0],
        price: assetToEdit.price !== null ? assetToEdit.price : undefined,
        notes: assetToEdit.notes || '',
        policyNumber: assetToEdit.policyDetails?.policyNumber || '',
        sumInsured: assetToEdit.policyDetails?.sumInsured || undefined,
        premiumAmount: assetToEdit.policyDetails?.premiumAmount || undefined,
        tpaHelpline: assetToEdit.policyDetails?.tpaHelpline || '',
      }
    : {
        title: '',
        providerOrBrand: '',
        category: 'electronics',
        identifierNumber: '',
        startDate: new Date().toISOString().split('T')[0],
        validityMonths: 12,
        expiryOrRenewalDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )
          .toISOString()
          .split('T')[0],
        price: undefined,
        notes: '',
        policyNumber: '',
        sumInsured: undefined,
        premiumAmount: undefined,
        tpaHelpline: '',
      };

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit: hookFormSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const currentCategory = useWatch({ control, name: 'category' });
  const currentStartDate = useWatch({ control, name: 'startDate' });
  const currentValidityMonths = useWatch({ control, name: 'validityMonths' });
  const currentExpiryDate = useWatch({ control, name: 'expiryOrRenewalDate' });

  const isVehicle = currentCategory === 'vehicle';
  const isInsurance =
    currentCategory === 'health_insurance' ||
    currentCategory === 'life_insurance';

  const handleRecalculateMilestones = useCallback(() => {
    const currentStart =
      getValues('startDate') || new Date().toISOString().split('T')[0];
    setMilestones(computeDefaultMilestones(currentStart, milestoneIdPrefix));
  }, [getValues, milestoneIdPrefix]);

  // Recalculate expiry date when start date or validity months change
  const updateStartDateOrMonths = useCallback(
    (startDate: string, months: number) => {
      try {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          const expiry = new Date(start);
          expiry.setMonth(expiry.getMonth() + months);
          const formattedExpiry = expiry.toISOString().split('T')[0];
          setValue('startDate', startDate, { shouldValidate: true });
          setValue('validityMonths', months, { shouldValidate: true });
          setValue('expiryOrRenewalDate', formattedExpiry, {
            shouldValidate: true,
          });
          return;
        }
      } catch {
        // Fallback
      }
      setValue('startDate', startDate);
      setValue('validityMonths', months);
    },
    [setValue]
  );

  const handleCategoryChange = useCallback(
    (category: AssetCategory) => {
      let defaultMonths = 12;
      if (category === 'vehicle') defaultMonths = 36;
      if (category === 'personal_doc') defaultMonths = 120; // 10 years

      const startDateVal = getValues('startDate');
      const start = new Date(startDateVal || new Date());
      const expiry = new Date(start);
      expiry.setMonth(expiry.getMonth() + defaultMonths);

      setValue('category', category, { shouldValidate: true });
      setValue('validityMonths', defaultMonths, { shouldValidate: true });
      setValue(
        'expiryOrRenewalDate',
        expiry.toISOString().split('T')[0],
        { shouldValidate: true }
      );
    },
    [setValue, getValues]
  );

  const handleNonNegativeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    },
    []
  );

  const handleDocumentSelect = useCallback(async (file: File) => {
    setDocError(null);
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];
    if (
      !allowed.includes(file.type) &&
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
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

      void uploadToCloudinary(compressed.file, file.name).then((cloudRes) => {
        if (cloudRes?.secureUrl) {
          setAttachedDoc((prev) =>
            prev
              ? {
                  ...prev,
                  uploadedUrl: cloudRes.secureUrl,
                  isUploading: false,
                }
              : null
          );
        } else {
          setAttachedDoc((prev) =>
            prev ? { ...prev, isUploading: false } : null
          );
        }
      });
    } catch {
      setDocError('Document compression failed. Please try another file.');
    }
  }, []);

  const handleRemoveDocument = useCallback(() => {
    setAttachedDoc(null);
    setDocError(null);
  }, []);

  const onValidSubmit: SubmitHandler<AssetFormData> = useCallback(
    async (formData) => {
      if (!user) {
        handleClose();
        openLoginModal();
        return;
      }

      const expiryTime = new Date(formData.expiryOrRenewalDate).getTime();
      const now = new Date().getTime();
      const diffDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

      let status: ExpiryStatus = 'active';
      if (diffDays < 0) status = 'expired';
      else if (diffDays <= 30) status = 'expiring_soon';

      const safePrice =
        formData.price !== undefined && formData.price !== null
          ? Math.max(0, formData.price)
          : undefined;

      const safeSumInsured =
        formData.sumInsured !== undefined && formData.sumInsured !== null
          ? Math.max(0, formData.sumInsured)
          : undefined;

      const safePremiumAmount =
        formData.premiumAmount !== undefined &&
        formData.premiumAmount !== null
          ? Math.max(0, formData.premiumAmount)
          : 0;

      const effectiveDocUrl =
        attachedDoc?.uploadedUrl || attachedDoc?.dataUrl || undefined;
      const effectiveDocName = attachedDoc?.name || undefined;

      const policyDetails =
        formData.category === 'health_insurance' ||
        formData.category === 'life_insurance'
          ? {
              policyNumber:
                formData.policyNumber ||
                formData.identifierNumber ||
                'POL-UNKNOWN',
              sumInsured: safeSumInsured,
              premiumAmount: safePremiumAmount,
              premiumDueDate: new Date(
                formData.expiryOrRenewalDate
              ).toISOString(),
              tpaHelpline: formData.tpaHelpline,
            }
          : undefined;

      let serviceMilestones: IServiceMilestone[] | undefined = undefined;
      if (formData.category === 'vehicle') {
        serviceMilestones = milestones
          .filter((m) => m.title.trim().length > 0 && m.dueDate)
          .map((m, idx) => ({
            id: m.id || `srv-${milestoneIdPrefix}-${idx + 1}`,
            title: m.title.trim(),
            dueDate: new Date(m.dueDate).toISOString(),
            isFree: m.isFree,
            status: 'pending',
            cost: m.isFree
              ? 0
              : m.cost !== undefined && m.cost !== null
              ? Math.max(0, m.cost)
              : undefined,
          }));
      }

      if (mode === 'create') {
        const createDto: ICreateAssetDto = {
          title: formData.title,
          providerOrBrand: formData.providerOrBrand,
          category: formData.category,
          identifierNumber: formData.identifierNumber || undefined,
          startDate: new Date(formData.startDate).toISOString(),
          expiryOrRenewalDate: new Date(
            formData.expiryOrRenewalDate
          ).toISOString(),
          validityMonths: formData.validityMonths,
          documentName: effectiveDocName,
          documentUrl: effectiveDocUrl,
          price: safePrice,
          notes: formData.notes,
          serviceMilestones: serviceMilestones?.map((m) => ({
            title: m.title,
            dueDate: m.dueDate,
            isFree: m.isFree,
            status: m.status,
            cost:
              m.cost !== undefined && m.cost !== null
                ? Math.max(0, m.cost)
                : undefined,
            notes: m.notes,
          })),
          policyDetails,
        };

        const optimisticAsset: IUniversalAsset = {
          id: `asset-${Date.now()}`,
          userId: user.id,
          title: formData.title,
          providerOrBrand: formData.providerOrBrand,
          category: formData.category,
          identifierNumber: formData.identifierNumber || undefined,
          startDate: new Date(formData.startDate).toISOString(),
          expiryOrRenewalDate: new Date(
            formData.expiryOrRenewalDate
          ).toISOString(),
          validityMonths: formData.validityMonths,
          documentName: effectiveDocName,
          documentUrl: effectiveDocUrl,
          price: safePrice,
          status,
          notes: formData.notes,
          serviceMilestones,
          policyDetails,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          const res = await fetch('/api/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createDto),
          });
          if (res.ok) {
            const json: IApiResponse<IUniversalAsset> =
              (await res.json()) as IApiResponse<IUniversalAsset>;
            if (json.success && json.data) {
              addAsset(json.data);
              handleClose();
              return;
            }
          }
        } catch {
          // Fallback optimistic
        }
        addAsset(optimisticAsset);
        handleClose();
      } else {
        // Edit mode
        if (!assetToEdit) return;

        const updateDto: IUpdateAssetDto = {
          title: formData.title,
          providerOrBrand: formData.providerOrBrand,
          category: formData.category,
          identifierNumber: formData.identifierNumber || undefined,
          startDate: new Date(formData.startDate).toISOString(),
          expiryOrRenewalDate: new Date(
            formData.expiryOrRenewalDate
          ).toISOString(),
          validityMonths: formData.validityMonths,
          documentName: effectiveDocName,
          documentUrl: effectiveDocUrl,
          price: safePrice,
          status,
          notes: formData.notes,
          serviceMilestones: serviceMilestones?.map((m) => ({
            title: m.title,
            dueDate: m.dueDate,
            isFree: m.isFree,
            status: m.status,
            cost: m.cost,
            notes: m.notes,
          })),
          policyDetails,
        };

        try {
          const res = await fetch(`/api/assets/${assetToEdit.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateDto),
          });
          if (res.ok) {
            const json: IApiResponse<IUniversalAsset> =
              (await res.json()) as IApiResponse<IUniversalAsset>;
            if (json.success && json.data) {
              updateAssetInStore(assetToEdit.id, json.data);
              handleClose();
              return;
            }
          }
        } catch {
          // Fallback optimistic
        }

        const optimisticUpdated: Partial<IUniversalAsset> = {
          title: formData.title,
          providerOrBrand: formData.providerOrBrand,
          category: formData.category,
          identifierNumber: formData.identifierNumber || undefined,
          startDate: new Date(formData.startDate).toISOString(),
          expiryOrRenewalDate: new Date(
            formData.expiryOrRenewalDate
          ).toISOString(),
          validityMonths: formData.validityMonths,
          documentName: effectiveDocName,
          documentUrl: effectiveDocUrl,
          price: safePrice,
          status,
          notes: formData.notes,
          serviceMilestones,
          policyDetails,
          updatedAt: new Date().toISOString(),
        };

        updateAssetInStore(assetToEdit.id, optimisticUpdated);
        handleClose();
      }
    },
    [
      user,
      mode,
      assetToEdit,
      handleClose,
      openLoginModal,
      milestoneIdPrefix,
      attachedDoc,
      milestones,
      addAsset,
      updateAssetInStore,
    ]
  );

  const updateField = useCallback(
    <K extends keyof AssetFormData>(key: K, value: AssetFormData[K]) => {
      setValue(key, value as never, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  const formErrors: Record<string, string> = {};
  Object.entries(errors).forEach(([k, err]) => {
    if (err?.message) formErrors[k] = err.message;
  });

  const formData = {
    category: currentCategory,
    startDate: currentStartDate,
    validityMonths: currentValidityMonths,
    expiryOrRenewalDate: currentExpiryDate,
  };

  return {
    mode,
    form,
    register,
    handleSubmit: hookFormSubmit(onValidSubmit),
    setValue,
    getValues,
    reset,
    errors,
    formErrors,
    formData,
    isSubmitting,
    isVehicle,
    isInsurance,
    currentCategory,
    currentStartDate,
    currentExpiryDate,
    currentValidityMonths,
    attachedDoc,
    docError,
    milestones,
    handleClose,
    handleDocumentSelect,
    handleRemoveDocument,
    handleUpdateMilestone,
    handleAddMilestone,
    handleRemoveMilestone,
    handleRecalculateMilestones,
    updateField,
    updateStartDateOrMonths,
    handleCategoryChange,
    handleNonNegativeKeyDown,
  };
}

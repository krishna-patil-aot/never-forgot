'use client';

import { useCallback, useEffect, useId } from 'react';
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
  IAssetFormData,
} from '@/types/asset.types';
import { ICreateAssetDto, IApiResponse } from '@/types/api.types';

// Strict Zod schema for manual creation
export const assetFormSchema = z.object({
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
});

export type AssetFormData = z.infer<typeof assetFormSchema>;

const defaultFormValues: IAssetFormData = {
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

export function useAssetOperations() {
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const addAsset = useAssetStore((state) => state.addAsset);
  const isAddModalOpen = useAssetStore((state) => state.isAddModalOpen);
  const setIsAddModalOpen = useAssetStore((state) => state.setIsAddModalOpen);
  const milestoneIdPrefix = useId();

  // Guard: if user is not signed in and modal opens, immediately dismiss and open auth
  useEffect(() => {
    if (isAddModalOpen && !user) {
      setIsAddModalOpen(false);
      openLoginModal();
    }
  }, [isAddModalOpen, user, setIsAddModalOpen, openLoginModal]);

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: defaultFormValues,
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

  // Recalculate expiry date when startDate or validityMonths changes
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
          setValue('expiryOrRenewalDate', formattedExpiry, { shouldValidate: true });
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
      if (category === 'personal_doc') defaultMonths = 120; // 10 years passport

      const startDateVal = getValues('startDate');
      const start = new Date(startDateVal || new Date());
      const expiry = new Date(start);
      expiry.setMonth(expiry.getMonth() + defaultMonths);

      setValue('category', category, { shouldValidate: true });
      setValue('validityMonths', defaultMonths, { shouldValidate: true });
      setValue('expiryOrRenewalDate', expiry.toISOString().split('T')[0], { shouldValidate: true });
    },
    [setValue, getValues]
  );

  const updateField = useCallback(
    <K extends keyof IAssetFormData>(key: K, value: IAssetFormData[K]) => {
      setValue(key, value as never, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  const handleNonNegativeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    },
    []
  );

  const onValidSubmit: SubmitHandler<AssetFormData> = useCallback(
    async (formData) => {
      // Determine status
      const expiryTime = new Date(formData.expiryOrRenewalDate).getTime();
      const now = new Date().getTime();
      const diffDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

      let status: ExpiryStatus = 'active';
      if (diffDays < 0) status = 'expired';
      else if (diffDays <= 30) status = 'expiring_soon';

    // Auto-generate service milestones for vehicle
    let serviceMilestones: IServiceMilestone[] | undefined = undefined;
    if (formData.category === 'vehicle') {
      const startDateObj = new Date(formData.startDate);
      const m1Date = new Date(startDateObj);
      m1Date.setDate(m1Date.getDate() + 45);

      const m2Date = new Date(startDateObj);
      m2Date.setDate(m2Date.getDate() + 180);

      const m3Date = new Date(startDateObj);
      m3Date.setDate(m3Date.getDate() + 365);

      serviceMilestones = [
        {
          id: `srv-${milestoneIdPrefix}-1`,
          title: '1st Free Service (500km / 45 Days)',
          dueDate: m1Date.toISOString(),
          isFree: true,
          status: 'pending',
          cost: 0,
        },
        {
          id: `srv-${milestoneIdPrefix}-2`,
          title: '2nd Free Service (3,000km / 180 Days)',
          dueDate: m2Date.toISOString(),
          isFree: true,
          status: 'pending',
          cost: 0,
        },
        {
          id: `srv-${milestoneIdPrefix}-3`,
          title: '3rd Free Service (6,000km / 365 Days)',
          dueDate: m3Date.toISOString(),
          isFree: true,
          status: 'pending',
          cost: 0,
        },
      ];
    }

    const safePrice =
      formData.price !== undefined && formData.price !== null
        ? Math.max(0, formData.price)
        : undefined;

    const safeSumInsured =
      formData.sumInsured !== undefined && formData.sumInsured !== null
        ? Math.max(0, formData.sumInsured)
        : undefined;

    const safePremiumAmount =
      formData.premiumAmount !== undefined && formData.premiumAmount !== null
        ? Math.max(0, formData.premiumAmount)
        : 0;

    const createDto: ICreateAssetDto = {
      title: formData.title,
      providerOrBrand: formData.providerOrBrand,
      category: formData.category,
      identifierNumber: formData.identifierNumber || undefined,
      startDate: new Date(formData.startDate).toISOString(),
      expiryOrRenewalDate: new Date(formData.expiryOrRenewalDate).toISOString(),
      validityMonths: formData.validityMonths,
      price: safePrice,
      notes: formData.notes,
      serviceMilestones: serviceMilestones?.map((m) => ({
        title: m.title,
        dueDate: m.dueDate,
        isFree: m.isFree,
        status: m.status,
        cost: m.cost !== undefined && m.cost !== null ? Math.max(0, m.cost) : undefined,
        notes: m.notes,
      })),
      policyDetails:
        formData.category === 'health_insurance' ||
        formData.category === 'life_insurance'
          ? {
              policyNumber: formData.policyNumber || formData.identifierNumber || 'POL-UNKNOWN',
              sumInsured: safeSumInsured,
              premiumAmount: safePremiumAmount,
              premiumDueDate: new Date(formData.expiryOrRenewalDate).toISOString(),
              tpaHelpline: formData.tpaHelpline,
            }
          : undefined,
    };

    if (!user) {
      setIsAddModalOpen(false);
      openLoginModal();
      return;
    }

    const newAsset: IUniversalAsset = {
      id: `asset-${Date.now()}`,
      userId: user.id,
      title: formData.title,
      providerOrBrand: formData.providerOrBrand,
      category: formData.category,
      identifierNumber: formData.identifierNumber || undefined,
      startDate: new Date(formData.startDate).toISOString(),
      expiryOrRenewalDate: new Date(formData.expiryOrRenewalDate).toISOString(),
      validityMonths: formData.validityMonths,
      price: safePrice,
      status,
      notes: formData.notes,
      serviceMilestones,
      policyDetails:
        formData.category === 'health_insurance' ||
        formData.category === 'life_insurance'
          ? {
              policyNumber: formData.policyNumber || formData.identifierNumber || 'POL-UNKNOWN',
              sumInsured: safeSumInsured,
              premiumAmount: safePremiumAmount,
              premiumDueDate: new Date(formData.expiryOrRenewalDate).toISOString(),
              tpaHelpline: formData.tpaHelpline,
            }
          : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    void (async () => {
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
            return;
          }
        }
      } catch {
        // Fallback optimistic
      }
      addAsset(newAsset);
    })();

    setIsAddModalOpen(false);
    reset(defaultFormValues);
  }, [user, addAsset, setIsAddModalOpen, openLoginModal, milestoneIdPrefix, reset]);

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
    formData: {
      category: currentCategory,
      startDate: currentStartDate,
      validityMonths: currentValidityMonths,
      expiryOrRenewalDate: currentExpiryDate,
    },
    isSubmitting,
    isVehicle,
    isInsurance,
    currentCategory,
    currentStartDate,
    currentExpiryDate,
    currentValidityMonths,
    updateField,
    updateStartDateOrMonths,
    handleCategoryChange,
    handleNonNegativeKeyDown,
  };
}

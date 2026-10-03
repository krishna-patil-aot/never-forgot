'use client';

import { useState, useCallback, useId } from 'react';
import { z } from 'zod';
import { useAssetStore } from '@/stores/useAssetStore';
import {
  AssetCategory,
  ExpiryStatus,
  IServiceMilestone,
  IUniversalAsset,
} from '@/types/asset.types';

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
  price: z.number().optional(),
  notes: z.string().optional(),

  // Policy specific
  policyNumber: z.string().optional(),
  sumInsured: z.number().optional(),
  premiumAmount: z.number().optional(),
  tpaHelpline: z.string().optional(),
});

export type AssetFormData = z.infer<typeof assetFormSchema>;

export function useAssetOperations() {
  const addAsset = useAssetStore((state) => state.addAsset);
  const setIsAddModalOpen = useAssetStore((state) => state.setIsAddModalOpen);
  const milestoneIdPrefix = useId();

  const [formData, setFormData] = useState<AssetFormData>({
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
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-recalculate expiry date when startDate or validityMonths changes
  const updateStartDateOrMonths = useCallback(
    (startDate: string, months: number) => {
      try {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          const expiry = new Date(start);
          expiry.setMonth(expiry.getMonth() + months);
          const formattedExpiry = expiry.toISOString().split('T')[0];
          setFormData((prev) => ({
            ...prev,
            startDate,
            validityMonths: months,
            expiryOrRenewalDate: formattedExpiry,
          }));
          return;
        }
      } catch {
        // Fallback
      }
      setFormData((prev) => ({ ...prev, startDate, validityMonths: months }));
    },
    []
  );

  const updateField = useCallback(
    <K extends keyof AssetFormData>(key: K, value: AssetFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      if (formErrors[key]) {
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }
    },
    [formErrors]
  );

  const handleCategoryChange = useCallback(
    (category: AssetCategory) => {
      let defaultMonths = 12;
      if (category === 'vehicle') defaultMonths = 36;
      if (category === 'personal_doc') defaultMonths = 120; // 10 years passport

      const start = new Date(formData.startDate);
      const expiry = new Date(start);
      expiry.setMonth(expiry.getMonth() + defaultMonths);

      setFormData((prev) => ({
        ...prev,
        category,
        validityMonths: defaultMonths,
        expiryOrRenewalDate: expiry.toISOString().split('T')[0],
      }));
    },
    [formData.startDate]
  );

  const handleSubmit = useCallback((): boolean => {
    const parseResult = assetFormSchema.safeParse(formData);
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFormErrors(errors);
      return false;
    }

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

    const newAsset: IUniversalAsset = {
      id: `asset-${Date.now()}`,
      userId: 'user-default',
      title: formData.title,
      providerOrBrand: formData.providerOrBrand,
      category: formData.category,
      identifierNumber: formData.identifierNumber || undefined,
      startDate: new Date(formData.startDate).toISOString(),
      expiryOrRenewalDate: new Date(formData.expiryOrRenewalDate).toISOString(),
      validityMonths: formData.validityMonths,
      price: formData.price,
      status,
      notes: formData.notes,
      serviceMilestones,
      policyDetails:
        formData.category === 'health_insurance' ||
        formData.category === 'life_insurance'
          ? {
              policyNumber: formData.policyNumber || formData.identifierNumber || 'POL-UNKNOWN',
              sumInsured: formData.sumInsured,
              premiumAmount: formData.premiumAmount || 0,
              premiumDueDate: new Date(formData.expiryOrRenewalDate).toISOString(),
              tpaHelpline: formData.tpaHelpline,
            }
          : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addAsset(newAsset);
    setIsAddModalOpen(false);

    // Reset form
    setFormData({
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
    });
    setFormErrors({});

    return true;
  }, [formData, addAsset, setIsAddModalOpen, milestoneIdPrefix]);

  return {
    formData,
    formErrors,
    updateField,
    updateStartDateOrMonths,
    handleCategoryChange,
    handleSubmit,
  };
}

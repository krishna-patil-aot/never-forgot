'use client';

import { useEffect, useCallback } from 'react';
import { useAiScanStore } from '@/stores/useAiScanStore';
import { useAssetStore } from '@/stores/useAssetStore';
import {
  IAiExtractionResult,
  IScanPayload,
} from '@/types/ai.types';
import {
  ExpiryStatus,
  IServiceMilestone,
  IUniversalAsset,
} from '@/types/asset.types';

// Diverse AI extraction templates simulating real-world multimodal vision output
const AI_SIMULATED_TEMPLATES: IAiExtractionResult[] = [
  {
    title: 'Samsung Galaxy S24 Ultra (512GB - Titanium Gray)',
    providerOrBrand: 'Samsung Electronics',
    category: 'electronics',
    identifierNumber: 'IMEI: 359182740192837',
    startDate: '2026-03-10',
    validityMonths: 12,
    expiryOrRenewalDate: '2027-03-10',
    price: 129999,
    suggestedMilestones: null,
    policyDetails: null,
    confidenceScore: 97.4,
    rawSummary: 'Extracted from Amazon India Tax Invoice #INV-2026-88192. 1-Year Manufacturer Warranty detected.',
  },
  {
    title: 'TVS Raider 125 (Fi Wicked Black)',
    providerOrBrand: 'TVS Motor Company',
    category: 'vehicle',
    identifierNumber: 'Chassis: MD625AR76P2190',
    startDate: '2026-08-01',
    validityMonths: 60,
    expiryOrRenewalDate: '2031-08-01',
    price: 98500,
    suggestedMilestones: [
      {
        title: '1st Free Service (500km / 30 Days)',
        dueDate: '2026-09-01T00:00:00.000Z',
        isFree: true,
      },
      {
        title: '2nd Free Service (3,000km / 90 Days)',
        dueDate: '2026-11-01T00:00:00.000Z',
        isFree: true,
      },
      {
        title: '3rd Free Service (6,000km / 180 Days)',
        dueDate: '2027-02-01T00:00:00.000Z',
        isFree: true,
      },
    ],
    policyDetails: null,
    confidenceScore: 96.1,
    rawSummary: 'Vehicle Delivery Invoice parsed. 5-year standard engine warranty & 3 free service coupons extracted.',
  },
  {
    title: 'HDFC ERGO Optima Secure (Health Insurance)',
    providerOrBrand: 'HDFC ERGO General Insurance',
    category: 'health_insurance',
    identifierNumber: 'Policy No: 2805-2009-8472-00',
    startDate: '2026-01-15',
    validityMonths: 12,
    expiryOrRenewalDate: '2027-01-14',
    price: 21500,
    suggestedMilestones: null,
    policyDetails: {
      policyNumber: '2805-2009-8472-00',
      sumInsured: 1000000,
      premiumAmount: 21500,
      premiumDueDate: '2027-01-14T00:00:00.000Z',
      tpaHelpline: '1800-2666-400',
      cashlessHospitalUrl: 'https://hdfcergo.com/cashless-hospitals',
    },
    confidenceScore: 98.8,
    rawSummary: 'Health Insurance Policy Schedule extracted. Annual renewal due on Jan 14, 2027. Sum insured: ₹10 Lakhs.',
  },
];

export function useInvoiceScanner() {
  const {
    scanStatus,
    scanPayload,
    scanProgressText,
    extractedData,
    isScanModalOpen,
    isReviewModalOpen,
    errorMessage,
    setIsScanModalOpen,
    setIsReviewModalOpen,
    startScan,
    setScanningProgress,
    setScanSuccess,
    setScanError,
    updateExtractedField,
    resetScan,
  } = useAiScanStore();

  const addAsset = useAssetStore((state) => state.addAsset);

  // Process uploaded or pasted file
  const processFile = useCallback(
    (file: File) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setScanError('Please upload an image (JPG, PNG, WebP) or PDF invoice.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string | undefined;
        const payload: IScanPayload = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          dataUrl,
        };

        startScan(payload);

        // Multi-stage visual laser-scan simulation
        setTimeout(() => {
          setScanningProgress('🔍 Analyzing image and recognizing text (OCR)...');
        }, 800);

        setTimeout(() => {
          setScanningProgress('✨ Extracting product name, dates, and identifier numbers...');
        }, 1800);

        setTimeout(() => {
          setScanningProgress('🤖 Classifying category & calculating expiry timeline...');
        }, 2800);

        setTimeout(() => {
          // Pick a relevant template based on file name or rotate
          let matched = AI_SIMULATED_TEMPLATES[0];
          const nameLower = file.name.toLowerCase();
          if (nameLower.includes('bike') || nameLower.includes('vehicle') || nameLower.includes('tvs')) {
            matched = AI_SIMULATED_TEMPLATES[1];
          } else if (nameLower.includes('health') || nameLower.includes('policy') || nameLower.includes('insurance')) {
            matched = AI_SIMULATED_TEMPLATES[2];
          } else {
            // Pick based on random index for realistic variety
            const randomIndex = Math.floor(Math.random() * AI_SIMULATED_TEMPLATES.length);
            matched = AI_SIMULATED_TEMPLATES[randomIndex];
          }

          setScanSuccess({ ...matched });
          setIsScanModalOpen(false);
          setIsReviewModalOpen(true);
        }, 3600);
      };

      reader.readAsDataURL(file);
    },
    [
      startScan,
      setScanningProgress,
      setScanSuccess,
      setScanError,
      setIsScanModalOpen,
      setIsReviewModalOpen,
    ]
  );

  // Global paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setIsScanModalOpen(true);
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile, setIsScanModalOpen]);

  // Confirm and save extracted asset
  const handleConfirmAndSave = useCallback(() => {
    if (!extractedData) return;

    // Calculate status
    const expiryTime = new Date(extractedData.expiryOrRenewalDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

    let status: ExpiryStatus = 'active';
    if (diffDays < 0) {
      status = 'expired';
    } else if (diffDays <= 30) {
      status = 'expiring_soon';
    }

    const serviceMilestones: IServiceMilestone[] | undefined =
      extractedData.suggestedMilestones?.map((m, idx) => ({
        id: `ms-${Date.now()}-${idx}`,
        title: m.title,
        dueDate: m.dueDate,
        isFree: m.isFree,
        status: 'pending',
      }));

    const newAsset: IUniversalAsset = {
      id: `asset-${Date.now()}`,
      userId: 'user-default',
      title: extractedData.title,
      providerOrBrand: extractedData.providerOrBrand,
      category: extractedData.category,
      identifierNumber: extractedData.identifierNumber || undefined,
      startDate: new Date(extractedData.startDate).toISOString(),
      expiryOrRenewalDate: new Date(extractedData.expiryOrRenewalDate).toISOString(),
      validityMonths: extractedData.validityMonths,
      documentName: scanPayload?.fileName || 'scanned_invoice.pdf',
      documentUrl: scanPayload?.dataUrl,
      price: extractedData.price || undefined,
      status,
      serviceMilestones,
      policyDetails: extractedData.policyDetails || undefined,
      notes: extractedData.rawSummary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addAsset(newAsset);
    resetScan();
  }, [extractedData, scanPayload, addAsset, resetScan]);

  return {
    scanStatus,
    scanPayload,
    scanProgressText,
    extractedData,
    isScanModalOpen,
    isReviewModalOpen,
    errorMessage,
    setIsScanModalOpen,
    setIsReviewModalOpen,
    processFile,
    updateExtractedField,
    handleConfirmAndSave,
    resetScan,
  };
}

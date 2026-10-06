"use client";

import { useEffect, useCallback } from "react";
import { useAiScanStore } from "@/stores/useAiScanStore";
import { useAssetStore } from "@/stores/useAssetStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { IScanPayload } from "@/types/ai.types";
import { IUniversalAsset, IServiceMilestone } from "@/types/asset.types";
import {
  IApiResponse,
  IScanDocumentRequest,
  IScanDocumentResult,
  ICreateAssetDto,
} from "@/types/api.types";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function useInvoiceScanner() {
  const {
    scanStatus,
    scanPayload,
    scanProgressText,
    extractedData,
    isScanModalOpen,
    isReviewModalOpen,
    errorMessage,
    isDragOver,
    setIsDragOver,
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
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  // Process uploaded or pasted file via backend /api/scan route
  const processFile = useCallback(
    (file: File) => {
      if (!user) {
        setIsScanModalOpen(false);
        openLoginModal();
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setScanError("Please upload an image (JPG, PNG, WebP) or PDF file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string | undefined;
        const payload: IScanPayload = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          dataUrl,
        };

        // Upload to Cloudinary CDN in parallel
        void uploadToCloudinary(file, file.name).then((cloudRes) => {
          if (cloudRes?.secureUrl) {
            payload.cloudinaryUrl = cloudRes.secureUrl;
          }
        });

        startScan(payload);

        // Progress micro-steps
        setScanningProgress("🔍 Analyzing image and recognizing text (OCR)...");

        setTimeout(() => {
          setScanningProgress(
            "✨ Extracting product name, dates, and identifier numbers...",
          );
        }, 600);

        setTimeout(() => {
          setScanningProgress(
            "🤖 Classifying category & calculating expiry timeline...",
          );
        }, 1200);

        try {
          const scanReq: IScanDocumentRequest = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            dataUrl,
          };

          const res = await fetch("/api/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(scanReq),
          });

          if (!res.ok) {
            throw new Error(`Server returned HTTP ${res.status}`);
          }

          const json: IApiResponse<IScanDocumentResult> =
            (await res.json()) as IApiResponse<IScanDocumentResult>;

          if (json.success && json.data) {
            setScanSuccess({ ...json.data.extraction });
            setIsScanModalOpen(false);
            setIsReviewModalOpen(true);
          } else {
            throw new Error(
              json.error || "Failed to extract document information",
            );
          }
        } catch (scanErr) {
          const msg =
            scanErr instanceof Error ? scanErr.message : "Scan error occurred";
          setScanError(`Scan failed: ${msg}. Please try again.`);
        }
      };

      reader.readAsDataURL(file);
    },
    [
      user,
      openLoginModal,
      startScan,
      setScanningProgress,
      setScanSuccess,
      setScanError,
      setIsScanModalOpen,
      setIsReviewModalOpen,
    ],
  );

  // Auto-dismiss scan and review modals if session is not authenticated
  useEffect(() => {
    if ((isScanModalOpen || isReviewModalOpen) && !user) {
      setIsScanModalOpen(false);
      setIsReviewModalOpen(false);
      openLoginModal();
    }
  }, [
    isScanModalOpen,
    isReviewModalOpen,
    user,
    setIsScanModalOpen,
    setIsReviewModalOpen,
    openLoginModal,
  ]);

  // Global paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      if (!user) {
        openLoginModal();
        return;
      }

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setIsScanModalOpen(true);
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [processFile, setIsScanModalOpen, user, openLoginModal]);

  const handleNonNegativeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    },
    []
  );

  const handlePriceChange = useCallback(
    (value: string) => {
      if (value === '') {
        updateExtractedField('price', null);
      } else {
        const num = Number(value);
        updateExtractedField('price', isNaN(num) ? null : Math.max(0, num));
      }
    },
    [updateExtractedField]
  );

  // Confirm and persist scanned asset to backend database
  const handleConfirmAndSave = useCallback(async () => {
    if (!extractedData) return;

    const safePrice =
      extractedData.price !== undefined && extractedData.price !== null
        ? Math.max(0, extractedData.price)
        : undefined;

    const createDto: ICreateAssetDto = {
      title: extractedData.title,
      providerOrBrand: extractedData.providerOrBrand,
      category: extractedData.category,
      identifierNumber: extractedData.identifierNumber || undefined,
      startDate: new Date(extractedData.startDate).toISOString(),
      expiryOrRenewalDate: new Date(
        extractedData.expiryOrRenewalDate,
      ).toISOString(),
      validityMonths: extractedData.validityMonths,
      documentName: scanPayload?.fileName || "scanned_invoice.pdf",
      documentUrl: scanPayload?.cloudinaryUrl || scanPayload?.dataUrl,
      price: safePrice,
      notes: extractedData.rawSummary,
      serviceMilestones: extractedData.suggestedMilestones?.map((m) => ({
        title: m.title,
        dueDate: m.dueDate,
        isFree: m.isFree,
        status: "pending",
      })),
      policyDetails: extractedData.policyDetails
        ? {
            policyNumber: extractedData.policyDetails.policyNumber,
            sumInsured: extractedData.policyDetails.sumInsured,
            premiumAmount: extractedData.policyDetails.premiumAmount,
            premiumDueDate: extractedData.policyDetails.premiumDueDate,
            tpaHelpline: extractedData.policyDetails.tpaHelpline,
            cashlessHospitalUrl:
              extractedData.policyDetails.cashlessHospitalUrl,
          }
        : undefined,
    };

    const fallbackMilestones: IServiceMilestone[] | undefined =
      extractedData.suggestedMilestones?.map((m, idx) => ({
        id: `ms-local-${Date.now()}-${idx}`,
        title: m.title,
        dueDate: m.dueDate,
        isFree: m.isFree,
        status: "pending",
      }));

    if (!user) {
      setIsReviewModalOpen(false);
      openLoginModal();
      return;
    }

    const fallbackAsset: IUniversalAsset = {
      id: `asset-${Date.now()}`,
      userId: user.id,
      title: createDto.title,
      providerOrBrand: createDto.providerOrBrand,
      category: createDto.category,
      identifierNumber: createDto.identifierNumber,
      startDate: createDto.startDate,
      expiryOrRenewalDate: createDto.expiryOrRenewalDate,
      validityMonths: createDto.validityMonths,
      documentName: createDto.documentName,
      documentUrl: createDto.documentUrl,
      price: createDto.price,
      status: "active",
      notes: createDto.notes,
      serviceMilestones: fallbackMilestones,
      policyDetails: createDto.policyDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createDto),
      });

      if (res.ok) {
        const json: IApiResponse<IUniversalAsset> =
          (await res.json()) as IApiResponse<IUniversalAsset>;
        if (json.success && json.data) {
          addAsset(json.data);
        } else {
          addAsset(fallbackAsset);
        }
      } else {
        addAsset(fallbackAsset);
      }
    } catch {
      addAsset(fallbackAsset);
    }

    resetScan();
    setIsReviewModalOpen(false);
  }, [
    extractedData,
    scanPayload,
    addAsset,
    resetScan,
    setIsReviewModalOpen,
    openLoginModal,
    user,
  ]);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    [setIsDragOver],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, [setIsDragOver]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [setIsDragOver, processFile],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
      }
    },
    [processFile],
  );

  return {
    scanStatus,
    scanPayload,
    scanProgressText,
    extractedData,
    isScanModalOpen,
    isReviewModalOpen,
    errorMessage,
    isDragOver,
    setIsScanModalOpen,
    setIsReviewModalOpen,
    processFile,
    updateExtractedField,
    handleConfirmAndSave,
    resetScan,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleNonNegativeKeyDown,
    handlePriceChange,
  };
}

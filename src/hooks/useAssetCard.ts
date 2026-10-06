'use client';

import { useMemo, useCallback } from 'react';
import {
  ShieldCheck,
  Wrench,
  HeartHandshake,
  CheckCircle2,
  FileText,
  LucideIcon,
} from 'lucide-react';
import { useAssetStore } from '@/stores/useAssetStore';
import { IUniversalAsset } from '@/types/asset.types';

export interface ICategoryStyleConfig {
  icon: LucideIcon;
  label: string;
  gradientBar: string;
  accentText: string;
  accentBg: string;
  chipBg: string;
  passType: string;
}

export interface IUseAssetCardReturn {
  percentageElapsed: number;
  diffDays: number;
  catDetails: ICategoryStyleConfig;
  isInsurance: boolean;
  hasMilestones: boolean;
  handleOpenDetails: () => void;
  handleDelete: (e: React.MouseEvent) => void;
}

export function useAssetCard(asset: IUniversalAsset): IUseAssetCardReturn {
  const setSelectedAssetId = useAssetStore((state) => state.setSelectedAssetId);
  const setIsDetailsModalOpen = useAssetStore((state) => state.setIsDetailsModalOpen);
  const deleteAsset = useAssetStore((state) => state.deleteAsset);

  // Calculate percentage of elapsed warranty time
  const { percentageElapsed, diffDays } = useMemo(() => {
    const startDate = new Date(asset.startDate).getTime();
    const expiryDate = new Date(asset.expiryOrRenewalDate).getTime();
    const now = new Date().getTime();
    const totalDuration = Math.max(1, expiryDate - startDate);
    const elapsed = Math.max(0, now - startDate);
    const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
    const days = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    return { percentageElapsed: pct, diffDays: days };
  }, [asset.startDate, asset.expiryOrRenewalDate]);

  const catDetails: ICategoryStyleConfig = useMemo(() => {
    switch (asset.category) {
      case 'electronics':
        return {
          icon: ShieldCheck,
          label: 'Electronics',
          gradientBar: 'from-cyan-600 via-teal-600 to-cyan-500',
          accentText: 'text-cyan-700',
          accentBg: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
          chipBg: 'bg-cyan-50 text-cyan-800',
          passType: 'Electronics',
        };
      case 'vehicle':
        return {
          icon: Wrench,
          label: 'Vehicle',
          gradientBar: 'from-amber-500 via-orange-500 to-yellow-500',
          accentText: 'text-amber-600',
          accentBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
          chipBg: 'bg-amber-50 text-amber-700',
          passType: 'Vehicle',
        };
      case 'health_insurance':
      case 'life_insurance':
        return {
          icon: HeartHandshake,
          label: 'Insurance',
          gradientBar: 'from-purple-600 via-pink-600 to-indigo-600',
          accentText: 'text-purple-600',
          accentBg: 'bg-purple-50 text-purple-800 border-purple-200/80',
          chipBg: 'bg-purple-50 text-purple-700',
          passType: 'Health Policy Pass',
        };
      case 'home_amc':
        return {
          icon: CheckCircle2,
          label: 'Home AMC',
          gradientBar: 'from-teal-500 via-emerald-500 to-cyan-500',
          accentText: 'text-teal-600',
          accentBg: 'bg-teal-50 text-teal-800 border-teal-200/80',
          chipBg: 'bg-teal-50 text-teal-700',
          passType: 'Home AMC Pass',
        };
      default:
        return {
          icon: FileText,
          label: 'Document',
          gradientBar: 'from-slate-500 via-slate-600 to-blue-500',
          accentText: 'text-slate-600',
          accentBg: 'bg-slate-100 text-slate-800 border-slate-200',
          chipBg: 'bg-slate-100 text-slate-700',
          passType: 'Registered Document',
        };
    }
  }, [asset.category]);

  const isInsurance =
    asset.category === 'health_insurance' || asset.category === 'life_insurance';
  const hasMilestones =
    Boolean(asset.serviceMilestones && asset.serviceMilestones.length > 0);

  const handleOpenDetails = useCallback(() => {
    setSelectedAssetId(asset.id);
    setIsDetailsModalOpen(true);
  }, [asset.id, setSelectedAssetId, setIsDetailsModalOpen]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteAsset(asset.id);
    },
    [asset.id, deleteAsset]
  );

  return {
    percentageElapsed,
    diffDays,
    catDetails,
    isInsurance,
    hasMilestones,
    handleOpenDetails,
    handleDelete,
  };
}

'use client';

import { create } from 'zustand';
import {
  AssetCategory,
  ExpiryStatus,
  IAssetFilter,
  IUniversalAsset,
  SortOption,
} from '@/types/asset.types';

// Initial realistic mock data covering all 5 categories
const INITIAL_ASSETS: IUniversalAsset[] = [
  {
    id: 'asset-1',
    userId: 'user-default',
    title: 'Apple iPhone 15 Pro (256GB - Natural Titanium)',
    providerOrBrand: 'Apple',
    category: 'electronics',
    identifierNumber: 'IMEI: 354892019482910',
    startDate: '2025-10-15T00:00:00.000Z',
    expiryOrRenewalDate: '2026-10-15T00:00:00.000Z',
    validityMonths: 12,
    documentName: 'apple_store_invoice_15pro.pdf',
    price: 134900,
    status: 'expiring_soon',
    notes: 'Covered under Apple 1-Year Limited Hardware Warranty.',
    createdAt: '2025-10-15T12:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'asset-2',
    userId: 'user-default',
    title: 'Royal Enfield Hunter 350 (Dapper Ash)',
    providerOrBrand: 'Royal Enfield',
    category: 'vehicle',
    identifierNumber: 'Reg: MH 12 AB 4590',
    startDate: '2026-06-01T00:00:00.000Z',
    expiryOrRenewalDate: '2029-06-01T00:00:00.000Z',
    validityMonths: 36,
    documentName: 'royal_enfield_rc_book.pdf',
    price: 174000,
    status: 'active',
    serviceMilestones: [
      {
        id: 'srv-1',
        title: '1st Free Service (500km / 45 Days)',
        dueDate: '2026-07-15T00:00:00.000Z',
        isFree: true,
        status: 'completed',
        cost: 0,
        notes: 'Engine oil replaced, chain tension checked at Authorized RE service center.',
      },
      {
        id: 'srv-2',
        title: '2nd Free Service (5,000km / 180 Days)',
        dueDate: '2026-11-28T00:00:00.000Z',
        isFree: true,
        status: 'pending',
        cost: 0,
        notes: 'General checkup, spark plug cleaning, free labor.',
      },
      {
        id: 'srv-3',
        title: '3rd Free Service (10,000km / 365 Days)',
        dueDate: '2027-05-30T00:00:00.000Z',
        isFree: true,
        status: 'pending',
        cost: 0,
      },
    ],
    notes: 'Free roadside assistance valid until June 2027.',
    createdAt: '2026-06-01T10:00:00.000Z',
    updatedAt: '2026-07-15T15:00:00.000Z',
  },
  {
    id: 'asset-3',
    userId: 'user-default',
    title: 'Star Health Optima Secure (Family Floater)',
    providerOrBrand: 'Star Health Insurance',
    category: 'health_insurance',
    identifierNumber: 'Policy: SH-2024-894721',
    startDate: '2025-11-20T00:00:00.000Z',
    expiryOrRenewalDate: '2026-11-19T00:00:00.000Z',
    validityMonths: 12,
    documentName: 'star_health_policy_schedule.pdf',
    status: 'expiring_soon',
    policyDetails: {
      policyNumber: 'SH-2024-894721',
      sumInsured: 1500000,
      premiumAmount: 24500,
      premiumDueDate: '2026-11-19T00:00:00.000Z',
      tpaHelpline: '1800-425-2255',
      cashlessHospitalUrl: 'https://starhealth.in/network-hospitals',
    },
    notes: 'No-claim bonus active. Grace period is 30 days after due date.',
    createdAt: '2025-11-20T09:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'asset-4',
    userId: 'user-default',
    title: 'Kent Grand Plus RO Water Purifier',
    providerOrBrand: 'Kent RO Systems',
    category: 'home_amc',
    identifierNumber: 'AMC ID: KNT-AMC-9812',
    startDate: '2026-04-10T00:00:00.000Z',
    expiryOrRenewalDate: '2027-04-09T00:00:00.000Z',
    validityMonths: 12,
    documentName: 'kent_amc_contract.pdf',
    price: 4800,
    status: 'active',
    serviceMilestones: [
      {
        id: 'srv-k1',
        title: 'Carbon & Sediment Filter Replacement',
        dueDate: '2026-10-10T00:00:00.000Z',
        isFree: true,
        status: 'pending',
        notes: 'Pre-paid under annual maintenance contract.',
      },
    ],
    notes: 'Includes 3 mandatory visits per year.',
    createdAt: '2026-04-10T14:00:00.000Z',
    updatedAt: '2026-04-10T14:00:00.000Z',
  },
  {
    id: 'asset-5',
    userId: 'user-default',
    title: 'Sony Bravia 55-inch 4K Google TV (X82L)',
    providerOrBrand: 'Sony Electronics',
    category: 'electronics',
    identifierNumber: 'Serial: SN-492817260',
    startDate: '2024-03-01T00:00:00.000Z',
    expiryOrRenewalDate: '2025-03-01T00:00:00.000Z',
    validityMonths: 12,
    documentName: 'croma_invoice_sony_tv.pdf',
    price: 68990,
    status: 'expired',
    notes: 'Comprehensive warranty expired. Consider 3rd-party extended cover.',
    createdAt: '2024-03-01T18:00:00.000Z',
    updatedAt: '2025-03-02T00:00:00.000Z',
  },
  {
    id: 'asset-6',
    userId: 'user-default',
    title: 'Apple MacBook Pro 14" (M3 Pro - 18GB/512GB)',
    providerOrBrand: 'Apple',
    category: 'electronics',
    identifierNumber: 'Serial: C02GL480MD6R',
    startDate: '2026-01-10T00:00:00.000Z',
    expiryOrRenewalDate: '2027-01-09T00:00:00.000Z',
    validityMonths: 12,
    documentName: 'apple_macbook_receipt.pdf',
    price: 199900,
    status: 'active',
    notes: 'Covered under AppleCare+ with accidental damage protection.',
    createdAt: '2026-01-10T11:00:00.000Z',
    updatedAt: '2026-01-10T11:00:00.000Z',
  },
  {
    id: 'asset-7',
    userId: 'user-default',
    title: 'Honda City ZX e:HEV Hybrid (Lunar Silver)',
    providerOrBrand: 'Honda Motors',
    category: 'vehicle',
    identifierNumber: 'Reg: MH 12 PQ 8899',
    startDate: '2025-08-20T00:00:00.000Z',
    expiryOrRenewalDate: '2028-08-19T00:00:00.000Z',
    validityMonths: 36,
    documentName: 'honda_warranty_booklet.pdf',
    price: 2050000,
    status: 'active',
    serviceMilestones: [
      {
        id: 'srv-h1',
        title: '20,000km Major Periodic Service',
        dueDate: '2026-11-15T00:00:00.000Z',
        isFree: true,
        status: 'pending',
        cost: 0,
        notes: 'Includes synthetic oil change and hybrid battery health check.',
      },
    ],
    notes: 'Extended powertrain warranty up to 5 years.',
    createdAt: '2025-08-20T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 'asset-8',
    userId: 'user-default',
    title: 'HDFC ERGO Drive Safe Comprehensive Car Insurance',
    providerOrBrand: 'HDFC ERGO',
    category: 'health_insurance',
    identifierNumber: 'Policy: HDFC-CAR-2024-9012',
    startDate: '2025-10-25T00:00:00.000Z',
    expiryOrRenewalDate: '2026-10-24T00:00:00.000Z',
    validityMonths: 12,
    documentName: 'hdfc_ergo_policy_schedule.pdf',
    price: 32000,
    status: 'expiring_soon',
    policyDetails: {
      policyNumber: 'HDFC-CAR-2024-9012',
      sumInsured: 1850000,
      premiumAmount: 32000,
      premiumDueDate: '2026-10-24T00:00:00.000Z',
      tpaHelpline: '1800-2666-400',
    },
    notes: 'Zero depreciation + engine protect add-on active.',
    createdAt: '2025-10-25T14:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'asset-9',
    userId: 'user-default',
    title: 'Dyson V12 Detect Slim Cordless Vacuum Cleaner',
    providerOrBrand: 'Dyson India',
    category: 'electronics',
    identifierNumber: 'Serial: DYS-V12-984120',
    startDate: '2025-05-15T00:00:00.000Z',
    expiryOrRenewalDate: '2027-05-14T00:00:00.000Z',
    validityMonths: 24,
    documentName: 'dyson_official_invoice.pdf',
    price: 52900,
    status: 'active',
    notes: '2-year standard Dyson manufacturer warranty.',
    createdAt: '2025-05-15T16:00:00.000Z',
    updatedAt: '2025-05-15T16:00:00.000Z',
  },
  {
    id: 'asset-10',
    userId: 'user-default',
    title: 'Voltas 1.5 Ton 5-Star Inverter AC Annual AMC',
    providerOrBrand: 'Voltas Limited',
    category: 'home_amc',
    identifierNumber: 'AMC: VLT-AMC-7731',
    startDate: '2026-03-01T00:00:00.000Z',
    expiryOrRenewalDate: '2027-02-28T00:00:00.000Z',
    validityMonths: 12,
    documentName: 'voltas_amc_contract.pdf',
    price: 3600,
    status: 'active',
    serviceMilestones: [
      {
        id: 'srv-v1',
        title: 'Pre-Summer Deep Jet Cleaning & Gas Check',
        dueDate: '2027-01-15T00:00:00.000Z',
        isFree: true,
        status: 'pending',
      },
    ],
    notes: '2 wet services and unlimited breakdown calls included.',
    createdAt: '2026-03-01T12:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 'asset-11',
    userId: 'user-default',
    title: 'Samsung Galaxy Watch 6 Classic (47mm Bluetooth)',
    providerOrBrand: 'Samsung',
    category: 'electronics',
    identifierNumber: 'IMEI: 358912048192831',
    startDate: '2025-12-01T00:00:00.000Z',
    expiryOrRenewalDate: '2026-11-30T00:00:00.000Z',
    validityMonths: 12,
    documentName: 'samsung_store_invoice.pdf',
    price: 36999,
    status: 'expiring_soon',
    notes: 'Comprehensive Samsung Care warranty.',
    createdAt: '2025-12-01T09:00:00.000Z',
    updatedAt: '2025-12-01T09:00:00.000Z',
  },
  {
    id: 'asset-12',
    userId: 'user-default',
    title: 'Republic of India Passport & 10-Yr US B1/B2 Visa',
    providerOrBrand: 'Passport Seva / US Embassy',
    category: 'personal_doc',
    identifierNumber: 'Doc No: Z5928172',
    startDate: '2024-06-15T00:00:00.000Z',
    expiryOrRenewalDate: '2034-06-14T00:00:00.000Z',
    validityMonths: 120,
    documentName: 'passport_scan_copy.pdf',
    status: 'active',
    notes: 'Keep renewal reminder set 9 months prior to expiry.',
    createdAt: '2024-06-15T10:00:00.000Z',
    updatedAt: '2024-06-15T10:00:00.000Z',
  },
];

interface AssetState {
  assets: IUniversalAsset[];
  filter: IAssetFilter;
  selectedAssetId: string | null;
  isAddModalOpen: boolean;
  isDetailsModalOpen: boolean;

  // Actions
  setFilterCategory: (category: AssetCategory | 'all') => void;
  setFilterStatus: (status: ExpiryStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  setSelectedAssetId: (id: string | null) => void;
  setIsAddModalOpen: (open: boolean) => void;
  setIsDetailsModalOpen: (open: boolean) => void;

  // Asset CRUD
  addAsset: (asset: IUniversalAsset) => void;
  updateAsset: (id: string, updated: Partial<IUniversalAsset>) => void;
  deleteAsset: (id: string) => void;
  toggleMilestoneStatus: (assetId: string, milestoneId: string) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  assets: INITIAL_ASSETS,
  filter: {
    category: 'all',
    status: 'all',
    searchQuery: '',
    sortBy: 'expiry_asc',
  },
  selectedAssetId: null,
  isAddModalOpen: false,
  isDetailsModalOpen: false,

  setFilterCategory: (category) =>
    set((state) => ({ filter: { ...state.filter, category } })),

  setFilterStatus: (status) =>
    set((state) => ({ filter: { ...state.filter, status } })),

  setSearchQuery: (searchQuery) =>
    set((state) => ({ filter: { ...state.filter, searchQuery } })),

  setSortBy: (sortBy) =>
    set((state) => ({ filter: { ...state.filter, sortBy } })),

  setSelectedAssetId: (selectedAssetId) => set({ selectedAssetId }),
  setIsAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
  setIsDetailsModalOpen: (isDetailsModalOpen) => set({ isDetailsModalOpen }),

  addAsset: (newAsset) =>
    set((state) => ({ assets: [newAsset, ...state.assets] })),

  updateAsset: (id, updated) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id
          ? { ...asset, ...updated, updatedAt: new Date().toISOString() }
          : asset
      ),
    })),

  deleteAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((asset) => asset.id !== id),
      selectedAssetId:
        state.selectedAssetId === id ? null : state.selectedAssetId,
    })),

  toggleMilestoneStatus: (assetId, milestoneId) =>
    set((state) => ({
      assets: state.assets.map((asset) => {
        if (asset.id !== assetId || !asset.serviceMilestones) return asset;
        return {
          ...asset,
          serviceMilestones: asset.serviceMilestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  status:
                    m.status === 'completed'
                      ? 'pending'
                      : ('completed' as const),
                }
              : m
          ),
          updatedAt: new Date().toISOString(),
        };
      }),
    })),
}));

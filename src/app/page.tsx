'use client';

import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ShieldCheck, CreditCard } from 'lucide-react';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { CategoryFilterBar } from '@/components/dashboard/CategoryFilterBar';
import { AssetCard } from '@/components/assets/AssetCard';
import { AssetEmptyState } from '@/components/assets/AssetEmptyState';
import { PaginationControls } from '@/components/dashboard/PaginationControls';
import { AiScanModal } from '@/components/scanner/AiScanModal';
import { AiReviewModal } from '@/components/scanner/AiReviewModal';
import { AssetFormModal } from '@/components/assets/AssetFormModal';
import { AssetDetailsModal } from '@/components/assets/AssetDetailsModal';
import { DeleteConfirmModal } from '@/components/assets/DeleteConfirmModal';
import { AboutSection } from '@/components/about/AboutSection';
import { EmiSection } from '@/components/emi/EmiSection';
import { useFilterAndSearch } from '@/hooks/useFilterAndSearch';
import { usePagination } from '@/hooks/usePagination';
import { useAssetApi } from '@/hooks/useAssetApi';
import { useNotificationApi } from '@/hooks/useNotificationApi';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { useConsumerLayout } from '@/hooks/useSidebar';
import { useEmiApi } from '@/hooks/useEmiApi';
import { useEmiMetrics } from '@/hooks/useEmiMetrics';

export function VaultDashboardPage() {
  useAssetApi();
  useNotificationApi();
  const { emis } = useEmiApi();
  const emiMetrics = useEmiMetrics();

  const { isAuthenticated, openLoginModal, openRegisterModal } = useAuth();
  const { filteredAssets, totalFilteredCount } = useFilterAndSearch();
  const { handleOpenAddModal, handleOpenScanModal } = useProtectedAction();
  const { activeTab, setActiveTab } = useConsumerLayout();

  const activeView: 'vault' | 'emi' = activeTab === 'emi' ? 'emi' : 'vault';

  const handleSelectView = (view: 'vault' | 'emi') => {
    setActiveTab(view);
  };

  // Dynamic pagination hook to cleanly handle products
  const pagination = usePagination(totalFilteredCount, 6);

  // Slice paginated assets cleanly
  const paginatedAssets = React.useMemo(() => {
    return filteredAssets.slice(pagination.startIndex, pagination.endIndex);
  }, [filteredAssets, pagination.startIndex, pagination.endIndex]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Main View Switcher: Warranties & Bills vs EMI Loans */}
      <div className="flex items-center justify-center p-1.5 bg-slate-200/70 rounded-2xl sm:rounded-3xl max-w-md mx-auto border border-slate-300/80 shadow-2xs">
        <button
          type="button"
          onClick={() => handleSelectView('vault')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeView === 'vault'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-cyan-600" />
          <span>Warranties & Bills</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {totalFilteredCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectView('emi')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeView === 'emi'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="h-4 w-4 text-teal-600" />
          <span>EMI Loans</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {emis.length}
          </span>
          {emiMetrics.urgentDueCount > 0 && (
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
      </div>

      {activeView === 'vault' ? (
        <>
          {/* Metrics Row */}
          <MetricCards />

          {/* Search & Filter Toolbar */}
          <CategoryFilterBar matchingCount={totalFilteredCount} />

          {/* Asset Grid */}
          {totalFilteredCount === 0 ? (
            <AssetEmptyState
              isAuthenticated={isAuthenticated}
              onOpenLogin={openLoginModal}
              onOpenRegister={openRegisterModal}
              onOpenScan={handleOpenScanModal}
              onOpenAdd={handleOpenAddModal}
            />
          ) : (
            <div id="asset-vault-grid" className="space-y-6 scroll-mt-20">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 items-stretch">
                <AnimatePresence mode="popLayout">
                  {paginatedAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              <PaginationControls pagination={pagination} />
            </div>
          )}
        </>
      ) : (
        /* Dedicated EMI & Loan Reminders Section */
        <EmiSection />
      )}

      {/* About Section */}
      <AboutSection />

      {/* Dialog Modals */}
      <AiScanModal />
      <AiReviewModal />
      <AssetFormModal />
      <AssetDetailsModal />
      <DeleteConfirmModal />
    </div>
  );
}

export default VaultDashboardPage;

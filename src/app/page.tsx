'use client';

import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { CategoryFilterBar } from '@/components/dashboard/CategoryFilterBar';
import { AssetCard } from '@/components/assets/AssetCard';
import { AssetEmptyState } from '@/components/assets/AssetEmptyState';
import { PaginationControls } from '@/components/dashboard/PaginationControls';
import { AiScanModal } from '@/components/scanner/AiScanModal';
import { AiReviewModal } from '@/components/scanner/AiReviewModal';
import { AddAssetModal } from '@/components/assets/AddAssetModal';
import { AssetDetailsModal } from '@/components/assets/AssetDetailsModal';
import { DeleteConfirmModal } from '@/components/assets/DeleteConfirmModal';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { AboutSection } from '@/components/about/AboutSection';
import { useFilterAndSearch } from '@/hooks/useFilterAndSearch';
import { usePagination } from '@/hooks/usePagination';
import { useAssetApi } from '@/hooks/useAssetApi';
import { useNotificationApi } from '@/hooks/useNotificationApi';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedAction } from '@/hooks/useProtectedAction';

export function VaultDashboardPage() {
  useAssetApi();
  useNotificationApi();

  const { isAuthenticated, openLoginModal, openRegisterModal } = useAuth();
  const { filteredAssets, totalFilteredCount } = useFilterAndSearch();
  const { handleOpenAddModal, handleOpenScanModal } = useProtectedAction();

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

      {/* About Section */}
      <AboutSection />

      {/* Dialog Modals */}
      <AiScanModal />
      <AiReviewModal />
      <AddAssetModal />
      <AssetDetailsModal />
      <DeleteConfirmModal />
      <NotificationDrawer />
    </div>
  );
}

export default VaultDashboardPage;

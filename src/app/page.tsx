'use client';

import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, ScanLine, Inbox, ShieldCheck, LogIn, Sparkles } from 'lucide-react';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { CategoryFilterBar } from '@/components/dashboard/CategoryFilterBar';
import { AssetCard } from '@/components/assets/AssetCard';
import { PaginationControls } from '@/components/dashboard/PaginationControls';
import { AiScanModal } from '@/components/scanner/AiScanModal';
import { AiReviewModal } from '@/components/scanner/AiReviewModal';
import { AddAssetModal } from '@/components/assets/AddAssetModal';
import { AssetDetailsModal } from '@/components/assets/AssetDetailsModal';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { AboutSection } from '@/components/about/AboutSection';
import { Button } from '@/components/ui/button';
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
        <div className="py-14 sm:py-16 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-white shadow-2xs flex flex-col items-center justify-center p-6 space-y-4">
          <div className="h-16 w-16 rounded-3xl bg-cyan-50 border border-cyan-150 flex items-center justify-center text-cyan-700 shadow-2xs">
            {isAuthenticated ? <Inbox className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
          </div>

          <div className="space-y-1.5 max-w-md">
            <h4 className="font-extrabold text-base sm:text-lg text-slate-800 tracking-tight">
              {isAuthenticated
                ? "You haven't added any items yet"
                : 'Sign in to save and see your bills'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAuthenticated
                ? 'No bills, warranties, or service dates added yet. Add your first item manually or take a quick photo of your receipt.'
                : 'Sign in with Google or email code to save your items and get timely reminders across all your devices.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs font-bold h-10 px-5 rounded-xl shadow-xs bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                  onClick={handleOpenScanModal}
                >
                  <ScanLine className="h-3.5 w-3.5 mr-1.5" />
                  Scan a Bill
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold h-10 px-4 rounded-xl border-slate-200 cursor-pointer hover:bg-slate-50"
                  onClick={handleOpenAddModal}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5 text-cyan-700" />
                  Add Manually
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs font-bold h-10 px-5 rounded-xl shadow-xs bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                  onClick={openLoginModal}
                >
                  <LogIn className="h-3.5 w-3.5 mr-1.5" />
                  Sign In with Google / Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold h-10 px-4 rounded-xl border-slate-200 cursor-pointer hover:bg-slate-50"
                  onClick={openRegisterModal}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-cyan-700" />
                  Create Free Account
                </Button>
              </>
            )}
          </div>
        </div>
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
      <NotificationDrawer />
    </div>
  );
}

export default VaultDashboardPage;

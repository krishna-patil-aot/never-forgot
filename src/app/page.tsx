'use client';

import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, ScanLine, Inbox } from 'lucide-react';
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
import { useAssetStore } from '@/stores/useAssetStore';
import { useAiScanStore } from '@/stores/useAiScanStore';

export function VaultDashboardPage() {
  const { filteredAssets, totalFilteredCount } = useFilterAndSearch();
  const setIsAddModalOpen = useAssetStore((state) => state.setIsAddModalOpen);
  const setIsScanModalOpen = useAiScanStore((state) => state.setIsScanModalOpen);

  // Dynamic pagination hook to cleanly handle 10, 50, 100+ products
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

      {/* Airbnb / App Store Style Search & Filter Toolbar */}
      <CategoryFilterBar matchingCount={totalFilteredCount} />

      {/* Dynamic Asset Grid */}
      {totalFilteredCount === 0 ? (
        <div className="py-16 sm:py-20 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white shadow-2xs flex flex-col items-center justify-center p-6 space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Inbox className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="font-bold text-base text-slate-800">
              No matching passes found
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No registered warranties, policies, or service schedules match your current search or category filter.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold h-9 px-4 rounded-xl"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Manually
            </Button>
            <Button
              variant="default"
              size="sm"
              className="text-xs font-semibold h-9 px-4 rounded-xl shadow-xs"
              onClick={() => setIsScanModalOpen(true)}
            >
              <ScanLine className="h-3.5 w-3.5 mr-1" />
              Scan with AI
            </Button>
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

          {/* Dynamic Pagination Controls for 100+ Products */}
          <PaginationControls pagination={pagination} />
        </div>
      )}

      {/* About Application Section */}
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

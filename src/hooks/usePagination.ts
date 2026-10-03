'use client';

import { useState, useMemo, useCallback } from 'react';
import { IPaginationControls } from '@/types/pagination.types';

export function usePagination(
  totalItems: number,
  initialPageSize: number = 6
): IPaginationControls {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Derive safe page index directly without triggering cascading re-renders
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const goToPage = useCallback(
    (page: number) => {
      const target = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(target);
      // Smooth scroll back to asset grid when navigating pages
      const gridElem = document.getElementById('asset-vault-grid');
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (safeCurrentPage < totalPages) {
      goToPage(safeCurrentPage + 1);
    }
  }, [safeCurrentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (safeCurrentPage > 1) {
      goToPage(safeCurrentPage - 1);
    }
  }, [safeCurrentPage, goToPage]);

  const setPageSize = useCallback((newSize: number) => {
    setPageSizeState(newSize);
    setCurrentPage(1);
  }, []);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const canPrevPage = safeCurrentPage > 1;
  const canNextPage = safeCurrentPage < totalPages;

  // Generate smart pagination numbers with ellipsis for 100+ items
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always include first page
    pages.push(1);

    if (safeCurrentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, safeCurrentPage - 1);
    const end = Math.min(totalPages - 1, safeCurrentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safeCurrentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    // Always include last page
    pages.push(totalPages);

    return pages;
  }, [safeCurrentPage, totalPages]);

  return {
    currentPage: safeCurrentPage,
    pageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    canPrevPage,
    canNextPage,
    pageNumbers,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  };
}

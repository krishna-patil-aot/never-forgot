'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IPaginationControls } from '@/types/pagination.types';

interface PaginationControlsProps {
  pagination: IPaginationControls;
}

export function PaginationControls({ pagination }: PaginationControlsProps) {
  const {
    currentPage,
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
  } = pagination;

  if (totalItems === 0) return null;

  return (
    <div className="pt-5 pb-2 border-t border-slate-200/80 mt-6 select-none space-y-3">
      {/* Primary Navigation Row: Full-width, single row, thumb-friendly on mobile */}
      <div className="flex items-center justify-between gap-2.5">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={!canPrevPage}
          className="h-10 px-3 sm:px-4 rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Mobile Page Indicator Pill: Clean, balanced, never stacked awkwardly */}
        <div className="sm:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-800 shadow-2xs">
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {/* Desktop Page Numbers: [1] [2] [3] */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === 'ellipsis') {
              return (
                <div
                  key={`ellipsis-${idx}`}
                  className="h-10 w-8 flex items-center justify-center text-slate-400"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <Button
                key={p}
                variant={isCurrent ? 'default' : 'outline'}
                size="sm"
                onClick={() => goToPage(p)}
                className={`h-10 w-10 p-0 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
                aria-label={`Page ${p}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {p}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={!canNextPage}
          className="h-10 px-3 sm:px-4 rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Meta Bar: Clean summary & Page Size selector on a single balanced line */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing{' '}
          <span className="font-extrabold text-slate-800">
            {totalItems > 0 ? startIndex + 1 : 0}–{endIndex}
          </span>{' '}
          of <span className="font-extrabold text-slate-800">{totalItems}</span> passes
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 hidden sm:inline text-[11px]">Show:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => setPageSize(Number(val))}
          >
            <SelectTrigger className="w-[88px] h-8 rounded-lg border-slate-200/90 bg-white text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200/90 bg-white shadow-xl">
              <SelectItem value="6" className="text-xs font-semibold cursor-pointer">
                6 / page
              </SelectItem>
              <SelectItem value="9" className="text-xs font-semibold cursor-pointer">
                9 / page
              </SelectItem>
              <SelectItem value="12" className="text-xs font-semibold cursor-pointer">
                12 / page
              </SelectItem>
              <SelectItem value="24" className="text-xs font-semibold cursor-pointer">
                24 / page
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

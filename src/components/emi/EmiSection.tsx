"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmiStore } from "@/stores/useEmiStore";
import { useEmiApi } from "@/hooks/useEmiApi";
import { EmiMetricsCards } from "./EmiMetricsCards";
import { EmiCard } from "./EmiCard";
import { EmiEmptyState } from "./EmiEmptyState";
import { AddEmiModal } from "./AddEmiModal";
import { EmiDetailsModal } from "./EmiDetailsModal";
import { LoanType } from "@/types/emi.types";

export function EmiSection() {
  const { emis } = useEmiApi();
  const filterLoanType = useEmiStore((state) => state.filterLoanType);
  const setFilterLoanType = useEmiStore((state) => state.setFilterLoanType);
  const searchQuery = useEmiStore((state) => state.searchQuery);
  const setSearchQuery = useEmiStore((state) => state.setSearchQuery);

  const filterTabs: Array<{ id: LoanType | "all"; label: string }> = [
    { id: "all", label: "All Loans" },
    { id: "home_loan", label: "Home" },
    { id: "car_loan", label: "Car" },
    { id: "bike_loan", label: "Bike / 2W" },
    { id: "personal_loan", label: "Personal" },
    { id: "education_loan", label: "Education" },
    { id: "gold_loan", label: "Gold" },
    { id: "consumer_loan", label: "Gadget / AMC" },
  ];

  const filteredEmis = React.useMemo(() => {
    return emis.filter((emi) => {
      if (filterLoanType !== "all" && emi.loanType !== filterLoanType) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = emi.title.toLowerCase().includes(q);
        const matchesLender = emi.lenderName.toLowerCase().includes(q);
        const matchesAcc = emi.accountNumber?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLender && !matchesAcc) {
          return false;
        }
      }
      return true;
    });
  }, [emis, filterLoanType, searchQuery]);

  return (
    <div id="emi-tracker-grid" className="space-y-6 scroll-mt-20">
      {/* Top Header & Add Loan Button */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              EMI & Loan Reminders
            </h2>
            <Badge variant="cyan" className="text-xs font-bold px-2 py-0.5">
              {emis.length} {emis.length === 1 ? 'Loan' : 'Loans'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated alerts sent <strong>7 days</strong> and <strong>1 day</strong> before monthly installment due dates.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="h-10 sm:h-11 px-5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-600/20 cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Loan EMI</span>
        </Button>
      </div> */}

      {/* Metrics Row */}
      <EmiMetricsCards />

      {/* Search and Category Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search by loan name, bank, or account number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 bg-white border-slate-200/90 text-xs sm:text-sm h-11 rounded-2xl shadow-2xs w-full focus-visible:ring-2 focus-visible:ring-cyan-500/20"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Clear search text"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {filterTabs.map((tab) => {
            const isSelected = filterLoanType === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setFilterLoanType(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* EMI Grid or Empty State */}
      {filteredEmis.length === 0 ? (
        <EmiEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredEmis.map((emi) => (
              <EmiCard key={emi.id} emi={emi} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AddEmiModal />
      <EmiDetailsModal />
    </div>
  );
}

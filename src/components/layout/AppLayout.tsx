"use client";

import * as React from "react";
import {
  ScanLine,
  Bell,
  LayoutGrid,
  Layers,
} from "lucide-react";
import { AppLogo } from "@/components/ui/AppLogo";
import { Button } from "@/components/ui/button";
import { useAssetStore } from "@/stores/useAssetStore";
import { useAiScanStore } from "@/stores/useAiScanStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useConsumerLayout } from "@/hooks/useSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const currentCategory = useAssetStore((state) => state.filter.category);
  const setFilterCategory = useAssetStore((state) => state.setFilterCategory);
  const setIsAddModalOpen = useAssetStore((state) => state.setIsAddModalOpen);
  const setIsScanModalOpen = useAiScanStore(
    (state) => state.setIsScanModalOpen,
  );
  const notifications = useNotificationStore((state) => state.notifications);
  const setIsNotificationPanelOpen = useNotificationStore(
    (state) => state.setIsNotificationPanelOpen,
  );
  const user = useAuthStore((state) => state.user);
  const { activeTab, setActiveTab } = useConsumerLayout();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50/70 text-foreground flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-10">
      {/* Top Consumer Header Bar - Clean, uncluttered, no double options */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Personal Vault Tag */}
            <div className="flex items-center space-x-3">
              <AppLogo size={40} className="rounded-2xl shadow-md shadow-blue-500/20" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                    NeverForgot
                  </span>
                  <span className="hidden min-[420px]:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 whitespace-nowrap">
                    Personal Vault
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  I Never Forget Your Bills & Warranty Dates
                </p>
              </div>
            </div>

            {/* Right Action Suite: Alerts Bell & User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Notification Bell with Badge */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex relative h-10 w-10 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                onClick={() => setIsNotificationPanelOpen(true)}
                aria-label="Alerts"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span
                    suppressHydrationWarning
                    className="absolute top-1 right-1 h-4 min-w-[1rem] px-1 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-white"
                  >
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* User Avatar */}
              <div
                className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-2xs cursor-pointer select-none ring-2 ring-slate-100 hover:ring-blue-200 transition-all"
                title={`${user?.fullName || "User"} (Personal Vault)`}
              >
                KP
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7">
        {children}
      </main>

      {/* Native Mobile Bottom Navigation Bar (Consumer App Feel) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Vault Tab */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setActiveTab("vault");
              setFilterCategory("all");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`h-auto flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer hover:bg-slate-100/60 ${
              activeTab === "vault" && currentCategory === "all"
                ? "text-blue-600 font-bold bg-blue-50/70"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="text-[10px]">Vault</span>
          </Button>

          {/* Categories Tab */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setActiveTab("categories");
              const el = document.getElementById("category-filter-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={`h-auto flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer hover:bg-slate-100/60 ${
              activeTab === "categories"
                ? "text-blue-600 font-bold bg-blue-50/70"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <Layers className="h-5 w-5" />
            <span className="text-[10px]">Filters</span>
          </Button>

          {/* Central Floating AI Camera Scan Button (Native App Experience) */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsScanModalOpen(true)}
            className="h-auto p-0 flex flex-col items-center -mt-5 group focus:outline-none cursor-pointer hover:bg-transparent"
            aria-label="Scan invoice with AI"
          >
            <div className="h-13 w-13 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 p-0.5 shadow-lg shadow-blue-500/35 group-active:scale-95 transition-transform flex items-center justify-center">
              <ScanLine className="h-6 w-6 text-white" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 mt-1">
              Scan AI
            </span>
          </Button>

          {/* Manual Add Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsAddModalOpen(true)}
            className="h-auto flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer font-medium"
          >
            <div className="h-5 w-5 rounded-lg border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
              +
            </div>
            <span className="text-[10px]">Manual</span>
          </Button>

          {/* Alerts / Notifications */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsNotificationPanelOpen(true)}
            className="h-auto flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 transition-colors relative cursor-pointer font-medium"
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 text-[8px] font-bold flex items-center justify-center text-white"
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">Alerts</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  ScanLine,
  Bell,
  LayoutGrid,
  Layers,
  User,
  LogIn,
  Sparkles,
  LogOut,
  Plus,
} from "lucide-react";
import { AppLogo } from "@/components/ui/AppLogo";
import { Button } from "@/components/ui/button";
import { useAssetStore } from "@/stores/useAssetStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useConsumerLayout } from "@/hooks/useSidebar";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserProfileModal } from "@/components/profile/UserProfileModal";
import { NotificationDrawer } from "@/components/notifications/NotificationDrawer";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { FeedbackFloatingButton } from "@/components/feedback/FeedbackFloatingButton";
import { useProtectedAction } from "@/hooks/useProtectedAction";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const currentCategory = useAssetStore((state) => state.filter.category);
  const setFilterCategory = useAssetStore((state) => state.setFilterCategory);
  const { handleOpenAddModal, handleOpenScanModal } = useProtectedAction();
  const notifications = useNotificationStore((state) => state.notifications);
  const setIsNotificationPanelOpen = useNotificationStore(
    (state) => state.setIsNotificationPanelOpen,
  );
  const { activeTab, setActiveTab } = useConsumerLayout();

  const {
    user,
    isAuthenticated,
    openLoginModal,
    openRegisterModal,
    openProfileModal,
    logoutUser,
  } = useAuth();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-slate-50/70 text-foreground flex flex-col antialiased selection:bg-cyan-100 selection:text-cyan-900 pb-20 md:pb-10">
      {/* Top Consumer Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Vault Tag */}
            <div className="flex items-center space-x-3">
              <AppLogo size={40} className="rounded-2xl shadow-md shadow-cyan-600/20" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                    NeverForgot
                  </span>
                  <span className="hidden min-[420px]:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200/80 whitespace-nowrap">
                    Simple Tracker
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  Keep your bills, warranties & services organized in one place
                </p>
              </div>
            </div>

            {/* Right Action Suite: Visible on both mobile and desktop */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Notification Bell with Badge (Mobile & Desktop) */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
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

              {/* Desktop-only Auth controls (Mobile uses the bottom navigation) */}
              {isAuthenticated ? (
                <>
                  {/* User Profile Avatar Pill */}
                  <button
                    type="button"
                    onClick={openProfileModal}
                    className="hidden sm:flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl bg-slate-100 hover:bg-cyan-50 border border-slate-200/80 hover:border-cyan-200 transition-all cursor-pointer group select-none"
                    title={`Signed in as ${user?.fullName} (${user?.email})`}
                  >
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-2xs group-hover:scale-105 transition-transform">
                      {userInitials}
                    </div>
                    <div className="text-left pr-1">
                      <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-cyan-800">
                        {user?.fullName.split(" ")[0]}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-none">Account</p>
                    </div>
                  </button>

                  {/* Sign Out Action with proper LogOut icon */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50 border-slate-200/90 rounded-xl cursor-pointer transition-colors"
                    onClick={() => void logoutUser()}
                    title="Sign Out"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5 text-rose-500" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-slate-700 hover:text-cyan-700 rounded-xl cursor-pointer"
                    onClick={openLoginModal}
                  >
                    <LogIn className="h-3.5 w-3.5 mr-1.5" />
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-xs cursor-pointer"
                    onClick={openRegisterModal}
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-cyan-200" />
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 md:pb-7">
        {children}
      </main>

      {/* Global Auth, Profile, Notification & Feedback Modals */}
      <AuthModal />
      <UserProfileModal />
      <NotificationDrawer />
      <FeedbackModal />
      <FeedbackFloatingButton />

      {/* Native Mobile Bottom Navigation Bar (Centered & Fixed Position) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        <div className="grid grid-cols-5 items-center justify-items-center w-full max-w-md mx-auto px-1 h-14">
          {/* 1. Items Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("vault");
              setFilterCategory("all");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center w-full h-full py-1 rounded-xl transition-all cursor-pointer ${
              activeTab === "vault" && currentCategory === "all"
                ? "text-cyan-700 font-bold"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <LayoutGrid className="h-5 w-5 mb-0.5 shrink-0" />
            <span className="text-[10px] leading-tight">Items</span>
          </button>

          {/* 2. Filter / Categories Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("categories");
              const el = document.getElementById("category-filter-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center w-full h-full py-1 rounded-xl transition-all cursor-pointer ${
              activeTab === "categories"
                ? "text-cyan-700 font-bold"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <Layers className="h-5 w-5 mb-0.5 shrink-0" />
            <span className="text-[10px] leading-tight">Filter</span>
          </button>

          {/* 3. Central Scan Bill Button (Centered & Elevated) */}
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            <button
              type="button"
              onClick={handleOpenScanModal}
              className="absolute -top-5 flex flex-col items-center group focus:outline-none cursor-pointer"
              aria-label="Scan bill"
            >
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-cyan-700 shadow-lg shadow-cyan-600/35 group-active:scale-95 transition-transform flex items-center justify-center border-2 border-white ring-2 ring-cyan-100">
                <ScanLine className="h-6 w-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-cyan-700 mt-1 leading-tight">
                Scan Bill
              </span>
            </button>
          </div>

          {/* 4. Manual Add Item Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex flex-col items-center justify-center w-full h-full py-1 text-slate-500 hover:text-slate-800 transition-all cursor-pointer font-medium rounded-xl"
          >
            <Plus className="h-5 w-5 mb-0.5 shrink-0 text-slate-600" />
            <span className="text-[10px] leading-tight">Add Item</span>
          </button>

          {/* 5. Profile / Account Tab */}
          <button
            type="button"
            onClick={isAuthenticated ? openProfileModal : openLoginModal}
            className="flex flex-col items-center justify-center w-full h-full py-1 text-slate-500 hover:text-slate-800 transition-all cursor-pointer font-medium rounded-xl"
          >
            <User className="h-5 w-5 mb-0.5 shrink-0" />
            <span className="text-[10px] leading-tight">
              {isAuthenticated ? "Account" : "Sign In"}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}


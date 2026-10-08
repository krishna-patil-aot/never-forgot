"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Bell,
  LayoutGrid,
  User,
  LogIn,
  Sparkles,
  LogOut,
  Plus,
  CreditCard,
  ArrowLeftRight,
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
  const setFilterCategory = useAssetStore((state) => state.setFilterCategory);
  const { handleOpenAddModal, handleOpenScanModal, handleOpenAddEmiModal } =
    useProtectedAction();
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
              <AppLogo
                size={40}
                className="rounded-2xl shadow-md shadow-cyan-600/20"
              />
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
              {/* Notification Bell with Badge (Desktop only; on mobile, accessed via bottom navigation bar) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex relative h-10 w-10 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
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
                      <p className="text-[10px] text-slate-500 leading-none">
                        Account
                      </p>
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
          {/* 1. Unified Dynamic View Switcher Tab (Items ⇄ EMIs) */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              if (activeTab === "emi") {
                setActiveTab("vault");
                setFilterCategory("all");
              } else {
                setActiveTab("emi");
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`relative flex flex-col items-center justify-center w-full h-full py-1 rounded-2xl transition-all cursor-pointer touch-press select-none group ${
              activeTab === "emi"
                ? "text-teal-700 font-extrabold"
                : "text-cyan-700 font-extrabold"
            }`}
            aria-label={
              activeTab === "emi"
                ? "Viewing EMIs. Tap to switch to Items"
                : "Viewing Items. Tap to switch to EMIs"
            }
          >
            {/* Soft animated background highlight */}
            <motion.div
              layoutId="mobile-nav-active-pill"
              className={`absolute inset-x-1.5 inset-y-1 rounded-xl pointer-events-none transition-colors ${
                activeTab === "emi" ? "bg-teal-50/90" : "bg-cyan-50/90"
              }`}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
            />

            {/* Animated Icon morph */}
            <div className="relative z-10 flex items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === "emi" ? (
                  <motion.div
                    key="emi-icon"
                    initial={{ scale: 0.5, rotate: -25, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.5, rotate: 25, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="relative flex items-center justify-center"
                  >
                    <CreditCard className="h-5 w-5 mb-0.5 shrink-0 text-teal-600 stroke-[2.2]" />
                    <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="vault-icon"
                    initial={{ scale: 0.5, rotate: 25, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.5, rotate: -25, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="relative flex items-center justify-center"
                  >
                    <LayoutGrid className="h-5 w-5 mb-0.5 shrink-0 text-cyan-600 stroke-[2.2]" />
                    <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Label with micro-switch hint */}
            <div className="relative z-10 flex items-center gap-0.5 text-[10px] leading-tight">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeTab === "emi" ? "emis" : "items"}
                  initial={{ y: 3, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -3, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-extrabold tracking-tight"
                >
                  {activeTab === "emi" ? "EMIs" : "Items"}
                </motion.span>
              </AnimatePresence>
              <ArrowLeftRight className="h-2.5 w-2.5 opacity-60 text-slate-400 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>

          {/* 2. Alerts & Reminders Tab (Core Project Feature) */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsNotificationPanelOpen(true)}
            className="relative flex flex-col items-center justify-center w-full h-full py-1 text-slate-500 hover:text-cyan-700 transition-colors cursor-pointer select-none group touch-press"
            aria-label="Alerts & Reminders"
          >
            <div className="relative flex items-center justify-center">
              <Bell className="h-5 w-5 mb-0.5 shrink-0 text-slate-600 group-hover:text-cyan-700 group-hover:scale-105 transition-transform" />
              {unreadCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute -top-1 -right-2 h-3.5 min-w-[0.875rem] px-1 rounded-full bg-rose-500 text-[9px] font-extrabold flex items-center justify-center text-white ring-2 ring-white shadow-2xs animate-pulse"
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight font-medium group-hover:font-bold">
              Alerts
            </span>
          </motion.button>

          {/* 3. Central Scan Bill Button (Centered & Elevated at 50% exact alignment) */}
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            <button
              type="button"
              onClick={handleOpenScanModal}
              className="absolute -top-5 flex flex-col items-center group focus:outline-none cursor-pointer touch-press"
              aria-label="Scan bill"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-cyan-700 shadow-lg shadow-cyan-600/35 flex items-center justify-center border-2 border-white ring-2 ring-cyan-100 group-hover:ring-cyan-200 transition-all"
              >
                <ScanLine className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-[10px] font-bold text-cyan-700 mt-1 leading-tight">
                Scan AI
              </span>
            </button>
          </div>

          {/* 4. Manual Add Item / Add EMI Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={
              activeTab === "emi"
                ? handleOpenAddEmiModal
                : handleOpenAddModal
            }
            className={`flex flex-col items-center justify-center w-full h-full py-1 transition-all cursor-pointer font-medium rounded-xl touch-press select-none ${
              activeTab === "emi"
                ? "text-teal-700 hover:text-teal-800"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Plus
              className={`h-5 w-5 mb-0.5 shrink-0 ${
                activeTab === "emi"
                  ? "text-teal-600 stroke-[2.5]"
                  : "text-slate-600 stroke-[2]"
              }`}
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={activeTab === "emi" ? "add-emi" : "add-item"}
                initial={{ y: 3, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -3, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-[10px] leading-tight font-medium"
              >
                {activeTab === "emi" ? "Add EMI" : "Add Item"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* 5. Profile / Account Tab */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={isAuthenticated ? openProfileModal : openLoginModal}
            className="flex flex-col items-center justify-center w-full h-full py-1 text-slate-500 hover:text-slate-800 transition-all cursor-pointer font-medium rounded-xl select-none"
          >
            <User className="h-5 w-5 mb-0.5 shrink-0 text-slate-600" />
            <span className="text-[10px] leading-tight">
              {isAuthenticated ? "Account" : "Sign In"}
            </span>
          </motion.button>
        </div>
      </nav>
    </div>
  );
}

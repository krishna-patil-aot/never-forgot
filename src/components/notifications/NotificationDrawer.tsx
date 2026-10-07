"use client";

import * as React from "react";
import {
  Bell,
  CheckCheck,
  Clock,
  Wrench,
  ShieldAlert,
  HeartHandshake,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NotificationType } from "@/types/notification.types";
import { useNotificationDrawer } from "@/hooks/useNotificationDrawer";

function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "warranty_expiry":
      return <ShieldAlert className="h-4 w-4 text-amber-600" />;
    case "service_due":
      return <Wrench className="h-4 w-4 text-cyan-600" />;
    case "policy_renewal":
      return <HeartHandshake className="h-4 w-4 text-teal-600" />;
    default:
      return <Bell className="h-4 w-4 text-cyan-600" />;
  }
}

export function NotificationDrawer() {
  const {
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotificationDrawer();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[calc(100%-1.25rem)] sm:w-full sm:max-w-md max-h-[90dvh] overflow-y-auto overflow-x-hidden overscroll-contain bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-2xl my-auto box-border min-w-0">
        {/* Header with clear right padding so close button has its own space */}
        <DialogHeader className="pr-10 sm:pr-12 text-left space-y-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-150 flex items-center justify-center shrink-0">
              <Bell className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-bold text-slate-900 truncate">
                Alerts & Reminders
              </DialogTitle>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold text-cyan-700">
                  {unreadCount} unread {unreadCount === 1 ? "alert" : "alerts"}
                </span>
              )}
            </div>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-0.5">
            Upcoming service dates, renewals, and expiring warranties.
          </DialogDescription>
        </DialogHeader>

        {/* Notifications List */}
        <div className="space-y-2.5 py-2 min-w-0">
          {notifications.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                <Bell className="h-6 w-6" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                No active alerts right now. All warranties are up to date!
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                role="button"
                tabIndex={0}
                onClick={() => handleMarkAsRead(notif.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMarkAsRead(notif.id);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer text-left select-none min-w-0 ${
                  notif.isRead
                    ? "bg-slate-50/70 border-slate-200/60 opacity-75"
                    : "bg-cyan-50/40 border-cyan-200/90 shadow-2xs hover:bg-cyan-50/60"
                }`}
              >
                <div className="mt-0.5 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                  <NotificationIcon type={notif.type} />
                </div>

                <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="h-2 w-2 rounded-full bg-cyan-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500 font-semibold min-w-0">
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      Due in {notif.daysRemaining} days
                    </span>
                    <span>•</span>
                    <span className="truncate min-w-0">{notif.assetTitle}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action for Mark All As Read */}
        {unreadCount > 0 && (
          <div className="pt-2 border-t border-slate-100 min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="w-full text-xs font-bold h-9 rounded-xl border-slate-200 hover:bg-slate-50 cursor-pointer min-w-0"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-cyan-600" />
              <span>Mark all alerts as read</span>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

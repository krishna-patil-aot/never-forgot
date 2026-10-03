'use client';

import * as React from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  Wrench,
  ShieldAlert,
  HeartHandshake,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { NotificationType } from '@/types/notification.types';

export function NotificationDrawer() {
  const notifications = useNotificationStore((state) => state.notifications);
  const isNotificationPanelOpen = useNotificationStore(
    (state) => state.isNotificationPanelOpen
  );
  const setIsNotificationPanelOpen = useNotificationStore(
    (state) => state.setIsNotificationPanelOpen
  );
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'warranty_expiry':
        return <ShieldAlert className="h-4 w-4 text-amber-600" />;
      case 'service_due':
        return <Wrench className="h-4 w-4 text-sky-600" />;
      case 'policy_renewal':
        return <HeartHandshake className="h-4 w-4 text-purple-600" />;
    }
  };

  return (
    <Dialog
      open={isNotificationPanelOpen}
      onOpenChange={setIsNotificationPanelOpen}
    >
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto p-4 sm:p-6 bg-white border-border shadow-2xl">
        {/* Header with clear right padding so close button has its own space */}
        <DialogHeader className="pr-10 text-left space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Bell className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Alerts & Reminders
              </DialogTitle>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold text-blue-600">
                  {unreadCount} unread {unreadCount === 1 ? 'alert' : 'alerts'}
                </span>
              )}
            </div>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-0.5">
            Upcoming warranty expirations, vehicle service schedules, and renewal due dates.
          </DialogDescription>
        </DialogHeader>

        {/* Notifications List */}
        <div className="space-y-2.5 py-2">
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
                onClick={() => markAsRead(notif.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    markAsRead(notif.id);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer text-left select-none ${
                  notif.isRead
                    ? 'bg-slate-50/70 border-slate-200/60 opacity-75'
                    : 'bg-blue-50/40 border-blue-200/90 shadow-2xs hover:bg-blue-50/60'
                }`}
              >
                <div className="mt-0.5 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due in {notif.daysRemaining} days
                    </span>
                    <span>•</span>
                    <span className="truncate">{notif.assetTitle}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dedicated Single Clean Action for Mark All As Read */}
        {unreadCount > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="w-full text-xs font-bold h-9 rounded-xl border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
              <span>Mark all alerts as read</span>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

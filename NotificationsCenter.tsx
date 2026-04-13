import { useState, useEffect } from "react";
import { Bell, X, Check, Archive, Settings } from "lucide-react";
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationAsRead,
  archiveNotification,
  getNotificationStats,
  type Notification,
} from "@/lib/notifications";

interface NotificationsCenterProps {
  userId: string;
}

export function NotificationsCenter({ userId }: NotificationsCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    // Fetch notifications
    const notifs = getUserNotifications(userId, filter === "unread" ? "unread" : undefined);
    setNotifications(notifs);
    setUnreadCount(getUnreadCount(userId));
  }, [userId, filter]);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, status: "read" } : n
      )
    );
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const handleArchive = (notificationId: string) => {
    archiveNotification(notificationId);
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return "💬";
      case "review":
        return "⭐";
      case "lead":
        return "🎯";
      case "payout":
        return "💰";
      case "referral":
        return "🤝";
      default:
        return "📢";
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 px-4 pt-3 border-b border-gray-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                filter === "all"
                  ? "bg-teal-100 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                filter === "unread"
                  ? "bg-teal-100 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    notification.status === "unread" ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {notification.status === "unread" && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleArchive(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 flex justify-between">
            <a
              href="/notifications"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View All
            </a>
            <a
              href="/settings/notifications"
              className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

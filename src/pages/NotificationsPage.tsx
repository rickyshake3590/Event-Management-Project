import { useAppStore, notificationsForCurrentUser } from "@/store/useAppStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { NotificationItem } from "@/components/domain/NotificationItem";

export function NotificationsPage() {
  const notifications = useAppStore(notificationsForCurrentUser);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead);

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Notifications"
        description="Feature 16 — Alerts for submissions, decisions, changes, and registration updates."
        actions={
          unreadCount > 0 ? (
            <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />
      <div className="space-y-2" aria-live="polite">
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">You're all caught up.</p>
        ) : (
          sorted.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={markNotificationRead} />
          ))
        )}
      </div>
    </div>
  );
}

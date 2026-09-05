import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore, notificationsForCurrentUser } from "@/store/useAppStore";
import { roleLabels } from "./navConfig";
import type { UserRole } from "@/types";

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const currentUser = useAppStore((s) => s.currentUser);
  const switchRole = useAppStore((s) => s.switchRole);
  const notifications = useAppStore(notificationsForCurrentUser);
  const unread = notifications.filter((n) => !n.read).length;
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles: UserRole[] = ["organiser", "coordinator", "venue_staff", "tech_support", "attendee"];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          aria-label="Open navigation menu"
        >
          ☰
        </button>
        <span className="hidden text-sm text-gray-500 dark:text-gray-400 sm:inline">
          Signed in as{" "}
          <span className="font-medium text-gray-800 dark:text-gray-200">{currentUser.name}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/notifications"
          className="relative rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={`Notifications, ${unread} unread`}
        >
          🔔
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-600 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </Link>

        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={roleMenuOpen}
            className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span className="hidden sm:inline">Viewing as:</span>
            {roleLabels[currentUser.role]}
            <span aria-hidden="true">▾</span>
          </button>
          {roleMenuOpen && (
            <ul
              role="listbox"
              className="absolute right-0 z-10 mt-1 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 shadow-lg"
            >
              {roles.map((role) => (
                <li key={role}>
                  <button
                    role="option"
                    aria-selected={currentUser.role === role}
                    onClick={() => {
                      switchRole(role);
                      setRoleMenuOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      currentUser.role === role ? "bg-primary-50 dark:bg-primary-900/30 font-medium text-primary-800 dark:text-primary-300" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {roleLabels[role]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

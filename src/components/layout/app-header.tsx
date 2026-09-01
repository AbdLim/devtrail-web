"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/api/logout";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { track } from "@/lib/analytics/analytics";
import { APP_NAME } from "@/lib/config/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      track("logout_completed");
      queryClient.clear();
      router.push("/login");
    } catch {
      setLoading(false);
    }
  }

  const displayName = user?.profile?.displayName ?? user?.email ?? "";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        id="user-menu-trigger"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {initials}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            aria-label="User menu"
            className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-white/10 bg-neutral-900 py-1 shadow-xl"
          >
            <div className="border-b border-white/10 px-4 py-2">
              <p className="truncate text-xs font-medium text-white">{displayName}</p>
              {user?.email && (
                <p className="truncate text-xs text-white/50">{user.email}</p>
              )}
            </div>
            <Link
              href="/complete-profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Profile
            </Link>
            <button
              type="button"
              role="menuitem"
              id="user-menu-logout"
              disabled={loading}
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              {loading ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-neutral-950/80 px-6 backdrop-blur-sm">
      <Link href="/dashboard" className="text-sm font-semibold text-white hover:text-white/80">
        {APP_NAME}
      </Link>
      <UserMenu />
    </header>
  );
}

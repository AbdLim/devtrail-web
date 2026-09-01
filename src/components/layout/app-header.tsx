"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { logout } from "@/features/auth/api/logout";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { track } from "@/lib/analytics/analytics";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useWorkbenchStore } from "@/stores/use-workbench-store";

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

  const displayName = user?.profile?.username ?? user?.firstname ?? user?.email ?? "Developer";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        id="user-menu-trigger"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171A19] border border-[#252A28] text-[11px] font-mono font-medium text-[#F1F0EA] hover:border-[#91AD9D]/40 transition focus:outline-none"
      >
        {initials}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            aria-label="User menu"
            className="absolute right-0 z-50 mt-2 w-52 rounded-md border border-[#252A28] bg-[#121515] py-1 shadow-2xl"
          >
            <div className="border-b border-[#252A28] px-3 py-2">
              <p className="truncate text-xs font-medium text-[#F1F0EA]">{displayName}</p>
              {user?.email && (
                <p className="truncate text-[11px] text-[#737A76]">{user.email}</p>
              )}
            </div>
            <Link
              href="/settings/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#A3AAA5] hover:bg-[#1B1F1E] hover:text-[#F1F0EA]"
            >
              <UserIcon className="h-3.5 w-3.5 text-[#737A76]" />
              <span>Profile Settings</span>
            </Link>
            <button
              type="button"
              role="menuitem"
              id="user-menu-logout"
              disabled={loading}
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#C98383] hover:bg-[#1B1F1E] disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{loading ? "Signing out..." : "Sign out"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function getBreadcrumb(pathname: string) {
  if (pathname === "/today") return "Today";
  if (pathname === "/timeline") return "Timeline";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname === "/memory") return "Memory";
  if (pathname === "/search") return "Search";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Workbench";
}

export function AppHeader() {
  const pathname = usePathname() || "/today";
  const sectionTitle = getBreadcrumb(pathname);
  const { setCommandPaletteOpen, setQuickCaptureOpen } = useWorkbenchStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#252A28] bg-[#0D0F0F]/90 px-4 md:px-6 backdrop-blur-md">
      {/* Restrained Context Bar / Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#737A76]">
        <span>DevTrail</span>
        <span>/</span>
        <span className="text-[#F1F0EA] font-sans font-medium">{sectionTitle}</span>
      </div>

      {/* Action Buttons & Navigation Triggers */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-md border border-[#252A28] bg-[#121515] px-2.5 py-1 text-xs text-[#A3AAA5] hover:bg-[#1B1F1E] hover:text-[#F1F0EA] transition"
        >
          <Search className="h-3.5 w-3.5 text-[#737A76]" />
          <span className="hidden sm:inline">Search / Commands</span>
          <kbd className="font-mono text-[10px] bg-[#171A19] border border-[#252A28] px-1 py-0.5 rounded text-[#737A76]">
            ⌘K
          </kbd>
        </button>

        {/* Generate Summary Action Trigger */}
        <button
          type="button"
          onClick={() => setQuickCaptureOpen(true)}
          className="hidden md:flex items-center gap-1.5 rounded-md border border-[#91AD9D]/30 bg-[#91AD9D]/10 px-2.5 py-1 text-xs font-medium text-[#91AD9D] hover:bg-[#91AD9D]/20 transition"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Quick Capture</span>
        </button>

        <div className="h-4 w-[1px] bg-[#252A28]" />

        {/* User Account Dropdown */}
        <UserMenu />
      </div>
    </header>
  );
}

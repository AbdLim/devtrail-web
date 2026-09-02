"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, LogOut, User as UserIcon } from "lucide-react";
import { logout } from "@/features/auth/api/logout";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { track } from "@/lib/analytics/analytics";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useWorkbenchStore } from "@/stores/use-workbench-store";
import { cn } from "@/lib/utils/cn";

function getBreadcrumb(pathname: string) {
  if (pathname === "/today") return "Today";
  if (pathname === "/timeline") return "Timeline";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname === "/memory") return "Memory";
  if (pathname === "/search") return "Search";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Workbench";
}

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

  const displayName =
    user?.profile?.username ?? user?.firstname ?? user?.email ?? "Developer";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        id="user-menu-trigger"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={displayName}
        className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] bg-[#151916] border border-[#222823] font-mono text-[11px] font-medium text-[#F4F1E8] hover:border-[#99B9A3]/50 hover:text-[#99B9A3] transition-all duration-[120ms] animate-button-press"
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
            className="absolute right-0 z-50 mt-1.5 w-52 rounded-[8px] border border-[#222823] bg-[#101311] py-1 shadow-xl animate-dropdown"
          >
            <div className="border-b border-[#1B201C] px-3 py-2">
              <p className="truncate text-[13px] font-medium text-[#F4F1E8]">
                {displayName}
              </p>
              {user?.email && (
                <p className="truncate font-mono text-[11px] text-[#707770]">
                  {user.email}
                </p>
              )}
            </div>
            <Link
              href="/settings/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-[7px] text-[13px] text-[#A8AEA8] hover:bg-[#191E1A] hover:text-[#F4F1E8] transition-colors"
            >
              <UserIcon className="h-[14px] w-[14px] stroke-[1.5px] text-[#505650]" />
              <span>Profile Settings</span>
            </Link>
            <button
              type="button"
              role="menuitem"
              id="user-menu-logout"
              disabled={loading}
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-[7px] text-left text-[13px] text-[#CB8585] hover:bg-[#191E1A] transition-colors disabled:opacity-50"
            >
              <LogOut className="h-[14px] w-[14px] stroke-[1.5px]" />
              <span>{loading ? "Signing out..." : "Sign out"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function AppHeader() {
  const pathname = usePathname() || "/today";
  const sectionTitle = getBreadcrumb(pathname);
  const { setCommandPaletteOpen } = useWorkbenchStore();

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b border-[#222823] bg-[#121514] px-4 md:px-5 animate-slide-in-left">
      {/* ─── Breadcrumb ────────────────────────── */}
      <div className="flex items-center gap-1.5 font-mono text-[12px] text-[#8E968E] select-none animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <span>DevTrail</span>
        <span className="text-[#6E766E]">/</span>
        <span className="text-[#F5F3EF] font-medium">{sectionTitle}</span>
      </div>

      {/* ─── Right Actions ─────────────────────── */}
      <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* Search / Commands control — §16 */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-[30px] items-center gap-2 rounded-[6px] border border-[#2B332D] bg-[#151916] px-2.5 font-mono text-[12px] text-[#8E968E] hover:border-[#38423A] hover:text-[#F5F3EF] transition-all duration-[120ms] animate-button-press"
        >
          <Search className="h-[13px] w-[13px] stroke-[1.5px] shrink-0 text-[#8E968E]" />
          <span className="hidden sm:inline">Search / Commands</span>
          <kbd className="hidden sm:inline text-[10px] text-[#8E968E] font-mono">⌘K</kbd>
        </button>

        <div className="h-4 w-px bg-[#1B201C]" />

        <UserMenu />
      </div>
    </header>
  );
}

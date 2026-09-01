"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Calendar,
  GitCommitHorizontal,
  FolderGit2,
  BrainCircuit,
  Search,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useWorkbenchStore } from "@/stores/use-workbench-store";

const mainNavItems = [
  { href: "/today", label: "Today", icon: Calendar },
  { href: "/timeline", label: "Timeline", icon: GitCommitHorizontal },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/memory", label: "Memory", icon: BrainCircuit },
  { href: "/search", label: "Search", icon: Search },
];

export function AppSidebar() {
  const pathname = usePathname();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    setQuickCaptureOpen,
  } = useWorkbenchStore();

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-[#252A28] bg-[#121515] flex flex-col transition-all duration-200 ease-out z-20 select-none",
        isSidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Sidebar Header with Official DevTrail Logo */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-[#252A28]">
        <Link
          href="/today"
          className={cn(
            "flex items-center gap-2.5 transition-opacity hover:opacity-80 overflow-hidden py-1",
            isSidebarCollapsed && "justify-center w-full"
          )}
        >
          {isSidebarCollapsed ? (
            <Image
              src="/images/logo_notext.png"
              alt="DevTrail"
              width={24}
              height={24}
              style={{ width: "auto", height: "auto" }}
              className="h-5 w-auto object-contain"
              priority
            />
          ) : (
            <Image
              src="/images/logo_wordmark_light.png"
              alt="DevTrail"
              width={110}
              height={24}
              style={{ width: "auto", height: "auto" }}
              className="h-5 w-auto object-contain"
              priority
            />
          )}
        </Link>
        {!isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Collapse sidebar"
            className="p-1 rounded-md text-[#737A76] hover:text-[#F1F0EA] hover:bg-[#1B1F1E] transition-colors"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Primary Navigation Links */}
      <div className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/today" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium transition-colors duration-150",
                isActive
                  ? "bg-[#171A19] text-[#F1F0EA] border border-[#252A28]"
                  : "text-[#A3AAA5] hover:bg-[#1B1F1E] hover:text-[#F1F0EA]",
                isSidebarCollapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-150",
                  isActive ? "text-[#91AD9D]" : "text-[#737A76]"
                )}
              />
              {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom Controls */}
      <div className="p-2.5 border-t border-[#252A28] space-y-1.5 bg-[#0D0F0F]/30">
        {/* Quick Capture Trigger */}
        <button
          type="button"
          onClick={() => setQuickCaptureOpen(true)}
          title={isSidebarCollapsed ? "Quick Note (C)" : undefined}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium bg-[#91AD9D]/10 text-[#91AD9D] border border-[#91AD9D]/20 hover:bg-[#91AD9D]/20 transition-colors duration-150",
            isSidebarCollapsed && "justify-center px-0"
          )}
        >
          <Plus className="h-4 w-4 shrink-0 text-[#91AD9D]" />
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Quick Note</span>
              <kbd className="font-mono text-[10px] bg-[#0D0F0F] border border-[#252A28] px-1.5 py-0.5 rounded text-[#737A76]">
                C
              </kbd>
            </div>
          )}
        </button>

        {/* Settings Link */}
        <Link
          href="/settings/profile"
          title={isSidebarCollapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium text-[#A3AAA5] hover:bg-[#1B1F1E] hover:text-[#F1F0EA] transition-colors duration-150",
            pathname?.startsWith("/settings") && "bg-[#171A19] text-[#F1F0EA] border border-[#252A28]",
            isSidebarCollapsed && "justify-center px-0"
          )}
        >
          <Settings className="h-4 w-4 shrink-0 text-[#737A76]" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </Link>

        {/* Expand Toggle */}
        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Expand sidebar"
            className="w-full flex items-center justify-center py-2 text-[#737A76] hover:text-[#F1F0EA] hover:bg-[#1B1F1E] rounded-md transition-colors"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

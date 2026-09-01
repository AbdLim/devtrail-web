"use client";

import Link from "next/link";
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
        "shrink-0 border-r border-[#252A28] bg-[#121515] flex flex-col transition-all duration-200 ease-in-out z-20 select-none",
        isSidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Sidebar Header & Brand */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-[#252A28]">
        <Link
          href="/today"
          className={cn(
            "flex items-center gap-2 font-semibold text-[#F1F0EA] transition-opacity hover:opacity-80 overflow-hidden",
            isSidebarCollapsed && "justify-center w-full"
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#91AD9D]/15 text-[#91AD9D] font-mono text-xs font-bold border border-[#91AD9D]/30">
            DT
          </div>
          {!isSidebarCollapsed && (
            <span className="text-sm font-medium tracking-tight whitespace-nowrap text-[#F1F0EA]">
              DevTrail
            </span>
          )}
        </Link>
        {!isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Collapse sidebar"
            className="p-1 rounded-md text-[#737A76] hover:text-[#F1F0EA] hover:bg-[#1B1F1E] transition"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/today" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-[#171A19] text-[#F1F0EA] border border-[#252A28]"
                  : "text-[#A3AAA5] hover:bg-[#1B1F1E] hover:text-[#F1F0EA]",
                isSidebarCollapsed && "justify-center px-0"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#91AD9D]" : "text-[#737A76]")} />
              {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-2 border-t border-[#252A28] space-y-1">
        {/* Quick Capture Button */}
        <button
          type="button"
          onClick={() => setQuickCaptureOpen(true)}
          title={isSidebarCollapsed ? "Quick Note (C)" : undefined}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium bg-[#91AD9D]/10 text-[#91AD9D] border border-[#91AD9D]/20 hover:bg-[#91AD9D]/20 transition-colors",
            isSidebarCollapsed && "justify-center px-0"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Quick Note</span>
              <kbd className="font-mono text-[10px] bg-[#121515] border border-[#252A28] px-1.5 py-0.5 rounded text-[#737A76]">
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
            "flex items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium text-[#A3AAA5] hover:bg-[#1B1F1E] hover:text-[#F1F0EA] transition-colors",
            pathname?.startsWith("/settings") && "bg-[#171A19] text-[#F1F0EA] border border-[#252A28]",
            isSidebarCollapsed && "justify-center px-0"
          )}
        >
          <Settings className="h-4 w-4 shrink-0 text-[#737A76]" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </Link>

        {/* Sidebar Expand Toggle (when collapsed) */}
        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Expand sidebar"
            className="w-full flex items-center justify-center py-2 text-[#737A76] hover:text-[#F1F0EA] hover:bg-[#1B1F1E] rounded-md transition"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

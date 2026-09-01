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
  const { isSidebarCollapsed, toggleSidebar } = useWorkbenchStore();

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-[#252A28] bg-[#121515] flex flex-col transition-all duration-150 ease-out z-20 select-none",
        isSidebarCollapsed ? "w-14" : "w-52"
      )}
    >
      {/* Sidebar Header with High-Contrast Logo */}
      <div className="flex h-13 items-center justify-between px-3.5 border-b border-[#252A28]">
        <Link
          href="/today"
          className={cn(
            "flex items-center gap-2 transition-opacity hover:opacity-90 overflow-hidden py-1",
            isSidebarCollapsed && "justify-center w-full"
          )}
        >
          {isSidebarCollapsed ? (
            <Image
              src="/images/logo_notext.png"
              alt="DevTrail"
              width={22}
              height={22}
              style={{ width: "auto", height: "auto" }}
              className="h-5 w-auto object-contain"
              priority
            />
          ) : (
            <Image
              src="/images/logo_wordmark_light.png"
              alt="DevTrail"
              width={105}
              height={22}
              style={{ width: "auto", height: "auto" }}
              className="h-5 w-auto object-contain brightness-110"
              priority
            />
          )}
        </Link>
        {!isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Collapse sidebar"
            className="p-1 rounded text-[#737A76] hover:text-[#F1F0EA] hover:bg-[#171A19] transition-colors"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Primary Navigation Links with Thin Sage Accent Marker */}
      <div className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/today" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-xs transition-colors relative font-normal",
                isActive
                  ? "bg-[#171A19] text-[#F1F0EA] font-medium border-l-2 border-[#91AD9D]"
                  : "text-[#A3AAA5] hover:bg-[#1B1F1E] hover:text-[#F1F0EA] border-l-2 border-transparent",
                isSidebarCollapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-[#91AD9D]" : "text-[#737A76]"
                )}
              />
              {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom Navigation Section */}
      <div className="py-2 border-t border-[#252A28] bg-[#0D0F0F]/30 space-y-0.5">
        <Link
          href="/settings/profile"
          title={isSidebarCollapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-xs text-[#A3AAA5] hover:bg-[#1B1F1E] hover:text-[#F1F0EA] transition-colors border-l-2 border-transparent",
            pathname?.startsWith("/settings") && "bg-[#171A19] text-[#F1F0EA] font-medium border-l-2 border-[#91AD9D]",
            isSidebarCollapsed && "justify-center px-0"
          )}
        >
          <Settings className="h-4 w-4 shrink-0 text-[#737A76]" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </Link>

        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Expand sidebar"
            className="w-full flex items-center justify-center py-2 text-[#737A76] hover:text-[#F1F0EA] hover:bg-[#171A19] transition-colors"
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}

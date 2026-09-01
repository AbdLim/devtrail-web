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

const workNavItems = [
  { href: "/today", label: "Today", icon: Calendar },
  { href: "/timeline", label: "Timeline", icon: GitCommitHorizontal },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
];

const memoryNavItems = [
  { href: "/memory", label: "Memory", icon: BrainCircuit },
  { href: "/search", label: "Search", icon: Search },
];

function NavGroup({
  label,
  items,
  pathname,
  collapsed,
}: {
  label: string;
  items: typeof workNavItems;
  pathname: string | null;
  collapsed: boolean;
}) {
  return (
    <div className="space-y-px">
      {!collapsed && (
        <div className="px-3 pt-4 pb-1">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8E968E]">
            {label}
          </span>
        </div>
      )}
      {collapsed && <div className="h-3" />}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/today" && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group relative flex items-center gap-3 px-3 transition-colors duration-[120ms]",
              "h-[34px] text-[13px]",
              isActive
                ? "bg-[#1B211D] text-[#F4F1E8] font-medium"
                : "text-[#A8AEA8] hover:bg-[#191E1A] hover:text-[#F4F1E8]",
              collapsed && "justify-center"
            )}
          >
            {/* Sage 2px left active marker */}
            {isActive && (
              <span className="absolute left-0 inset-y-0 w-[2px] bg-[#99B9A3] rounded-r-px" />
            )}
            <Icon
              className={cn(
                "h-[15px] w-[15px] shrink-0 stroke-[1.5px] transition-colors duration-[120ms]",
                isActive ? "text-[#99B9A3]" : "text-[#8E968E] group-hover:text-[#F5F3EF]"
              )}
            />
            {!collapsed && <span className="truncate leading-none">{item.label}</span>}
          </Link>
        );
      })}
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useWorkbenchStore();

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-[#222823] bg-[#141715] flex flex-col overflow-hidden transition-all duration-200 ease-out z-20",
        isSidebarCollapsed ? "w-14" : "w-[216px]"
      )}
    >
      {/* ─── Brand Area ─────────────────────────────────── */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-[#222823] px-4",
          isSidebarCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link
          href="/today"
          className="flex items-center gap-2 transition-opacity hover:opacity-90 overflow-hidden"
        >
          {isSidebarCollapsed ? (
            <Image
              src="/images/logo_notext.png"
              alt="DevTrail"
              width={22}
              height={22}
              style={{ width: "auto", height: "auto" }}
              className="h-5 w-auto shrink-0"
              priority
            />
          ) : (
            <Image
              src="/images/logo_wordmark_light.png"
              alt="DevTrail"
              width={106}
              height={22}
              style={{ width: "auto", height: "auto" }}
              className="h-[22px] w-auto brightness-[1.08]"
              priority
            />
          )}
        </Link>
        {!isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Collapse sidebar"
            className="shrink-0 p-1 rounded text-[#8E968E] hover:text-[#F5F3EF] hover:bg-[#191E1A] transition-colors"
          >
            <PanelLeftClose className="h-[15px] w-[15px] stroke-[1.5px]" />
          </button>
        )}
      </div>

      {/* ─── Navigation Groups ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-1 min-h-0">
        <NavGroup
          label="Work"
          items={workNavItems}
          pathname={pathname}
          collapsed={isSidebarCollapsed}
        />
        <NavGroup
          label="Memory"
          items={memoryNavItems}
          pathname={pathname}
          collapsed={isSidebarCollapsed}
        />
      </div>

      {/* ─── Bottom: Settings ─────────────────────────────── */}
      <div className="shrink-0 border-t border-[#222823] py-1">
        <Link
          href="/settings/profile"
          title={isSidebarCollapsed ? "Settings" : undefined}
          className={cn(
            "group relative flex items-center gap-3 px-3 h-[34px] text-[13px] transition-colors duration-[120ms]",
            pathname?.startsWith("/settings")
              ? "bg-[#1B211D] text-[#F4F1E8] font-medium"
              : "text-[#A8AEA8] hover:bg-[#191E1A] hover:text-[#F4F1E8]",
            isSidebarCollapsed && "justify-center"
          )}
        >
          {pathname?.startsWith("/settings") && (
            <span className="absolute left-0 inset-y-0 w-[2px] bg-[#99B9A3] rounded-r-px" />
          )}
          <Settings
            className={cn(
              "h-[15px] w-[15px] shrink-0 stroke-[1.5px] transition-colors duration-[120ms]",
              pathname?.startsWith("/settings")
                ? "text-[#99B9A3]"
                : "text-[#8E968E] group-hover:text-[#F5F3EF]"
            )}
          />
          {!isSidebarCollapsed && <span className="truncate leading-none">Settings</span>}
        </Link>

        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Expand sidebar"
            className="flex w-full items-center justify-center h-8 text-[#8E968E] hover:text-[#F5F3EF] hover:bg-[#191E1A] transition-colors"
          >
            <PanelLeftOpen className="h-[15px] w-[15px] stroke-[1.5px]" />
          </button>
        )}
      </div>
    </aside>
  );
}

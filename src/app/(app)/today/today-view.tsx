"use client";

import { useWorkbenchStore, type InspectorData } from "@/stores/use-workbench-store";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/* ─── Types ──────────────────────────────────────────── */
type ActivityKind = "github" | "manual" | "ai";

type ActivityItem = {
  id: string;
  time: string;
  kind: ActivityKind;
  label: string;          // e.g. "MERGED", "COMMITS · 4", "LEARNING"
  title: string;
  project: string;
  meta: string;           // e.g. "PR #184 · TYPESCRIPT · REDIS"
  description?: string;
  tags?: string[];
  url?: string;
};

/* ─── Symbols per source type ─────────────────────────── */
const SYMBOLS: Record<ActivityKind, { char: string; color: string }> = {
  github: { char: "●", color: "text-[#99B9A3]" },
  manual: { char: "◇", color: "text-[#C3AA78]" },
  ai:     { char: "✦", color: "text-[#9C92BA]" },
};

/* ─── Demo data ───────────────────────────────────────── */
const mockActivities: ActivityItem[] = [
  {
    id: "a1",
    time: "09:14",
    kind: "github",
    label: "MERGED",
    title: "Fix authentication refresh race condition",
    project: "Curri API",
    meta: "PR #184 · TYPESCRIPT · REDIS",
    description: "Resolved single-flight locking issue during token rotation under high concurrency.",
    tags: ["TypeScript", "Redis", "Authentication"],
    url: "https://github.com/org/repo/pull/184",
  },
  {
    id: "a2",
    time: "10:32",
    kind: "github",
    label: "COMMITS · 4",
    title: "Redis caching improvements",
    project: "Curri API",
    meta: "4 COMMITS · 7 FILES",
    description: "Added Redis cache layer for user profiles with TTL invalidation on updates.",
    tags: ["Redis", "Performance"],
  },
  {
    id: "a3",
    time: "13:08",
    kind: "manual",
    label: "LEARNING",
    title: "Refresh requests should use single-flight locking",
    project: "DevTrail",
    meta: "Manual note",
    description: "Documented the pattern for handling concurrent token refreshes across server instances without thundering herd.",
    tags: ["Architecture", "Security"],
  },
  {
    id: "a4",
    time: "16:42",
    kind: "github",
    label: "ISSUE CLOSED",
    title: "Remove duplicate cache invalidation on user profile update",
    project: "Curri API",
    meta: "#142 · POSTGRESQL",
    description: "Cleaned up redundant database triggers firing duplicate cache resets.",
    tags: ["PostgreSQL", "Cleanup"],
  },
];

/* ─── Activity River Item ─────────────────────────────── */
function ActivityRow({
  item,
  isSelected,
  onSelect,
  isLast,
}: {
  item: ActivityItem;
  isSelected: boolean;
  onSelect: () => void;
  isLast: boolean;
}) {
  const symbol = SYMBOLS[item.kind];

  return (
    <div className="flex gap-0">
      {/* ─── Time column — high legibility muted font ── */}
      <div className="w-[56px] shrink-0 pt-[3px]">
        <span className="font-mono text-[12px] text-[#8E968E] font-medium">{item.time}</span>
      </div>

      {/* ─── Marker + connector line column ── */}
      <div className="w-6 shrink-0 flex flex-col items-center">
        <span className={cn("text-[12px] leading-none mt-0.5", symbol.color)}>
          {symbol.char}
        </span>
        {!isLast && (
          <div className="w-px flex-1 mt-1 mb-0 bg-[#252C26]" />
        )}
      </div>

      {/* ─── Content column ───────────────── */}
      <div className="flex-1 pb-8 pl-3 min-w-0">
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "w-full text-left rounded-[6px] px-3 py-2.5 -ml-3 transition-all duration-[130ms] group",
            isSelected
              ? "bg-[#1B211D]"
              : "hover:bg-[#191E1A]/80"
          )}
        >
          {/* Type label — crisp mono uppercase colored by source */}
          <div className="mb-1.5">
            <span
              className={cn(
                "font-mono text-[11px] font-semibold uppercase tracking-[0.10em]",
                item.kind === "github" && "text-[#8AA792]",
                item.kind === "manual" && "text-[#A6926A]",
                item.kind === "ai" && "text-[#958BB3]"
              )}
            >
              {item.label}
            </span>
          </div>

          {/* Activity title — 15px / 600 high contrast */}
          <p
            className={cn(
              "text-[15px] font-semibold leading-[1.35] transition-colors duration-[120ms]",
              isSelected
                ? "text-[#F5F3EF]"
                : "text-[#D5DCD5] group-hover:text-[#F5F3EF]"
            )}
          >
            {item.title}
          </p>

          {/* Project + metadata — mono 11px clear text */}
          <p className="mt-1 font-mono text-[11px] text-[#8E968E] uppercase tracking-[0.02em]">
            <span className="text-[#C4CCC4] font-medium">{item.project}</span>
            {item.meta && (
              <span className="text-[#8E968E]"> · {item.meta}</span>
            )}
          </p>
        </button>
      </div>
    </div>
  );
}

/* ─── Today Page ──────────────────────────────────────── */
export function TodayView({ userName }: { userName: string }) {
  const { inspector, openInspector, closeInspector } = useWorkbenchStore();

  const today = new Date();
  const dayAbbr = today
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const monthAbbr = today
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const dayNum = today.getDate().toString().padStart(2, "0");

  function handleSelectActivity(item: ActivityItem) {
    if (inspector.isOpen && inspector.data?.title === item.title) {
      closeInspector();
      return;
    }
    const data: InspectorData = {
      title: item.title,
      subtitle: `${item.label} · ${item.project}`,
      type: item.kind === "github" ? "evidence" : "note",
      data: {
        description: item.description,
        project: item.project,
        repo: item.project.toLowerCase().replace(/\s+/g, "-"),
        timestamp: `${monthAbbr} ${dayNum} · ${item.time}`,
        tags: item.tags,
        url: item.url,
        label: item.label,
        meta: item.meta,
      },
    };
    openInspector(data);
  }

  return (
    <div className="space-y-0 select-none">
      {/* ─────────────────────────────────────────────────────
          Page Header — asymmetric editorial §18
      ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between pb-8">
        <div className="space-y-1">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#8E968E]">
            {dayAbbr} · {monthAbbr} {dayNum}
          </p>
          <h1
            className="text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-[#F5F3EF]"
          >
            Today
          </h1>
          <p className="font-mono text-[12px] text-[#8E968E] uppercase tracking-[0.05em]">
            Curri AI · DevTrail
          </p>
        </div>

        {/* Asymmetric metrics — right column */}
        <div className="text-right space-y-1 pt-1">
          <div>
            <span className="font-mono text-[22px] font-semibold text-[#F5F3EF]">
              {String(mockActivities.length).padStart(2, "0")}
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[#8E968E]">
              Events
            </p>
          </div>
          <div className="pt-1">
            <span className="font-mono text-[22px] font-semibold text-[#F5F3EF]">
              02
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[#8E968E]">
              Projects
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          GitHub Not Connected notice — §43 compact inline
      ───────────────────────────────────────────────────── */}
      <div className="border-y border-[#222823] py-3.5 mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-[13px] text-[#F5F3EF] font-medium">GitHub is not connected</p>
          <p className="font-mono text-[11px] text-[#8E968E] mt-0.5">
            Bring commits, pull requests, issues, and releases into your activity river.
          </p>
        </div>
        <Link
          href="/settings/integrations"
          className="shrink-0 inline-flex items-center gap-1.5 h-[32px] rounded-[6px] bg-[#151916] border border-[#2B332D] px-3 text-[13px] font-medium text-[#99B9A3] hover:bg-[#191E1A] hover:border-[#99B9A3]/40 transition-colors duration-[130ms]"
        >
          Connect GitHub →
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────────
          Activity River — §20-27
      ───────────────────────────────────────────────────── */}
      <div className="space-y-0">
        {mockActivities.map((item, i) => (
          <ActivityRow
            key={item.id}
            item={item}
            isSelected={inspector.isOpen && inspector.data?.title === item.title}
            onSelect={() => handleSelectActivity(item)}
            isLast={i === mockActivities.length - 1}
          />
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────
          Section Divider
      ───────────────────────────────────────────────────── */}
      <div className="border-t border-[#222823] my-10" />

      {/* ─────────────────────────────────────────────────────
          Daily Memory — §33-35, editorial treatment
      ───────────────────────────────────────────────────── */}
      <div className="space-y-5 pb-12">
        {/* Eyebrow — violet for AI/memory */}
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#958BB3]">
          Memory · {monthAbbr} {dayNum}
        </p>

        {/* Summary paragraph */}
        <p className="text-[15px] font-medium leading-[1.6] text-[#E0E5E0] max-w-xl">
          Improved authentication reliability and Redis-backed session caching across backend services.
          Documented a single-flight approach to prevent thundering herd on concurrent token rotation.
        </p>

        {/* Highlights — numbered editorial list */}
        <div className="space-y-2 pt-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.10em] text-[#8E968E]">
            Highlights
          </p>
          {[
            "Authentication race condition fixed",
            "Redis caching improved and invalidation standardised",
            "Cache invalidation issue closed",
          ].map((h, i) => (
            <div key={h} className="flex items-start gap-3 text-[13px] text-[#C4CCC4]">
              <span className="font-mono text-[11px] text-[#8E968E] shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="leading-[1.5]">{h}</span>
            </div>
          ))}
        </div>

        {/* Learning */}
        <div className="space-y-2 pt-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.10em] text-[#8E968E]">
            Learning
          </p>
          <p className="text-[13px] text-[#F5F3EF] leading-[1.6] font-medium max-w-md">
            Refresh requests should use single-flight locking to prevent concurrent redundant calls.
          </p>
        </div>

        {/* Evidence count footer — mono muted */}
        <p className="font-mono text-[12px] text-[#8E968E] font-medium pt-2">
          {String(mockActivities.length).padStart(2, "0")} Evidence Items
        </p>
      </div>
    </div>
  );
}

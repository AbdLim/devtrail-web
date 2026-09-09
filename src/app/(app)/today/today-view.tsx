"use client";

import { useWorkbenchStore, type InspectorData } from "@/stores/use-workbench-store";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useActivities } from "@/features/activities/hooks/use-activities";
import type { Activity } from "@/features/activities/types/activity.types";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useInstallations } from "@/features/github/hooks/use-installations";
import { Plus, Activity as ActivityIcon } from "lucide-react";

/* ─── Symbols per source type ─────────────────────────── */
const SYMBOLS: Record<string, { char: string; color: string }> = {
  github: { char: "●", color: "text-[#99B9A3]" },
  manual: { char: "◇", color: "text-[#C3AA78]" },
  ai:     { char: "✦", color: "text-[#9C92BA]" },
};

/* ─── Activity River Item ─────────────────────────────── */
function ActivityRow({
  activity,
  isSelected,
  onSelect,
  isLast,
}: {
  activity: Activity;
  isSelected: boolean;
  onSelect: () => void;
  isLast: boolean;
}) {
  const symbol = SYMBOLS[activity.source] || SYMBOLS.manual;

  // Format occurredAt time (HH:mm)
  const occurredDate = new Date(activity.occurredAt);
  const formattedTime = isNaN(occurredDate.getTime())
    ? "09:00"
    : occurredDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

  const eventLabel = (activity.eventType || activity.source).toUpperCase();
  const repoName = activity.metadata?.repositoryName || "";

  return (
    <div className="flex gap-0">
      {/* ─── Time column — high legibility muted font ── */}
      <div className="w-[56px] shrink-0 pt-[3px]">
        <span className="font-mono text-[12px] text-[#8E968E] font-medium">{formattedTime}</span>
      </div>

      {/* ─── Marker + connector line column ── */}
      <div className="w-6 shrink-0 flex flex-col items-center">
        <span
          className={cn(
            "leading-none mt-0.5 transition-all duration-[130ms]",
            symbol.color,
            isSelected ? "text-[8px]" : "text-[6px] group-hover:text-[7px]"
          )}
        >
          {symbol.char}
        </span>
        {!isLast && <div className="w-px flex-1 mt-1 mb-0 bg-[#252C26]" />}
      </div>

      {/* ─── Content column ───────────────── */}
      <div className="flex-1 pb-5 pl-3 min-w-0">
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "w-full text-left rounded-[6px] px-3 py-2.5 -ml-3 transition-all duration-[140ms] group",
            isSelected ? "bg-[#1B211D]" : "hover:bg-[#191E1A]/80"
          )}
        >
          {/* Type label — crisp mono uppercase colored by source */}
          <div className="mb-1.5">
            <span
              className={cn(
                "font-mono text-[11px] font-semibold uppercase tracking-[0.10em]",
                activity.source === "github" && "text-[#8AA792]",
                activity.source === "manual" && "text-[#A6926A]",
                activity.source === "ai" && "text-[#958BB3]"
              )}
            >
              {eventLabel}
            </span>
          </div>

          {/* Activity title */}
          <p
            className={cn(
              "text-[15px] font-semibold leading-[1.35] transition-colors duration-[120ms]",
              isSelected ? "text-[#F5F3EF]" : "text-[#D5DCD5] group-hover:text-[#F5F3EF]"
            )}
          >
            {activity.title}
          </p>

          {/* Project / Repo metadata */}
          {(repoName || activity.externalId) && (
            <p className="mt-1 font-mono text-[11px] text-[#8E968E] uppercase tracking-[0.02em]">
              {repoName && <span className="text-[#C4CCC4] font-medium">{repoName}</span>}
              {activity.externalId && (
                <span className="text-[#8E968E]"> · {activity.externalId.slice(0, 8)}</span>
              )}
            </p>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Today Page ──────────────────────────────────────── */
export function TodayView({ userName }: { userName: string }) {
  const { inspector, openInspector, closeInspector, openCapture } = useWorkbenchStore();

  // Real backend queries
  const { data: activities = [], isLoading: loadingActivities } = useActivities();
  const { data: projects = [] } = useProjects();
  const { data: installations = [] } = useInstallations();

  const isGitHubConnected = installations.length > 0;

  const today = new Date();
  const dayAbbr = today.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const monthAbbr = today.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayNum = today.getDate().toString().padStart(2, "0");

  // Calculate week number
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const days = Math.floor((today.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

  function handleSelectActivity(activity: Activity) {
    if (inspector.isOpen && inspector.data?.title === activity.title) {
      closeInspector();
      return;
    }
    const data: InspectorData = {
      title: activity.title,
      subtitle: `${activity.eventType.toUpperCase()} · ${activity.source}`,
      type: activity.source === "github" ? "evidence" : "note",
      data: {
        description: activity.description,
        project: activity.projectId,
        repo: activity.metadata?.repositoryName,
        timestamp: `${monthAbbr} ${dayNum} · ${new Date(activity.occurredAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`,
        url: activity.url,
        label: activity.eventType.toUpperCase(),
      },
    };
    openInspector(data);
  }

  return (
    <div className="space-y-0 select-none animate-page-enter">
      {/* ─────────────────────────────────────────────────────
          Page Header — asymmetric editorial §18
      ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between pb-8 animate-fade-in-up">
        <div className="space-y-1">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#8E968E]">
            {dayAbbr} · {monthAbbr} {dayNum}
          </p>
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-[#F5F3EF]">
            Today
          </h1>
          <p className="font-mono text-[12px] text-[#8E968E] uppercase tracking-[0.05em]">
            DevTrail Activity River
          </p>
        </div>

        {/* Asymmetric metrics — right column */}
        <div className="text-right space-y-1 pt-1 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <div>
            <span className="font-mono text-[22px] font-semibold text-[#F5F3EF]">{weekNumber}</span>
            <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[#8E968E]">Week</p>
          </div>
          <div>
            <span className="font-mono text-[22px] font-semibold text-[#F5F3EF]">
              {String(activities.length).padStart(2, "0")}
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[#8E968E]">Events</p>
          </div>
          <div className="pt-1">
            <span className="font-mono text-[22px] font-semibold text-[#F5F3EF]">
              {String(projects.length).padStart(2, "0")}
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[#8E968E]">Projects</p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          GitHub Not Connected notice — §43 compact inline
      ───────────────────────────────────────────────────── */}
      {!isGitHubConnected && (
        <div className="border-y border-[#222823] py-3.5 mb-8 flex items-center justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
          <div>
            <p className="text-[13px] text-[#F5F3EF] font-medium">GitHub is not connected</p>
            <p className="font-mono text-[11px] text-[#8E968E] mt-0.5">
              Bring commits, pull requests, issues, and releases into your activity river.
            </p>
          </div>
          <Link
            href="/connect-github"
            className="shrink-0 inline-flex items-center gap-1.5 h-[32px] rounded-[6px] bg-[#151916] border border-[#2B332D] px-3 text-[13px] font-medium text-[#99B9A3] hover:bg-[#191E1A] hover:border-[#99B9A3]/40 transition-all duration-[130ms]"
          >
            Connect GitHub →
          </Link>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────
          Activity River — Real Data & Empty State (Railway Spec §58)
      ───────────────────────────────────────────────────── */}
      {loadingActivities ? (
        <div className="space-y-3 py-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full rounded bg-[#121613]/50 animate-pulse" />
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-0 stagger-children">
          {activities.map((item, i) => (
            <div key={item.id} className="animate-stagger" style={{ animationDelay: `${i * 30}ms` }}>
              <ActivityRow
                activity={item}
                isSelected={inspector.isOpen && inspector.data?.title === item.title}
                onSelect={() => handleSelectActivity(item)}
                isLast={i === activities.length - 1}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Railway Technical Empty State — spec §58 */
        <div className="rounded-[8px] border border-[#222823] bg-[#121613] p-10 text-center space-y-3 my-4">
          <ActivityIcon className="mx-auto h-7 w-7 text-[#8E968E] stroke-[1.2px]" />
          <div className="space-y-1 max-w-sm mx-auto">
            <p className="text-[14px] font-medium text-[#F5F3EF]">Nothing recorded today</p>
            <p className="font-mono text-[11px] text-[#8E968E]">
              GitHub activity and notes will appear here as your workday unfolds.
            </p>
          </div>
          <button
            type="button"
            onClick={openCapture}
            className="inline-flex items-center gap-1.5 h-[32px] rounded-[6px] bg-[#171C18] border border-[#222823] px-3.5 font-mono text-[12px] text-[#99B9A3] hover:border-[#99B9A3]/40 transition-colors"
          >
            <Plus className="h-[13px] w-[13px] stroke-[1.5px]" />
            <span>Capture a note →</span>
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────
          Daily Memory Section — §33-35
      ───────────────────────────────────────────────────── */}
      {activities.length > 0 && (
        <>
          <div className="border-t border-[#222823] my-10" />

          <div className="space-y-5 pb-12 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#958BB3]">
              Memory · {monthAbbr} {dayNum}
            </p>

            <p className="text-[15px] font-medium leading-[1.6] text-[#E0E5E0] max-w-xl">
              Captured {activities.length} engineering activity items today.
            </p>

            <p className="font-mono text-[12px] text-[#8E968E] font-medium pt-2">
              {String(activities.length).padStart(2, "0")} Evidence Items Recorded
            </p>
          </div>
        </>
      )}
    </div>
  );
}

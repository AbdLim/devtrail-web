"use client";

import { useEffect } from "react";
import { X, ExternalLink, GitCommit, GitPullRequest, Bookmark, CheckCircle2, FolderGit2, Calendar, Tag } from "lucide-react";
import { useWorkbenchStore } from "@/stores/use-workbench-store";
import { cn } from "@/lib/utils/cn";

export function InspectorDrawer() {
  const { inspector, closeInspector } = useWorkbenchStore();
  const { isOpen, data } = inspector;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeInspector();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeInspector]);

  if (!isOpen || !data) return null;

  return (
    <aside className="w-80 shrink-0 border-l border-[#252A28] bg-[#121515] flex flex-col h-full z-20 select-none animate-in slide-in-from-right duration-150">
      {/* Inspector Header */}
      <div className="flex h-13 items-center justify-between px-4 border-b border-[#252A28] bg-[#0D0F0F]">
        <span className="text-[11px] font-mono text-[#737A76] uppercase tracking-wider">
          Evidence Context
        </span>
        <button
          type="button"
          onClick={closeInspector}
          className="p-1 rounded text-[#737A76] hover:text-[#F1F0EA] hover:bg-[#171A19] transition-colors"
          title="Close Inspector (Esc)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Inspector Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-[#A3AAA5]">
        {/* Title & Type Badge */}
        <div className="space-y-2 border-b border-[#252A28] pb-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#91AD9D]/10 text-[#91AD9D] border border-[#91AD9D]/20">
            {data.type === "activity" && <GitCommit className="h-3 w-3" />}
            {data.type === "evidence" && <GitPullRequest className="h-3 w-3" />}
            {data.type === "accomplishment" && <CheckCircle2 className="h-3 w-3" />}
            {data.type === "project" && <FolderGit2 className="h-3 w-3" />}
            {!["activity", "evidence", "accomplishment", "project"].includes(data.type || "") && <Bookmark className="h-3 w-3" />}
            <span className="capitalize">{data.type || "Evidence"}</span>
          </div>

          <h3 className="text-sm font-semibold text-[#F1F0EA] leading-snug">
            {data.title}
          </h3>

          {data.subtitle && (
            <p className="text-xs font-mono text-[#737A76]">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Detailed Metadata Sections */}
        {data.data ? (
          <div className="space-y-4">
            {data.data.description && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#737A76] uppercase tracking-wider">
                  Summary / Details
                </span>
                <div className="p-3 rounded border border-[#252A28] bg-[#0D0F0F] text-[#F1F0EA] leading-relaxed">
                  {data.data.description}
                </div>
              </div>
            )}

            {data.data.project && (
              <div className="flex items-center justify-between py-1.5 border-b border-[#252A28]">
                <span className="text-[#737A76] font-mono text-[11px]">Project</span>
                <span className="text-[#F1F0EA] font-medium">{data.data.project}</span>
              </div>
            )}

            {data.data.repo && (
              <div className="flex items-center justify-between py-1.5 border-b border-[#252A28]">
                <span className="text-[#737A76] font-mono text-[11px]">Repository</span>
                <span className="text-[#F1F0EA] font-mono">{data.data.repo}</span>
              </div>
            )}

            {data.data.timestamp && (
              <div className="flex items-center justify-between py-1.5 border-b border-[#252A28]">
                <span className="text-[#737A76] font-mono text-[11px]">Timestamp</span>
                <span className="text-[#F1F0EA] font-mono">{data.data.timestamp}</span>
              </div>
            )}

            {data.data.tags && Array.isArray(data.data.tags) && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-[#737A76] uppercase tracking-wider">
                  Observed Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.data.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded border border-[#252A28] bg-[#171A19] text-[11px] font-mono text-[#A3AAA5]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.data.url && (
              <div className="pt-3">
                <a
                  href={data.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#91AD9D] hover:underline font-mono"
                >
                  <span>Open on GitHub ↗</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-[#737A76]">
            <p>Select an item in the timeline to inspect evidence details.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

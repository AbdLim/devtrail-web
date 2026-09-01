"use client";

import { useEffect } from "react";
import { X, ExternalLink, GitCommit, GitPullRequest, Bookmark, CheckCircle2, FolderGit2 } from "lucide-react";
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

  const renderIcon = () => {
    switch (data.type) {
      case "activity":
        return <GitCommit className="h-4 w-4 text-[#8EA5B8]" />;
      case "evidence":
        return <GitPullRequest className="h-4 w-4 text-[#91AD9D]" />;
      case "accomplishment":
        return <CheckCircle2 className="h-4 w-4 text-[#8FB39A]" />;
      case "project":
        return <FolderGit2 className="h-4 w-4 text-[#C2AA73]" />;
      default:
        return <Bookmark className="h-4 w-4 text-[#A3AAA5]" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeInspector}
        aria-hidden="true"
      />

      {/* Slide-over Inspector Drawer Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#121515] border-l border-[#252A28] shadow-2xl flex flex-col transition-transform duration-200 ease-in-out">
        {/* Drawer Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-[#252A28] bg-[#0D0F0F]">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#171A19] border border-[#252A28]">
              {renderIcon()}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#F1F0EA] truncate max-w-[240px]">
                {data.title}
              </h3>
              {data.subtitle && (
                <p className="text-[11px] font-mono text-[#737A76] truncate max-w-[240px]">
                  {data.subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={closeInspector}
            className="p-1 rounded-md text-[#737A76] hover:text-[#F1F0EA] hover:bg-[#1B1F1E] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-[#A3AAA5]">
          {data.data ? (
            <div className="space-y-3">
              {data.data.description && (
                <div>
                  <h4 className="text-[11px] font-mono text-[#737A76] uppercase tracking-wider mb-1">
                    Details
                  </h4>
                  <p className="text-[#F1F0EA] leading-relaxed bg-[#171A19] p-3 rounded border border-[#252A28]">
                    {data.data.description}
                  </p>
                </div>
              )}

              {data.data.repo && (
                <div className="flex items-center justify-between py-2 border-b border-[#252A28]">
                  <span className="text-[#737A76] font-mono">Repository</span>
                  <span className="text-[#F1F0EA] font-mono font-medium">{data.data.repo}</span>
                </div>
              )}

              {data.data.timestamp && (
                <div className="flex items-center justify-between py-2 border-b border-[#252A28]">
                  <span className="text-[#737A76] font-mono">Timestamp</span>
                  <span className="text-[#F1F0EA] font-mono">{data.data.timestamp}</span>
                </div>
              )}

              {data.data.url && (
                <a
                  href={data.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#91AD9D] hover:underline pt-2 font-mono"
                >
                  <span>View source on GitHub</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-[#737A76]">
              <p>No additional evidence details attached.</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

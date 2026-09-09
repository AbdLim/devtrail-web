"use client";

import { FolderGit2, Lock, Globe, ExternalLink } from "lucide-react";
import { useToggleTracking } from "../hooks/use-toggle-tracking";
import type { GitHubRepository } from "../types/github.types";
import { cn } from "@/lib/utils/cn";

export function RepositoryListItem({ repo }: { repo: GitHubRepository }) {
  const toggleMutation = useToggleTracking();

  function handleToggle() {
    toggleMutation.mutate({
      repositoryId: repo.id,
      isTracking: !repo.isTracking,
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-[6px] border border-[#222823] bg-[#121613] px-3.5 py-2.5 transition-colors hover:border-[#303832]">
      <div className="flex items-center gap-3 min-w-0">
        <FolderGit2 className="h-[15px] w-[15px] stroke-[1.5px] text-[#99B9A3] shrink-0" />

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[#F5F3EF] truncate">
              {repo.fullName}
            </span>
            {repo.isPrivate ? (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#8E968E]" title="Private repository">
                <Lock className="h-[10px] w-[10px] stroke-[1.5px]" />
                Private
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#8E968E]" title="Public repository">
                <Globe className="h-[10px] w-[10px] stroke-[1.5px]" />
                Public
              </span>
            )}
          </div>

          {repo.defaultBranch && (
            <p className="font-mono text-[11px] text-[#8E968E]">
              default branch: <span className="text-[#C4CCC4]">{repo.defaultBranch}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {repo.htmlUrl && (
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded text-[#8E968E] hover:text-[#F5F3EF] hover:bg-[#171C18] transition-colors"
            title="Open on GitHub"
          >
            <ExternalLink className="h-[13px] w-[13px] stroke-[1.5px]" />
          </a>
        )}

        {/* Tracking Toggle Switch */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={toggleMutation.isPending}
          className={cn(
            "flex items-center gap-2 h-[26px] px-2.5 rounded-[4px] font-mono text-[11px] font-medium transition-colors border select-none",
            repo.isTracking
              ? "bg-[#171C18] border-[#99B9A3]/50 text-[#99B9A3]"
              : "bg-[#090B0A] border-[#222823] text-[#8E968E] hover:text-[#C4CCC4]"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", repo.isTracking ? "bg-[#99B9A3]" : "bg-[#8E968E]")} />
          {repo.isTracking ? "Tracking" : "Paused"}
        </button>
      </div>
    </div>
  );
}

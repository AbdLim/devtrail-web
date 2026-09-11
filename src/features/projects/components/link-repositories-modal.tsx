"use client";

import { useState } from "react";
import Link from "next/link";
import { X, FolderGit2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useGitHubRepositories } from "@/features/github/hooks/use-github-repositories";
import { useLinkRepositories } from "../hooks/use-link-repositories";
import { cn } from "@/lib/utils/cn";

export function LinkRepositoriesModal({
  projectId,
  existingRepoIds = [],
  isOpen,
  onClose,
}: {
  projectId: string;
  existingRepoIds: string[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: repositories = [], isLoading } = useGitHubRepositories();
  const linkMutation = useLinkRepositories();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const existingSet = new Set(existingRepoIds.filter(Boolean));
  const availableRepos = repositories.filter(
    (repo) => !existingSet.has(repo.id) && !existingSet.has(repo.githubRepoId)
  );

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    if (selectedIds.length === 0) return;
    setError(null);
    try {
      await linkMutation.mutateAsync({ projectId, repositoryIds: selectedIds });
      setSelectedIds([]);
      onClose();
    } catch {
      setError("Failed to link repositories.");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-[10px] border border-[#222823] bg-[#121613] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#222823] pb-3">
          <div>
            <h3 className="text-[15px] font-semibold text-[#F5F3EF]">
              Link GitHub Repositories
            </h3>
            <p className="text-[12px] text-[#8E968E]">
              Select imported repositories to attach to this project.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#8E968E] hover:bg-[#171C18] hover:text-[#F5F3EF]"
          >
            <X className="h-[14px] w-[14px] stroke-[1.5px]" />
          </button>
        </div>

        {error && (
          <p className="text-xs text-[#CB8585]">{error}</p>
        )}

        {isLoading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-full rounded bg-[#171C18] animate-pulse" />
            ))}
          </div>
        ) : repositories.length === 0 ? (
          <div className="rounded-[8px] border border-[#222823] bg-[#090B0A] p-6 text-center space-y-3">
            <FolderGit2 className="mx-auto h-6 w-6 text-[#8E968E] stroke-[1.5px]" />
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-[#F5F3EF]">No GitHub repositories found</p>
              <p className="font-mono text-[11px] text-[#8E968E]">
                You haven&apos;t connected GitHub or imported repositories yet.
              </p>
            </div>
            <Link
              href="/settings/integrations"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#99B9A3] hover:underline"
            >
              <span>Connect GitHub in Integrations</span>
              <ExternalLink className="h-[11px] w-[11px]" />
            </Link>
          </div>
        ) : availableRepos.length > 0 ? (
          <div className="max-h-60 overflow-y-auto space-y-1 rounded-[6px] border border-[#222823] bg-[#090B0A] p-2">
            {availableRepos.map((repo) => {
              const isSelected = selectedIds.includes(repo.id);
              return (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => toggle(repo.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded text-[13px] text-left transition-colors",
                    isSelected
                      ? "bg-[#171C18] text-[#F5F3EF] border border-[#99B9A3]/30"
                      : "text-[#C4CCC4] hover:bg-[#121613]"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderGit2 className="h-[14px] w-[14px] stroke-[1.5px] text-[#99B9A3]" />
                    <span className="truncate">{repo.fullName || repo.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8E968E]">
                    {isSelected ? "Selected" : "Select"}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[8px] border border-[#222823] bg-[#090B0A] p-6 text-center space-y-1">
            <p className="text-[13px] font-medium text-[#F5F3EF]">All repositories linked</p>
            <p className="font-mono text-[11px] text-[#8E968E]">
              All {repositories.length} imported {repositories.length === 1 ? "repository is" : "repositories are"} already linked to this project.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222823]">
          <button
            type="button"
            onClick={onClose}
            className="h-[32px] rounded px-3 font-mono text-[12px] text-[#8E968E] hover:text-[#F5F3EF]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={selectedIds.length === 0 || linkMutation.isPending}
            onClick={handleSave}
            className="flex items-center gap-1.5 h-[32px] rounded bg-[#99B9A3] px-3.5 font-mono text-[12px] font-semibold text-[#090B0A] hover:bg-[#B4CEBC] disabled:opacity-40"
          >
            <LinkIcon className="h-[13px] w-[13px] stroke-[2px]" />
            {linkMutation.isPending ? "Linking..." : `Link (${selectedIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}


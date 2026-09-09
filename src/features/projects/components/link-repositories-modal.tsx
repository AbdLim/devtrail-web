"use client";

import { useState } from "react";
import { X, FolderGit2, Link as LinkIcon } from "lucide-react";
import { useGitHubRepositories } from "@/features/github/hooks/use-github-repositories";
import { useLinkRepositories } from "../hooks/use-link-repositories";
import type { GitHubRepository } from "@/features/github/types/github.types";
import { cn } from "@/lib/utils/cn";

export function LinkRepositoriesModal({
  projectId,
  existingRepoIds,
  isOpen,
  onClose,
}: {
  projectId: string;
  existingRepoIds: string[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: repositories = [] } = useGitHubRepositories();
  const linkMutation = useLinkRepositories();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const availableRepos = repositories.filter(
    (repo) => !existingRepoIds.includes(repo.id)
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
          <h3 className="text-[15px] font-semibold text-[#F5F3EF]">
            Link GitHub Repositories
          </h3>
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

        {availableRepos.length > 0 ? (
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
                      ? "bg-[#171C18] text-[#F5F3EF]"
                      : "text-[#C4CCC4] hover:bg-[#121613]"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderGit2 className="h-[14px] w-[14px] stroke-[1.5px] text-[#99B9A3]" />
                    <span className="truncate">{repo.fullName}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8E968E]">
                    {isSelected ? "Selected" : "Select"}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="py-6 text-center text-[13px] text-[#8E968E]">
            All imported repositories are already linked to this project.
          </p>
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
            {linkMutation.isPending ? "Linking..." : "Link Repositories"}
          </button>
        </div>
      </div>
    </div>
  );
}

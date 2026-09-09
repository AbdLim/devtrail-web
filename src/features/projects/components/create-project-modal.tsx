"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus, FolderGit2 } from "lucide-react";
import { createProjectSchema, type CreateProjectSchemaInput } from "../schemas/create-project.schema";
import { useCreateProject } from "../hooks/use-create-project";
import { useGitHubRepositories } from "@/features/github/hooks/use-github-repositories";
import { cn } from "@/lib/utils/cn";

const PRESET_COLORS = [
  "#99B9A3", // Sage
  "#9C92BA", // Violet
  "#C3AA78", // Gold
  "#4F46E5", // Slate Blue
  "#EC4899", // Rose
  "#F59E0B", // Amber
];

export function CreateProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const createProjectMutation = useCreateProject();
  const { data: repositories = [] } = useGitHubRepositories();

  const [selectedColor, setSelectedColor] = useState("#99B9A3");
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectSchemaInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      visibility: "private",
      color: "#99B9A3",
    },
  });

  function toggleRepo(repoId: string) {
    setSelectedRepoIds((prev) =>
      prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId]
    );
  }

  async function onSubmit(data: CreateProjectSchemaInput) {
    setServerError(null);
    try {
      await createProjectMutation.mutateAsync({
        ...data,
        color: selectedColor,
        repositoryIds: selectedRepoIds,
      });
      reset();
      setSelectedRepoIds([]);
      onClose();
    } catch (err: unknown) {
      setServerError("Failed to create project. Please try again.");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Scrim */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-[10px] border border-[#222823] bg-[#121613] p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222823] pb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#F5F3EF]">Create New Project</h2>
            <p className="text-[13px] text-[#8E968E] mt-0.5">
              Group your engineering work, evidence, and repositories.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#8E968E] hover:bg-[#171C18] hover:text-[#F5F3EF] transition-colors"
          >
            <X className="h-[15px] w-[15px] stroke-[1.5px]" />
          </button>
        </div>

        {serverError && (
          <div className="rounded-md border border-[#CB8585]/30 bg-[#CB8585]/10 px-3 py-2 text-xs text-[#CB8585]">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E968E]">
              Project Name *
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Curri API"
              className="w-full rounded-[6px] border border-[#222823] bg-[#090B0A] px-3 py-2 text-[13px] text-[#F5F3EF] placeholder:text-[#6E766E] focus:border-[#99B9A3] focus:outline-none"
            />
            {errors.name && (
              <p className="text-[11px] text-[#CB8585]">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E968E]">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={2}
              placeholder="Brief summary of the project scope..."
              className="w-full resize-none rounded-[6px] border border-[#222823] bg-[#090B0A] px-3 py-2 text-[13px] text-[#F5F3EF] placeholder:text-[#6E766E] focus:border-[#99B9A3] focus:outline-none"
            />
          </div>

          {/* Color Picker — §45 subdued identity marker */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E968E]">
              Project Marker Color
            </label>
            <div className="flex items-center gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={cn(
                    "h-6 w-6 rounded-full transition-transform",
                    selectedColor === c ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#121613]" : "hover:scale-105"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Repository Selector */}
          {repositories.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E968E]">
                Link Repositories ({selectedRepoIds.length} selected)
              </label>
              <div className="max-h-36 overflow-y-auto space-y-1 rounded-[6px] border border-[#222823] bg-[#090B0A] p-2">
                {repositories.map((repo) => {
                  const isChecked = selectedRepoIds.includes(repo.id);
                  return (
                    <button
                      key={repo.id}
                      type="button"
                      onClick={() => toggleRepo(repo.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[12px] text-left transition-colors",
                        isChecked
                          ? "bg-[#171C18] text-[#F5F3EF]"
                          : "text-[#8E968E] hover:bg-[#121613] hover:text-[#C4CCC4]"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FolderGit2 className="h-[13px] w-[13px] stroke-[1.5px] text-[#99B9A3]" />
                        <span className="truncate">{repo.fullName}</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#8E968E]">
                        {isChecked ? "✓" : "+"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222823]">
            <button
              type="button"
              onClick={onClose}
              className="h-[34px] rounded-[6px] px-3 font-mono text-[12px] text-[#8E968E] hover:text-[#F5F3EF] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createProjectMutation.isPending}
              className="flex items-center gap-1.5 h-[34px] rounded-[6px] bg-[#99B9A3] px-4 font-mono text-[12px] font-semibold text-[#090B0A] hover:bg-[#B4CEBC] disabled:opacity-50 transition-colors"
            >
              <Plus className="h-[14px] w-[14px] stroke-[2px]" />
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

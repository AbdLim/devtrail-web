"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderGit2,
  Trash2,
  Plus,
  ArrowLeft,
  Lock,
  Globe,
  Unlink,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { useProject } from "@/features/projects/hooks/use-project";
import { useDeleteProject } from "@/features/projects/hooks/use-delete-project";
import { useUnlinkRepository } from "@/features/projects/hooks/use-unlink-repository";
import { LinkRepositoriesModal } from "@/features/projects/components/link-repositories-modal";
import { cn } from "@/lib/utils/cn";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();

  const { data: project, isLoading, isError } = useProject(projectId);
  const deleteMutation = useDeleteProject();
  const unlinkMutation = useUnlinkRepository();

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(projectId);
      router.push("/projects");
    } catch {
      console.error("Failed to delete project");
    }
  }

  async function handleUnlink(repoId: string) {
    try {
      await unlinkMutation.mutateAsync({ projectId, repositoryId: repoId });
    } catch {
      console.error("Failed to unlink repository");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-6 w-32 bg-[#121613] rounded animate-pulse" />
        <div className="h-10 w-64 bg-[#121613] rounded animate-pulse" />
        <div className="h-40 w-full bg-[#121613] rounded animate-pulse" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-[15px] text-[#CB8585]">Project not found or failed to load.</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#99B9A3] hover:underline"
        >
          <ArrowLeft className="h-[13px] w-[13px]" /> Back to Projects
        </Link>
      </div>
    );
  }

  const projectColor = project.color || "#99B9A3";
  const existingRepoIds = (project.repositories || []).map((r) => r.id || (r as any).githubRepoId || (r as any).repositoryId).filter(Boolean);


  return (
    <div className="space-y-6 select-none">
      {/* Back breadcrumb link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#8E968E] hover:text-[#F5F3EF] transition-colors"
      >
        <ArrowLeft className="h-[13px] w-[13px] stroke-[1.5px]" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#222823] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span
              className="h-3.5 w-3.5 rounded-full shrink-0"
              style={{ backgroundColor: projectColor }}
            />
            <h1 className="text-[28px] font-semibold text-[#F5F3EF]">
              {project.name}
            </h1>

            <span className="font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 rounded border border-[#222823] bg-[#121613] text-[#99B9A3]">
              {project.status}
            </span>
          </div>

          {project.description && (
            <p className="text-[14px] text-[#C4CCC4] max-w-2xl leading-[1.5]">
              {project.description}
            </p>
          )}
        </div>

        {/* Delete action */}
        <div className="flex items-center gap-2 shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#CB8585]">Confirm delete?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="h-[30px] rounded bg-[#CB8585] px-2.5 font-mono text-[11px] font-semibold text-[#090B0A] hover:opacity-90"
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="h-[30px] rounded border border-[#222823] px-2.5 font-mono text-[11px] text-[#8E968E]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 h-[32px] rounded-[6px] border border-[#222823] bg-[#121613] px-3 font-mono text-[11px] text-[#CB8585] hover:bg-[#CB8585]/10 hover:border-[#CB8585]/40 transition-colors"
            >
              <Trash2 className="h-[13px] w-[13px] stroke-[1.5px]" />
              <span>Delete Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Linked Repositories Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-[16px] w-[16px] stroke-[1.5px] text-[#99B9A3]" />
            <h2 className="text-[16px] font-semibold text-[#F5F3EF]">
              Linked Repositories ({project.repositories?.length || 0})
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
            className="flex items-center gap-1.5 h-[32px] rounded-[6px] bg-[#171C18] border border-[#222823] px-3 font-mono text-[12px] text-[#99B9A3] hover:border-[#99B9A3]/40 transition-colors"
          >
            <Plus className="h-[13px] w-[13px] stroke-[1.5px]" />
            <span>Link Repository</span>
          </button>
        </div>

        {project.repositories && project.repositories.length > 0 ? (
          <div className="space-y-2">
            {project.repositories.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between gap-4 rounded-[8px] border border-[#222823] bg-[#121613] px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FolderGit2 className="h-[15px] w-[15px] stroke-[1.5px] text-[#99B9A3] shrink-0" />
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[14px] font-medium text-[#F5F3EF] truncate block">
                      {repo.fullName}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#8E968E]">
                      <span>{repo.isPrivate ? "Private" : "Public"}</span>
                      {repo.htmlUrl && (
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#99B9A3] hover:underline"
                        >
                          GitHub <ExternalLink className="h-[10px] w-[10px]" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUnlink(repo.id)}
                  disabled={unlinkMutation.isPending}
                  className="flex items-center gap-1 font-mono text-[11px] text-[#8E968E] hover:text-[#CB8585] p-1.5 rounded transition-colors"
                  title="Unlink repository from project"
                >
                  <Unlink className="h-[13px] w-[13px] stroke-[1.5px]" />
                  <span className="hidden sm:inline">Unlink</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[8px] border border-[#222823] bg-[#121613] p-8 text-center space-y-2">
            <p className="text-[13px] text-[#8E968E]">
              No repositories linked to this project yet.
            </p>
            <button
              type="button"
              onClick={() => setIsLinkModalOpen(true)}
              className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#99B9A3] hover:underline"
            >
              <Plus className="h-[12px] w-[12px]" /> Link a repository now
            </button>
          </div>
        )}
      </div>

      {/* Modal to Link Repositories */}
      <LinkRepositoriesModal
        projectId={projectId}
        existingRepoIds={existingRepoIds}
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </div>
  );
}

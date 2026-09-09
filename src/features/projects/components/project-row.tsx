"use client";

import Link from "next/link";
import { FolderGit2, GitBranch, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Project } from "../types/project.types";

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: "Active", bg: "bg-[#99B9A3]/10", text: "text-[#99B9A3]", dot: "bg-[#99B9A3]" },
  completed: { label: "Completed", bg: "bg-[#9C92BA]/10", text: "text-[#9C92BA]", dot: "bg-[#9C92BA]" },
  paused: { label: "Paused", bg: "bg-[#C3AA78]/10", text: "text-[#C3AA78]", dot: "bg-[#C3AA78]" },
  archived: { label: "Archived", bg: "bg-[#505650]/10", text: "text-[#8E968E]", dot: "bg-[#8E968E]" },
};

export function ProjectRow({ project }: { project: Project }) {
  const status = STATUS_STYLES[project.status] || STATUS_STYLES.active;
  const projectColor = project.color || "#99B9A3";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative flex items-center justify-between gap-4 rounded-[8px] border border-[#222823] bg-[#121613] px-4 py-3.5 transition-all duration-[150ms] hover:border-[#303832] hover:bg-[#171C18]"
    >
      {/* Subdued project color left indicator marker — Railway spec §45 */}
      <span
        className="absolute left-0 inset-y-2 w-[3px] rounded-r-sm transition-opacity opacity-80 group-hover:opacity-100"
        style={{ backgroundColor: projectColor }}
      />

      <div className="flex items-center gap-3.5 min-w-0 pl-1">
        {/* Status dot */}
        <span className={cn("h-2 w-2 shrink-0 rounded-full", status.dot)} />

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[15px] font-semibold text-[#F5F3EF] group-hover:text-[#99B9A3] transition-colors truncate">
              {project.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] px-2 py-0.5 rounded-[4px]",
                status.bg,
                status.text
              )}
            >
              {status.label}
            </span>
          </div>

          {project.description && (
            <p className="text-[13px] text-[#C4CCC4] line-clamp-1 leading-normal">
              {project.description}
            </p>
          )}

          {/* Linked Repositories Summary */}
          {project.repositories && project.repositories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {project.repositories.slice(0, 3).map((repo) => (
                <span
                  key={repo.id}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-[#8E968E] bg-[#171C18] border border-[#222823] px-1.5 py-0.5 rounded"
                >
                  <FolderGit2 className="h-[11px] w-[11px] stroke-[1.5px] text-[#8E968E]" />
                  {repo.name}
                </span>
              ))}
              {project.repositories.length > 3 && (
                <span className="font-mono text-[11px] text-[#8E968E]">
                  +{project.repositories.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right details & action indicator */}
      <div className="flex items-center gap-4 shrink-0 font-mono text-[11px] text-[#8E968E]">
        <div className="hidden sm:flex items-center gap-1.5">
          <GitBranch className="h-[13px] w-[13px] stroke-[1.5px] text-[#8E968E]" />
          <span>
            {project.repositoryCount ?? project.repositories?.length ?? 0} repositories
          </span>
        </div>

        <ArrowRight className="h-[15px] w-[15px] stroke-[1.5px] text-[#8E968E] group-hover:text-[#F5F3EF] group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

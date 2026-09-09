"use client";

import { useState } from "react";
import { Plus, Search, FolderGit2, RefreshCw } from "lucide-react";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { ProjectRow } from "@/features/projects/components/project-row";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { GitHubConnectCard } from "@/features/github/components/github-connect-card";
import { useInstallations } from "@/features/github/hooks/use-installations";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, refetch, isRefetching } = useProjects();
  const { data: installations = [] } = useInstallations();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const isGitHubConnected = installations.length > 0;

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#8E968E]">
            Workplaces & Ecosystems
          </p>
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-[#F5F3EF]">
            Projects
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2 rounded-[6px] border border-[#222823] bg-[#121613] text-[#8E968E] hover:text-[#F5F3EF] hover:border-[#303832] transition-colors"
            title="Refresh projects"
          >
            <RefreshCw className={`h-[14px] w-[14px] stroke-[1.5px] ${isRefetching ? "animate-spin text-[#99B9A3]" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 h-[34px] rounded-[6px] bg-[#99B9A3] px-3.5 font-mono text-[12px] font-semibold text-[#090B0A] hover:bg-[#B4CEBC] transition-colors"
          >
            <Plus className="h-[14px] w-[14px] stroke-[2px]" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* GitHub connection notice if not connected */}
      {!isGitHubConnected && <GitHubConnectCard />}

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-[6px] border border-[#222823] bg-[#121613] px-3 h-[38px]">
        <Search className="h-[14px] w-[14px] text-[#8E968E] shrink-0 stroke-[1.5px]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter projects by name or description..."
          className="flex-1 bg-transparent text-[13px] text-[#F5F3EF] placeholder:text-[#6E766E] outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="font-mono text-[11px] text-[#8E968E] hover:text-[#F5F3EF]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Projects List — Railway technical resource rows */}
      {isLoading ? (
        <div className="space-y-2 py-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[62px] w-full rounded-[8px] border border-[#222823] bg-[#121613]/50 animate-pulse"
            />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="space-y-2">
          {filteredProjects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Railway Technical Empty State — spec §58 */
        <div className="rounded-[8px] border border-[#222823] bg-[#121613] p-12 text-center space-y-3">
          <FolderGit2 className="mx-auto h-8 w-8 text-[#8E968E] stroke-[1.2px]" />
          <div className="space-y-1 max-w-sm mx-auto">
            <p className="text-[14px] font-medium text-[#F5F3EF]">
              {search ? `No projects matching "${search}"` : "No projects created yet"}
            </p>
            <p className="font-mono text-[11px] text-[#8E968E]">
              Organize repositories, evidence, and activity into technical project resource views.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 h-[32px] rounded-[6px] bg-[#171C18] border border-[#222823] px-3.5 font-mono text-[12px] text-[#99B9A3] hover:border-[#99B9A3]/40 transition-colors"
          >
            <Plus className="h-[13px] w-[13px] stroke-[1.5px]" />
            <span>Create your first project →</span>
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}

import type { GitHubRepository } from "@/features/github/types/github.types";

export type ProjectStatus = "active" | "completed" | "archived" | "paused";
export type ProjectVisibility = "private" | "public" | "team";

export interface Project {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  color?: string;
  repositoryCount?: number;
  repositories?: GitHubRepository[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectDetail extends Project {
  repositories: GitHubRepository[];
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  color?: string;
  repositoryIds?: string[];
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  color?: string;
}

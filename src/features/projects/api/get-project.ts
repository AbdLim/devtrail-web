import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { ProjectDetail } from "../types/project.types";

export async function getProject(projectId: string): Promise<ProjectDetail> {
  return apiClient<ProjectDetail>(endpoints.projects.detail(projectId));
}

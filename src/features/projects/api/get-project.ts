import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { ProjectDetail } from "../types/project.types";

export async function getProject(projectId: string): Promise<ProjectDetail> {
  const res = await apiClient<ProjectDetail | { project: ProjectDetail; data?: ProjectDetail }>(
    endpoints.projects.detail(projectId)
  );
  if (res && typeof res === "object") {
    if ((res as any).project) return (res as any).project;
    if ((res as any).data && !Array.isArray((res as any).data)) return (res as any).data;
  }
  return res as ProjectDetail;
}


import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Project } from "../types/project.types";

export async function getProjects(): Promise<Project[]> {
  const res = await apiClient<Project[] | { projects: Project[]; data?: Project[] }>(endpoints.projects.list);
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    if (Array.isArray((res as any).projects)) return (res as any).projects;
    if (Array.isArray((res as any).data)) return (res as any).data;
  }
  return [];
}


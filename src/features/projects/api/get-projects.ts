import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Project } from "../types/project.types";

export async function getProjects(): Promise<Project[]> {
  try {
    return await apiClient<Project[]>(endpoints.projects.list);
  } catch (error) {
    console.warn("Failed to fetch projects:", error);
    return [];
  }
}

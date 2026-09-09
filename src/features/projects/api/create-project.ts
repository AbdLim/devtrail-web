import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { CreateProjectInput, Project } from "../types/project.types";

export async function createProject(data: CreateProjectInput): Promise<Project> {
  return apiClient<Project>(endpoints.projects.create, {
    method: "POST",
    body: data,
  });
}

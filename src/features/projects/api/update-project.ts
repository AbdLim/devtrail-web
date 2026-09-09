import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { UpdateProjectInput, Project } from "../types/project.types";

export async function updateProject(
  projectId: string,
  data: UpdateProjectInput
): Promise<Project> {
  return apiClient<Project>(endpoints.projects.update(projectId), {
    method: "PUT",
    body: data,
  });
}

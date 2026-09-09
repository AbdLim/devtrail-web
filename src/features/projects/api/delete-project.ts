import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function deleteProject(projectId: string): Promise<void> {
  await apiClient<void>(endpoints.projects.delete(projectId), {
    method: "DELETE",
  });
}

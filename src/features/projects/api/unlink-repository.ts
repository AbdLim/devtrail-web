import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function unlinkRepository(
  projectId: string,
  repositoryId: string
): Promise<void> {
  await apiClient<void>(endpoints.projects.removeRepository(projectId, repositoryId), {
    method: "DELETE",
  });
}

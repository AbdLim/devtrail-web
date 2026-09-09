import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function linkRepositories(
  projectId: string,
  repositoryIds: string[]
): Promise<void> {
  await apiClient<void>(endpoints.projects.addRepositories(projectId), {
    method: "POST",
    body: { repositoryIds },
  });
}

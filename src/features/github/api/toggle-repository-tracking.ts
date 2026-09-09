import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { GitHubRepository } from "../types/github.types";

export async function toggleRepositoryTracking(
  repositoryId: string,
  isTracking: boolean
): Promise<GitHubRepository> {
  return apiClient<GitHubRepository>(endpoints.github.toggleTracking(repositoryId), {
    method: "PATCH",
    body: { isTracking },
  });
}

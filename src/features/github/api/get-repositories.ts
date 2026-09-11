import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { GitHubRepository } from "../types/github.types";

export async function getRepositories(): Promise<GitHubRepository[]> {
  return apiClient<GitHubRepository[]>(endpoints.github.repositories);
}

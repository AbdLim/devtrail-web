import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { GitHubRepository } from "../types/github.types";

export async function getRepositories(): Promise<GitHubRepository[]> {
  try {
    return await apiClient<GitHubRepository[]>(endpoints.github.repositories);
  } catch (error) {
    console.warn("Failed to fetch GitHub repositories:", error);
    return [];
  }
}

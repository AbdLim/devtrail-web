import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { GitHubRepository } from "../types/github.types";

export async function getRepositories(): Promise<GitHubRepository[]> {
  const res = await apiClient<GitHubRepository[] | { repositories: GitHubRepository[]; data?: GitHubRepository[] }>(
    endpoints.github.repositories
  );
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    if (Array.isArray((res as any).repositories)) return (res as any).repositories;
    if (Array.isArray((res as any).data)) return (res as any).data;
  }
  return [];
}


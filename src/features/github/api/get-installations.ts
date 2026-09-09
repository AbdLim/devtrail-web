import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { GitHubInstallation } from "../types/github.types";

export async function getInstallations(): Promise<GitHubInstallation[]> {
  try {
    return await apiClient<GitHubInstallation[]>(endpoints.github.installations);
  } catch (error) {
    console.warn("Failed to fetch GitHub installations:", error);
    return [];
  }
}

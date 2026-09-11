import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { GitHubInstallation } from "../types/github.types";

export async function getInstallations(): Promise<GitHubInstallation[]> {
  return apiClient<GitHubInstallation[]>(endpoints.github.installations);
}

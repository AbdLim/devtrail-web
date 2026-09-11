import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { GitHubInstallation } from "../types/github.types";

export async function getInstallations(): Promise<GitHubInstallation[]> {
  const res = await apiClient<GitHubInstallation[] | { installations: GitHubInstallation[]; data?: GitHubInstallation[] }>(
    endpoints.github.installations
  );
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    if (Array.isArray((res as any).installations)) return (res as any).installations;
    if (Array.isArray((res as any).data)) return (res as any).data;
  }
  return [];
}


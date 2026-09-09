import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { ConnectInstallationInput, GitHubInstallation } from "../types/github.types";

export async function connectInstallation(
  data: ConnectInstallationInput
): Promise<GitHubInstallation> {
  return apiClient<GitHubInstallation>(endpoints.github.installations, {
    method: "POST",
    body: data,
  });
}

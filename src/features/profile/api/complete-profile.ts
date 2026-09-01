import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { ProfileInput } from "../schemas/profile.schema";
import type { ProfileCompletionResult } from "../types/profile.types";

export async function completeProfile(data: ProfileInput): Promise<ProfileCompletionResult> {
  return apiClient<ProfileCompletionResult>(endpoints.profile.complete, {
    method: "PUT",
    body: data,
  });
}

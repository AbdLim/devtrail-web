import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { ResendOtpResult } from "../types/auth.types";

export async function resendOtp(email: string, signal?: AbortSignal): Promise<ResendOtpResult> {
  return apiClient<ResendOtpResult>(endpoints.auth.resendOtp, {
    method: "POST",
    body: { email },
    signal,
  });
}

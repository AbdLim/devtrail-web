import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { LoginInput } from "../schemas/login.schema";
import type { LoginResult } from "../types/auth.types";

export async function login(data: LoginInput, signal?: AbortSignal): Promise<LoginResult> {
  const result = await apiClient<Record<string, unknown>>(endpoints.auth.login, {
    method: "POST",
    body: data,
    signal,
  });

  const payload = (result?.data || result) as Record<string, unknown>;
  const accessToken =
    (payload?.access_token as string) ||
    (payload?.token as string) ||
    (result?.access_token as string) ||
    (result?.token as string);

  const refreshToken =
    (payload?.refresh_token as string) ||
    (result?.refresh_token as string);

  if (typeof document !== "undefined") {
    const thirtyDays = 60 * 60 * 24 * 30;
    if (accessToken) {
      document.cookie = `access_token=${encodeURIComponent(accessToken)}; path=/; max-age=${thirtyDays}; SameSite=Lax`;
    }
    if (refreshToken) {
      document.cookie = `refresh_token=${encodeURIComponent(refreshToken)}; path=/; max-age=${thirtyDays}; SameSite=Lax`;
    }
  }

  return (result as unknown) as LoginResult;
}

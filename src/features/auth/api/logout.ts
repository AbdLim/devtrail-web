import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function logout(): Promise<void> {
  if (typeof document !== "undefined") {
    document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "refresh_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "session=; path=/; max-age=0; SameSite=Lax";
  }

  try {
    await apiClient<void>(endpoints.auth.logout, { method: "POST" });
  } catch {
    // Ignore error if session already cleared
  }
}

import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { AuthSession, User } from "../types/auth.types";

export async function getSessionClient(): Promise<AuthSession> {
  try {
    const data = await apiClient<Record<string, unknown>>(endpoints.auth.session);
    if (!data) return { authenticated: false, user: null };

    const userRaw = (data.user || data) as Record<string, unknown>;
    if (!userRaw || (!userRaw.id && !userRaw.email)) {
      return { authenticated: false, user: null };
    }

    const firstname = (userRaw.firstname || userRaw.firstName || "") as string;
    const lastname = (userRaw.lastname || userRaw.lastName || "") as string;
    const isEmailVerified = Boolean(userRaw.is_email_verified ?? userRaw.emailVerified ?? true);
    const displayName = (userRaw.displayName as string) || `${firstname} ${lastname}`.trim() || (userRaw.email as string);

    const user: User = {
      id: (userRaw.id as string) || "",
      email: (userRaw.email as string) || "",
      firstname,
      lastname,
      age: typeof userRaw.age === "number" ? userRaw.age : undefined,
      is_email_verified: isEmailVerified,
      emailVerified: isEmailVerified,
      profileComplete: Boolean(firstname && lastname),
      profile: {
        firstName: firstname,
        lastName: lastname,
        displayName,
      },
    };

    return {
      authenticated: true,
      user,
    };
  } catch {
    return {
      authenticated: false,
      user: null,
    };
  }
}

import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { AuthSession, User } from "../types/auth.types";

export async function getSessionClient(): Promise<AuthSession> {
  try {
    const data = await apiClient<Record<string, unknown>>(endpoints.auth.session);
    if (!data) return { authenticated: false, user: null };

    // The API wraps the user in a `data` envelope: { success, data: { id, email, profile, ... } }
    const dataEnvelope = (data.data || data) as Record<string, unknown>;
    const userRaw = (dataEnvelope.user || dataEnvelope) as Record<string, unknown>;
    if (!userRaw || (!userRaw.id && !userRaw.email)) {
      return { authenticated: false, user: null };
    }

    const firstname = (userRaw.firstname || userRaw.firstName || "") as string;
    const lastname = (userRaw.lastname || userRaw.lastName || "") as string;
    const isEmailVerified = Boolean(userRaw.is_email_verified ?? userRaw.isEmailVerified ?? userRaw.emailVerified ?? false);
    // Read from the real API field — do NOT compute locally
    const isProfileCompleted = Boolean(userRaw.is_profile_completed ?? userRaw.isProfileCompleted ?? userRaw.profileComplete ?? false);

    const profileRaw = userRaw.profile as Record<string, unknown> | null | undefined;

    const user: User = {
      id: (userRaw.id as string) || "",
      email: (userRaw.email as string) || "",
      firstname,
      lastname,
      age: typeof userRaw.age === "number" ? userRaw.age : undefined,
      is_email_verified: isEmailVerified,
      emailVerified: isEmailVerified,
      is_profile_completed: isProfileCompleted,
      profileComplete: isProfileCompleted,
      // Map all rich profile sub-fields returned by GET /auth/profile
      profile: profileRaw
        ? {
            id: profileRaw.id as string,
            username: profileRaw.username as string,
            bio: profileRaw.bio as string,
            avatarUrl: (profileRaw.avatarUrl as string) || null,
            jobTitle: profileRaw.jobTitle as string,
            company: profileRaw.company as string,
            location: profileRaw.location as string,
            websiteUrl: profileRaw.websiteUrl as string,
            githubUsername: profileRaw.githubUsername as string,
            skills: Array.isArray(profileRaw.skills) ? (profileRaw.skills as string[]) : [],
            timezone: profileRaw.timezone as string,
            firstName: (profileRaw.firstName as string) || firstname,
            lastName: (profileRaw.lastName as string) || lastname,
            displayName: (profileRaw.username || `${firstname} ${lastname}`.trim() || userRaw.email) as string,
          }
        : {
            firstName: firstname,
            lastName: lastname,
            displayName: `${firstname} ${lastname}`.trim() || (userRaw.email as string),
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

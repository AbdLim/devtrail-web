import "server-only";
import { cookies } from "next/headers";
import { serverApi } from "@/lib/api/server";
import { endpoints } from "@/lib/api/endpoints";
import type { AuthSession, User } from "@/features/auth/types/auth.types";
import { ApiError } from "@/lib/api/api-error";

const BASE_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

async function refreshServerToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoints.auth.refreshToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const body = (await res.json()) as Record<string, unknown>;
    const payload = (body?.data || body) as Record<string, unknown>;
    const newAccessToken =
      (payload?.access_token as string) ||
      (payload?.token as string) ||
      (body?.access_token as string);

    const newRefreshToken =
      (payload?.refresh_token as string) ||
      (body?.refresh_token as string);

    const cookieStore = await cookies();
    const thirtyDays = 60 * 60 * 24 * 30;

    if (newAccessToken) {
      try {
        cookieStore.set("access_token", newAccessToken, {
          path: "/",
          maxAge: thirtyDays,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      } catch {
        // Ignored if in read-only context
      }
    }

    if (newRefreshToken) {
      try {
        cookieStore.set("refresh_token", newRefreshToken, {
          path: "/",
          maxAge: thirtyDays,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      } catch {
        // Ignored if in read-only context
      }
    }

    return newAccessToken || null;
  } catch {
    return null;
  }
}

function parseUserData(data: Record<string, unknown>): User | null {
  const userRaw = (data.user || data) as Record<string, unknown>;
  if (!userRaw || (!userRaw.id && !userRaw.email)) return null;

  const firstname = (userRaw.firstname || userRaw.firstName || "") as string;
  const lastname = (userRaw.lastname || userRaw.lastName || "") as string;
  const isEmailVerified = Boolean(userRaw.is_email_verified ?? userRaw.emailVerified ?? true);
  const displayName = (userRaw.displayName as string) || `${firstname} ${lastname}`.trim() || (userRaw.email as string);

  return {
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
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  try {
    const data = await serverApi<Record<string, unknown>>(endpoints.auth.session);
    if (data) {
      const user = parseUserData(data);
      if (user) {
        return { authenticated: true, user };
      }
    }
  } catch (err) {
    if (err instanceof ApiError && (err.isUnauthorized() || err.status === 401 || err.status === 403)) {
      if (refreshToken) {
        const newAccessToken = await refreshServerToken(refreshToken);
        if (newAccessToken) {
          try {
            const freshData = await serverApi<Record<string, unknown>>(endpoints.auth.session);
            if (freshData) {
              const freshUser = parseUserData(freshData);
              if (freshUser) {
                return { authenticated: true, user: freshUser };
              }
            }
          } catch {
            return null;
          }
        }
      }
    }
    return null;
  }

  if (refreshToken) {
    const newAccessToken = await refreshServerToken(refreshToken);
    if (newAccessToken) {
      try {
        const freshData = await serverApi<Record<string, unknown>>(endpoints.auth.session);
        if (freshData) {
          const freshUser = parseUserData(freshData);
          if (freshUser) {
            return { authenticated: true, user: freshUser };
          }
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

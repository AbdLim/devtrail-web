import { parseResponse } from "./api-response";
import { ApiError } from "./api-error";
import { endpoints } from "./endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge = 60 * 60 * 24 * 30) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=None;Secure`;
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getCookie("refresh_token");
  if (!refreshToken) return null;

  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}${endpoints.auth.refreshToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) {
        throw new Error("Refresh failed");
      }

      const body = (await res.json()) as Record<string, unknown>;
      const payload = (body?.data || body) as Record<string, unknown>;
      const newAccessToken =
        (payload?.access_token as string) ||
        (payload?.token as string) ||
        (body?.access_token as string);

      const newRefreshToken =
        (payload?.refresh_token as string) ||
        (body?.refresh_token as string);

      if (newAccessToken) {
        setCookie("access_token", newAccessToken);
      }
      if (newRefreshToken) {
        setCookie("refresh_token", newRefreshToken);
      }

      return newAccessToken || null;
    } catch {
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  signal?: AbortSignal;
  retryOnUnauthorized?: boolean;
};

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, signal, headers, retryOnUnauthorized = true, ...rest } = options;

  const fullUrl = `${BASE_URL}${path}`;
  const token = getCookie("access_token") || getCookie("token") || getCookie("session");
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  console.log(`[API CLIENT] Sending ${options.method || "GET"} request to:`, fullUrl, {
    hasToken: !!token,
    body: body ? JSON.stringify(body) : undefined,
  });

  const res = await fetch(fullUrl, {
    ...rest,
    credentials: "include",
    signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).catch((err: unknown) => {
    console.error(`[API CLIENT] Fetch network error for ${fullUrl}:`, err);
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new ApiError("Network request failed. Check your connection.", 0);
  });

  console.log(`[API CLIENT] Received response for ${fullUrl}:`, {
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
  });

  if (res.status === 401 && retryOnUnauthorized && path !== endpoints.auth.login && path !== endpoints.auth.refreshToken) {
    console.warn(`[API CLIENT] 401 received for ${fullUrl}, attempting token refresh...`);
    const newToken = await refreshAccessToken();
    if (newToken) {
      console.log(`[API CLIENT] Token refresh succeeded, retrying request to ${fullUrl}`);
      return apiClient<T>(path, {
        ...options,
        retryOnUnauthorized: false,
      });
    }
  }

  return parseResponse<T>(res);
}

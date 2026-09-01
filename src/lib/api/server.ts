import "server-only";
import { cookies } from "next/headers";
import { parseResponse } from "./api-response";
import { ApiError } from "./api-error";

const BASE_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function serverApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const token =
    cookieStore.get("access_token")?.value ||
    cookieStore.get("token")?.value ||
    cookieStore.get("session")?.value;

  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookieHeader,
      ...authHeaders,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  }).catch((err: unknown) => {
    if (err instanceof Error) {
      throw new ApiError(`Upstream request failed: ${err.message}`, 0);
    }
    throw new ApiError("Upstream request failed", 0);
  });

  return parseResponse<T>(res);
}

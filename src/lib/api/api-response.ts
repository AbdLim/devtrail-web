import type { ApiSuccess } from "@/types/api";
import { ApiError } from "./api-error";

export async function parseResponse<T>(res: Response): Promise<T> {
  let body: unknown;

  try {
    body = await res.json();
  } catch {
    throw new ApiError("Unexpected response from server", res.status);
  }

  const payload = body as Record<string, unknown>;

  if (!res.ok || payload?.success === false) {
    const errorObj = payload?.error as Record<string, unknown> | undefined;
    const message =
      (typeof errorObj?.message === "string" ? errorObj.message : null) ||
      (typeof payload?.message === "string" ? payload.message : null) ||
      "Request failed";

    const code =
      (typeof errorObj?.code === "string" ? errorObj.code : null) ||
      (typeof payload?.code === "string" ? payload.code : null) ||
      "ERROR";

    const fields = (errorObj?.fields || payload?.details || payload?.fields) as Record<string, string[]> | undefined;

    throw new ApiError(message, res.status, {
      code,
      message,
      fields,
    });
  }

  const successPayload = payload as ApiSuccess<T>;
  return (successPayload.data !== undefined ? successPayload.data : (payload as unknown)) as T;
}

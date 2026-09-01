import type { ApiErrorBody } from "@/types/api";

export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string[]>;

  constructor(message: string, status: number, body: Partial<ApiErrorBody> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code ?? "UNKNOWN_ERROR";
    this.fields = body.fields;
  }

  isUnauthorized() {
    return this.status === 401;
  }

  isForbidden() {
    return this.status === 403;
  }

  isNotFound() {
    return this.status === 404;
  }

  isValidation() {
    return this.status === 422 || (this.fields != null && Object.keys(this.fields).length > 0);
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

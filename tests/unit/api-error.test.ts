import { describe, it, expect } from "vitest";
import { ApiError, isApiError } from "@/lib/api/api-error";
import { getAuthErrorMessage, isEmailVerificationRequired } from "@/features/auth/utils/auth-error";

describe("API Error Utilities", () => {
  it("correctly identifies ApiError instance", () => {
    const err = new ApiError("Not found", 404, { code: "NOT_FOUND" });
    expect(isApiError(err)).toBe(true);
    expect(err.isNotFound()).toBe(true);
    expect(err.isUnauthorized()).toBe(false);
  });

  it("maps known backend codes to human messages", () => {
    const err = new ApiError("Raw error", 401, { code: "INVALID_CREDENTIALS" });
    expect(getAuthErrorMessage(err)).toBe("Email or password is incorrect.");
  });

  it("falls back to error message when code is unknown", () => {
    const err = new ApiError("Custom failure message", 500);
    expect(getAuthErrorMessage(err)).toBe("Custom failure message");
  });

  it("detects email verification required code", () => {
    const err = new ApiError("Verify email", 403, { code: "EMAIL_VERIFICATION_REQUIRED" });
    expect(isEmailVerificationRequired(err)).toBe(true);
  });
});

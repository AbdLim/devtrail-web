import { ApiError } from "@/lib/api/api-error";

const errorMessages: Record<string, string> = {
  INVALID_CREDENTIALS: "Email or password is incorrect.",
  EMAIL_ALREADY_EXISTS: "An account already exists with this email.",
  OTP_INVALID: "The code is incorrect.",
  OTP_EXPIRED: "The code has expired. Request a new one.",
  OTP_RATE_LIMITED: "Please wait before requesting another code.",
  PROFILE_ALREADY_COMPLETE: "Your profile is already complete.",
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
};

export function getAuthErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code && errorMessages[err.code]) {
      return errorMessages[err.code];
    }
    return err.message || "Something went wrong.";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Something went wrong.";
}

export function isEmailVerificationRequired(err: unknown): boolean {
  if (err instanceof ApiError) {
    return (
      err.code === "EMAIL_VERIFICATION_REQUIRED" ||
      err.status === 403 ||
      /verify your email/i.test(err.message)
    );
  }
  return false;
}

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Starter";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const PROTECTED_ROUTES = ["/dashboard"];
export const AUTH_ROUTES = ["/login", "/signup", "/verify-otp"];
export const ONBOARDING_ROUTES = ["/complete-profile"];

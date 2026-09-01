type AnalyticsEvent =
  | "signup_started"
  | "signup_completed"
  | "otp_verified"
  | "profile_completed"
  | "login_completed"
  | "logout_completed";

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", event, properties ?? "");
    return;
  }
  // swap this out for the real vendor SDK once chosen
}

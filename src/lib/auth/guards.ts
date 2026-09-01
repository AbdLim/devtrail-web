import { redirect } from "next/navigation";
import type { AuthSession, User } from "@/features/auth/types/auth.types";

export function requireAuth(session: AuthSession | null): asserts session is AuthSession & { authenticated: true; user: User } {
  if (!session?.authenticated || !session.user) {
    redirect("/login");
  }
}

export function requireVerifiedEmail(session: AuthSession | null): asserts session is AuthSession & { authenticated: true; user: User } {
  requireAuth(session);
  if (!session.user.emailVerified) {
    redirect("/verify-otp");
  }
}

export function requireCompleteProfile(session: AuthSession | null): asserts session is AuthSession & { authenticated: true; user: User } {
  requireVerifiedEmail(session);
  if (!session.user.profileComplete) {
    redirect("/complete-profile");
  }
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.authenticated || !session.user) {
    redirect("/login");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-otp");
  }

  if (!session.user.profileComplete) {
    redirect("/complete-profile");
  }

  return <AppShell>{children}</AppShell>;
}

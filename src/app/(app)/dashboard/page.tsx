import { getSession } from "@/lib/auth/session";
import { DashboardWelcome } from "@/features/dashboard/components/dashboard-welcome";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();

  // Guard in (app)/layout guarantees session & user exist
  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardWelcome user={session.user} />
    </div>
  );
}

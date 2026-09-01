import type { User } from "@/features/auth/types/auth.types";

type DashboardWelcomeProps = {
  user: User;
};

export function DashboardWelcome({ user }: DashboardWelcomeProps) {
  const name = user.profile?.displayName ?? user.profile?.firstName ?? user.email;

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold text-white">Welcome, {name}</h1>
      <p className="text-white/60">Authentication is set up and working.</p>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <p>
          Signed in as <span className="font-medium text-white">{user.email}</span>
        </p>
        {user.profile?.displayName && (
          <p>
            Display name: <span className="font-medium text-white">{user.profile.displayName}</span>
          </p>
        )}
      </div>
    </div>
  );
}

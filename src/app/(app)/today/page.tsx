import { getSession } from "@/lib/auth/session";
import { Calendar, Sparkles, GitCommit, GitPullRequest, Bookmark, Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Today",
};

export default async function TodayPage() {
  const session = await getSession();
  const user = session?.user;

  const displayName = user?.profile?.username || user?.firstname || "Developer";
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Date & Quiet Greeting */}
      <div className="space-y-1 border-b border-[#252A28] pb-4">
        <p className="text-xs font-mono text-[#737A76] uppercase tracking-wider">{todayDate}</p>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#F1F0EA]">
          Good day, {displayName}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Canvas: Activity River & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-[#252A28] bg-[#121515] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#91AD9D]" />
                <h2 className="text-sm font-medium text-[#F1F0EA]">Today's Activity River</h2>
              </div>
              <span className="text-[11px] font-mono text-[#737A76]">Live Metadata Feed</span>
            </div>

            {/* Quiet Stream Items / Empty state guide */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-md border border-[#252A28] bg-[#0D0F0F] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#91AD9D] bg-[#91AD9D]/15 px-1.5 py-0.5 rounded border border-[#91AD9D]/30">
                      Phase 1 & 2
                    </span>
                    <span className="text-[#F1F0EA] font-medium">Quiet Workbench Initialized</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#737A76]">Just now</span>
                </div>
                <p className="text-xs text-[#A3AAA5] leading-relaxed">
                  Design tokens, layout frame (Left Rail, Context Bar, Inspector Drawer, Quick Capture Dock, Command Palette), and Phase 1/2 REST API identity flows are ready.
                </p>
              </div>

              <div className="p-4 rounded-md border border-dashed border-[#252A28] bg-[#0D0F0F]/50 text-center py-6 space-y-2">
                <p className="text-xs text-[#A3AAA5]">Connect your GitHub repositories in Phase 3 to start recording automated work evidence.</p>
                <Link
                  href="/settings/integrations"
                  className="inline-flex items-center gap-1.5 text-xs text-[#91AD9D] hover:underline font-mono"
                >
                  <span>Setup GitHub App connection →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widget Column */}
        <div className="space-y-6">
          {/* AI Daily Summary Card Placeholder */}
          <div className="rounded-lg border border-[#252A28] bg-[#121515] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#91AD9D]" />
              <h3 className="text-sm font-medium text-[#F1F0EA]">AI Daily Summary</h3>
            </div>
            <p className="text-xs text-[#737A76] leading-relaxed">
              Your daily engineering summary will be automatically generated as work evidence and notes accumulate.
            </p>
          </div>

          {/* Quick Capture Hint Card */}
          <div className="rounded-lg border border-[#252A28] bg-[#121515] p-5 space-y-3">
            <h3 className="text-xs font-mono text-[#A3AAA5] uppercase tracking-wider">Quick Note Dock</h3>
            <p className="text-xs text-[#737A76] leading-relaxed">
              Press <kbd className="font-mono text-[10px] bg-[#171A19] border border-[#252A28] px-1.5 py-0.5 rounded text-[#F1F0EA]">C</kbd> anywhere in the workbench to capture technical learnings, decisions, or accomplishments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

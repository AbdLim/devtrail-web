import { getSession } from "@/lib/auth/session";
import { Calendar, Sparkles, GitBranch, ArrowRight, Zap } from "lucide-react";
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
    <div className="space-y-6">
      {/* Date & Quiet Greeting Header */}
      <div className="space-y-1 border-b border-[#252A28] pb-4">
        <p className="text-xs font-mono text-[#737A76] uppercase tracking-wider">{todayDate}</p>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#F1F0EA]">
          Good day, {displayName}
        </h1>
        <p className="text-xs text-[#A3AAA5]">
          Your engineering activity river and personal proof-of-work workbench.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Activity River Stream */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-lg border border-[#252A28] bg-[#121515] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#252A28] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#91AD9D]" />
                <h2 className="text-xs font-semibold text-[#F1F0EA]">Today's Activity River</h2>
              </div>
              <span className="text-[10px] font-mono text-[#737A76]">Live Feed</span>
            </div>

            {/* Stream Timeline Items */}
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-md border border-[#252A28] bg-[#0D0F0F] space-y-2 hover:border-[#323835] transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#91AD9D] bg-[#91AD9D]/10 px-1.5 py-0.5 rounded border border-[#91AD9D]/20 font-medium">
                      Phase 1 & 2
                    </span>
                    <span className="text-[#F1F0EA] font-medium">Quiet Workbench Initialized</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#737A76]">Just now</span>
                </div>
                <p className="text-xs text-[#A3AAA5] leading-relaxed">
                  Design tokens, layout frame (Left Rail, Context Bar, Inspector Drawer, Quick Capture Dock, Command Palette), and Phase 1 & 2 REST API identity flows are ready.
                </p>
              </div>

              <div className="p-5 rounded-md border border-dashed border-[#252A28] bg-[#0D0F0F]/50 text-center space-y-3">
                <div className="space-y-1">
                  <h3 className="text-xs font-medium text-[#F1F0EA]">Connect GitHub Repositories</h3>
                  <p className="text-xs text-[#737A76] max-w-sm mx-auto">
                    Track automatic commit metadata, pull requests, and releases to build your verified career memory.
                  </p>
                </div>
                <Link
                  href="/settings/integrations"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D0F0F] bg-[#91AD9D] px-3.5 py-1.5 rounded-md hover:bg-[#B1CCBC] transition-colors"
                >
                  <span>Setup GitHub Connection</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Cards */}
        <div className="space-y-5">
          {/* AI Summary Placeholder */}
          <div className="rounded-lg border border-[#252A28] bg-[#121515] p-4 space-y-2.5">
            <div className="flex items-center gap-2 border-b border-[#252A28] pb-2.5">
              <Sparkles className="h-4 w-4 text-[#91AD9D]" />
              <h3 className="text-xs font-semibold text-[#F1F0EA]">AI Daily Summary</h3>
            </div>
            <p className="text-xs text-[#737A76] leading-relaxed">
              Your daily engineering summary will be automatically synthesized as work evidence and notes accumulate.
            </p>
          </div>

          {/* Quick Capture Hint */}
          <div className="rounded-lg border border-[#252A28] bg-[#121515] p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-[#91AD9D]" />
              <h3 className="text-xs font-semibold text-[#F1F0EA]">Quick Note Dock</h3>
            </div>
            <p className="text-xs text-[#737A76] leading-relaxed">
              Press <kbd className="font-mono text-[10px] bg-[#0D0F0F] border border-[#252A28] px-1.5 py-0.5 rounded text-[#F1F0EA]">C</kbd> anywhere on your keyboard to capture technical learnings or decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

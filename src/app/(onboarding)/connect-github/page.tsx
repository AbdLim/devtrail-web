"use client";

import Link from "next/link";
import { FolderGit2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ConnectGitHubOnboardingPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center select-none py-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#99B9A3]/10 border border-[#99B9A3]/30 text-[#99B9A3]">
        <FolderGit2 className="h-6 w-6 stroke-[1.5px]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-[24px] font-semibold text-[#F5F3EF]">
          Connect GitHub
        </h1>
        <p className="text-[14px] text-[#C4CCC4] leading-[1.5]">
          DevTrail automatically imports your commits, pull requests, and issues into your personal proof-of-work timeline.
        </p>
      </div>

      {/* Railway technical notice features list */}
      <div className="rounded-[8px] border border-[#222823] bg-[#121613] p-4 text-left space-y-3 font-mono text-[12px] text-[#8E968E]">
        <div className="flex items-center gap-2 text-[#C4CCC4]">
          <CheckCircle2 className="h-4 w-4 text-[#99B9A3] shrink-0" />
          <span>Automatic commit & PR tracking</span>
        </div>
        <div className="flex items-center gap-2 text-[#C4CCC4]">
          <CheckCircle2 className="h-4 w-4 text-[#99B9A3] shrink-0" />
          <span>Private & public repository support</span>
        </div>
        <div className="flex items-center gap-2 text-[#C4CCC4]">
          <CheckCircle2 className="h-4 w-4 text-[#99B9A3] shrink-0" />
          <span>Zero code change or webhook setup required</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <a
          href={process.env.NEXT_PUBLIC_GITHUB_APP_URL || "https://github.com/apps/devtrail/installations/new"}
          className="flex w-full items-center justify-center gap-2 h-[40px] rounded-[6px] bg-[#99B9A3] text-[13px] font-semibold text-[#090B0A] hover:bg-[#B4CEBC] transition-colors"
        >
          <span>Connect GitHub App</span>
          <ArrowRight className="h-4 w-4 stroke-[2px]" />
        </a>

        <Link
          href="/today"
          className="block font-mono text-[12px] text-[#8E968E] hover:text-[#F5F3EF] transition-colors"
        >
          Skip for now →
        </Link>
      </div>
    </div>
  );
}

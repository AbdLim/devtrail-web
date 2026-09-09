"use client";

import Link from "next/link";
import { FolderGit2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function GitHubConnectCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[8px] border border-[#222823] bg-[#121613] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-[16px] w-[16px] stroke-[1.5px] text-[#99B9A3]" />
          <h3 className="text-[14px] font-semibold text-[#F5F3EF]">
            GitHub is not connected
          </h3>
        </div>
        <p className="font-mono text-[11px] text-[#8E968E]">
          Bring commits, pull requests, issues, and releases into your activity river.
        </p>
      </div>

      <Link
        href="/connect-github"
        className="shrink-0 inline-flex items-center gap-2 h-[34px] rounded-[6px] bg-[#171C18] border border-[#222823] px-3.5 font-mono text-[12px] font-medium text-[#99B9A3] hover:border-[#99B9A3]/50 hover:bg-[#1B211D] transition-colors"
      >
        <span>Connect GitHub</span>
        <ArrowRight className="h-[13px] w-[13px] stroke-[1.5px]" />
      </Link>
    </div>
  );
}

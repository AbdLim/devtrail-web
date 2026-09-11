"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FolderGit2, ArrowRight, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
import { connectInstallation } from "@/features/github/api/connect-installation";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

function ConnectGitHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const installationId = searchParams.get("installation_id") || searchParams.get("installationId");
  const setupAction = searchParams.get("setup_action");

  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!installationId) return;

    let isMounted = true;
    async function handleInstallation() {
      setConnecting(true);
      setError(null);
      try {
        console.log("[GITHUB OAUTH] Connecting installation ID:", installationId);

        // Fetch the user's real GitHub username from their profile
        let accountLogin = "GitHub User";
        try {
          const profileData = await apiClient<Record<string, unknown>>(endpoints.auth.session);
          const dataEnvelope = (profileData?.data || profileData) as Record<string, unknown>;
          const userRaw = (dataEnvelope?.user || dataEnvelope) as Record<string, unknown>;
          const profileRaw = userRaw?.profile as Record<string, unknown> | null | undefined;
          const githubUsername = profileRaw?.githubUsername as string | undefined;
          const firstname = (userRaw?.firstname || userRaw?.firstName || "") as string;
          const lastname = (userRaw?.lastname || userRaw?.lastName || "") as string;
          // Prefer GitHub username, then full name, then email as fallback
          accountLogin =
            githubUsername ||
            [firstname, lastname].filter(Boolean).join(" ") ||
            (userRaw?.email as string) ||
            "GitHub User";
          console.log("[GITHUB OAUTH] Using accountLogin:", accountLogin);
        } catch {
          // Non-fatal — proceed with fallback
          console.warn("[GITHUB OAUTH] Could not fetch profile for accountLogin, using fallback");
        }

        await connectInstallation({
          installationId: installationId!,
          accountLogin,
          accountType: "User",
          repositories: [],
        });

        if (isMounted) {
          queryClient.invalidateQueries({ queryKey: ["github"] });
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          console.log("[GITHUB OAUTH] Successfully connected installation, redirecting to /today");
          router.push("/today");
        }
      } catch (err) {
        console.error("[GITHUB OAUTH] Failed to link installation:", err);
        if (isMounted) {
          setError("Failed to complete GitHub App linking. Please try again.");
          setConnecting(false);
        }
      }
    }

    handleInstallation();

    return () => {
      isMounted = false;
    };
  }, [installationId, queryClient, router]);

  if (connecting) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center select-none py-12">
        <RefreshCw className="mx-auto h-8 w-8 text-[#99B9A3] animate-spin stroke-[1.5px]" />
        <div className="space-y-1">
          <h2 className="text-[18px] font-semibold text-[#F5F3EF]">
            Connecting your GitHub App...
          </h2>
          <p className="font-mono text-[11px] text-[#8E968E]">
            Installation ID: {installationId}
          </p>
        </div>
      </div>
    );
  }

  const githubAppUrl =
    process.env.NEXT_PUBLIC_GITHUB_APP_URL ||
    "https://github.com/apps/devtrail-app-dev/installations/new";

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

      {error && (
        <div className="flex items-center gap-2 rounded-[6px] border border-[#CB8585]/30 bg-[#CB8585]/10 p-3 text-left text-[12px] text-[#CB8585]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
          href={githubAppUrl}
          target="_blank"
          rel="noopener noreferrer"
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

export default function ConnectGitHubOnboardingPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-[#8E968E]">Loading GitHub connection...</div>}>
      <ConnectGitHubContent />
    </Suspense>
  );
}

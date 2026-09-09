"use client";

import { FolderGit2, Plus, RefreshCw } from "lucide-react";
import { useInstallations } from "@/features/github/hooks/use-installations";
import { useGitHubRepositories } from "@/features/github/hooks/use-github-repositories";
import { RepositoryListItem } from "@/features/github/components/repository-list-item";
import { GitHubConnectCard } from "@/features/github/components/github-connect-card";

export default function IntegrationsSettingsPage() {
  const { data: installations = [], isLoading: loadingInstallations, refetch } = useInstallations();
  const { data: repositories = [], isLoading: loadingRepos } = useGitHubRepositories();

  const isConnected = installations.length > 0;

  return (
    <div className="space-y-8 select-none max-w-4xl">
      {/* Page Header */}
      <div className="space-y-1">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#8E968E]">
          Settings
        </p>
        <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-[#F5F3EF]">
          Integrations & Sources
        </h1>
        <p className="text-[14px] text-[#C4CCC4]">
          Manage connected developer tools and configure repository activity tracking.
        </p>
      </div>

      {/* GitHub App Connection Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#222823] pb-3">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-[16px] w-[16px] stroke-[1.5px] text-[#99B9A3]" />
            <h2 className="text-[16px] font-semibold text-[#F5F3EF]">
              GitHub App Installations
            </h2>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="p-1.5 rounded text-[#8E968E] hover:text-[#F5F3EF] hover:bg-[#171C18] transition-colors"
            title="Refresh installations"
          >
            <RefreshCw className="h-[13px] w-[13px] stroke-[1.5px]" />
          </button>
        </div>

        {loadingInstallations ? (
          <div className="h-20 bg-[#121613] rounded animate-pulse" />
        ) : isConnected ? (
          <div className="space-y-3">
            {installations.map((inst) => (
              <div
                key={inst.id || inst.installationId}
                className="flex items-center justify-between gap-4 rounded-[8px] border border-[#222823] bg-[#121613] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171C18] border border-[#222823] font-mono text-[12px] font-bold text-[#99B9A3]">
                    {inst.accountLogin?.slice(0, 2).toUpperCase() || "GH"}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#F5F3EF]">
                      {inst.accountLogin}
                    </h3>
                    <p className="font-mono text-[11px] text-[#8E968E]">
                      {inst.accountType || "User"} Account · ID: {inst.installationId}
                    </p>
                  </div>
                </div>

                <a
                  href="https://github.com/apps/devtrail/installations/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[#99B9A3] hover:underline"
                >
                  Configure on GitHub ↗
                </a>
              </div>
            ))}
          </div>
        ) : (
          <GitHubConnectCard />
        )}
      </div>

      {/* Repositories Tracking Management Section */}
      {isConnected && (
        <div className="space-y-4 pt-4">
          <div className="border-b border-[#222823] pb-3">
            <h2 className="text-[16px] font-semibold text-[#F5F3EF]">
              Repository Activity Tracking ({repositories.length})
            </h2>
            <p className="font-mono text-[11px] text-[#8E968E] mt-0.5">
              Toggle tracking to pause or resume activity river capture for individual repositories.
            </p>
          </div>

          {loadingRepos ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-[#121613] rounded animate-pulse" />
              ))}
            </div>
          ) : repositories.length > 0 ? (
            <div className="space-y-2">
              {repositories.map((repo) => (
                <RepositoryListItem key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="rounded-[8px] border border-[#222823] bg-[#121613] p-8 text-center text-[13px] text-[#8E968E]">
              No repositories imported yet. Install or select repositories in your GitHub App settings.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

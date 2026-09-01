import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ArrowRight, Sparkles, Shield, GitCommit } from "lucide-react";

export default async function HomePage() {
  const session = await getSession();

  if (session?.authenticated && session.user?.emailVerified && session.user?.profileComplete) {
    redirect("/today");
  }

  return (
    <div className="min-h-screen bg-[#0D0F0F] text-[#F1F0EA] flex flex-col font-sans selection:bg-[#91AD9D]/30 selection:text-[#F1F0EA]">
      {/* Top Header Navigation Bar */}
      <header className="flex h-16 items-center justify-between px-6 md:px-12 border-b border-[#252A28] bg-[#0D0F0F]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo_wordmark_light.png"
            alt="DevTrail Logo"
            width={130}
            height={28}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-mono text-[#A3AAA5] hover:text-[#F1F0EA] transition"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 rounded-md bg-[#91AD9D] px-3.5 py-1.5 text-xs font-semibold text-[#0D0F0F] hover:bg-[#B1CCBC] transition"
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto my-12 space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#91AD9D]/30 bg-[#91AD9D]/10 px-3 py-1 text-xs font-mono text-[#91AD9D]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>DevTrail MVP1 Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#F1F0EA] leading-tight">
          Your engineering work, <span className="text-[#91AD9D]">remembered.</span>
        </h1>

        <p className="max-w-2xl text-sm md:text-base text-[#A3AAA5] leading-relaxed">
          DevTrail collects work evidence from GitHub and manual notes to create a trustworthy, evidence-backed career memory and proof-of-work for developers.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-md bg-[#91AD9D] px-6 py-2.5 text-xs font-semibold text-[#0D0F0F] hover:bg-[#B1CCBC] transition shadow-lg shadow-[#91AD9D]/10"
          >
            <span>Sign in to Workbench</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 rounded-md border border-[#252A28] bg-[#121515] px-6 py-2.5 text-xs font-medium text-[#F1F0EA] hover:bg-[#1B1F1E] hover:border-[#323835] transition"
          >
            <span>Create Free Account</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 text-left w-full">
          <div className="p-4 rounded-lg border border-[#252A28] bg-[#121515] space-y-2">
            <div className="p-2 rounded bg-[#171A19] border border-[#252A28] w-fit">
              <GitCommit className="h-4 w-4 text-[#91AD9D]" />
            </div>
            <h3 className="text-xs font-semibold text-[#F1F0EA]">Evidence-Backed</h3>
            <p className="text-[11px] text-[#737A76] leading-normal">
              Connect GitHub repos to build normalized evidence timelines of commits, PRs, and releases.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-[#252A28] bg-[#121515] space-y-2">
            <div className="p-2 rounded bg-[#171A19] border border-[#252A28] w-fit">
              <Sparkles className="h-4 w-4 text-[#91AD9D]" />
            </div>
            <h3 className="text-xs font-semibold text-[#F1F0EA]">Career Memory</h3>
            <p className="text-[11px] text-[#737A76] leading-normal">
              AI daily & weekly summaries extract true accomplishments and technical learnings.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-[#252A28] bg-[#121515] space-y-2">
            <div className="p-2 rounded bg-[#171A19] border border-[#252A28] w-fit">
              <Shield className="h-4 w-4 text-[#91AD9D]" />
            </div>
            <h3 className="text-xs font-semibold text-[#F1F0EA]">Developer-Owned</h3>
            <p className="text-[11px] text-[#737A76] leading-normal">
              Private by default. You control your record and select what to publish on your public profile.
            </p>
          </div>
        </div>
      </main>

      {/* Restrained Footer */}
      <footer className="border-t border-[#252A28] py-6 px-6 text-center text-xs font-mono text-[#737A76]">
        &copy; {new Date().getFullYear()} DevTrail. Your engineering work, remembered.
      </footer>
    </div>
  );
}

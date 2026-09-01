import Link from "next/link";
import { Home, Search, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#090B0A]">
      <div className="text-center max-w-md">
        {/* Error code */}
        <p className="font-mono text-[72px] font-semibold text-[#F5F3EF] leading-none tracking-tight">
          404
        </p>

        {/* Label */}
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#99B9A3] mt-2">
          Page Not Found
        </p>

        {/* Description */}
        <p className="mt-6 text-[15px] text-[#C4CCC4] leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Quick actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/today"
            className="inline-flex items-center gap-2 h-[36px] px-4 rounded-[6px] bg-[#151916] border border-[#2B332D] text-[13px] font-medium text-[#99B9A3] hover:bg-[#191E1A] hover:border-[#99B9A3]/40 transition-colors"
          >
            <Calendar className="h-[14px] w-[14px] stroke-[1.5px]" />
            Go to Today
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 h-[36px] px-4 rounded-[6px] border border-transparent text-[13px] font-medium text-[#8E968E] hover:text-[#F5F3EF] hover:bg-[#191E1A] transition-colors"
          >
            <Search className="h-[14px] w-[14px] stroke-[1.5px]" />
            Search Memory
          </Link>
        </div>

        {/* Keyboard hint */}
        <p className="mt-8 font-mono text-[10px] text-[#6E766E]">
          Press <kbd className="px-1 py-0.5 rounded bg-[#151916] text-[#8E968E]">⌘K</kbd> to open command palette
        </p>
      </div>
    </main>
  );
}
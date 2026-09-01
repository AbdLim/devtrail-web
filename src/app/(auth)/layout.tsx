import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-[#0D0F0F] text-[#F1F0EA] font-sans selection:bg-[#91AD9D]/30 selection:text-[#F1F0EA]">
      {/* Brand Header with Logo */}
      <header className="mb-6">
        <Link href="/" className="flex items-center gap-2 transition opacity-90 hover:opacity-100">
          <Image
            src="/images/logo_wordmark_light.png"
            alt="DevTrail Logo"
            width={140}
            height={32}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="w-full flex justify-center">{children}</main>

      {/* Quiet Footer */}
      <footer className="mt-8 text-center text-[11px] font-mono text-[#737A76]">
        &copy; {new Date().getFullYear()} DevTrail. Engineering career memory.
      </footer>
    </div>
  );
}

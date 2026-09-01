import Link from "next/link";
import { APP_NAME } from "@/lib/config/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-neutral-950">
      <header className="mb-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-white/80 transition">
          {APP_NAME}
        </Link>
      </header>
      <main className="w-full flex justify-center">{children}</main>
      <footer className="mt-8 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
}

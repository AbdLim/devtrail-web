import Link from "next/link";
import { APP_NAME } from "@/lib/config/constants";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-white">{APP_NAME}</h1>
        <p className="text-white/60">
          Production-grade Next.js starter consuming an external REST API with full authentication.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}

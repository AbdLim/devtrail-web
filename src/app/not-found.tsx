import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h2 className="text-4xl font-bold text-white">404</h2>
      <p className="mt-2 text-sm text-white/60">Page not found</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Return home
      </Link>
    </main>
  );
}

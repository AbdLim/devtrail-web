import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div
      role="status"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="mt-4 text-sm text-white/60">Loading...</p>
        <span className="sr-only">Loading page</span>
      </div>
    </div>
  );
}

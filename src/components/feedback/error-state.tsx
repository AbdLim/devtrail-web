import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ErrorStateProps = {
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this content.",
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-red-500/20 bg-red-500/5",
        className,
      )}
    >
      <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/60 max-w-sm">{message}</p>
      {retry && (
        <button
          type="button"
          onClick={retry}
          className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className,
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mb-3" />
      <p className="text-sm text-white/60">{message}</p>
      <span className="sr-only">{message}</span>
    </div>
  );
}

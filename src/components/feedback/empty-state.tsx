import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title = "No items found",
  description = "There is nothing to display here yet.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-white/10 bg-white/5",
        className,
      )}
    >
      <FolderOpen className="h-10 w-10 text-white/40 mb-3" />
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/60 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

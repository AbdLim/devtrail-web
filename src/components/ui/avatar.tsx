import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Avatar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10 text-white",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full text-xs font-semibold uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

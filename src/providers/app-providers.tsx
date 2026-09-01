"use client";

import { QueryProvider } from "@/lib/query/query-provider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster theme="dark" position="top-right" richColors />
    </QueryProvider>
  );
}

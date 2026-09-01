"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <ErrorState
        title="Application Error"
        message="An unexpected error occurred. Please try again."
        retry={reset}
      />
    </div>
  );
}

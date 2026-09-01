"use client";

import { useQuery } from "@tanstack/react-query";
import { getSessionClient } from "../api/get-session";
import type { AuthSession } from "../types/auth.types";

export function useAuth() {
  const { data, isLoading, error } = useQuery<AuthSession>({
    queryKey: ["session"],
    queryFn: getSessionClient,
    retry: false,
  });

  return {
    user: data?.user ?? null,
    isAuthenticated: data?.authenticated ?? false,
    isLoading,
    error,
  };
}

import { useQuery } from "@tanstack/react-query";
import { getInstallations } from "../api/get-installations";

export function useInstallations() {
  return useQuery({
    queryKey: ["github", "installations"],
    queryFn: () => getInstallations(),
    retry: false,
    staleTime: 30_000,
  });
}

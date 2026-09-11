import { useQuery } from "@tanstack/react-query";
import { getRepositories } from "../api/get-repositories";

export function useGitHubRepositories() {
  return useQuery({
    queryKey: ["github", "repositories"],
    queryFn: () => getRepositories(),
    retry: false,
    staleTime: 30_000,
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleRepositoryTracking } from "../api/toggle-repository-tracking";

export function useToggleTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ repositoryId, isTracking }: { repositoryId: string; isTracking: boolean }) =>
      toggleRepositoryTracking(repositoryId, isTracking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

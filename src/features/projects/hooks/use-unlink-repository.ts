import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlinkRepository } from "../api/unlink-repository";

export function useUnlinkRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, repositoryId }: { projectId: string; repositoryId: string }) =>
      unlinkRepository(projectId, repositoryId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
  });
}

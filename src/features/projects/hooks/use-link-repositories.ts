import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkRepositories } from "../api/link-repositories";

export function useLinkRepositories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, repositoryIds }: { projectId: string; repositoryIds: string[] }) =>
      linkRepositories(projectId, repositoryIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
  });
}

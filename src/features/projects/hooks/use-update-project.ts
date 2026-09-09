import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../api/update-project";
import type { UpdateProjectInput } from "../types/project.types";

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectInput }) =>
      updateProject(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
  });
}

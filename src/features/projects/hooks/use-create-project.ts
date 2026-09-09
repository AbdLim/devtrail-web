import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../api/create-project";
import type { CreateProjectInput } from "../types/project.types";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

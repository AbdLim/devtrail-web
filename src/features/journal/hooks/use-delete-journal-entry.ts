import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJournalEntry } from "../api/delete-journal-entry";

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["activities", "timeline"] });
    },
  });
}

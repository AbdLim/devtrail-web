import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJournalEntry } from "../api/update-journal-entry";
import type { UpdateJournalInput } from "../types/journal.types";

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJournalInput }) =>
      updateJournalEntry(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["journal", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["activities", "timeline"] });
    },
  });
}

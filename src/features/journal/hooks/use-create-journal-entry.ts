import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJournalEntry } from "../api/create-journal-entry";
import type { CreateJournalInput } from "../types/journal.types";

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJournalInput) => createJournalEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["activities", "timeline"] });
    },
  });
}

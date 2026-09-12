import { useQuery } from "@tanstack/react-query";
import { getJournalEntry } from "../api/get-journal-entry";

export function useJournalEntry(id: string | null | undefined) {
  return useQuery({
    queryKey: ["journal", id],
    queryFn: () => (id ? getJournalEntry(id) : null),
    enabled: Boolean(id),
    retry: false,
    staleTime: 30_000,
  });
}

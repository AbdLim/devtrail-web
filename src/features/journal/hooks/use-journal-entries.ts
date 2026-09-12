import { useQuery } from "@tanstack/react-query";
import { getJournalEntries } from "../api/get-journal-entries";
import type { JournalQuery } from "../types/journal.types";

export function useJournalEntries(query: JournalQuery = {}) {
  return useQuery({
    queryKey: ["journal", query],
    queryFn: () => getJournalEntries(query),
    retry: false,
    staleTime: 30_000,
  });
}

import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { JournalEntry, UpdateJournalInput } from "../types/journal.types";

export async function updateJournalEntry(
  id: string,
  data: UpdateJournalInput
): Promise<JournalEntry> {
  const res = await apiClient<JournalEntry | { entry?: JournalEntry; data?: JournalEntry }>(
    endpoints.journal.update(id),
    {
      method: "PUT",
      body: data,
    }
  );
  if (res && typeof res === "object") {
    if ((res as any).entry) return (res as any).entry;
    if ((res as any).data && !Array.isArray((res as any).data)) return (res as any).data;
  }
  return res as JournalEntry;
}

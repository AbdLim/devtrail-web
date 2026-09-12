import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { CreateJournalInput, JournalEntry } from "../types/journal.types";

export async function createJournalEntry(data: CreateJournalInput): Promise<JournalEntry> {
  const headers: Record<string, string> = {};
  if (data.idempotencyKey) {
    headers["X-Idempotency-Key"] = data.idempotencyKey;
  }

  const res = await apiClient<JournalEntry | { entry: JournalEntry; data?: JournalEntry }>(
    endpoints.journal.create,
    {
      method: "POST",
      body: data,
      headers,
    }
  );

  if (res && typeof res === "object") {
    if ((res as any).entry) return (res as any).entry;
    if ((res as any).data && !Array.isArray((res as any).data)) return (res as any).data;
  }
  return res as JournalEntry;
}

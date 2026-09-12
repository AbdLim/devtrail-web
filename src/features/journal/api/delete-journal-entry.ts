import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function deleteJournalEntry(id: string): Promise<void> {
  await apiClient<void>(endpoints.journal.delete(id), {
    method: "DELETE",
  });
}

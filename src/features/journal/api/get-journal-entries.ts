import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { JournalEntry, JournalQuery, JournalListResponse } from "../types/journal.types";

export async function getJournalEntries(query: JournalQuery = {}): Promise<JournalEntry[]> {
  const params = new URLSearchParams();
  if (query.projectId) params.append("projectId", query.projectId);
  if (query.entryType) params.append("entryType", query.entryType);
  if (query.search) params.append("search", query.search);
  if (query.from) params.append("from", query.from);
  if (query.to) params.append("to", query.to);
  if (query.limit) params.append("limit", query.limit.toString());
  if (query.offset) params.append("offset", query.offset.toString());

  const queryString = params.toString();
  const url = queryString ? `${endpoints.journal.list}?${queryString}` : endpoints.journal.list;

  const res = await apiClient<JournalEntry[] | JournalListResponse | { entries?: JournalEntry[]; data?: JournalEntry[] }>(
    url
  );

  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    if (Array.isArray((res as any).entries)) return (res as any).entries;
    if (Array.isArray((res as any).data)) return (res as any).data;
  }
  return [];
}

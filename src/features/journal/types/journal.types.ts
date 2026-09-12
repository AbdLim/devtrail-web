export type JournalEntryType =
  | "note"
  | "accomplishment"
  | "learning"
  | "blocker"
  | "decision";

export interface JournalEntry {
  id: string;
  userId: string;
  projectId?: string | null;
  entryType: JournalEntryType;
  title: string;
  content: string;
  tags?: string[];
  idempotencyKey?: string | null;
  occurredAt: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateJournalInput {
  title: string;
  content: string;
  entryType?: JournalEntryType;
  projectId?: string | null;
  tags?: string[];
  idempotencyKey?: string;
  occurredAt?: string;
}

export interface UpdateJournalInput {
  title?: string;
  content?: string;
  entryType?: JournalEntryType;
  projectId?: string | null;
  tags?: string[];
  occurredAt?: string;
}

export interface JournalQuery {
  projectId?: string;
  entryType?: JournalEntryType;
  search?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export interface JournalListResponse {
  entries: JournalEntry[];
  total: number;
  limit: number;
  offset: number;
}

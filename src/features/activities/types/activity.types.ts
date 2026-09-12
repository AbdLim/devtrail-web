export type ActivitySource = "github" | "journal" | "manual" | "ai";
export type ActivityEventType =
  | "commit"
  | "pull_request"
  | "issue"
  | "note"
  | "accomplishment"
  | "learning"
  | "blocker"
  | "decision"
  | "summary"
  | string;

export interface ActivityMetadata {
  author?: {
    name?: string;
    email?: string;
    username?: string;
  };
  repositoryName?: string;
  branch?: string;
  labels?: string[];
  tags?: string[];
  entryType?: string;
  [key: string]: unknown;
}

export interface Activity {
  id: string;
  userId: string;
  projectId?: string;
  repositoryId?: string;
  source: ActivitySource;
  eventType: ActivityEventType;
  externalId?: string;
  title: string;
  description?: string;
  url?: string;
  metadata?: ActivityMetadata;
  occurredAt: string;
  created_at?: string;
}

export interface ActivityTimelineQuery {
  projectId?: string;
  limit?: number;
  offset?: number;
}


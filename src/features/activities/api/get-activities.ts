import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Activity, ActivityTimelineQuery } from "../types/activity.types";

export async function getActivities(query: ActivityTimelineQuery = {}): Promise<Activity[]> {
  const params = new URLSearchParams();
  if (query.projectId) params.append("projectId", query.projectId);
  if (query.limit) params.append("limit", query.limit.toString());
  if (query.offset) params.append("offset", query.offset.toString());

  const queryString = params.toString();
  const url = queryString ? `${endpoints.activities.timeline}?${queryString}` : endpoints.activities.timeline;

  const res = await apiClient<Activity[] | { data?: Activity[]; activities?: Activity[]; timeline?: Activity[] }>(url);
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    if (Array.isArray((res as any).activities)) return (res as any).activities;
    if (Array.isArray((res as any).timeline)) return (res as any).timeline;
    if (Array.isArray((res as any).data)) return (res as any).data;
  }
  return [];
}



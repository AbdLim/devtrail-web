import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Activity, ActivityTimelineQuery } from "../types/activity.types";

export async function getActivities(query: ActivityTimelineQuery = {}): Promise<Activity[]> {
  try {
    const params = new URLSearchParams();
    if (query.projectId) params.append("projectId", query.projectId);
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.offset) params.append("offset", query.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `${endpoints.activities.timeline}?${queryString}` : endpoints.activities.timeline;

    return await apiClient<Activity[]>(url);
  } catch (error) {
    console.warn("Failed to fetch activity timeline:", error);
    return [];
  }
}

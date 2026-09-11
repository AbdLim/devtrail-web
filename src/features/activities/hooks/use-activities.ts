import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../api/get-activities";
import type { ActivityTimelineQuery } from "../types/activity.types";

export function useActivities(query: ActivityTimelineQuery = {}) {
  return useQuery({
    queryKey: ["activities", "timeline", query],
    queryFn: () => getActivities(query),
    retry: false,
    staleTime: 30_000,
  });
}


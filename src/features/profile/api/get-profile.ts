import { serverApi } from "@/lib/api/server";
import { endpoints } from "@/lib/api/endpoints";
import type { UserProfile } from "../types/profile.types";

export async function getProfile(): Promise<UserProfile> {
  return serverApi<UserProfile>(endpoints.profile.me);
}

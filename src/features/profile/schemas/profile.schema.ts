import { z } from "zod/v4";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50).transform((v) => v.trim()),
  lastName: z.string().min(1, "Last name is required").max(50).transform((v) => v.trim()),
  displayName: z.string().min(1, "Display name is required").max(50).transform((v) => v.trim()),
});

export type ProfileInput = z.infer<typeof profileSchema>;

import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().max(50).transform((v) => v.trim()).optional().or(z.literal("")),
  lastName: z.string().max(50).transform((v) => v.trim()).optional().or(z.literal("")),
  displayName: z.string().max(50).transform((v) => v.trim()).optional().or(z.literal("")),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional().or(z.literal("")),
  avatarUrl: z.string().url("Invalid avatar URL format").optional().or(z.literal("")),
  jobTitle: z.string().max(100, "Job title must not exceed 100 characters").optional().or(z.literal("")),
  company: z.string().max(100, "Company name must not exceed 100 characters").optional().or(z.literal("")),
  location: z.string().max(100, "Location must not exceed 100 characters").optional().or(z.literal("")),
  websiteUrl: z.string().url("Invalid website URL format").optional().or(z.literal("")),
  githubUsername: z.string().max(100, "GitHub username must not exceed 100 characters").optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
  timezone: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

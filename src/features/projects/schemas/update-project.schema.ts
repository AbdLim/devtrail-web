import { z } from "zod/v4";

export const updateProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(80).optional(),
  description: z.string().max(300, "Description cannot exceed 300 characters").optional(),
  status: z.enum(["active", "completed", "archived", "paused"]).optional(),
  visibility: z.enum(["private", "public", "team"]).optional(),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color hex").optional(),
});

export type UpdateProjectSchemaInput = z.infer<typeof updateProjectSchema>;

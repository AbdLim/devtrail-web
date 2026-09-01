import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z.string().min(1, "Password is required").max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

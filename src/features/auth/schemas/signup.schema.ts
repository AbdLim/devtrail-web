import { z } from "zod/v4";

export const signupSchema = z
  .object({
    firstname: z.string().min(1, "First name is required").max(50),
    lastname: z.string().min(1, "Last name is required").max(50),
    age: z.number().optional(),
    email: z.email({ message: "Enter a valid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters").max(128),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.literal(true, { message: "You must accept the terms to continue" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

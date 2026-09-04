import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { SignupInput } from "../schemas/signup.schema";
import type { SignupResult } from "../types/auth.types";

export async function signup(
  data: Pick<SignupInput, "firstname" | "lastname" | "email" | "password"> & { age?: number },
  signal?: AbortSignal,
): Promise<SignupResult> {
  const payload = {
    firstname: data.firstname,
    lastname: data.lastname,
    age: data.age,
    email: data.email,
    password: data.password,
  };

  console.log("[SIGNUP API] Calling signup API endpoint:", {
    endpoint: endpoints.auth.register,
    payload: { ...payload, password: "***" },
    envApiUrl: process.env.NEXT_PUBLIC_API_URL || "(empty/relative)",
  });

  try {
    const result = await apiClient<SignupResult>(endpoints.auth.register, {
      method: "POST",
      body: payload,
      signal,
    });
    console.log("[SIGNUP API] Signup successful result:", result);
    return result;
  } catch (error) {
    console.error("[SIGNUP API] Signup failed error:", error);
    throw error;
  }
}

import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { SignupInput } from "../schemas/signup.schema";
import type { SignupResult } from "../types/auth.types";

export async function signup(
  data: Pick<SignupInput, "firstname" | "lastname" | "email" | "password"> & { age?: number },
  signal?: AbortSignal,
): Promise<SignupResult> {
  return apiClient<SignupResult>(endpoints.auth.register, {
    method: "POST",
    body: {
      firstname: data.firstname,
      lastname: data.lastname,
      age: data.age,
      email: data.email,
      password: data.password,
    },
    signal,
  });
}

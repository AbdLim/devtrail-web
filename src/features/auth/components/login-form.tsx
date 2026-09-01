"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { login } from "../api/login";
import { getAuthErrorMessage, isEmailVerificationRequired } from "../utils/auth-error";
import { track } from "@/lib/analytics/analytics";
import { PasswordField } from "./password-field";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      const result = await login(data);
      track("login_completed");
      router.refresh();

      const isProfileComplete =
        result.user?.is_profile_completed ??
        result.user?.profileComplete;

      if (isProfileComplete) {
        router.push("/today");
      } else {
        router.push("/complete-profile");
      }
    } catch (err: unknown) {
      if (isEmailVerificationRequired(err)) {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }
      setServerError(getAuthErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 text-left">
      {serverError && (
        <div role="alert" className="rounded-md border border-[#C98383]/30 bg-[#C98383]/10 px-3 py-2 text-xs text-[#C98383]">
          {serverError}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="login-email" className="block text-xs font-mono text-[#A3AAA5]">
          Email
        </label>
        <input
          {...register("email")}
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          className="w-full rounded-md border border-[#252A28] bg-[#0D0F0F] px-3 py-2 text-xs text-[#F1F0EA] placeholder-[#737A76] transition focus:border-[#91AD9D] focus:outline-none"
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-xs text-[#C98383]">
            {errors.email.message}
          </p>
        )}
      </div>

      <PasswordField
        {...register("password")}
        id="login-password"
        label="Password"
        autoComplete="current-password"
        placeholder="Your password"
        error={errors.password?.message}
      />

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-[#737A76]">
          <button type="button" className="hover:text-[#A3AAA5] focus:outline-none">
            Forgot password?
          </button>
        </span>
      </div>

      <button
        type="submit"
        id="login-submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#91AD9D] px-4 py-2.5 text-xs font-semibold text-[#0D0F0F] transition hover:bg-[#B1CCBC] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-xs text-[#737A76] pt-2 border-t border-[#252A28]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#91AD9D] hover:underline font-medium focus:outline-none">
          Create account
        </Link>
      </p>
    </form>
  );
}

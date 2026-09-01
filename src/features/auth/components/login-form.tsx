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
      await login(data);
      track("login_completed");
      router.refresh();
      router.push("/dashboard");
    } catch (err: unknown) {
      if (isEmailVerificationRequired(err)) {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }
      setServerError(getAuthErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="login-email" className="block text-sm font-medium text-white/80">
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
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-xs text-red-400">
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
        <span className="text-xs text-white/40">
          <button type="button" className="hover:text-white/70 focus:outline-none focus-visible:underline">
            Forgot password?
          </button>
        </span>
      </div>

      <button
        type="submit"
        id="login-submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-white/50">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { signupSchema, type SignupInput } from "../schemas/signup.schema";
import { signup } from "../api/signup";
import { getAuthErrorMessage } from "../utils/auth-error";
import { track } from "@/lib/analytics/analytics";
import { PasswordField } from "./password-field";

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupInput) {
    setServerError(null);
    try {
      track("signup_started");
      await signup({
        firstname: data.firstname,
        lastname: data.lastname,
        age: typeof data.age === "number" ? data.age : undefined,
        email: data.email,
        password: data.password,
      });
      track("signup_completed");
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="signup-firstname" className="block text-sm font-medium text-white/80">
            First name
          </label>
          <input
            {...register("firstname")}
            id="signup-firstname"
            type="text"
            autoComplete="given-name"
            placeholder="John"
            aria-invalid={!!errors.firstname}
            aria-describedby={errors.firstname ? "signup-firstname-error" : undefined}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          {errors.firstname && (
            <p id="signup-firstname-error" role="alert" className="text-xs text-red-400">
              {errors.firstname.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="signup-lastname" className="block text-sm font-medium text-white/80">
            Last name
          </label>
          <input
            {...register("lastname")}
            id="signup-lastname"
            type="text"
            autoComplete="family-name"
            placeholder="Doe"
            aria-invalid={!!errors.lastname}
            aria-describedby={errors.lastname ? "signup-lastname-error" : undefined}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          {errors.lastname && (
            <p id="signup-lastname-error" role="alert" className="text-xs text-red-400">
              {errors.lastname.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="signup-email" className="block text-sm font-medium text-white/80">
          Email
        </label>
        <input
          {...register("email")}
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "signup-email-error" : undefined}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
        {errors.email && (
          <p id="signup-email-error" role="alert" className="text-xs text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <PasswordField
        {...register("password")}
        id="signup-password"
        label="Password"
        autoComplete="new-password"
        placeholder="Minimum 6 characters"
        error={errors.password?.message}
      />

      <PasswordField
        {...register("confirmPassword")}
        id="signup-confirm-password"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="Repeat your password"
        error={errors.confirmPassword?.message}
      />

      <div className="flex items-start gap-2 pt-1">
        <input
          {...register("terms")}
          id="signup-terms"
          type="checkbox"
          aria-invalid={!!errors.terms}
          aria-describedby={errors.terms ? "signup-terms-error" : undefined}
          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500/40"
        />
        <div>
          <label htmlFor="signup-terms" className="text-sm text-white/70">
            I agree to the{" "}
            <a href="/terms" className="text-indigo-400 hover:text-indigo-300">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-indigo-400 hover:text-indigo-300">
              Privacy Policy
            </a>
          </label>
          {errors.terms && (
            <p id="signup-terms-error" role="alert" className="text-xs text-red-400">
              {errors.terms.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        id="signup-submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

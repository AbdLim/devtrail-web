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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 text-left">
      {serverError && (
        <div role="alert" className="rounded-md border border-[#C98383]/30 bg-[#C98383]/10 px-3 py-2 text-xs text-[#C98383]">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="signup-firstname" className="block text-xs font-mono text-[#A3AAA5]">
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
            className="w-full rounded-md border border-[#252A28] bg-[#0D0F0F] px-3 py-2 text-xs text-[#F1F0EA] placeholder-[#737A76] transition focus:border-[#91AD9D] focus:outline-none"
          />
          {errors.firstname && (
            <p id="signup-firstname-error" role="alert" className="text-xs text-[#C98383]">
              {errors.firstname.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="signup-lastname" className="block text-xs font-mono text-[#A3AAA5]">
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
            className="w-full rounded-md border border-[#252A28] bg-[#0D0F0F] px-3 py-2 text-xs text-[#F1F0EA] placeholder-[#737A76] transition focus:border-[#91AD9D] focus:outline-none"
          />
          {errors.lastname && (
            <p id="signup-lastname-error" role="alert" className="text-xs text-[#C98383]">
              {errors.lastname.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="signup-email" className="block text-xs font-mono text-[#A3AAA5]">
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
          className="w-full rounded-md border border-[#252A28] bg-[#0D0F0F] px-3 py-2 text-xs text-[#F1F0EA] placeholder-[#737A76] transition focus:border-[#91AD9D] focus:outline-none"
        />
        {errors.email && (
          <p id="signup-email-error" role="alert" className="text-xs text-[#C98383]">
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
          className="mt-0.5 h-3.5 w-3.5 rounded border-[#252A28] bg-[#0D0F0F] text-[#91AD9D] focus:ring-[#91AD9D]/40"
        />
        <div>
          <label htmlFor="signup-terms" className="text-xs text-[#737A76]">
            I agree to the{" "}
            <a href="/terms" className="text-[#91AD9D] hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#91AD9D] hover:underline">
              Privacy Policy
            </a>
          </label>
          {errors.terms && (
            <p id="signup-terms-error" role="alert" className="text-xs text-[#C98383]">
              {errors.terms.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        id="signup-submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#91AD9D] px-4 py-2.5 text-xs font-semibold text-[#0D0F0F] transition hover:bg-[#B1CCBC] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-xs text-[#737A76] pt-2 border-t border-[#252A28]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#91AD9D] hover:underline font-medium focus:outline-none">
          Sign in
        </Link>
      </p>
    </form>
  );
}

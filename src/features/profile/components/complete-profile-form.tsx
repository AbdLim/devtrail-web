"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { profileSchema, type ProfileInput } from "../schemas/profile.schema";
import { completeProfile } from "../api/complete-profile";
import { track } from "@/lib/analytics/analytics";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-red-400">
      {message}
    </p>
  );
}

function TextInput({
  id,
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-white/80">
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function CompleteProfileForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  async function onSubmit(data: ProfileInput) {
    setServerError(null);
    try {
      await completeProfile(data);
      track("profile_completed");
      router.push("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      <TextInput
        {...register("firstName")}
        id="profile-first-name"
        label="First name"
        placeholder="John"
        autoComplete="given-name"
        error={errors.firstName?.message}
      />

      <TextInput
        {...register("lastName")}
        id="profile-last-name"
        label="Last name"
        placeholder="Doe"
        autoComplete="family-name"
        error={errors.lastName?.message}
      />

      <TextInput
        {...register("displayName")}
        id="profile-display-name"
        label="Display name"
        placeholder="How you appear in the app"
        autoComplete="nickname"
        error={errors.displayName?.message}
      />

      <button
        type="submit"
        id="profile-submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Complete profile"}
      </button>
    </form>
  );
}

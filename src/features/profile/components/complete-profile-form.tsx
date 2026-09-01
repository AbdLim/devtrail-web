"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { profileSchema, type ProfileInput } from "../schemas/profile.schema";
import { completeProfile } from "../api/complete-profile";
import { track } from "@/lib/analytics/analytics";
import { toast } from "sonner";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-[#C98383]">
      {message}
    </p>
  );
}

function TextInput({
  id,
  label,
  error,
  helperText,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string; helperText?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-mono text-[#A3AAA5]">
          {label}
        </label>
        {helperText && <span className="text-[10px] text-[#737A76]">{helperText}</span>}
      </div>
      <input
        {...props}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-md border border-[#252A28] bg-[#0D0F0F] px-3 py-2 text-xs text-[#F1F0EA] placeholder-[#737A76] transition focus:border-[#91AD9D] focus:outline-none"
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
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    },
  });

  async function onSubmit(data: ProfileInput) {
    setServerError(null);
    try {
      await completeProfile(data);
      track("profile_completed");
      toast.success("Profile setup complete!");
      router.push("/today");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to save developer profile.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="rounded-md border border-[#C98383]/30 bg-[#C98383]/10 px-3 py-2 text-xs text-[#C98383]">
          {serverError}
        </div>
      )}

      <TextInput
        {...register("username")}
        id="profile-username"
        label="Username"
        placeholder="sarahconnor"
        helperText="Unique developer handle"
        error={errors.username?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextInput
          {...register("jobTitle")}
          id="profile-job-title"
          label="Job Title"
          placeholder="Systems Engineer"
          error={errors.jobTitle?.message}
        />
        <TextInput
          {...register("company")}
          id="profile-company"
          label="Company / Org"
          placeholder="Cyberdyne"
          error={errors.company?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextInput
          {...register("location")}
          id="profile-location"
          label="Location"
          placeholder="Los Angeles, CA"
          error={errors.location?.message}
        />
        <TextInput
          {...register("githubUsername")}
          id="profile-github"
          label="GitHub Username"
          placeholder="sarahconnor"
          error={errors.githubUsername?.message}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="profile-bio" className="block text-xs font-mono text-[#A3AAA5]">
          Bio / Technical Focus
        </label>
        <textarea
          {...register("bio")}
          id="profile-bio"
          rows={3}
          placeholder="Building distributed systems and infrastructure..."
          className="w-full rounded-md border border-[#252A28] bg-[#0D0F0F] px-3 py-2 text-xs text-[#F1F0EA] placeholder-[#737A76] transition focus:border-[#91AD9D] focus:outline-none resize-none"
        />
        <FieldError id="profile-bio-error" message={errors.bio?.message} />
      </div>

      <TextInput
        {...register("websiteUrl")}
        id="profile-website"
        label="Website / Portfolio URL"
        placeholder="https://sarahconnor.dev"
        error={errors.websiteUrl?.message}
      />

      <button
        type="submit"
        id="profile-submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#91AD9D] px-4 py-2.5 text-xs font-semibold text-[#0D0F0F] transition hover:bg-[#B1CCBC] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Saving profile..." : "Complete Profile & Enter Workbench"}
      </button>
    </form>
  );
}

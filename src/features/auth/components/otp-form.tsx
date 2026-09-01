"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "../api/verify-otp";
import { resendOtp } from "../api/resend-otp";
import { getAuthErrorMessage } from "../utils/auth-error";
import { track } from "@/lib/analytics/analytics";
import { formatSeconds, maskEmail } from "@/lib/utils/format";
import { toast } from "sonner";
import { OTP_LENGTH, OTP_RESEND_COOLDOWN_SECONDS } from "@/lib/config/constants";
import { cn } from "@/lib/utils/cn";

type OtpFormProps = {
  destination?: string;
};

export function OtpForm({ destination }: OtpFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || destination || "";

  const [inputEmail, setInputEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(OTP_RESEND_COOLDOWN_SECONDS);
  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(OTP_LENGTH).fill(null));

  const effectiveEmail = emailParam || inputEmail;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const code = digits.join("");

  function handleChange(index: number, value: string) {
    if (value.length === OTP_LENGTH && /^\d+$/.test(value)) {
      const next = value.split("").slice(0, OTP_LENGTH);
      setDigits(next);
      inputsRef.current[OTP_LENGTH - 1]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!effectiveEmail) {
        setServerError("Email address is required for verification.");
        return;
      }
      if (code.length !== OTP_LENGTH || submitting) return;
      setServerError(null);
      setSubmitting(true);
      try {
        const result = await verifyOtp({ email: effectiveEmail, otp: code });
        track("otp_verified");
        toast.success("Email verified successfully!");

        const isProfileComplete =
          result.user?.is_profile_completed ??
          result.user?.profileComplete ??
          result.profileComplete;

        if (isProfileComplete) {
          router.push("/today");
        } else {
          router.push("/complete-profile");
        }
      } catch (err) {
        setServerError(getAuthErrorMessage(err));
        setSubmitting(false);
      }
    },
    [code, effectiveEmail, router, submitting],
  );

  async function handleResend() {
    if (!effectiveEmail) {
      setServerError("Please enter your email to resend the code.");
      return;
    }
    if (resending || cooldown > 0) return;
    setResending(true);
    setServerError(null);
    try {
      const result = await resendOtp(effectiveEmail);
      setCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
      toast.success(result.message || "A new 6-digit code has been sent to your email.");
    } catch (err) {
      setServerError(getAuthErrorMessage(err));
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {emailParam ? (
        <p className="text-center text-xs text-[#A3AAA5]">
          We sent a 6-digit verification code to{" "}
          <span className="font-mono text-[#F1F0EA] font-medium">{maskEmail(emailParam)}</span>
        </p>
      ) : (
        <div className="space-y-1">
          <label htmlFor="otp-email" className="block text-xs font-mono text-[#A3AAA5]">
            Email address
          </label>
          <input
            id="otp-email"
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-[#252A28] bg-[#0D0F0F] px-3 py-2 text-xs text-[#F1F0EA] placeholder-[#737A76] transition focus:border-[#91AD9D] focus:outline-none"
          />
        </div>
      )}

      {serverError && (
        <div role="alert" className="rounded-md border border-[#C98383]/30 bg-[#C98383]/10 px-3 py-2 text-xs text-[#C98383]">
          {serverError}
        </div>
      )}

      <fieldset>
        <legend className="sr-only">Verification code</legend>
        <div className="flex justify-center gap-2" role="group" aria-label="6-digit verification code">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              id={`otp-digit-${i}`}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={OTP_LENGTH}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Digit ${i + 1}`}
              className={cn(
                "h-12 w-10 rounded-md border border-[#252A28] bg-[#0D0F0F] text-center text-lg font-mono font-semibold text-[#F1F0EA] transition focus:border-[#91AD9D] focus:outline-none",
                serverError && "border-[#C98383]/50",
              )}
            />
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        id="otp-submit"
        disabled={code.length !== OTP_LENGTH || submitting || !effectiveEmail}
        className="w-full rounded-md bg-[#91AD9D] px-4 py-2 text-xs font-semibold text-[#0D0F0F] transition hover:bg-[#B1CCBC] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center text-xs text-[#737A76]">
        {cooldown > 0 ? (
          <span className="font-mono">Resend code in {formatSeconds(cooldown)}</span>
        ) : (
          <button
            type="button"
            id="otp-resend"
            onClick={handleResend}
            disabled={resending}
            className="text-[#91AD9D] hover:underline focus:outline-none disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend verification code"}
          </button>
        )}
      </div>
    </form>
  );
}

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
        await verifyOtp({ email: effectiveEmail, otp: code });
        track("otp_verified");
        toast.success("Email verified successfully!");
        router.push("/dashboard");
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
      setCooldown(result.resendAfter ?? OTP_RESEND_COOLDOWN_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
      toast.success(result.message || "A new code has been sent.");
    } catch (err) {
      setServerError(getAuthErrorMessage(err));
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {emailParam ? (
        <p className="text-center text-sm text-white/60">
          We sent a code to{" "}
          <span className="font-medium text-white/80">{maskEmail(emailParam)}</span>
        </p>
      ) : (
        <div className="space-y-1">
          <label htmlFor="otp-email" className="block text-sm font-medium text-white/80">
            Email address
          </label>
          <input
            id="otp-email"
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
      )}

      {serverError && (
        <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
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
                "h-12 w-10 rounded-lg border border-white/10 bg-white/5 text-center text-lg font-semibold text-white transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40",
                serverError && "border-red-500/40",
              )}
            />
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        id="otp-submit"
        disabled={code.length !== OTP_LENGTH || submitting || !effectiveEmail}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Verifying..." : "Verify"}
      </button>

      <div className="text-center text-sm text-white/50">
        {cooldown > 0 ? (
          <span>Resend code in {formatSeconds(cooldown)}</span>
        ) : (
          <button
            type="button"
            id="otp-resend"
            onClick={handleResend}
            disabled={resending}
            className="text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>
    </form>
  );
}

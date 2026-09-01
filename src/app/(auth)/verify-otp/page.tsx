import { Suspense } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { OtpForm } from "@/features/auth/components/otp-form";
import { LoadingState } from "@/components/feedback/loading-state";

export const metadata = {
  title: "Verify your email",
};

export default function VerifyOtpPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Verify your email"
        description="Enter the verification code sent to your email"
      />
      <Suspense fallback={<LoadingState message="Loading verification..." />}>
        <OtpForm />
      </Suspense>
    </AuthCard>
  );
}

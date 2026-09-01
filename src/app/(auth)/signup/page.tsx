import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata = {
  title: "Create an account",
};

export default function SignupPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Create your account"
        description="Get started with your new account in seconds"
      />
      <SignupForm />
    </AuthCard>
  );
}

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Welcome back"
        description="Enter your credentials to access your account"
      />
      <LoginForm />
    </AuthCard>
  );
}

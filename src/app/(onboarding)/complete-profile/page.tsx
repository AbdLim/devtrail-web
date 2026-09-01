import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { CompleteProfileForm } from "@/features/profile/components/complete-profile-form";

export const metadata = {
  title: "Complete your profile",
};

export default function CompleteProfilePage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Complete your profile"
        description="Tell us how you would like to appear in the application"
      />
      <CompleteProfileForm />
    </AuthCard>
  );
}

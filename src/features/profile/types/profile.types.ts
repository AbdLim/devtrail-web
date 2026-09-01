export type UserProfile = {
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string | null;
};

export type ProfileCompletionResult = {
  profileComplete: boolean;
  profile: UserProfile;
};

export type DeveloperProfile = {
  id?: string;
  userId?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string | null;
  jobTitle?: string;
  company?: string;
  location?: string;
  websiteUrl?: string;
  githubUsername?: string;
  skills?: string[];
  timezone?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
};

export type User = {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  is_email_verified?: boolean;
  is_profile_completed?: boolean;
  emailVerified?: boolean;
  profileComplete?: boolean;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  profile?: DeveloperProfile | null;
};

export type AuthSession = {
  authenticated: boolean;
  user: User | null;
};

export type LoginResult = {
  user?: User;
  access_token?: string;
  refresh_token?: string;
};

export type SignupResult = {
  message?: string;
  user?: User;
};

export type VerifyOtpResult = {
  authenticated?: boolean;
  profileComplete?: boolean;
  message?: string;
  user?: User;
  access_token?: string;
  refresh_token?: string;
};

export type ResendOtpResult = {
  message?: string;
};

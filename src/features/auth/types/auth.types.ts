export type UserProfile = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string | null;
};

export type User = {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  is_email_verified?: boolean;
  emailVerified?: boolean;
  profileComplete?: boolean;
  profile?: UserProfile | null;
};

export type AuthSession = {
  authenticated: boolean;
  user: User | null;
};

export type LoginResult = {
  user?: User;
  token?: string;
  access_token?: string;
  refresh_token?: string;
};

export type SignupResult = {
  message?: string;
  user?: User;
  challengeId?: string;
};

export type VerifyOtpResult = {
  authenticated?: boolean;
  profileComplete?: boolean;
  message?: string;
  user?: User;
};

export type ResendOtpResult = {
  message?: string;
  resendAfter?: number;
};

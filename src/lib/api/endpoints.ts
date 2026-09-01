export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    signup: "/auth/register",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    logout: "/auth/logout",
    profile: "/auth/profile",
    session: "/auth/profile",
    refreshToken: "/auth/refresh-token",
  },
  profile: {
    me: "/auth/profile",
    complete: "/auth/profile",
  },
} as const;


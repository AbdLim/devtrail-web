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
  projects: {
    list: "/projects",
    create: "/projects",
    detail: (id: string) => `/projects/${id}`,
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
    addRepositories: (id: string) => `/projects/${id}/repositories`,
    removeRepository: (id: string, repoId: string) => `/projects/${id}/repositories/${repoId}`,
  },
  github: {
    installations: "/github/installations",
    repositories: "/github/repositories",
    toggleTracking: (id: string) => `/github/repositories/${id}/tracking`,
  },
  activities: {
    timeline: "/activities/timeline",
  },
  journal: {
    create: "/journal",
    list: "/journal",
    detail: (id: string) => `/journal/${id}`,
    update: (id: string) => `/journal/${id}`,
    delete: (id: string) => `/journal/${id}`,
  },
} as const;


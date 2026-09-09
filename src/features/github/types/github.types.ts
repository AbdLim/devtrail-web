export interface GitHubRepositoryInput {
  githubRepoId: string;
  name: string;
  fullName: string;
  isPrivate: boolean;
  htmlUrl: string;
  defaultBranch: string;
}

export interface ConnectInstallationInput {
  installationId: string;
  accountLogin: string;
  accountType: "User" | "Organization";
  avatarUrl?: string;
  repositories: GitHubRepositoryInput[];
}

export interface GitHubRepository {
  id: string;
  githubRepoId: string;
  name: string;
  fullName: string;
  htmlUrl: string;
  isPrivate: boolean;
  isTracking: boolean;
  defaultBranch?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GitHubInstallation {
  id: string;
  installationId: string;
  accountLogin: string;
  accountType: "User" | "Organization";
  avatarUrl?: string;
  created_at?: string;
  repositories?: GitHubRepository[];
}

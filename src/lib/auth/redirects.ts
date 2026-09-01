const ALLOWED_HOSTS = ["localhost", ""];

export function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url, "http://n");
    // only allow relative paths (no host or same-origin)
    return parsed.hostname === "n" || ALLOWED_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function safeRedirectUrl(url: string | null | undefined, fallback = "/dashboard"): string {
  if (!url) return fallback;
  if (!url.startsWith("/")) return fallback;
  if (url.startsWith("//")) return fallback;
  return url;
}

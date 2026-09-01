import { describe, it, expect } from "vitest";
import { maskEmail, formatSeconds } from "@/lib/utils/format";
import { safeRedirectUrl, isSafeRedirectUrl } from "@/lib/auth/redirects";
import { cn } from "@/lib/utils/cn";

describe("Format & Redirect Utilities", () => {
  describe("maskEmail", () => {
    it("masks local part while preserving domain", () => {
      expect(maskEmail("person@example.com")).toBe("p***@example.com");
      expect(maskEmail("alexander@test.org")).toBe("a***@test.org");
    });

    it("returns raw string if not an email format", () => {
      expect(maskEmail("invalid-email")).toBe("invalid-email");
    });
  });

  describe("formatSeconds", () => {
    it("formats seconds into mm:ss string", () => {
      expect(formatSeconds(60)).toBe("01:00");
      expect(formatSeconds(42)).toBe("00:42");
      expect(formatSeconds(0)).toBe("00:00");
    });
  });

  describe("safeRedirectUrl", () => {
    it("allows relative paths", () => {
      expect(safeRedirectUrl("/dashboard")).toBe("/dashboard");
      expect(safeRedirectUrl("/settings/profile")).toBe("/settings/profile");
    });

    it("blocks absolute URLs and protocol-relative URLs", () => {
      expect(safeRedirectUrl("https://attacker.example")).toBe("/dashboard");
      expect(safeRedirectUrl("//attacker.example")).toBe("/dashboard");
      expect(safeRedirectUrl(null)).toBe("/dashboard");
    });
  });

  describe("cn", () => {
    it("merges classes and handles conditions", () => {
      expect(cn("px-2", "py-1")).toBe("px-2 py-1");
      expect(cn("px-2", false && "hidden", "text-white")).toBe("px-2 text-white");
      expect(cn("px-2", "px-4")).toBe("px-4");
    });
  });
});

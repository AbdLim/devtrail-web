import { describe, it, expect } from "vitest";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import { signupSchema } from "@/features/auth/schemas/signup.schema";
import { otpSchema } from "@/features/auth/schemas/otp.schema";
import { profileSchema } from "@/features/profile/schemas/profile.schema";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("validates correct email and password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "securepassword",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "securepassword",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("signupSchema", () => {
    it("validates full register inputs with matching passwords", () => {
      const result = signupSchema.safeParse({
        firstname: "John",
        lastname: "Doe",
        age: 25,
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
        terms: true,
      });
      expect(result.success).toBe(true);
    });

    it("rejects password mismatch", () => {
      const result = signupSchema.safeParse({
        firstname: "John",
        lastname: "Doe",
        email: "user@example.com",
        password: "password123",
        confirmPassword: "differentpassword",
        terms: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects unaccepted terms", () => {
      const result = signupSchema.safeParse({
        firstname: "John",
        lastname: "Doe",
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
        terms: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("otpSchema", () => {
    it("validates 6 digit numeric code", () => {
      const result = otpSchema.safeParse({ code: "123456" });
      expect(result.success).toBe(true);
    });

    it("rejects non-numeric code", () => {
      const result = otpSchema.safeParse({ code: "12345a" });
      expect(result.success).toBe(false);
    });

    it("rejects code with wrong length", () => {
      const result = otpSchema.safeParse({ code: "12345" });
      expect(result.success).toBe(false);
    });
  });

  describe("profileSchema", () => {
    it("trims whitespace and validates complete profile", () => {
      const result = profileSchema.safeParse({
        firstName: "  John  ",
        lastName: "  Doe  ",
        displayName: "  Johnny  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("John");
        expect(result.data.lastName).toBe("Doe");
        expect(result.data.displayName).toBe("Johnny");
      }
    });

    it("rejects empty fields", () => {
      const result = profileSchema.safeParse({
        firstName: "",
        lastName: "Doe",
        displayName: "Johnny",
      });
      expect(result.success).toBe(false);
    });
  });
});

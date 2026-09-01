import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "@/features/auth/components/signup-form";
import * as signupApi from "@/features/auth/api/signup";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields including firstname and lastname", () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("shows validation error when passwords do not match", async () => {
    render(<SignupForm />);
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/^password/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "password456");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("submits valid credentials and triggers register API", async () => {
    const signupSpy = vi.spyOn(signupApi, "signup").mockResolvedValueOnce({
      message: "Signup successful",
    });

    render(<SignupForm />);
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/^password/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "password123");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(signupSpy).toHaveBeenCalledWith({
        firstname: "John",
        lastname: "Doe",
        age: undefined,
        email: "user@example.com",
        password: "password123",
      });
    });
  });
});

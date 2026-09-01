import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/features/auth/components/login-form";
import * as loginApi from "@/features/auth/api/login";
import { ApiError } from "@/lib/api/api-error";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password inputs and submit button", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    render(<LoginForm />);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
  });

  it("displays server error when API returns an error", async () => {
    vi.spyOn(loginApi, "login").mockRejectedValueOnce(
      new ApiError("Invalid credentials", 401, { code: "INVALID_CREDENTIALS" }),
    );

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Email or password is incorrect.");
    });
  });
});

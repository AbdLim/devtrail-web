import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpForm } from "@/features/auth/components/otp-form";
import * as otpApi from "@/features/auth/api/verify-otp";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue("test@example.com"),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("OtpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 6 digits inputs and verify button", () => {
    render(<OtpForm destination="person@example.com" />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
    expect(screen.getByRole("button", { name: /verify/i })).toBeInTheDocument();
  });

  it("handles pasting 6-digit code across inputs", async () => {
    render(<OtpForm />);
    const firstInput = screen.getByLabelText("Digit 1");
    await userEvent.type(firstInput, "123456");

    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs[0].value).toBe("1");
    expect(inputs[1].value).toBe("2");
    expect(inputs[2].value).toBe("3");
    expect(inputs[3].value).toBe("4");
    expect(inputs[4].value).toBe("5");
    expect(inputs[5].value).toBe("6");
  });

  it("submits verification code with email when full code is entered", async () => {
    const verifySpy = vi.spyOn(otpApi, "verifyOtp").mockResolvedValueOnce({
      authenticated: true,
      profileComplete: true,
    });

    render(<OtpForm />);
    const firstInput = screen.getByLabelText("Digit 1");
    await userEvent.type(firstInput, "123456");

    const verifyBtn = screen.getByRole("button", { name: /verify/i });
    expect(verifyBtn).toBeEnabled();
    await userEvent.click(verifyBtn);

    await waitFor(() => {
      expect(verifySpy).toHaveBeenCalledWith({
        email: "test@example.com",
        otp: "123456",
      });
    });
  });
});

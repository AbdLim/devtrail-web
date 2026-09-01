import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompleteProfileForm } from "@/features/profile/components/complete-profile-form";
import * as profileApi from "@/features/profile/api/complete-profile";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("CompleteProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders first name, last name, and display name fields", () => {
    render(<CompleteProfileForm />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /complete profile/i })).toBeInTheDocument();
  });

  it("submits valid profile data", async () => {
    const profileSpy = vi.spyOn(profileApi, "completeProfile").mockResolvedValueOnce({
      profileComplete: true,
      profile: {
        firstName: "Jane",
        lastName: "Doe",
        displayName: "Jane Doe",
      },
    });

    render(<CompleteProfileForm />);
    await userEvent.type(screen.getByLabelText(/first name/i), "Jane");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/display name/i), "Jane Doe");
    await userEvent.click(screen.getByRole("button", { name: /complete profile/i }));

    await waitFor(() => {
      expect(profileSpy).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Doe",
        displayName: "Jane Doe",
      });
    });
  });
});

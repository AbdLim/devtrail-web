import { z } from "zod/v4";
import { OTP_LENGTH } from "@/lib/config/constants";

export const otpSchema = z.object({
  code: z
    .string()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code`)
    .regex(/^\d+$/, "The code must be numeric"),
});

export type OtpInput = z.infer<typeof otpSchema>;

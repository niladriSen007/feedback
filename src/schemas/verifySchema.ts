import { z } from "zod";

export const verifySchema = z.object({
  verificationCode: z.string().min(6, "Verification token must be at least 6 characters long"),
})
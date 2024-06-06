import { z } from "zod";

export const signInSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
})
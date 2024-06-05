import { z } from "zod"

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name must be less than 255 characters long")
    .regex(/^[a-zA-Z\s]*$/, "Name must contain only alphabets"),
  email: z
    .string()
    .email({ message: "Please provide a valid email" })
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please provide a valid email"
    ),
  password: z.string().min(4, "Password must be at least 4 characters long"),
})

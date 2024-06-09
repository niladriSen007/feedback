import { z } from "zod"

export const UserNameValidationSchema = z
  .string()
  .min(1, "Name must be at least 1 character long")
  .max(255, "Name must be less than 255 characters long")
  .regex(/^[a-z0-9A-Z\s]*$/, "Name must contain only alphabets and numbers")

export const SignUpSchema = z.object({
  name: UserNameValidationSchema,
  email: z
    .string()
    .email({ message: "Please provide a valid email" })
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please provide a valid email"
    ),
  password: z.string().min(4, "Password must be at least 4 characters long"),
})

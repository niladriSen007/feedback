import { z } from "zod";

export const QuestionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 character long"),
  media: z.array(z.string()).optional()
})
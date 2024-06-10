import { z } from "zod";

export const answerSchema = z.object({
  answer: z.string().min(1, "Answer must be at least 1 character long"),
  media: z.array(z.string()),
})
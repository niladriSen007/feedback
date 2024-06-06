import { z } from "zod";

export const acceptingAnswersSchema = z.object({
  isacceptingans: z.boolean(),
})
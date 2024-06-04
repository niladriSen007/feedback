import { Answer } from "@/types/answer.type"
import { Model, Schema, model, models } from "mongoose"

const AnswerSchema: Schema<Answer> = new Schema(
  {
    answer: {
      type: String,
      required: true,
    },
    aAuthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true }
)

export const AnswerModel =
  (models.Answer as Model<Answer>) || model<Answer>("Answer", AnswerSchema)

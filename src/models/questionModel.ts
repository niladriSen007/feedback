import { Question } from "@/types/question.type"
import { Model, Schema, model, models } from "mongoose"

const QuestionSchema: Schema<Question> = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    qAuthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isacceptingans: {
      type: Boolean,
      default: true,
    },
    isclosed: {
      type: Boolean,
      default: false,
    },
    media: [
      {
        type: String,
      },
    ],
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
  },
  { timestamps: true }
)

export const QuestionModel =
  (models.Question as Model<Question>) || model<Question>("Question", QuestionSchema)

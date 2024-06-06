import { User } from "@/types/user.type"
import { Model, Schema, model, models } from "mongoose"

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    questionsRaised: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    answersGiven: [
      {
        type: Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    verificationCode: {
      type: String,
      required: [true, "Please provide a verification token"],
    },
    verificationExpiry: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export const UserModel =
  (models.User as Model<User>) || model<User>("User", UserSchema)

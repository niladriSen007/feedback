import { dbConnection } from "@/lib/database/connection"
import { User, getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { AuthOptions } from "../auth/[...nextauth]/options"
import mongoose from "mongoose"
import { UserModel } from "@/models/userModel"
import { QuestionModel } from "@/models/questionModel"

export async function GET(req: NextRequest) {
  await dbConnection()
  const { searchParams } = new URL(req.url)
  const skip = parseInt(searchParams.get("skip") as string)
  const limit = parseInt(searchParams.get("limit") as string)
  const session = await getServerSession(AuthOptions)
  console.log(session, "session123")
  const user: User = session?.user as User

  /* if (!session || !user) {
    return NextResponse.json({
      message: "User not found or not logged in yet",
      status: 200,
      success: false,
    })
  } */

  /*   const userId = new mongoose.Types.ObjectId(user._id) */
  try {
    /* const user = await UserModel.aggregate([
      {$match: {_id: userId}},
      {$unwind : "$questionsRaised"},
      {$sort:{'questionsRaised.createdAt': -1}},
      {$group: {_id: "$_id", questionsRaised: {$push: "$questionsRaised"}}},
    ]).exec() */

    const allQuestions = await QuestionModel.find()
      .populate("qAuthor")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)

    const allQuestionCount = await QuestionModel.find().countDocuments()
    console.log(allQuestionCount, "allQuestionCount")

    /*   console.log(user) */

    /*  if (!user) {
      return NextResponse.json({
        message: "User not found",
        status: 200,
        success: false,
      })
    } */

    return NextResponse.json({
      message: "Questions fetched successfully",
      status: 200,
      success: true,
      allQuestions: allQuestions,
      pageCount : Math.ceil(allQuestionCount / limit),
    })
  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to get questions",
      status: 400,
      success: false,
    })
  }
}

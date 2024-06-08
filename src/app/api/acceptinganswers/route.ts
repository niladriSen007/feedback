import { dbConnection } from "@/lib/database/connection"
import { User, getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { AuthOptions } from "../auth/[...nextauth]/options"
import { QuestionModel } from "@/models/questionModel"

export async function POST(req: NextRequest) {
  await dbConnection()
  const session = await getServerSession(AuthOptions)
  const user: User = session?.user as User

  if (!session || !user) {
    return NextResponse.json({
      message: "User not found or not logged in yet",
      status: 200,
      success: false,
    })
  }

  const { acceptAnswers } = await req.json()
  try {
    const question = await QuestionModel.findOne({
      qAuthor: user._id,
    })

    if (!question) {
      return NextResponse.json({
        message: "You are not the author of this question",
        status: 200,
        success: false,
      })
    }

    question.isacceptingans = acceptAnswers

    await question.save()

    return NextResponse.json({
      message: "Accepting answers updated successfully",
      status: 200,
      success: true,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to update accepting answers",
      status: 400,
      success: false,
    })
  }
}



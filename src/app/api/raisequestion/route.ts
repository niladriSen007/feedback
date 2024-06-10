import { dbConnection } from "@/lib/database/connection";
import { QuestionModel } from "@/models/questionModel";
import { UserModel } from "@/models/userModel";
import { Question } from "@/types/question.type";
import { getServerSession,User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../auth/[...nextauth]/options";



export async function POST(req:NextRequest){
  await dbConnection()
  const session = await getServerSession(AuthOptions)
  console.log(session,"session")
  let userVal: User = session?.user as User

  console.log(userVal)
  try {
    const { question,media } = await req.json()
    console.log(question)

    if (!question) {
      return NextResponse.json({
        message: "Question must include some text",
        status: 400,
        success: false,
      })
    }

    if (!userVal) {
      return NextResponse.json({
        message: "Username not found",
        status: 400,
        success: false,
      })
    }

    const user = await UserModel.findOne({ name: userVal?.name,isVerified:true })
    if (!user) {
      return NextResponse.json({
        message: "User not found",
        status: 400,
        success: false,
      })
    }

    const newQuestion : Question = new QuestionModel({
      question,
      qAuthor: user._id,
      isacceptingans:true,
      isclosed:false,
      answers:[],
      media
    })

    await newQuestion.save()
    user.questionsRaised.push(newQuestion as Question)
    await user.save()

    return NextResponse.json({
      message: "Question raised successfully",
      status: 200,
      success: true,
    })

  } catch (error) {
    return NextResponse.json({
      error: "Failed to raise question",
      status: 400,
      success: false,
    })
  }
}
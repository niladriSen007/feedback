import { dbConnection } from "@/lib/database/connection";
import { QuestionModel } from "@/models/questionModel";
import { UserModel } from "@/models/userModel";
import { Question } from "@/types/question.type";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";

export async function POST(req:NextRequest){
  await dbConnection()
  try {
    const { question, username } = await req.json()
    if (!question) {
      return NextResponse.json({
        message: "Question not found",
        status: 200,
        success: false,
      })
    }

    if (!username) {
      return NextResponse.json({
        message: "Username not found",
        status: 200,
        success: false,
      })
    }

    const user = await UserModel.findOne({ name: username,isVerified:true })
    if (!user) {
      return NextResponse.json({
        message: "User not found",
        status: 200,
        success: false,
      })
    }

    const newQuestion : Question = new QuestionModel({
      question,
      qAuthor: user._id,
      isacceptingans:true,
      isclosed:false,
      answers:[],
    })

    await newQuestion.save()
    user.questionsRaised.push(newQuestion)
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
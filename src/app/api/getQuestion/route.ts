import { dbConnection } from "@/lib/database/connection";
import { QuestionModel } from "@/models/questionModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
  await dbConnection()
  const { searchParams } = new URL(req.url)
  const queryParam = {
    questionId: searchParams.get("questionId"),
    }

    
  try {
    const question = await QuestionModel.findById(queryParam?.questionId).populate({
      path: "answers",
      populate: {
        path: "aAuthor",
       
      },
    })
    if (!question) {
      return NextResponse.json({
        message: "Question not found",
        status: 400,
        success: false,
      })
    }

   
    return NextResponse.json({
      status: 200,
      success: true,
      question,
    })
  } catch (error) {
    console.log(error)
  }
}
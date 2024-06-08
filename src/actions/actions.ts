"use server"
import { dbConnection } from "@/lib/database/connection"
import { QuestionModel } from "@/models/questionModel"

export async function getQuestion(questionId : string) {
  await dbConnection()
  try {
    const question = await QuestionModel.findById(questionId)
    if (!question) {
      return {
        message: "Question not found",
        status: 200,
        success: false,
      }
    }
    return question
  } catch (error) {
    console.log(error)
  }
  
}
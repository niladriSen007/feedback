"use server"
import { dbConnection } from "@/lib/database/connection"
import { AnswerModel } from "@/models/answerModel"
import { QuestionModel } from "@/models/questionModel"
import { Answer } from "@/types/answer.type"
import axios from "axios"
import { revalidatePath } from "next/cache"

export async function getQuestion(questionId: string) {
  
  try {
    const question = await axios.get(`http://localhost:3000/api/getQuestion?questionId=${questionId}`)
   
    return {
      status: 200,
      success: true,
      question,
    }
  } catch (error) {
    console.log(error)
  }
}

export const getAllQuestions = async (skip: number, limit: number) => {
  await dbConnection()
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/getquestions?skip=${skip}&limit=${limit}`
    )
    const { status, success, allQuestions, pageCount } = data
    return { status, success, allQuestions, pageCount }
  } catch (error) {
    console.log(error)
  }
}

export const raiseQuestion = async (question: string, media: string[]) => {
  await dbConnection()
  try {
    const { data } = await axios.post(
      "http://localhost:3000/api/raisequestion",
      {
        question,
        media,
      }
    )
    console.log(data)
    const { status, success } = data
    revalidatePath("/question/all")
    return { status, success }
  } catch (error) {
    console.log(error)
  }
}

export const giveAnswer = async (
  questionId: string,
  answer: string,
  media: string[],
  userId: string
) => {
  await dbConnection()

  console.log(questionId,answer,userId,media, "Niladri")
  try {
    const newAnswer = await new AnswerModel({
      answer,
      media,
      upvote: false,
      downvote: false,
      question: questionId,
      aAuthor: userId,
    }).save()

    console.log(newAnswer, "Niladri1")


    const question = await QuestionModel.findById(questionId)
    question?.answers.push(newAnswer)
    console.log(question, "Niladri2")
    await question?.save()
    revalidatePath('/questions/[questionId]')
    return {
      status: 200,
      success: true,
    }
  } catch (error) {
    return {
      status: 400,
      success: false,
    }
  }
}


export const upvoteOrDownvote = async (
  answerId: string,
  userId: string,
  isUpvote: boolean,
  isDownvote: boolean
) => {
  await dbConnection()
  try {
    const answer  = await AnswerModel.findById(answerId)

    if (!answer) {
      return {
        status: 400,
        success: false,
      }
    }
    if (isUpvote) {
      answer.upvote.push(userId)
      answer.downvote = answer.downvote.filter((id) => id !== userId)
    } else if (isDownvote) {
      answer.downvote.push(userId)
      answer.upvote = answer.upvote.filter((id) => id !== userId)
    }
    await answer.save()
    return {
      status: 200,
      success: true,
    }
  } catch (error) {
    return {
      status: 400,
      success: false,
    }
  }
}

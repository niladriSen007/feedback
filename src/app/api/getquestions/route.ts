import { dbConnection } from "@/lib/database/connection";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { UserModel } from "@/models/userModel";

export async function GET(req:NextRequest){
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

  const userId = new mongoose.Types.ObjectId(user._id)
  try {
    const user = await UserModel.aggregate([
      {$match: {_id: userId}},
      {$unwind : "$questionsRaised"},
      {$sort:{'questionsRaised.createdAt': -1}},
      {$group: {_id: "$_id", questionsRaised: {$push: "$questionsRaised"}}},
    ])

    if (!user) {
      return NextResponse.json({
        message: "User not found",
        status: 200,
        success: false,
      })
    }

    return NextResponse.json({
      message: "Questions fetched successfully",
      status: 200,
      success: true,
      questionsRised: user[0].questionsRaised,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to get questions",
      status: 400,
      success: false,
    })
  }
}

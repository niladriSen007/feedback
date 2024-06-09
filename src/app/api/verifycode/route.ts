import { dbConnection } from "@/lib/database/connection"
import { UserModel } from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  await dbConnection()
  try {
    const { name, verificationCode } = await req.json()
    const decodedUsername = decodeURIComponent(name)
    console.log(decodedUsername)
    const user = await UserModel.findOne({ name: decodedUsername })

    console.log("User " ,user)
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
        success: false,
      })
    }

    if (user.verificationCode !=   verificationCode) {
      return NextResponse.json({
        status: 400,
        message: "Invalid Verification Code",
        success: false,
      })
    } else {
      console.log("Inside this")
      const isCodeExpired = new Date(user.verificationExpiry) > new Date()

      if (!isCodeExpired) {
        return NextResponse.json({
          status: 400,
          message: "Verification Code Expired",
          success: false,
        })
      }

      user.isVerified = true
      await user.save()
    }

    return NextResponse.json({
      status: 200,
      message: "Verification Successful",
      success: true,
    })
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Verification Failed",
      success: false,
    })
  }
}

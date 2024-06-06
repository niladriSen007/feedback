import { dbConnection } from "@/lib/database/connection"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { UserModel } from "@/models/userModel"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"

export async function POST(request: NextRequest) {
  await dbConnection()
  try {
    const { name, email, password } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "Email and password are required",
        status: 400,
      })
    }
    const verifiedUserExistance = await UserModel.findOne({
      email,
      isVerified: true,
    })
    if (verifiedUserExistance) {
      return NextResponse.json({
        success: false,
        message: "User already verified",
        status: 400,
      })
    }

    const unverifiedUserExistance = await UserModel.findOne({ email })
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString()
    if (unverifiedUserExistance) {
      if (unverifiedUserExistance.isVerified) {
        return NextResponse.json({
          success: false,
          message: "User already verified",
          status: 400,
        })
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        unverifiedUserExistance.password = hashedPassword
        unverifiedUserExistance.verificationCode = verifyToken
        unverifiedUserExistance.verificationExpiry = new Date(
          Date.now() + 3600000
        )
        await unverifiedUserExistance.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        verificationCode: verifyToken,
        verificationExpiry: new Date(Date.now()).setHours(
          new Date(Date.now()).getHours() + 1
        ),
        isVerified: false,
        questionsRaised: [],
        answersGiven: [],
      })
      await newUser.save()
    }

    const sendEmail = await sendVerificationEmail(email, name, verifyToken)

    if (!sendEmail.success) {
      return NextResponse.json({
        success: false,
        message: "Error sending email",
        status: 500,
      })
    }
    return NextResponse.json({
      success: true,
      message: "User created successfully. Please verify your email address",
      status: 201,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Error creating user",
      status: 500,
    })
  }
}

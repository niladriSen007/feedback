import { dbConnection } from "@/lib/database/connection"
import { UserModel } from "@/models/userModel"
import { UserNameValidationSchema } from "@/schemas/signUpSchema"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const UserNameQuerySchema = z.object({
  name: UserNameValidationSchema,
})

export async function GET(req: NextRequest) {
  await dbConnection()
  try {
    const { searchParams } = new URL(req.url)
    const queryParam = {
      name: searchParams.get("name"),
      }
      const validatedQuery = UserNameQuerySchema.safeParse(queryParam)
      /* console.log(validatedQuery) */

    if (!validatedQuery.success) {
      const errors = validatedQuery.error.format().name?._errors || []
      return NextResponse.json({ error: errors[0], status: 400, success: false })
    }

    const userName = validatedQuery.data.name

    const isUserNameExist = await UserModel.findOne({
      name: userName,
      isVerified: true,
    })

    if (isUserNameExist) {
      return NextResponse.json({
        message: "Username already exists",
        status: 200,
        success: false,
      })
    }

    return NextResponse.json({
      message: "Username available",
      status: 200,
      success: true,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 400,
      success: false,
    })
  }
}

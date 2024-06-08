import { dbConnection } from "@/lib/database/connection";
import { UserModel } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";

export async function POST(req: NextRequest) {
  await dbConnection();
  try {
    const {name,code} = await req.json();
    const decodedUsername = decodeURIComponent(name);
    const user = await UserModel.findOne({ name: decodedUsername });

    if (!user) {
      return NextResponse.json({
        message: "User not found",
        status: 200,
        success: false,
      });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({
        message: "Invalid verification code",
        status: 200,
        success: false,
      });
    }

    const isCodeNotExpired = new Date(user.verificationExpiry) > new Date();

    if (!isCodeNotExpired) {
      return NextResponse.json({
        message: "Verification code expired",
        status: 200,
        success: false,
      });
    }

    user.isVerified = true;
    await user.save();
    return NextResponse.json({
      message: "User verified successfully",
      status: 200,
      success: true,
    });
  } catch (error : any) {
    return NextResponse.json({
      error: error.message,
      status: 400,
      success: false,
    });
  }
}
  
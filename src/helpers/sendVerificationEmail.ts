import { resend } from "@/lib/resendemail"
import { ApiResponse } from "@/types/apiResponse.type"
import { VerificationEmail } from "../../emails/VerifyEmailTemplate"

export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationCode: string
): Promise<ApiResponse> => {
  console.log(email, name, verificationCode)
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail({ name, otp: verificationCode }),
    })

    if (error) {
      return {
        success: false,
        message: error.message,
        status: 500,
      }
    }

    return {
      success: true,
      message: "Email sent successfully",
      status: 200,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      status: 500,
    }
  }
}

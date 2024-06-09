"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { verifySchema } from "@/schemas/verifySchema"
import { ApiResponse } from "@/types/apiResponse.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import axios from "axios"

const VerificationPage = () => {
  const { name } = useParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verificationCode: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof verifySchema>) => {
    try {
      const { data } = await axios.post<ApiResponse>("/api/verifyCode", {
        name,
        verificationCode: values.verificationCode,
      })

      if (data.success) {
        toast("Verification Successful", { type: "success" })
      router.replace("/signin")
      }else{
        toast("Verification Failed", { type: "error" })
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Verification Failed", { type: "error" })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md py-16 px-8 space-y-8 rounded-lg shadow-2xl border  shadow-violet-800">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="verificationCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
export default VerificationPage

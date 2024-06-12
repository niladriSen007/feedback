"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useDebounceValue } from "usehooks-ts"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignUpSchema } from "@/schemas/signUpSchema"
import { useEffect, useState } from "react"
import { CircleCheck, CircleX, Loader2, Ticket } from "lucide-react"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse.type"
import Link from "next/link"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

const Page = () => {
  const [name, setName] = useState<string>("")
  const [userNameMessage, setUserNameMessage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue(name, 500)

  const router = useRouter()

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUserName = async () => {
      if (!debouncedUsername) {
        setUserNameMessage("")
      }
      if (debouncedUsername) {
        setIsCheckingUsername(true)
        setUserNameMessage("")
        try {
          const { data } = await axios.get(
            `/api/checkUsername?name=${debouncedUsername}`
          )
          console.log(data)
          if (data.success) {
            setUserNameMessage(data.message)
          } else {
            setUserNameMessage(data.message)
          }
        } catch (error) {
          console.log("Inside error")
          const axiosError = error as AxiosError<ApiResponse>
          console.log(error)
          setUserNameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        }
        console.log("Outside error")
        setIsCheckingUsername(false)
      }
    }
    checkUserName()
  }, [debouncedUsername])

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    setIsSubmitting(true)
    try {
      const { data } = await axios.post<ApiResponse>("/api/signup", values)
      const { success, message, status } = data

      if (success) {
        toast(message, { type: "success" })
        setIsSubmitting(false)
        router.replace(`/verifyCode/${name}`)
      } else {
        setIsSubmitting(false)
        toast(message, { type: "error" })
      }
    } catch (error) {
      console.error("Error during sign-up:", error)

      const axiosError = error as AxiosError<ApiResponse>

      // Default error message
      let errorMessage = axiosError.response?.data.message
      ;("There was a problem with your sign-up. Please try again.")

      toast("Sign Up Failed", { type: "error" })

      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-fit my-24 flex flex-col items-center justify-center">
      <div className="border flex flex-col gap-6  border-white shadow-2xl   shadow-violet-800 px-8 py-12 rounded-2xl max-w-sm">
        <h1 className="text-4xl font-bold text-center">
          Sign up to Queue{" "}
          <span className="text-violet-500 text-4xl underline font-black italic ">
            Overflow.
          </span>
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Name</FormLabel>

                  <Input
                    placeholder="shadcn"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setDebouncedUsername(e.target.value)
                      setName(e.target.value)
                    }}
                  />
                  {isCheckingUsername ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <p
                      className={`text-sm ${
                        userNameMessage === "Username available"
                          ? "text-green-500"
                          : "text-red-600"
                      }`}
                    >
                      {!isCheckingUsername &&
                        userNameMessage &&
                        (userNameMessage === "Username available" ? (
                          <span className="flex items-center gap-1">
                            <CircleCheck color="lime" size={18} />
                            {userNameMessage}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <CircleX color="red" size={18} /> {userNameMessage}
                          </span>
                        ))}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Email</FormLabel>

                  <Input placeholder="shadcn" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel className="text-lg">Password</FormLabel>

                  <Input placeholder="shadcn" {...field} />
                </FormItem>
              )}
            />
            <Button
              className="w-full shadow-lg shadow-violet-800"
              type="submit"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-2">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-violet-400 hover:text-violet-500 transition-all duration-300 underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Page

"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ImageUpload from "@/components/upload/ImageUpload"
import { QuestionSchema } from "@/schemas/questionSchema"
import { ApiResponse } from "@/types/apiResponse.type"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

const AskQuestion = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      question: "",
      media: [],
    },
  })

  const onSubmit = async (values: z.infer<typeof QuestionSchema>) => {
    setIsSubmitting(true)
    try {
      const { data } = await axios.post<ApiResponse>("/api/raisequestion", {
        question: values?.question,
        media: values?.media,
      })

      if (data.success) {
        toast("Question raised Successfully", { type: "success" })
        setIsSubmitting(false)
        
        router.replace("/question/all")
      } else {
        toast(" Error raising question", { type: "error" })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      setIsSubmitting(false)
      toast(" Error raising question", { type: "error" })
    }
  }

  return (
    <div className=" min-h-screen max-w-6xl mx-auto py-12">
      <h1 className="text-5xl font-bold mb-8">Ask your question</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="question"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl">Question</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="media"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel className="text-2xl">Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter(
                          (imageUrl: string) => imageUrl !== url
                        ),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="" type="submit">
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
export default AskQuestion

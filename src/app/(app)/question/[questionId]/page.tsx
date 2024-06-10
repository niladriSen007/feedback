"use client"
import { getQuestion, giveAnswer } from "@/actions/actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ImageUpload from "@/components/upload/ImageUpload"
import { answerSchema } from "@/schemas/answerSchema"
import { Question } from "@/types/question.type"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const SingleQuestion = () => {

  const { data : userData } = useSession()
  console.log(userData?.user?._id,"nbcdvjcjhs")

  const { questionId } = useParams()
  const [questionDetails, setQuestionDetails] = useState<Question>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const getQuestionData = async () => {
    const { data } = await axios.get(
      `/api/getQuestion?questionId=${questionId}`
    )
    console.log(data, "Niladri")
    setQuestionDetails(data?.question)
  }

  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: "",
      media: [],
    },
  })

 

  async function onSubmit(values: z.infer<typeof answerSchema>) {
    setIsSubmitting(true)
    const result = await giveAnswer(
      questionId as string,
      values.answer,
      userData?.user?._id as string
    )
    console.log(result)
 
      setIsSubmitting(false)
      form.reset()
   
  }

  useEffect(() => {
    getQuestionData()
  }, [])

  
  return (
    <div className="min-h-screen max-w-6xl mx-auto py-16">
      <section>
        <h2 className="text-2xl font-bold ">
          Q: <span>{questionDetails?.question}</span>
        </h2>
        <section className="mb-8 mt-6">
          {questionDetails?.media && questionDetails?.media?.length > 0 && (
            <Image
              fetchPriority={"low"}
              priority
              src={questionDetails?.media[0]}
              alt="question_img"
              width={2400}
              height={2400}
              className="size-80 w-[600px] object-cover rounded-md"
            />
          )}
        </section>
        <section>
          <p className="text-xl mb-2">Answers</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4  "
            >
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      placeholder="Type your answer..."
                      {...field}
                      className="focus-visible:outline-none focus:outline-none  border-t-0 border-l-0 border-r-0  border-b-1 rounded-none"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="media"
                render={({ field }: any) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(url) =>
                          field.onChange([...field.value, url])
                        }
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (imageUrl: string) => imageUrl !== url
                            ),
                          ])
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="w-32 shadow-lg "
                type="submit"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span>Submit answer</span>
                )}
              </Button>
            </form>
          </Form>
          <div>
            {questionDetails?.answers?.map((answer) => (
              <div key={answer._id as string} className="border p-4 my-4">
                <p>{answer.answer}</p>
                {/* <p>By: {answer.userId}</p> */}
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}
export default SingleQuestion

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
import { Answer } from "@/types/answer.type"
import { Question } from "@/types/question.type"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

const SingleQuestion = () => {
  const { data: userData } = useSession()
  console.log(userData?.user?._id, "nbcdvjcjhs")

  const { questionId } = useParams()
  const [questionDetails, setQuestionDetails] = useState<Question>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [comments, setComments] = useState([])
  const getQuestionData = async () => {
    const { data } = await axios.get(
      `/api/getQuestion?questionId=${questionId}`
    )
    console.log(data, "Niladri")
    setIsDataLoading(false)
    setQuestionDetails(data?.question)
    setComments(data?.question?.answers)
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
      values.media,
      userData?.user?._id as string
    )
    console.log(result)
    if (result.success) {
      setIsSubmitting(false)
      setComments([
        {
          answer: values.answer,
          media: values.media,
          aAuthor: { name: userData?.user?.name },
          question: questionId,
        },
        ...comments,
      ])
      form.reset()
    } else {
      setIsSubmitting(false)
      toast("Something went wrong while submitting the answer", {
        type: "error",
      })
    }
  }

  useEffect(() => {
    getQuestionData()
  }, [])

  return (
    <div className="min-h-screen max-w-6xl mx-auto py-16">
      {isDataLoading ? (
        <div className="flex flex-col gap-10">
          <div className=" h-8 bg-slate-800 rounded-md" />
          <div className="w-2/5 h-64 bg-slate-800 rounded-md" />
          <div className="w-36 h-8 bg-slate-800 rounded-md" />
          <div className="w-36 h-8 bg-slate-800 rounded-md" />

          <div className=" h-8 bg-slate-800 rounded-md" />
          <div className=" h-8 bg-slate-800 rounded-md" />
          <div className=" h-8 bg-slate-800 rounded-md" />
          <div className=" h-8 bg-slate-800 rounded-md" />
          <div className=" h-8 bg-slate-800 rounded-md" />
          <div className=" h-8 bg-slate-800 rounded-md" />
        </div>
      ) : (
        <section>
          <h2 className="text-2xl font-bold ">
            Q: <span>{questionDetails?.question}</span>
          </h2>
          <section className="mb-8 mt-6">
            {questionDetails?.media && questionDetails?.media?.length > 0 && (
              <Image
                fetchPriority={"low"}
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
                <Button className="w-32 shadow-lg " type="submit">
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <span>Submit answer</span>
                  )}
                </Button>
              </form>
            </Form>
            <div>
              {comments?.map((answer: Answer) => (
                <div key={answer._id as string} className=" py-4 my-6">
                  <span>{answer?.aAuthor?.name}</span>
                  <p className="text-gray-400">{answer.answer}</p>
                  {answer?.media?.length > 0 &&
                    answer?.media?.map((media) => (
                      <Image
                        key={media}
                        src={media}
                        alt="answer_img"
                        width={2400}
                        height={2400}
                        className="size-80 mt-2 w-[600px] object-cover rounded-md"
                      />
                    ))}
                  {/* <p>By: {answer.userId}</p> */}
                </div>
              ))}
            </div>
          </section>
        </section>
      )}
    </div>
  )
}
export default SingleQuestion

import { Question } from "@/types/question.type"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"

interface QuestionCompProps {
  question: Question
  redirect: any
  setRedirect: any
}

const QuestionComp = ({question,redirect,setRedirect}:QuestionCompProps) => {
  return (
    <div
              key={question?._id as string}
              className="w-full flex items-start justify-between border-b pb-8"
            >
              <div className=" flex flex-col gap-4 ">
                <h2 className="text-2xl font-bold">
                  Q: <span>{question.question}</span>
                </h2>
                {question?.media?.length > 0 && (
                  <Image
                    fetchPriority={"low"}
                    src={question?.media[0]}
                    alt="question_img"
                    width={2400}
                    height={2400}
                    className="size-80 w-[600px] object-cover rounded-md"
                  />
                )}
                <p className="text-lg">by {question.qAuthor.name}</p>
                <Link
                  onClick={() => {
                    setRedirect({
                      redirect: true,
                      questionId: question._id as string,
                    })
                  }}
                  href={`/question/${question?._id}`}
                >
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    {redirect?.questionId == question?._id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "See details"
                    )}
                  </Button>
                </Link>
              </div>
              <div>on {new Date(question.createdAt).toLocaleDateString()}</div>
            </div>
  )
}
export default QuestionComp
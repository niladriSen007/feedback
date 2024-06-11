"use client"
import { getAllQuestions } from "@/actions/actions"
import { Button } from "@/components/ui/button"
import { Question } from "@/types/question.type"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const Page = () => {
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [redirect, setRedirect] = useState({
    redirect: false,
    questionId: "-1",
  })
  const [skip, setSkip] = useState(0)
  const [currentPageNo, setCurrentPageNo] = useState(1)
  const [limit] = useState(10)
  const [pgCount, setPgCount] = useState(0)

  const getAllQuestionsFromServer = async () => {
    const { allQuestions, pageCount } = await getAllQuestions(skip, limit)
    setPgCount(pageCount)
    setLoading(false)
    setQuestions(allQuestions)
  }

  useEffect(() => {
    getAllQuestionsFromServer()
    setRedirect({
      redirect: false,
      questionId: "-1",
    })
  }, [])

  return (
    <div className="min-h-screen max-w-6xl mx-auto py-16">
      <h1 className="text-5xl font-bold ">All Questions</h1>
      <Button className="my-8">
        <Link href={"/question/ask"}>Ask a question</Link>
      </Button>
      <div className="grid grid-cols-1 gap-12 ">
        {loading ? (
          <div className="w-full ">
            <div className=" flex items-start justify-between border-b pb-8 h-40 mb-6">
              <div className=" flex flex-col gap-4 ">
                <div className="w-48 bg-slate-700 h-6 rounded-md"></div>
                <div className="w-32 bg-slate-800 h-6 rounded-md"></div>
              </div>
              <div className="w-48 bg-slate-800 h-6 rounded-md"></div>
            </div>
            <div className=" flex items-start justify-between border-b pb-8 h-40 mb-6">
              <div className=" flex flex-col gap-4 ">
                <div className="w-48 bg-slate-700 h-6 rounded-md"></div>
                <div className="w-32 bg-slate-800 h-6 rounded-md"></div>
              </div>
              <div className="w-48 bg-slate-800 h-6 rounded-md"></div>
            </div>
            <div className=" flex items-start justify-between border-b pb-8 h-40 mb-6">
              <div className=" flex flex-col gap-4 ">
                <div className="w-48 bg-slate-700 h-6 rounded-md"></div>
                <div className="w-32 bg-slate-800 h-6 rounded-md"></div>
              </div>
              <div className="w-48 bg-slate-800 h-6 rounded-md"></div>
            </div>
            <div className=" flex items-start justify-between border-b pb-8 h-40 mb-6">
              <div className=" flex flex-col gap-4 ">
                <div className="w-48 bg-slate-700 h-6 rounded-md"></div>
                <div className="w-32 bg-slate-800 h-6 rounded-md"></div>
              </div>
              <div className="w-48 bg-slate-800 h-6 rounded-md"></div>
            </div>
          </div>
        ) : (
          questions?.map((question: Question) => (
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
                  <Button className="bg-blue-600">
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
          ))
        )}
      </div>
     {pgCount > 0 && <section className="flex items-center gap-8 my-20 w-full  justify-center">
        <Button
          disabled={currentPageNo === 1}
          onClick={() => {
            window.scrollTo(0, 0)
            setLoading(true)
            setCurrentPageNo(currentPageNo > 1 ? currentPageNo - 1 : 1)
            setSkip(skip > 0 ? skip - limit : 0)
            getAllQuestionsFromServer()
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Previous
        </Button>
        <p className="text-2xl">
          {currentPageNo} of {pgCount}
        </p>
        <Button
          disabled={currentPageNo === pgCount}
          onClick={() => {
            window.scrollTo(0, 0)
            setCurrentPageNo(
              currentPageNo < pgCount ? currentPageNo + 1 : pgCount
            )
            setLoading(true)
            setSkip(skip + limit)
            getAllQuestionsFromServer()
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Next
        </Button>
      </section>}
    </div>
  )
}
export default Page

"use client"
import { getAllQuestions } from "@/actions/actions"
import { QuestionLoader } from "@/components/questions/QuestionLoader"
import { Button } from "@/components/ui/button"
import { Question } from "@/types/question.type"
import Link from "next/link"
import { lazy, memo, useEffect, useState } from "react"
const MemoizedQuestionComp = memo(lazy(()=> import("@/components/questions/QuestionComp")))
const MemoizedQuestionLoader = memo(QuestionLoader)

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
          <MemoizedQuestionLoader />
        ) : (
          questions?.map((question: Question) => (
            <div key={question?._id as string}>
              <MemoizedQuestionComp {...{ question, redirect, setRedirect }} />
            </div>
          ))
        )}
      </div>
      {pgCount > 1 && (
        <section className="flex items-center gap-8 my-20 w-full  justify-center">
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
        </section>
      )}
    </div>
  )
}
export default Page

import { memo } from "react"

export const QuestionLoader = () => {
  return (
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
  )
}
/* export default function MemoizedQuestionLoader  () {
  return (QuestionLoader)
}
 */


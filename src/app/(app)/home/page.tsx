"use client"
import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import { motion } from "framer-motion"

const page = () => {
  return (
    <div className="w-screen min-h-screen text-white max-w-6xl mx-auto ">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 2,
        }}
      >
        <section className="text-center py-64 flex items-center justify-center flex-col ">
          <h1 className="text-7xl font-black">
            Welcome to Queue{" "}
            <span className="text-violet-600 underline">Overflow.</span>
          </h1>
          <p className="text-2xl my-8 w-2/5">
            One stop solution for resolving your doubts and get answers.
          </p>
          <section className="flex items-center justify-between gap-8">
            <Button className="bg-violet-600 text-white px-8 py-2 rounded-lg">
              Ask questions <MoveRight className="ml-1" />
            </Button>
            <Button className="bg-transparent border hover:bg-gray-400  text-white px-8 py-2 rounded-lg">
              Start demo{" "}
            </Button>
          </section>
        </section>
      </motion.div>
    </div>
  )
}
export default page

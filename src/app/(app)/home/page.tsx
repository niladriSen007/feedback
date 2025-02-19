"use client"
import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

import { GlobeDemo } from "@/components/shared/World"

const page = () => {
  return (
    <div className="  h-fit  text-white max-w-6xl mx-auto ">
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
        <section className="text-center max-w-6xl flex flex-col md:flex-row items-center justify-between">
          
          <div className=" flex px-8 md:px-0 items-center justify-center flex-col">
          <h1 className=" text-4xl md:text-6xl mt-8 font-black">
            Welcome to Queue{" "}
            <span className="text-violet-600 underline">Overflow.</span>
          </h1>
          <p className="text-sm md:text-lg my-8 px-6 md:px-0 ">
            One stop solution for resolving your doubts and get answers.
          </p>
          <section className="flex items-center justify-between gap-2 md:gap-8">
          <Link href={"/question/ask"} className="flex items-center">
            <Button className="bg-violet-600 text-white px-4 md:px-8 py-2 rounded-lg">
             Ask questions <MoveRight className="ml-1" />
            </Button>
            </Link>
            <Button className="bg-transparent border hover:bg-gray-400  text-white px-4 md:px-8 py-2 rounded-lg">
              Start demo{" "}
            </Button>
          </section>
          </div>
          <GlobeDemo />
        </section>
      </motion.div>
    </div>
  )
}
export default page

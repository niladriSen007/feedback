import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full h-20 max-w-6xl mx-auto">
      {/* <section className="text-2xl">Queue<span className="text-violet-600 font-black underline">Overflow.</span></section> */}
      <Image src="/l.png" alt="Queue overflow" width={70} height={70} />
      <section>
        <ul className="flex items-center gap-8">
          <Link href={"/home"}>Home</Link>
          <Link href={"/question/all"}>Questions</Link>
          <Link href={"/profile"}>Profile</Link>
          
        </ul>
      </section>
    </nav>
  )
}
export default Navbar
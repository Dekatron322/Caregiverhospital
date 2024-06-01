"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { usePathname, useRouter } from "next/navigation"
import { HMOs } from "utils"

import { IoIosArrowForward, IoMdArrowBack } from "react-icons/io"
import { useState } from "react"

import "aos/dist/aos.css"
import Hmo from "components/Hmo/Hmo"

export default function Dashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  setTimeout(() => setLoading(false), 5000)

  const handleGoBack = () => {
    router.back()
  }

  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />
            <div className="px-16 max-md:px-3 md:pt-4">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go Back</p>
              </button>
            </div>
            <div className="flex  justify-center ">
              <div className="flex flex-col items-center max-md:w-full">
                <div className="mt-4 w-full px-16 max-md:flex-col max-md:px-3 md:min-w-[650px]">
                  <p className="mb-4 font-semibold">HMos</p>
                  <Hmo />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}

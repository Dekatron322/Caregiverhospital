"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { usePathname, useRouter } from "next/navigation"
import { Finance } from "utils"

import { IoMdArrowBack } from "react-icons/io"
import { useEffect, useState } from "react"

import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const isDashboardPage = pathname.includes("/dashboard")
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
            <div className="px-16 pt-4 max-md:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>
            <div className="flex  justify-center">
              <div className="flex flex-col items-center max-md:w-full ">
                <div className="mt-4 w-full px-16 max-md:w-full max-md:flex-col max-md:px-3 md:min-w-[650px]">
                  <p className="mb-4 font-semibold">Finance</p>
                  {Finance.map((finance) => (
                    <div key={finance.id} className=" sidebar mb-4 w-full rounded border p-4 shadow-md">
                      <div className="mb-6 flex justify-between">
                        <h6 className="font-bold">{finance.name}</h6>
                        <Image src="/money-bag.svg" height={48} width={48} alt="pharmacy" />
                      </div>
                      <div className="flex justify-between">
                        {/* <h6 className="font-bold">₦{finance.income}</h6> */}
                        <span className="rounded bg-[#46FFA666] px-[10px] py-[5px]">{finance.status}</span>
                      </div>
                      <div className="mt-6 flex w-full ">
                        <Link href={finance.url} className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]">
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
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

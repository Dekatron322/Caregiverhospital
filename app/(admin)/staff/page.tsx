"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowForward } from "react-icons/io"
import { usePathname } from "next/navigation"

import { Skeleton } from "@mui/material"
import { useState } from "react"

import "aos/dist/aos.css"
import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const isDashboardPage = pathname.includes("/dashboard")
  setTimeout(() => setLoading(false), 5000)
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />
            <div className="flex items-center gap-2 px-16 pt-4 max-md:px-3">
              <p className="font-bold">Admin Dashboard</p>
              <IoIosArrowForward />
              <p className="capitalize">{pathname.split("/").pop()}</p>
            </div>
            <div className="mt-10  flex gap-4 px-16 max-md:flex-col max-md:px-3">
              <div className="w-full rounded border p-4">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Pharmacy</h6>
                  <Image src="/pharmacy-symbol.svg" height={48} width={48} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">Registered Staff</h6>
                  <h6 className="font-bold">36</h6>
                </div>
                <div className="mt-8 flex w-full ">
                  <Link
                    href="staff/pharmacy"
                    className="button-primary h-[50px] w-full rounded-sm  max-sm:h-[45px]
                "
                  >
                    View
                  </Link>
                </div>
              </div>
              <div className="w-full rounded border p-4">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Laboratory</h6>
                  <Image src="/laboratory-analyst.svg" height={48} width={63} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">Registered Staff</h6>
                  <h6 className="font-bold">36</h6>
                </div>
                <div className="mt-8 flex w-full ">
                  <Link
                    href="staff/laboratory"
                    className="button-primary h-[50px] w-full rounded-sm  max-sm:h-[45px]
                "
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-4  flex gap-4 px-16 pb-16 max-md:flex-col max-md:px-3">
              <div className="w-full rounded border p-4">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Finance</h6>
                  <Image src="/money-bag.svg" height={48} width={48} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">Registered Staff</h6>
                  <h6 className="font-bold">36</h6>
                </div>
                <div className="mt-8 flex w-full ">
                  <Link
                    href="departments/finance"
                    className="button-primary h-[50px] w-full rounded-sm  max-sm:h-[45px]
                "
                  >
                    View
                  </Link>
                </div>
              </div>
              <div className="w-full rounded border p-4">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Medical Consultant</h6>
                  <Image src="/avatar-doctor-health-hospital-man-medical-2.svg" height={48} width={48} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">Registered Staff</h6>
                  <h6 className="font-bold">36</h6>
                </div>
                <div className="mt-8 flex w-full ">
                  <Link
                    href="/staff/medical-consultant"
                    className="button-primary h-[50px] w-full rounded-sm  max-sm:h-[45px]
                "
                  >
                    View
                  </Link>
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

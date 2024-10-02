"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"

import IssueRequest from "components/Dashboard/IssueRequest"
import { IoIosArrowForward } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import PharmacyNav from "components/Navbar/PharmacyNav"

export default function Dashboard() {
  const pathname = usePathname()
  return (
    <section>
      <div className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <PharmacyNav />

            <div className="flex items-center gap-2 px-16 max-sm:px-3  md:py-6">
              <p className="font-bold">Pharmacy</p>
              <IoIosArrowForward />
              <p className="capitalize">List of {pathname.split("/").pop()}</p>
            </div>

            <div className="mb-16 flex gap-6 px-16 py-6 max-sm:px-3">
              <div className="w-full">
                <p className="mb-8 font-semibold">Issue Requests</p>
                <IssueRequest />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </section>
  )
}

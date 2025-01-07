"use client"
import Footer from "components/Footer/Footer"
import { IoIosArrowForward } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import CashierNav from "components/Navbar/CashierNav"
import AllDownPayment from "components/Dashboard/AllDownPayment"

export default function DownPayment() {
  const pathname = usePathname()
  return (
    <section>
      <div className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <CashierNav />

            <div className="flex items-center gap-2 px-16 max-sm:px-3  md:py-6">
              <p className="font-bold">Cashier</p>
              <IoIosArrowForward />
              <p className="capitalize">{pathname.split("/").pop()}</p>
            </div>

            <div className="mb-16 flex gap-6 px-16 py-6 max-sm:px-3">
              <div className="w-full">
                <p className="mb-8 font-semibold">Down Payment</p>
                <AllDownPayment />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </section>
  )
}

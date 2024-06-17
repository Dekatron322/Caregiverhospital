"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { usePathname, useRouter } from "next/navigation"
import { SetStateAction, useState } from "react"

import { IoMdArrowBack } from "react-icons/io"
import Image from "next/image"

import { FaCalendarAlt } from "react-icons/fa"
import { MdOutlinePrint } from "react-icons/md"
import { IoIosArrowDown } from "react-icons/io"

export default function Pocket() {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [openSection, setOpenSection] = useState(0) // State to manage open section

  const isDashboardPage = pathname.includes("/dashboard")
  setTimeout(() => setLoading(false), 5000)

  const handleGoBack = () => {
    router.back()
  }

  const toggleOpen = (index: SetStateAction<number>) => {
    setOpenSection(openSection === index ? -1 : index) // Toggle the state
  }

  return (
    <>
      <section className="h-full ">
        <div className="flex min-h-screen ">
          <div className="flex w-screen flex-col ">
            <DashboardNav />
            <div className="px-16 max-md:px-3 md:py-4">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>
            <div className="flex justify-between gap-4 px-16 max-md:px-3">
              <div className="w-[80%] ">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold">HMO1 MONTHLY INVOICE</p>
                  <div className="flex items-center gap-1 ">
                    <FaCalendarAlt className="text-lg" />
                    <p className="text-xs">February, 2024</p>
                  </div>
                </div>
                <div className="rounded border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Image src="/admission1.svg" width={40} height={40} alt="" />
                      <div>
                        <h5>John Smith</h5>
                        <p className="text-xs">HMO ID: 1234567AA</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs">Date: 1st Feb 2024</p>
                    </div>
                  </div>
                  <div className="tab-bg mt-2 w-full rounded p-4">
                    <div className="flex items-center justify-between" onClick={() => toggleOpen(0)}>
                      <p>Orders (₦1200.00)</p>
                      <IoIosArrowDown />
                    </div>
                    {openSection === 0 && (
                      <div className="mt-4 flex-col">
                        <div className="flex items-center justify-between pb-4">
                          <p className="text-sm">Panadol</p>
                          <p className="text-sm font-bold">1 x ₦200.00</p>
                        </div>
                        <div className="flex items-center justify-between pb-4">
                          <p className="text-sm">Panadol</p>
                          <p className="text-sm font-bold">1 x ₦200.00</p>
                        </div>
                        <div className="flex items-center justify-between pb-4">
                          <p className="text-sm">Panadol</p>
                          <p className="text-sm font-bold">1 x ₦200.00</p>
                        </div>
                        <div className="w-full border"></div>
                        <div className="flex items-center justify-between pt-4">
                          <p className="text-sm">Total</p>
                          <p className="text-sm font-bold">₦1200.00</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Image src="/admission2.svg" width={40} height={40} alt="" />
                      <div>
                        <h5>John Smith</h5>
                        <p className="text-xs">HMO ID: 1234567AA</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs">Date: 1st Feb 2024</p>
                    </div>
                  </div>
                  <div className="tab-bg mt-2 w-full rounded p-4">
                    <div className="flex items-center justify-between" onClick={() => toggleOpen(1)}>
                      <p>Orders (₦1200.00)</p>
                      <IoIosArrowDown />
                    </div>
                    {openSection === 1 && (
                      <div className="mt-4 flex-col">
                        <div className="flex items-center justify-between pb-4 ">
                          <p className="text-sm">Panadol</p>
                          <p className="text-sm font-bold">1 x ₦200.00</p>
                        </div>
                        <div className="flex items-center justify-between pb-4">
                          <p className="text-sm">Panadol</p>
                          <p className="text-sm font-bold">1 x ₦200.00</p>
                        </div>
                        <div className="flex items-center justify-between pb-4">
                          <p className="text-sm">Panadol</p>
                          <p className="text-sm font-bold">1 x ₦200.00</p>
                        </div>
                        <div className="w-full border"></div>
                        <div className="flex items-center justify-between pt-4">
                          <p className="text-sm">Total</p>
                          <p className="text-sm font-bold">₦1200.00</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Image src="/admission3.svg" width={40} height={40} alt="" />
                      <div>
                        <h5>John Smith</h5>
                        <p className="text-xs">HMO ID: 1234567AA</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs">Date: 1st Feb 2024</p>
                    </div>
                  </div>
                  <div className="tab-bg mt-2 w-full rounded p-4">
                    <div className="flex items-center justify-between" onClick={() => toggleOpen(2)}>
                      <p>Orders (₦1200.00)</p>
                      <IoIosArrowDown />
                    </div>
                    {openSection === 2 && (
                      <div className="mt-4 flex-col">
                        <div className="flex items-center justify-between pb-4 ">
                          <p className="text-sm">Panadol</p>
                          <p className="text-sm font-bold">1 x ₦200.00</p>
                        </div>
                        <div className="flex items-center justify-between pb-4">
                          <p className="text-sm">Panadol</p>
                          <p className="text-sm font-bold">1 x ₦200.00</p>
                        </div>
                        <div className="flex items-center justify-between pb-4">
                          <p className="text-sm">Panadol</p>
                          <p className="text-sm font-bold">1 x ₦200.00</p>
                        </div>
                        <div className="w-full border"></div>
                        <div className="flex items-center justify-between pt-4">
                          <p className="text-sm">Total</p>
                          <p className="text-sm font-bold">₦1200.00</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 w-full border"></div>
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm">Total</p>
                    <p className="text-sm font-bold">₦1200.00</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1">
                    <MdOutlinePrint />
                    <p className="text-sm">Print</p>
                  </div>
                </div>
              </div>
              <div className="w-[20%]">
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-lg" />
                    <p className="text-xs">2024 Invoice</p>
                  </div>
                  <IoIosArrowDown />
                </div>
                <div className="mt-1 flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-lg" />
                    <p className="text-xs">2024 Invoice</p>
                  </div>
                  <IoIosArrowDown />
                </div>
                <div className="mt-1 flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-lg" />
                    <p className="text-xs">2024 Invoice</p>
                  </div>
                  <IoIosArrowDown />
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

"use client"
import React, { useState } from "react"
import { HiMiniStar } from "react-icons/hi2"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { RiImageAddLine } from "react-icons/ri"
import { IoChevronDownOutline } from "react-icons/io5"
import { RxCalendar } from "react-icons/rx"
import { useRouter } from "next/navigation"
import { IoMdArrowBack } from "react-icons/io"

interface RateIconProps {
  filled: boolean
  onClick: () => void
}

const RateIcon: React.FC<RateIconProps> = ({ filled, onClick }) => {
  return (
    <span onClick={onClick} style={{ cursor: "pointer" }}>
      {filled ? (
        <HiMiniStar className="h-5 w-5 text-[#FFC70066]" />
      ) : (
        <HiMiniStar className="h-5 w-5 text-[#FFC70066] opacity-40" />
      )}
    </span>
  )
}
const page = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />
            <div className=" flex justify-between px-16 py-6 max-sm:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>
            <div className="mb-6 flex h-full w-full items-center justify-center">
              <div className="auth flex w-2/3 rounded-lg max-sm:w-full">
                <div className="w-full px-6 py-6 max-sm:px-3">
                  <h6 className="text-lg font-medium">Add New Medicine</h6>

                  <div className="mt-6">
                    <div className="mb-3 grid grid-cols-3 gap-3 max-sm:grid-cols-2">
                      <div className="search-bg   flex h-[50px] w-[100%] items-center justify-between gap-3  rounded  px-3  py-1 hover:border-[#5378F6]  focus:border-[#5378F6]  focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Medicine Name"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Medicine Category"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                        <IoChevronDownOutline />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Medicine Id"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                        <RxCalendar />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="number"
                          id="search"
                          placeholder="Price"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="number"
                          id="search"
                          placeholder="Quantity"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="number"
                          id="search"
                          placeholder="Expiry Date"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                    </div>

                    <div className="mb-2  gap-3">
                      <textarea
                        className="search-bg  h-[100px] w-full rounded-md border bg-transparent p-2 outline-none"
                        placeholder="Add how to use..."
                      ></textarea>
                    </div>
                    <div className="mb-3  gap-3">
                      <textarea
                        className="search-bg  h-[100px] w-full rounded-md border bg-transparent p-2 outline-none"
                        placeholder="Add side effects..."
                      ></textarea>
                    </div>
                    <button
                      className="button-primary h-[50px] w-full rounded-md  max-sm:h-[45px]
                  "
                    >
                      REGISTER
                    </button>
                  </div>
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

export default page

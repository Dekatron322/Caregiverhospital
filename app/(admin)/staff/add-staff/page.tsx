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
            <div className="flex justify-between px-16 pt-4 max-md:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="">Go back</p>
              </button>
            </div>
            <div className="flex h-full w-full items-center justify-center ">
              <div className="auth flex rounded-lg md:w-2/3">
                <div className="w-full px-6 py-8">
                  <h6 className="text-lg font-medium">Register Staff</h6>
                  <p>Please enter staff essentials</p>
                  <div className="mt-12">
                    <div className="mb-3">
                      <div className="search-bg flex h-20 w-full content-center items-center justify-center rounded border border-dotted">
                        <RiImageAddLine className="text-[#087A43]" />
                      </div>
                    </div>
                    <div className="mb-3 flex gap-3">
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Full Name"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Gender"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                        <IoChevronDownOutline />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Date of Birth"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                        <RxCalendar />
                      </div>
                    </div>
                    <div className="mb-3 flex gap-3">
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Department"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                        <IoChevronDownOutline />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Qualification"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                    </div>
                    <div className="mb-3 flex gap-3">
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Email Address"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Phone number"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                    </div>
                    <div className="mb-3  gap-3">
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Address"
                          className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
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

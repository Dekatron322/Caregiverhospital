"use client"
import React, { useEffect, useRef, useState } from "react"
import { HiMiniStar } from "react-icons/hi2"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { RiImageAddLine } from "react-icons/ri"
import { IoChevronDownOutline } from "react-icons/io5"
import { RxCalendar } from "react-icons/rx"
import { useRouter } from "next/navigation"
import { IoMdArrowBack } from "react-icons/io"
import Image from "next/image"

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const departments = ["Medical Consultants", "Pharmacy", "Medical Laboratory", "Finance", "Nurse", "Patients"]
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous)
  }

  const handleInputChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSearchTerm(event.target.value)
    setShowDropdown(true)
  }

  const handleDropdownSelect = (state: React.SetStateAction<string>) => {
    setSearchTerm(state)
    setShowDropdown(false)
  }

  const handleCancelSearch = () => {
    setSearchTerm("")
    setShowDropdown(false)
  }
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
            <div className="flex justify-between px-16 py-4 max-md:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>
            <div className="flex h-full w-full items-center justify-center ">
              <div className="auth flex rounded-lg shadow md:w-2/3">
                <div className="w-full px-6 py-8 max-md:px-3">
                  <h6 className="text-lg font-medium">Register Patient</h6>
                  <p className="text-sm">Please enter user essentials to give them access to the platform</p>
                  <div className="mt-6">
                    <div className="mb-3">
                      <div className="search-bg flex h-20 w-full content-center items-center justify-center rounded border border-dotted">
                        <RiImageAddLine className="text-[#087A43]" />
                      </div>
                    </div>
                    <div className="mb-3 grid grid-cols-3 gap-3 max-sm:grid-cols-2">
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Full Name"
                          className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Gender"
                          className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                        <IoChevronDownOutline />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Date of Birth"
                          className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                        <RxCalendar />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Email Address"
                          className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Phone number"
                          className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                          style={{ width: "100%", height: "40px" }}
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Address"
                          className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                    </div>
                    <div className="mb-3 flex gap-3">
                      <div
                        className="search-bg relative flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2"
                        ref={dropdownRef}
                      >
                        <div className="flex w-[100%] items-center justify-between gap-3">
                          <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
                          <Image
                            className="dark-icon-style"
                            src="/search-dark.svg"
                            width={16}
                            height={16}
                            alt="dekalo"
                          />
                          <input
                            type="text"
                            id="search"
                            placeholder="Select department"
                            className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                            style={{ width: "100%", height: "50px" }}
                            value={searchTerm}
                            onChange={handleInputChange}
                            onFocus={() => setShowDropdown(true)}
                          />
                          {searchTerm && (
                            <button className="focus:outline-none" onClick={handleCancelSearch}>
                              <Image className="icon-style" src="/cancel.svg" width={16} height={16} alt="cancel" />
                              <Image
                                className="dark-icon-style"
                                src="/dark_cancel.svg"
                                width={16}
                                height={16}
                                alt="cancel"
                              />
                            </button>
                          )}
                        </div>
                        {showDropdown && (
                          <div className="dropdown absolute left-0 top-full z-10 w-full rounded-md">
                            {departments
                              .filter((department) => department.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map((department, index) => (
                                <div
                                  key={index}
                                  className="cursor-pointer overflow-hidden px-4 py-2 hover:bg-[#747A80]"
                                  onClick={() => handleDropdownSelect(department)}
                                >
                                  <p className="text-xs font-medium">{department}</p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Membership number"
                          className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                    </div>

                    <div className="mb-3  gap-3">
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="search"
                          placeholder="Allergies"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <p className="my-2 text-xs">Seperate allergies with ","</p>
                    </div>

                    <h6 className="text-lg font-medium">Next of Kin Information</h6>

                    <div className="mt-3">
                      <div className="mb-3 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                        <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            id="search"
                            placeholder="Name"
                            className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                            style={{ width: "100%", height: "50px" }}
                          />
                        </div>
                        <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            id="search"
                            placeholder="Phone number"
                            className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                            style={{ width: "100%", height: "40px" }}
                          />
                        </div>
                        <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            id="search"
                            placeholder="Address"
                            className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                            style={{ width: "100%", height: "50px" }}
                          />
                        </div>
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

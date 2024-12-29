"use client"
import React, { useEffect, useRef, useState } from "react"
import { HiMiniStar } from "react-icons/hi2"
import Image from "next/image"
import Navbar from "components/Navbar/Navbar"
import Link from "next/link"

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

const Page = () => {
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

  const isSubmitEnabled = comment.trim() !== "" || selectedAmenities.length > 0 || rating > 0
  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full items-center justify-center ">
        <div className="auth flex max-w-[498px] justify-center rounded-lg">
          <div className="px-6 py-6">
            <h6 className="text-center text-lg font-medium">Sign Up</h6>

            <div className="mt-3 flex gap-4">
              <div className="search-bg mb-3 flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="search"
                  placeholder="First Name"
                  className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "50px" }}
                />
              </div>
              <div className="search-bg mb-3 flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="search"
                  placeholder="Last Name"
                  className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "50px" }}
                />
              </div>
            </div>

            <div className="search-bg mb-3 flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="search"
                placeholder="Username"
                className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                style={{ width: "100%", height: "50px" }}
              />
            </div>

            <div className="relative" ref={dropdownRef}>
              <div className="search-bg mb-3 flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
                <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
                <input
                  type="text"
                  id="search"
                  placeholder="Select department"
                  className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "50px" }}
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => setShowDropdown(true)}
                />
                {searchTerm && (
                  <button className="focus:outline-none" onClick={handleCancelSearch}>
                    <Image className="icon-style" src="/cancel.svg" width={16} height={16} alt="cancel" />
                    <Image className="dark-icon-style" src="/dark_cancel.svg" width={16} height={16} alt="cancel" />
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
                        className="cursor-pointer overflow-hidden px-4 py-2 hover:bg-[#D4DCF1]"
                        onClick={() => handleDropdownSelect(department)}
                      >
                        <p className="text-sm font-medium">{department}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="search-bg mb-3 flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="search"
                placeholder="Email address"
                className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                style={{ width: "100%", height: "50px" }}
              />
            </div>

            <div className="search-bg mb-3 flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="search"
                placeholder="Password"
                className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                style={{ width: "100%", height: "50px" }}
              />
              <button className="focus:outline-none">
                <Image className="icon-style" src="/password.svg" width={16} height={16} alt="password" />
              </button>
            </div>

            <div className="search-bg mb-3 flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="search"
                placeholder="Confirm Password"
                className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                style={{ width: "100%", height: "50px" }}
              />
              <button className="focus:outline-none">
                <Image className="icon-style" src="/password.svg" width={16} height={16} alt="password" />
              </button>
            </div>

            <div className="my-4 flex content-center items-center gap-2" onClick={toggleAnonymous}>
              {isAnonymous ? (
                <Image src="/checkbox1.svg" width={14} height={14} alt="checkbox" />
              ) : (
                <Image src="/checkbox.svg" width={14} height={14} alt="checkbox" />
              )}
              <p className="text-sm">Remember me</p>
            </div>
            <div className="flex w-full gap-6">
              <button
                className="button-primary h-[50px] w-full rounded-md  max-sm:h-[45px]
                "
              >
                SIGN UP
              </button>
            </div>

            <div className="mb-6 mt-4 flex items-center justify-center gap-1">
              <Image src="/stroke.svg" width={140} height={1} alt="checkbox" />
              <p>Or</p>
              <Image src="/stroke.svg" width={140} height={1} alt="checkbox" />
            </div>
            <div className="flex justify-center gap-1">
              <p>Already have an account? </p>
              <Link href="signin" className="text-[#3366FF]">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page

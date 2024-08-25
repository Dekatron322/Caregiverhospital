"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { HiMiniStar } from "react-icons/hi2"
import Image from "next/image"
import Navbar from "components/Navbar/Navbar"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

// Define a union type for the departments
type Department = "Admin" | "Doctors" | "Pharmacy" | "Laboratory" | "Nurses" | "Cashier"

const Page: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])

  const [searchTerm, setSearchTerm] = useState<Department | "">("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const departments: Department[] = ["Admin", "Doctors", "Pharmacy", "Laboratory", "Nurses", "Cashier"]

  const router = useRouter() // Initialize the router

  const departmentRoutes: { [key in Department]: string } = {
    Admin: "/dashboard",
    Doctors: "/doctor-dashboard",
    Pharmacy: "/pharmacy-dashboard",
    Laboratory: "/laboratory-dashboard",
    Nurses: "/nurses-dashboard",
    Cashier: "/cashier-dashboard",
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleRateClick = (index: number) => {
    setRating(index + 1)
  }

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  const toggleAmenity = (amenityId: number) => {
    if (selectedAmenities.includes(amenityId)) {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId))
    } else {
      setSelectedAmenities([...selectedAmenities, amenityId])
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value as Department | "")
    setShowDropdown(true)
  }

  const handleDropdownSelect = (department: Department) => {
    setSearchTerm(department)
    setShowDropdown(false)
  }

  const handleCancelSearch = () => {
    setSearchTerm("")
    setShowDropdown(false)
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("https://api2.caregiverhospital.com/app_user/sign-in/", {
        username: username,
        password: password,
        department: searchTerm,
      })

      // Log the posted data
      console.log("Data posted:", {
        username: username,
        password: password,
        department: searchTerm,
      })

      // Handle the response as needed
      console.log("Login successful:", response.data)

      const userId = response.data.id
      localStorage.setItem("id", userId.toString())
      console.log("User ID set in localStorage:", localStorage.getItem("id")) // Log the value to confirm

      // Redirect based on department
      if (searchTerm) {
        const route = departmentRoutes[searchTerm]
        router.push(route)
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 5000)
      }
    } catch (error) {
      setError("Login failed. Please try again.")
      console.error("Login error:", error)

      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full items-center justify-center">
        <div className="auth flex rounded-lg max-sm:w-full xl:min-w-[498px]">
          <div className="w-full justify-center px-6 py-6">
            <h6 className="mb-6 text-center text-lg font-medium">Sign In</h6>
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <div className="search-bg mb-3 flex h-[50px] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2 max-sm:w-full xl:w-[450px]">
                  <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
                  <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Select department"
                    className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%", height: "45px" }}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {searchTerm && (
                    <button type="button" className="focus:outline-none" onClick={handleCancelSearch}>
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
                          className="cursor-pointer overflow-hidden px-4 py-2 hover:bg-[#747A80]"
                          onClick={() => handleDropdownSelect(department)}
                        >
                          <p className="text-xs font-medium">{department}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="search-bg mb-3 flex h-[50px] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2 xl:w-[450px]">
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="w-ful h-[45px] bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="search-bg mb-3 flex h-[50px] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2 xl:w-[450px]">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button type="button" className="focus:outline-none">
                  <Image className="icon-style" src="/password.svg" width={16} height={16} alt="password" />
                  <Image
                    className="dark-icon-style"
                    src="/passwordpassword.svg"
                    width={16}
                    height={16}
                    alt="password"
                  />
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
                  type="submit"
                  className="button-primary h-[50px] w-full rounded-md max-sm:h-[45px]"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "SIGN IN"}
                </button>
              </div>
            </form>

            <div className="mb-6 mt-4 flex items-center justify-center gap-1">
              <Image src="/stroke.svg" width={140} height={1} alt="checkbox" />
              <p>Or</p>
              <Image src="/stroke.svg" width={140} height={1} alt="checkbox" />
            </div>
            <div className="flex justify-center gap-1">
              <p>you&apos;re a patient? </p>
              <Link href="/signin/patient" className="text-[#46FFA6]">
                Login as Patient
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5  flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Login Successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in 0 absolute bottom-16  m-5 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514] md:right-16">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#D14343]">{error}</span>
        </div>
      )}
    </>
  )
}

export default Page

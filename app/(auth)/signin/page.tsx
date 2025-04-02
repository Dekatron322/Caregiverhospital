"use client"
import React, { useState } from "react"
import axios from "axios"
import { HiMiniStar } from "react-icons/hi2"
import Image from "next/image"
import Navbar from "components/Navbar/Navbar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"

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

type Department = "Admin" | "Doctors" | "Pharmacy" | "Laboratory" | "Nurses" | "Cashier"

const Page: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<Department | "">("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const departments: Department[] = ["Admin", "Doctors", "Pharmacy", "Laboratory", "Nurses", "Cashier"]

  const router = useRouter()

  const departmentRoutes: { [key in Department]: string } = {
    Admin: "/dashboard",
    Doctors: "/doctor-dashboard",
    Pharmacy: "/pharmacy-dashboard",
    Laboratory: "/laboratory-dashboard",
    Nurses: "/nurses-dashboard",
    Cashier: "/cashier-dashboard",
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

      console.log("Data posted:", {
        username: username,
        password: password,
        department: searchTerm,
      })

      console.log("Login successful:", response.data)

      const userId = response.data.id
      localStorage.setItem("id", userId.toString())
      console.log("User ID set in localStorage:", localStorage.getItem("id"))

      if (searchTerm) {
        const route = departmentRoutes[searchTerm]
        router.push(route)

        toast.success("Login Successful", {
          description: "You have successfully logged in.",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        })
      }
    } catch (error) {
      setError("Login failed. Please try again.")
      console.error("Login error:", error)

      toast.error("Login Failed", {
        description: "Please check your credentials and try again.",
        duration: 5000,
        cancel: {
          label: "Close",
          onClick: () => {},
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/2493e163-a190-44e0-88af-aed2aaa79ee5 (1).webp"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
          className=" brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-15"></div>
      </div>

      <Navbar />
      <Toaster position="top-center" richColors />
      <div className="flex h-screen w-full items-center justify-center px-4">
        <div className="auth flex rounded-lg bg-white/95 shadow-xl backdrop-blur-sm max-sm:w-full xl:min-w-[498px]">
          <div className="w-full justify-center px-6 py-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

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
                  <div className="dropdown absolute left-0 top-full z-10 w-full rounded-md bg-white shadow-lg">
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

              <div className="my-4 flex content-center items-center gap-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="text-sm">
                  Remember me
                </label>
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
    </>
  )
}

export default Page

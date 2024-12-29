"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { HiMiniStar } from "react-icons/hi2"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { RiImageAddLine } from "react-icons/ri"
import { useRouter } from "next/navigation"
import { IoMdArrowBack } from "react-icons/io"
import Image from "next/image"

import CustomDropdown from "components/Patient/CustomDropdown"

interface RateIconProps {
  filled: boolean
  onClick: () => void
}
type Department = "Admin" | "Doctors" | "Pharmacy" | "Laboratory" | "Nurses" | "Patients" | "Cashier"

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
const Page: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<Department | "">("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [fullName, setFullName] = useState("")
  const [gender, setGender] = useState("")
  const [qualification, setQualification] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const departments: Department[] = ["Admin", "Doctors", "Pharmacy", "Laboratory", "Nurses", "Patients", "Cashier"]
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const selectedGender = genderOptions.find((gend) => gend.id === gender)

    try {
      const response = await axios.post("https://api2.caregiverhospital.com/app_user/sign-up/", {
        username,
        password,
        email,
        phone_number: phoneNumber,
        address,
        account_type: searchTerm,
        name: fullName,
        gender: selectedGender ? selectedGender.name : "",
        dob: new Date().toISOString(), // This should be replaced with the actual date of birth from your form
        qualification,
      })
      console.log("Response:", response.data)
      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 5000)
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to register user")
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  const genderOptions = [
    { id: "1", name: "Male" },
    { id: "2", name: "Female" },
  ]

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
            <div className="mb-2 flex h-full w-full items-center justify-center">
              <div className="auth flex rounded-lg md:w-2/3">
                <div className="w-full px-6 py-8">
                  <h6 className="text-lg font-medium">Register Staff</h6>
                  <p>Please enter staff essentials</p>
                  <form onSubmit={handleSubmit} className="mt-12">
                    <div className="mb-3">
                      <div className="search-bg flex h-20 w-full content-center items-center justify-center rounded border border-dotted">
                        <RiImageAddLine className="text-[#076fc6]" />
                      </div>
                    </div>
                    <div className="mb-3 flex gap-3">
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="username"
                          placeholder="Username"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="password"
                          id="password"
                          placeholder="Password"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="email"
                          id="email"
                          placeholder="Email"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3 grid grid-cols-3 gap-3">
                      <div className="relative">
                        <div className="search-bg  flex h-[50px] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2 max-sm:w-full ">
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
                            className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                            style={{ width: "100%", height: "45px" }}
                            value={searchTerm}
                            onChange={handleInputChange}
                            onFocus={() => setShowDropdown(true)}
                            required
                          />
                          {searchTerm && (
                            <button type="button" className="focus:outline-none" onClick={handleCancelSearch}>
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

                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="fullName"
                          placeholder="Full Name"
                          className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="phoneNumber"
                          placeholder="Phone number"
                          className="h-[50px] w-full bg-transparent text-xs  outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3 flex gap-3">
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3 rounded  py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <CustomDropdown
                          options={genderOptions.map((gend) => ({ id: gend.id, name: gend.name }))}
                          selectedOption={gender}
                          onChange={(selected) => setGender(selected)}
                          placeholder="Select Gender"
                        />
                      </div>
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="qualification"
                          placeholder="Qualification"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3  gap-3">
                      <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="address"
                          placeholder="Address"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      className="button-primary h-[50px] w-full rounded-md  max-sm:h-[45px]"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "REGISTER"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </section>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">User registered successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514]">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#D14343]">{error}</span>
        </div>
      )}
    </>
  )
}

export default Page

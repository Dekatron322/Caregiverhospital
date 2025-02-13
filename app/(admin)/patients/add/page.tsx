"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { IoMdArrowBack } from "react-icons/io"
import { IoChevronDownOutline } from "react-icons/io5"
import { useRouter } from "next/navigation"
import CustomDropdown from "components/Patient/CustomDropdown"

type Hmo = {
  id: string
  name: string
}

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    membership_no: "",
    policy_id: "",
    email_address: "",
    phone_no: "",
    address: "",
    nok_name: "",
    nok_phone_no: "",
    nok_address: "",
    allergies: "",
    hmo: "",
    password: "",
  })
  const [hmos, setHmos] = useState<Hmo[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch HMOs
  const fetchHmos = useCallback(async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/hmo/hmo/fetch/lite-mode/")
      const data = await response.json()
      setHmos(data as Hmo[])
    } catch (error) {
      console.error("Error fetching HMOs:", error)
    }
  }, [])

  useEffect(() => {
    fetchHmos()
  }, [fetchHmos])

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  // Handle gender change
  const handleGenderChange = useCallback((selectedGender: string) => {
    setFormData((prev) => ({ ...prev, gender: selectedGender }))
    setShowGenderDropdown(false)
  }, [])

  // Handle dropdown select
  const handleDropdownSelect = useCallback(
    (selectedHmoId: string) => {
      const selectedHmo = hmos.find((hmo) => hmo.id === selectedHmoId)
      if (selectedHmo) {
        setFormData((prev) => ({
          ...prev,
          hmo: selectedHmoId,
        }))
      }
    },
    [hmos]
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      if (!formData.name || !formData.email_address || !formData.phone_no || !formData.hmo) {
        alert("Please fill out all required fields.")
        setLoading(false)
        return
      }

      try {
        const response = await fetch("https://api2.caregiverhospital.com/patient/patient/0/0/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Error response:", errorData)
          throw new Error("Something went wrong!")
        }

        const data = await response.json()
        console.log(data)

        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 5000)
        setTimeout(() => {
          router.push(`/patients/`)
        }, 5000)
      } catch (error) {
        console.error("Error:", error)
        setShowErrorNotification(true)
        setTimeout(() => setShowErrorNotification(false), 5000)
      } finally {
        setLoading(false)
      }
    },
    [formData, router]
  )

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGenderDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Memoize gender dropdown options
  const genderOptions = useMemo(() => ["Male", "Female"], [])

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />
            <div className="flex justify-between px-16 py-4 max-md:px-3">
              <button onClick={() => router.back()} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>
            <div className="mb-2 flex h-full w-full items-center justify-center">
              <div className="auth flex rounded-lg shadow md:w-2/3">
                <form className="w-full px-6 py-8 max-md:px-3" onSubmit={handleSubmit}>
                  <h6 className="text-lg font-medium">Register Patient</h6>
                  <p className="text-sm">Please enter user essentials to give them access to the platform</p>
                  <div className="mt-6">
                    <div className="mb-3 grid grid-cols-3 gap-3 max-sm:grid-cols-2">
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="relative flex items-center">
                        <div
                          className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2"
                          onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                        >
                          <input
                            type="text"
                            name="gender"
                            value={formData.gender}
                            placeholder="Gender"
                            className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                            readOnly
                          />
                          <IoChevronDownOutline />
                        </div>
                        {showGenderDropdown && (
                          <div
                            ref={dropdownRef}
                            className="dropdown absolute top-[55px] z-10 w-full rounded-lg bg-white shadow-lg"
                          >
                            {genderOptions.map((gender) => (
                              <div
                                key={gender}
                                className="cursor-pointer p-2 text-sm hover:bg-[#747A80]"
                                onClick={() => handleGenderChange(gender)}
                              >
                                {gender}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="datetime-local"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="email_address"
                          placeholder="Email Address"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          value={formData.email_address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="phone_no"
                          placeholder="Phone number"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          value={formData.phone_no}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <CustomDropdown
                          options={hmos}
                          selectedOption={formData.hmo}
                          onChange={handleDropdownSelect}
                          placeholder="Select HMO"
                        />
                      </div>
                    </div>
                    <div className="mb-3 flex gap-3">
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="policy_id"
                          placeholder="Policy ID"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          value={formData.policy_id}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="membership_no"
                          placeholder="Membership number"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          value={formData.membership_no}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="mb-3 grid grid-cols-2 gap-3">
                        <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            name="allergies"
                            placeholder="Allergies"
                            className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                            value={formData.allergies}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            name="password"
                            placeholder="Enter Password"
                            className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                        <p className="my-2 text-xs text-[#0F920F]">Separate allergies with &rdquo;,&rdquo;</p>
                      </div>
                    </div>
                    <h6 className="text-lg font-medium">Next of Kin Information</h6>
                    <div className="mt-3">
                      <div className="mb-3 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                        <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            name="nok_name"
                            placeholder="Name"
                            className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                            value={formData.nok_name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            name="nok_phone_no"
                            placeholder="Phone number"
                            className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                            value={formData.nok_phone_no}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            name="nok_address"
                            placeholder="Address"
                            className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                            value={formData.nok_address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      className="button-primary h-[50px] w-full rounded-md max-sm:h-[45px]"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Adding Patient..." : "REGISTER PATIENT"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </section>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#0F920F]">Login Successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514]">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#D14343]">Error registering patient.</span>
        </div>
      )}
    </>
  )
}

export default Page

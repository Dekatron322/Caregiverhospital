"use client"
import React, { useEffect, useState } from "react"
import { HiMiniStar } from "react-icons/hi2"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { IoMdArrowBack } from "react-icons/io"
import CustomDropdownTest from "components/Patient/CustomDropdownTest"
import LaboratoryNav from "components/Navbar/LaboratoryNav"

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

interface Category {
  id: string
  title: string
}

const Page: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [param_title, setParam_title] = useState<string>("")
  const [param_unit, setParam_unit] = useState<string>("")
  const [param_range, setParam_range] = useState<string>("")

  const router = useRouter()
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleGoBack = () => {
    router.back()
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api2.caregiverhospital.com/testt/testt/")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = (await response.json()) as Category[]
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)

    // Set default values if the input fields are empty
    const defaultHowToUse = "No specific instructions provided"
    const defaultSideEffects = "No known side effects"

    const newMedicine = {
      param_title,
      param_unit,
      param_range,
      category: selectedCategory,

      status: true,
      pub_date: new Date().toISOString(),
    }

    try {
      const response = await fetch(
        `https://api2.caregiverhospital.com/testt/add-parameter-to/testt/${selectedCategory}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMedicine),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to add medicine")
      }

      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 3000)
      setTimeout(() => {
        router.push(`/medicines/`)
      }, 3000)
    } catch (error) {
      console.error("Error adding medicine:", error)

      if (error instanceof Error) {
        console.error("Error message:", error.message)
      } else {
        console.error("Unknown error occurred")
      }
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <LaboratoryNav />
            <div className="flex justify-between px-16 py-6 max-sm:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>
            <div className="mb-6 flex h-full w-full items-center justify-center">
              <div className="auth flex w-1/2 rounded-lg max-sm:w-full">
                <div className="w-full px-6 py-6 max-sm:px-3">
                  <h6 className="text-lg font-medium">Add Test Parameters</h6>

                  <div className="mt-6">
                    <div className="mb-3 grid grid-cols-2 gap-3 max-sm:grid-cols-2">
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="name"
                          placeholder="Parameter Title"
                          value={param_title}
                          onChange={(e) => setParam_title(e.target.value)}
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <CustomDropdownTest
                          options={categories}
                          selectedOption={selectedCategory}
                          onChange={(selected) => setSelectedCategory(selected)}
                          placeholder="Select Test"
                        />
                      </div>
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-3 ">
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="test"
                          id="unit"
                          placeholder="Test Unit"
                          value={param_unit}
                          onChange={(e) => setParam_unit(e.target.value)}
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="range"
                          placeholder="Test Range"
                          value={param_range}
                          onChange={(e) => setParam_range(e.target.value)}
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="button-primary h-[50px] w-full rounded-md max-sm:h-[45px]"
                    >
                      {loading ? "Adding Parameter..." : "REGISTER PARAMETER"}
                    </button>
                  </div>
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
          <span className="clash-font text-sm  text-[#0F920F]">Medicine added successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514]">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#D14343]">Error registering medicine.</span>
        </div>
      )}
    </>
  )
}

export default Page

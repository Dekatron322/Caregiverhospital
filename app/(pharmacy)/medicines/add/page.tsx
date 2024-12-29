"use client"
import React, { useEffect, useState } from "react"
import { HiMiniStar } from "react-icons/hi2"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { RxCalendar } from "react-icons/rx"
import { useRouter } from "next/navigation"
import { IoMdArrowBack } from "react-icons/io"

import CustomDropdown from "components/Patient/CustomDropdown"
import PharmacyNav from "components/Navbar/PharmacyNav"

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
  name: string
}

const Page: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [medicine_id, setMedicine_id] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [howToUse, setHowToUse] = useState<string>("")
  const [sideEffects, setSideEffects] = useState<string>("")
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
        const response = await fetch("https://api2.caregiverhospital.com/medicine-category/medicine-category/")
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
      name,
      quantity,
      medicine_id,
      category: selectedCategory,
      expiry_date: expiryDate,
      price,
      how_to_use: howToUse || defaultHowToUse, // Default if empty
      side_effect: sideEffects || defaultSideEffects, // Default if empty
      status: true,
      pub_date: new Date().toISOString(),
    }

    try {
      const response = await fetch(
        `https://api2.caregiverhospital.com/medicine-category/add-medicine-to-medicine_category/${selectedCategory}/`,
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
            <PharmacyNav />
            <div className="flex justify-between px-16 py-6 max-sm:px-3">
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
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="name"
                          placeholder="Medicine Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <CustomDropdown
                          options={categories}
                          selectedOption={selectedCategory}
                          onChange={(selected) => setSelectedCategory(selected)}
                          placeholder="Select Category"
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="date"
                          id="expiry_date"
                          placeholder="Expiry Date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                    </div>
                    <div className="mb-3 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="number"
                          id="price"
                          placeholder="Price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="number"
                          id="quantity"
                          placeholder="Quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>

                      <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          id="medicine_id"
                          placeholder="Medicine ID"
                          value={medicine_id}
                          onChange={(e) => setMedicine_id(e.target.value)}
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                        />
                      </div>
                    </div>

                    <div className="mb-2 gap-3">
                      <textarea
                        className="search-bg h-[100px] w-full rounded-md border bg-transparent p-2 text-xs outline-none"
                        placeholder="Add how to use..."
                        value={howToUse}
                        onChange={(e) => setHowToUse(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-3 gap-3">
                      <textarea
                        className="search-bg h-[100px] w-full rounded-md border bg-transparent p-2 text-xs outline-none"
                        placeholder="Add side effects..."
                        value={sideEffects}
                        onChange={(e) => setSideEffects(e.target.value)}
                      ></textarea>
                    </div>
                    <button
                      onClick={handleSubmit}
                      className="button-primary h-[50px] w-full rounded-md max-sm:h-[45px]"
                    >
                      {loading ? "Adding Medicine..." : "REGISTER MEDICINE"}
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

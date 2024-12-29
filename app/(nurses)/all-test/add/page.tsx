"use client"
import React, { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"

import NursesNav from "components/Navbar/NursesNav"

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false) // State for gender dropdown
  const [error, setError] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    detail: "",
    test_range: "",
    test_price: "",
  })

  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setShowGenderDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.title || !formData.detail || !formData.test_price || !formData.test_range) {
      alert("Please fill out all required fields.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("https://api2.caregiverhospital.com/testt/testt/", {
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
        router.push("")
      }, 5000)
    } catch (error) {
      console.error("Error:", error)
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="h-full ">
        <div className="flex min-h-screen ">
          <div className="flex w-screen flex-col ">
            <NursesNav />
            <div className="flex justify-between px-16 py-4 max-md:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>
            <div className="mb-2 flex h-full w-full items-center justify-center">
              <div className="auth flex rounded-lg shadow md:w-1/3">
                <form className="w-full px-6 py-8 max-md:px-3" onSubmit={handleSubmit}>
                  <h6 className="text-lg font-medium">Add New Test</h6>
                  <p className="text-sm">Please enter procedure according to stardard provided by HMO</p>
                  <div className="mt-6">
                    <div className="mb-3 flex-col gap-3">
                      <div className="search-bg mb-2 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="title"
                          placeholder="Test Title"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                          value={formData.title}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="search-bg mb-2 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="test_range"
                          placeholder="Test Range"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "50px" }}
                          value={formData.test_range}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="search-bg mb-2 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="detail"
                          placeholder="Unit of Measurement"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "40px" }}
                          value={formData.detail}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="search-bg mb-2 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                        <input
                          type="text"
                          name="test_price"
                          placeholder="Price"
                          className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          style={{ width: "100%", height: "40px" }}
                          value={formData.test_price}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <button
                      className="button-primary h-[50px] w-full rounded-md max-sm:h-[45px]"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Adding Test..." : "ADD TEST"}
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
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Added Successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514]">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#D14343]">Error adding test.</span>
        </div>
      )}
    </>
  )
}

export default Page

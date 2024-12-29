"use client"
import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import Image from "next/image"

interface HmoModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
  hmoCategoryId: string
}

const HmoModal: React.FC<HmoModalProps> = ({ isOpen, onClose, onSubmitSuccess, hmoCategoryId }) => {
  const [name, setName] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [status, setStatus] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  const departments = ["Health maintenance organization", "Out of Pocket finance"]

  if (!isOpen) return null

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    setLoading(true)
    const newHmo = {
      name,
      category,
      description,
      status,
      pub_date: new Date().toISOString(),
    }

    try {
      const response = await fetch(
        `https://api2.caregiverhospital.com/hmo-category/add-hmo-to-hmo_category/${hmoCategoryId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newHmo),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to add new HMO")
      }

      onSubmitSuccess()
      onClose()
    } catch (error) {
      console.error("Error adding HMO:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSearchTerm(event.target.value)
    setShowDropdown(true)
  }

  const handleDropdownSelect = (state: React.SetStateAction<string>) => {
    setCategory(state)
    setShowDropdown(false)
  }

  const handleCancelSearch = () => {
    setSearchTerm("")
    setShowDropdown(false)
  }

  const isSubmitEnabled = name.trim() !== "" && category.trim() !== "" && description.trim() !== ""

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Add Hmo</h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <div className="my-4">
            <p className="text-sm">Name</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 text-xs hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="name"
                placeholder="Name"
                className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", height: "45px" }}
              />
            </div>
          </div>
          <div className="relative">
            <div className="search-bg mb-3 flex h-[50px] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2 max-sm:w-full ">
              <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
              <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
              <input
                type="text"
                id="category"
                placeholder="Select department"
                className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                style={{ width: "100%", height: "45px" }}
                value={category}
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
                      className="cursor-pointer overflow-hidden px-4 py-2 text-xs hover:bg-[#747A80]"
                      onClick={() => handleDropdownSelect(department)}
                    >
                      <p className="text-sm font-medium">{department}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-3">
            <p className="text-sm">Description</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 h-[173px] w-full rounded-md border bg-transparent p-2 outline-none"
              placeholder="Add your description..."
            ></textarea>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className={`button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px] ${
                !isSubmitEnabled && "cursor-not-allowed opacity-50"
              }`}
              onClick={isSubmitEnabled ? submitForm : undefined}
              disabled={loading}
            >
              {loading ? "Submitting..." : "SUBMIT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HmoModal

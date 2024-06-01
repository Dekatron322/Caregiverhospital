"use client"
import React, { useState } from "react"
import styles from "./modal.module.css"
import { HiMiniStar } from "react-icons/hi2"
import { LiaTimesSolid } from "react-icons/lia"
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

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
}

const HmoModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  const departments = ["Medical Consultants", "Pharmacy", "Medical Laboratory", "Finance", "Nurse", "Patients"]

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  if (!isOpen) return null

  const submitForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    onSubmitSuccess()
    onClose()
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Add Hmo</h6>
            <LiaTimesSolid className="cursor-pointer" onClick={onClose} />
          </div>

          <div className="my-4">
            <p className="text-sm">Name</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="search"
                placeholder="Name"
                className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
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
                id="search"
                placeholder="Select department"
                className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
                style={{ width: "100%", height: "45px" }}
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
                      className="cursor-pointer overflow-hidden px-4 py-2 hover:bg-[#747A80]"
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
              value={comment}
              onChange={handleCommentChange}
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
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HmoModal

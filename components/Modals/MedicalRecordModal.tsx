import React, { useState } from "react"
import styles from "./modal.module.css"
import { Patient } from "utils"
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
  patientId: string // Assuming patientId is of type string
}

const MedicalRecordModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, patientId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const wards = [
    "Male Recovery",
    "Female Recovery",
    "Post Natal Ward",
    "Pediatric Ward ",
    "Female General Ward",
    "Male Ward",
    "Semi-Private Ward (Male)",
    "Semi-Private Ward (Female)",
    "Amenity 1",
    "Amenity 2",
    "Amenity 3",
    "Amenity 4",
  ]

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

  const handleCancelSearch = () => {
    setSearchTerm("")
    setShowDropdown(false)
  }

  const handleInputChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSearchTerm(event.target.value)
    setShowDropdown(true)
  }

  const handleDropdownSelect = (state: React.SetStateAction<string>) => {
    setSearchTerm(state)
    setShowDropdown(false)
  }

  const isSubmitEnabled = comment.trim() !== "" || selectedAmenities.length > 0 || rating > 0
  const patientDetail = Patient.find((patient) => patient.id === patientId)

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Admission </h6>

            <LiaTimesSolid className="cursor-pointer" onClick={onClose} />
          </div>
          <p>Check in {patientDetail?.name}</p>

          <div className="relative mt-6">
            <p className="text-sm">Ward </p>
            <div className="search-bg mb-3 mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
              <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
              <input
                type="text"
                id="search"
                placeholder="Select ward"
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
              <div className="dropdown absolute left-0 top-full z-10 max-h-40 w-full overflow-auto rounded-md">
                {wards
                  .filter((ward) => ward.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((ward, index) => (
                    <div
                      key={index}
                      className="cursor-pointer overflow-hidden px-4 py-2 hover:bg-[#D4DCF1]"
                      onClick={() => handleDropdownSelect(ward)}
                    >
                      <p className="text-sm font-medium">{ward}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="my-4">
            <p className="text-sm">Reason for check in</p>

            <textarea
              value={comment}
              onChange={handleCommentChange}
              className="mt-1 h-[173px] w-full rounded-md border bg-transparent p-2 outline-none"
              placeholder="Add your description..."
            ></textarea>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]">REGISTER</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalRecordModal

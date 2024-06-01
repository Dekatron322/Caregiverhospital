import React, { useState } from "react"
import styles from "./modal.module.css"
import { Admissions } from "utils"
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

const CustomDropdown: React.FC<{
  options: string[]
  selectedValue: string
  onSelect: (value: string) => void
}> = ({ options, selectedValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOptionSelect = (value: string) => {
    onSelect(value)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div
        className="search-bg mb-3 mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
        <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
        <div className="flex h-[50px] w-full items-center bg-transparent outline-none focus:outline-none">
          {selectedValue || "Select"}
        </div>
      </div>
      {isOpen && (
        <div className="absolute left-0 top-full z-10 w-full rounded border bg-white shadow-lg">
          {options.map((option, index) => (
            <div
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AdministerDrugModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, patientId }) => {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedMedication, setSelectedMedication] = useState<string>("")

  const drugCategories = [
    {
      category: "Male Recovery",
      medications: ["Medication 1", "Medication 2", "Medication 3"],
    },
    {
      category: "Female Recovery",
      medications: ["Medication 4", "Medication 5", "Medication 6"],
    },
    // Add more categories and medications as needed
  ]

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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSelectedMedication("")
  }

  const handleMedicationSelect = (medication: string) => {
    setSelectedMedication(medication)
    setShowDropdown(false)
  }

  const isSubmitEnabled = comment.trim() !== "" || selectedAmenities.length > 0 || rating > 0

  const patientDetail = Admissions.find((patient) => patient.id === patientId)

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Administer Drug </h6>
            <LiaTimesSolid className="cursor-pointer" onClick={onClose} />
          </div>
          <p>Administer drug to {patientDetail?.name}</p>
          <div className="flex w-full gap-2">
            <div className="relative mt-6 w-full">
              <p className="text-sm">Medication Category </p>
              <CustomDropdown
                options={drugCategories.map((category) => category.category)}
                selectedValue={selectedCategory}
                onSelect={handleCategorySelect}
              />
            </div>
            <div className="relative mt-6 w-full">
              <p className="text-sm">Medication Name </p>
              <CustomDropdown
                options={
                  selectedCategory
                    ? drugCategories.find((category) => category.category === selectedCategory)?.medications || []
                    : []
                }
                selectedValue={selectedMedication}
                onSelect={handleMedicationSelect}
              />
            </div>
          </div>
          <div className="mb-3 flex gap-3">
            <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="number"
                id="search"
                placeholder="Units"
                className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                style={{ width: "100%", height: "50px" }}
              />
            </div>

            <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="number"
                id="search"
                placeholder="Dosage"
                className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                style={{ width: "100%", height: "50px" }}
              />
            </div>
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={!isSubmitEnabled}
            >
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdministerDrugModal

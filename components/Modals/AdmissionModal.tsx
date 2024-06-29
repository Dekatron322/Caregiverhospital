import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { Patient } from "utils"
import { HiMiniStar } from "react-icons/hi2"
import { LiaTimesSolid } from "react-icons/lia"
import AOS from "aos"
import "aos/dist/aos.css"

import Image from "next/image"
import CustomDropdown from "components/Patient/CustomDropdown"

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
  patientId: string
}

const AdmissionModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, patientId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [ward, setWard] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  const wardOptions = [
    { id: "1", name: "Male Recovery" },
    { id: "2", name: "Female Recovery" },
    { id: "3", name: "Post Natal Ward" },
    { id: "4", name: "Pediatric Ward" },
    { id: "5", name: "Female General Ward" },
    { id: "6", name: "Male Ward" },
    { id: "7", name: "Semi-Private Ward (Male)" },
    { id: "8", name: "Semi-Private Ward (Female)" },
    { id: "9", name: "Amenity 1" },
    { id: "10", name: "Amenity 2" },
    { id: "11", name: "Amenity 3" },
    { id: "12", name: "Amenity 4" },
  ]

  const selectedWard = wardOptions.find((comp) => comp.id === ward)

  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  if (!isOpen) return null

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.preventDefault()
    console.log("Register button clicked") // Debug log
    setLoading(true)
    try {
      const response = await fetch(`https://api.caregiverhospital.com/patient/add-check-app-to-patient/${patientId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ward: selectedWard ? selectedWard.name : "",
          reason,
        }),
      })

      if (response.ok) {
        console.log("Form submitted successfully") // Debug log
        onSubmitSuccess()
        onClose()
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 5000)
      } else {
        const errorData = await response.json()
        console.error("Failed to submit form", errorData)
        setShowErrorNotification(true)
        setTimeout(() => setShowErrorNotification(false), 5000)
      }
    } catch (error) {
      console.error("Error submitting form", error)
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    } finally {
      setLoading(false)
    }
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
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Admission</h6>

            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>
          <p>Check in {patientDetail?.name}</p>

          <div className="my-2 w-full">
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <CustomDropdown
                options={wardOptions.map((comp) => ({ id: comp.id, name: comp.name }))}
                selectedOption={ward}
                onChange={(selected) => setWard(selected)}
                placeholder="Select Ward"
              />
            </div>
          </div>

          <div className="my-4">
            <p className="text-sm">Reason for check in</p>

            <textarea
              id="reason"
              className="mt-1 h-[173px] w-full rounded-md border bg-transparent p-2 outline-none"
              placeholder="Add your description..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={!isSubmitEnabled || loading}
            >
              REGISTER
            </button>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="success" />
          <span className="clash-font text-sm text-[#0F920F]">User registered successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514]">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="error" />
          <span className="clash-font text-sm text-[#D14343]">Error registering user</span>
        </div>
      )}
    </div>
  )
}

export default AdmissionModal

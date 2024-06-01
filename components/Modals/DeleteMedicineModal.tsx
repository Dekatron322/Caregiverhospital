import React, { useState } from "react"
import styles from "./modal.module.css"
import { HiMiniStar } from "react-icons/hi2"
import { LiaTimesSolid } from "react-icons/lia"
import { MedicineList } from "utils"

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
  medicineId: string // Assuming patientId is of type string
}

const DeleteMedicineModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, medicineId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])

  const medicineDetail = MedicineList.find((medicine) => medicine.id === medicineId)

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

  const isSubmitEnabled = comment.trim() !== "" || selectedAmenities.length > 0 || rating > 0

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.deleteModalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">
              Delete <span className="font-semibold">{medicineDetail?.medicine_name}</span>
            </h6>
            <LiaTimesSolid className="cursor-pointer" onClick={onClose} />
          </div>

          <div className="my-6">
            <p>Are you sure you want to delete this medicine? </p>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={submitForm}>
              DELETE
            </button>

            <button className="button-secondary h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={onClose}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteMedicineModal

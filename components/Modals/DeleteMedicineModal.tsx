import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { HiMiniStar } from "react-icons/hi2"
import { LiaTimesSolid } from "react-icons/lia"
import { MedicineList } from "utils"
import { useRouter } from "next/navigation"
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

interface DeleteMedicineModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  medicineId: string
}

const DeleteMedicineModal: React.FC<DeleteMedicineModalProps> = ({ isOpen, onClose, onSubmitSuccess, medicineId }) => {
  const [error, setError] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const router = useRouter()

  const medicineDetail = MedicineList.find((medicine) => medicine.id === medicineId)

  if (!isOpen) return null

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/medicine/medicine/${medicineId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete medicine")
      }

      onSubmitSuccess()
      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 3000)
      setTimeout(() => {
        router.push(`/medicines/`)
      }, 3000)
      onClose()
    } catch (error) {
      console.error("Error deleting medicine:", error)
      setError("Failed to delete medicine")
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.deleteModalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">
              Delete <span className="font-semibold">{medicineDetail?.medicine_name}</span>
            </h6>
            <div className="border-black hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <div className="my-6">
            <p>Are you sure you want to delete this medicine?</p>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <div className="mt-4 flex w-full gap-6">
            <button className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={handleDelete}>
              DELETE
            </button>

            <button className="button-secondary h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={onClose}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Login Successfully</span>
        </div>
      )}
    </div>
  )
}

export default DeleteMedicineModal

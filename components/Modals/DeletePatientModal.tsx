import React, { useEffect } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import AOS from "aos"
import "aos/dist/aos.css"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  patientName: string
}

const DeletePatientModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, patientName }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
      <div className={styles.deleteModalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Confirm Deletion</h2>
            <div className="border-black  hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <p>Are you sure you want to delete {patientName}?</p>
          <div className="mt-6 flex justify-end gap-4">
            <button onClick={onClose} className="button-secondary h-[50px] w-full rounded-sm max-sm:h-[45px]">
              Cancel
            </button>
            <button onClick={onConfirm} className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeletePatientModal

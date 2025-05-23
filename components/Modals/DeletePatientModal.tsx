import React, { useEffect } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import CancelDelete from "public/svgs/cancel-delete"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  patientName: string
}

const DeletePatientModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, patientName }) => {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.deleteModalContent}>
        <div className=" bg-[#F5F8FA] p-4">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Delete Department</h6>
            <div className="m-1 cursor-pointer" onClick={onClose}>
              <CancelDelete />
            </div>
          </div>
        </div>
        <div className="p-4">
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

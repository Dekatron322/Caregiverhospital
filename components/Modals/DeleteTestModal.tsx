import React, { useEffect } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import CancelDelete from "public/svgs/cancel-delete"

interface TestModalProps {
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
}

const DeleteTestModal: React.FC<TestModalProps> = ({ title, description, onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.deleteModalContent}>
        <div className=" bg-[#F5F8FA] p-4">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Delete Department</h6>
            <div className="m-1 cursor-pointer" onClick={onCancel}>
              <CancelDelete />
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="mt-4">{description}</p>
          <div className="mt-6 flex justify-end gap-4">
            <button className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={onConfirm}>
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteTestModal

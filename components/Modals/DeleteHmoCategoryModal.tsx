import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  hmoId: string | null
}

const DeleteHmoCategoryModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onSubmitSuccess, hmoId }) => {
  const [isLoading, setIsLoading] = useState(false)

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    if (!hmoId) return
    setIsLoading(true)
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/hmo-category/hmo_category/${hmoId}/`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      onSubmitSuccess()
      onClose()
    } catch (error) {
      console.error("Error deleting HMO:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.deleteModalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Delete HMO</h6>
            <div className="border-black hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <div className="my-6">
            <p>Are you sure you want to delete this HMO? All Data from this HMO will be lost.</p>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "DELETE"}
            </button>

            <button
              className="button-secondary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={onClose}
              disabled={isLoading}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteHmoCategoryModal

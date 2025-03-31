import React, { useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import { toast } from "sonner" // Import Sonner toast
import CancelDelete from "public/svgs/cancel-delete"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  hmoId: string | null
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onSubmitSuccess, hmoId }) => {
  const [isLoading, setIsLoading] = useState(false)

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    if (!hmoId) {
      toast.error("Error", {
        description: "No HMO selected for deletion",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`https://api2.caregiverhospital.com/hmo/hmo/${hmoId}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete HMO")
      }

      toast.success("Hmo deleted", {
        description: "HMO deleted successfully",
        duration: 5000,
        cancel: {
          label: "Close",
          onClick: () => {},
        },
      })

      onSubmitSuccess()
      onClose()
    } catch (error) {
      console.error("Error deleting HMO:", error)
      toast.error("Error", {
        description: "Failed to delete HMO. Please try again.",
        duration: 5000,
        cancel: {
          label: "Close",
          onClick: () => {},
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.deleteModalContent}>
        <div className=" bg-[#F5F8FA] p-4">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Delete HMO</h6>
            <div className="m-1 cursor-pointer" onClick={onClose}>
              <CancelDelete />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="mt-4">
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

export default DeleteModal

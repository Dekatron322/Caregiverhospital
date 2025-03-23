import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import CancelDelete from "public/svgs/cancel-delete"

interface DeleteDepartmentModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
  departmentId: number | null
}

const DeleteDepartmentModal: React.FC<DeleteDepartmentModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  departmentId,
}) => {
  const [loading, setLoading] = useState(false)

  if (!isOpen || departmentId === null) return null

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    setLoading(true)
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/department/department/${departmentId}/`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete department")
      }
      onSubmitSuccess()
      onClose()
    } catch (error) {
      console.error("Error deleting department:", error)
    } finally {
      setLoading(false)
    }
  }

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
          <div className="my-6">
            <p>Are you sure you want to delete this department? All Data from this department will be lost.</p>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={loading}
            >
              {loading ? "Deleting..." : "DELETE"}
            </button>

            <button
              className="button-secondary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={onClose}
              disabled={loading}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteDepartmentModal

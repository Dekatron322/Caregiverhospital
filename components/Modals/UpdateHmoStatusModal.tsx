import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import CustomDropdown from "components/Patient/CustomDropdown"

interface Hmo {
  id: string
  name: string
  category: string
  description: string
  status: boolean
  pub_date: string
}

interface UpdateHmoStatusModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
  hmo: Hmo | null
}

const statusOptions = [
  { id: "true", name: "Active" },
  { id: "false", name: "Inactive" },
]

const UpdateHmoStatusModal: React.FC<UpdateHmoStatusModalProps> = ({ isOpen, onClose, onSubmitSuccess, hmo }) => {
  const [status, setStatus] = useState(hmo?.status.toString() ?? "true")

  useEffect(() => {
    if (hmo) {
      setStatus(hmo.status.toString())
    }
  }, [hmo])

  const handleStatusChange = (selected: string) => {
    setStatus(selected)
  }

  const handleSubmit = async () => {
    if (hmo) {
      try {
        const response = await fetch(`https://api2.caregiverhospital.com/hmo/hmo/${hmo.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...hmo, status: status === "true" }),
        })
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        onSubmitSuccess()
        onClose()
      } catch (error) {
        console.error("Error updating HMO status:", error)
      }
    }
  }

  if (!isOpen || !hmo) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Update Hmo Status</h6>
            <LiaTimesSolid className="cursor-pointer" onClick={onClose} />
          </div>
          <div className="my-4">
            <p className="text-sm">Status</p>
            <CustomDropdown
              options={statusOptions}
              selectedOption={status}
              onChange={handleStatusChange}
              placeholder="Select Status"
            />
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateHmoStatusModal

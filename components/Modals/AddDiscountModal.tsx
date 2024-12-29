"use client"
import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import axios from "axios"

interface Prescription {
  id: string
  category: string
  name: string
  complain: string
  code: string
  unit: string
  dosage: string
  rate: string
  usage: string
  note: string
  status: boolean
  pub_date: string
  doctor_name: string
  discount_value: string
}

const AddDiscountModal = ({
  show,
  onClose,
  onSave,
  prescription,
}: {
  show: boolean
  onClose: () => void
  onSave: (value: string) => void
  prescription: Prescription | null
}) => {
  const [discountValue, setDiscountValue] = useState("")

  useEffect(() => {
    if (prescription) {
      setDiscountValue(prescription.discount_value || "0")
    }
  }, [prescription])

  const handleSave = async () => {
    try {
      // Assuming you have an API endpoint to update the discount
      await axios.post(`https://api2.caregiverhospital.com/prescription/add-discount-to/${prescription?.id}/`, {
        discount_value: discountValue,
      })
      onSave(discountValue)
      onClose() // Close the modal after saving
    } catch (error) {
      console.error("Failed to update discount:", error)
      // Handle error (e.g., display a notification to the user)
    }
  }

  if (!show || !prescription) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Apply Discount</h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>
          <div className="my-4">
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 text-xs hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                value={discountValue}
                className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder="Enter discount value"
              />
            </div>
          </div>
          <button
            className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
            onClick={handleSave}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddDiscountModal

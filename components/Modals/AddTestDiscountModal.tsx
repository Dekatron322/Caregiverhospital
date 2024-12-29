import React, { useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

interface MedicalRecord {
  id: string
  doctor_name: string
  doctor_request_title: string
  doctor_request_description: string
  test_type: string
  result: string
  pub_date: string
  status_note: string
  discount_value: string
}

interface AddDiscountModalProps {
  show: boolean
  onClose: () => void
  onSave: (discountValue: string) => void
  record: MedicalRecord | null
}

const AddTestDiscountModal: React.FC<AddDiscountModalProps> = ({ show, onClose, onSave, record }) => {
  const [discountValue, setDiscountValue] = useState<string>("")

  const handleSave = () => {
    if (record) {
      onSave(discountValue)
    }
  }

  if (!show || !record) return null

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
                className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
                placeholder="Enter discount value"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>
          </div>
          <button
            className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
            onClick={handleSave}
          >
            Apply
          </button>
          {/* <button onClick={onClose}>Close</button> */}
        </div>
      </div>
    </div>
  )
}

export default AddTestDiscountModal

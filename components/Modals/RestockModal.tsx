import React, { useState } from "react"
import styles from "./modal.module.css"
import { MedicineList } from "utils"
import { HiMiniStar } from "react-icons/hi2"
import { LiaTimesSolid } from "react-icons/lia"

import Image from "next/image"
import { RxCalendar } from "react-icons/rx"

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

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
  medicineId: string // Assuming patientId is of type string
}

const RestockModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, medicineId }) => {
  if (!isOpen) return null

  const submitForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    onSubmitSuccess()
    onClose()
  }

  const medicineDetail = MedicineList.find((medicine) => medicine.id === medicineId)

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Restock Medicine </h6>

            <LiaTimesSolid className="cursor-pointer" onClick={onClose} />
          </div>
          <p>
            Restock <span className="font-semibold">{medicineDetail?.medicine_name}</span>
          </p>

          <div className="my-4">
            <div className="search-bg  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="number"
                id="search"
                placeholder="Quantity"
                className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                style={{ width: "100%", height: "50px" }}
              />
            </div>
            <div className="search-bg mt-2  flex h-[50px] w-[100%] items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="search"
                placeholder="Expiry date"
                className="h-[50px] w-full bg-transparent  outline-none focus:outline-none"
                style={{ width: "100%", height: "50px" }}
              />
              <RxCalendar />
            </div>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]">RESTOCK</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestockModal

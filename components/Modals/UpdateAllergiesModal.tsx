"use client"

import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import Image from "next/image"

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: () => void
  onClose: () => void
  patientId: string
}

interface PatientData {
  name: string
  gender: string
  dob: string
  membership_no: string
  policy_id: string
  email_address: string
  phone_no: string
  address: string
  nok_name: string
  nok_phone_no: string
  nok_address: string
  allergies: string
  heart_rate: string
  body_temperature: string
  glucose_level: string
  blood_pressure: string
  status: boolean
  discount_value: string
  pub_date: string
  hmo: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }
}

const UpdateAllergiesModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, patientId }) => {
  const [allergies, setAllergies] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const fetchPatientData = async () => {
        try {
          const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
          if (!response.ok) {
            throw new Error("Failed to fetch patient data")
          }
          const data = (await response.json()) as PatientData
          setAllergies(data.allergies || "")
        } catch (error) {
          console.error("Error fetching patient data", error)
        }
      }
      fetchPatientData()
    }
  }, [isOpen, patientId])

  if (!isOpen) return null

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.preventDefault()
    setLoading(true)
    try {
      // Fetch the current patient data
      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient data")
      }
      const patientData = (await response.json()) as PatientData

      // Ensure the hmo field only includes the ID
      const updatedHmo = patientData.hmo?.id

      // Create an object with all current fields, updating only the allergies field
      const updatedData = {
        ...patientData,
        hmo: updatedHmo, // Only send the ID for hmo
        allergies, // Update the allergies field
        // Ensure other fields like heart_rate, body_temperature, etc. are not blank
        heart_rate: patientData.heart_rate || "0",
        body_temperature: patientData.body_temperature || "0",
        glucose_level: patientData.glucose_level || "0",
        blood_pressure: patientData.blood_pressure || "0",
        discount_value: patientData.discount_value || "0",
      }

      // Send the update request with the full data object
      const updateResponse = await fetch(`https://api2.caregiverhospital.com/patient/edit/patient/${patientId}/`, {
        method: "PUT", // Using PUT method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData), // Send the entire data object
      })

      if (updateResponse.ok) {
        onSubmitSuccess()
        onClose()
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 5000)
      } else {
        const errorData = await updateResponse.json()
        console.error("Failed to submit form", errorData)
        setShowErrorNotification(true)
        setTimeout(() => setShowErrorNotification(false), 5000)
      }
    } catch (error) {
      console.error("Error submitting form", error)
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllergies(e.target.value)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Update Allergies </h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
            <input
              type="text"
              id="allergies"
              placeholder="Allergies"
              className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
              value={allergies}
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={!allergies}
            >
              {loading ? "Updating..." : "UPDATE ALLERGIES"}
            </button>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#0F920F]">Allergies updated successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514]">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#D14343]">Error updating allergies</span>
        </div>
      )}
    </div>
  )
}

export default UpdateAllergiesModal

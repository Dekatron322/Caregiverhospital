"use client"

import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import Image from "next/image"
import CancelDelete from "public/svgs/cancel-delete"
import { toast } from "sonner" // Import Sonner toast

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
        toast.success("Allergies updated successfully", {
          description: "The patient's allergies have been updated.",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        }) // Sonner success toast
      } else {
        const errorData = await updateResponse.json()
        console.error("Failed to submit form", errorData)
        toast.error("Error updating allergies", {
          description: "Please try again or contact support.",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        })
      }
    } catch (error) {
      console.error("Error submitting form", error)
      toast.error("Error updating allergies", {
        description: "Please try again or contact support.",
        duration: 5000,
        cancel: {
          label: "Close",
          onClick: () => {},
        },
      })
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
        <div className="p-6">
          <div className="flex items-center justify-between pb-4">
            <h6 className="text-lg font-medium">Update Allergies </h6>
            <div className="cursor-pointer " onClick={onClose}>
              <CancelDelete />
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
          <p className="my-2 text-xs">Seperate Allergies with comma</p>

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
    </div>
  )
}

export default UpdateAllergiesModal

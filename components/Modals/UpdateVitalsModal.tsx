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
  pub_date: string
  discount_value?: string
  hmo: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }
}

const UpdateVitalsModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, patientId }) => {
  const [heartRate, setHeartRate] = useState<string>("")
  const [bodyTemperature, setBodyTemperature] = useState<string>("")
  const [glucoseLevel, setGlucoseLevel] = useState<string>("")
  const [bloodPressure, setBloodPressure] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
      const data = (await response.json()) as PatientData
      // Set state variables with the existing data
      setHeartRate(data.heart_rate || "")
      setBodyTemperature(data.body_temperature || "")
      setGlucoseLevel(data.glucose_level || "")
      setBloodPressure(data.blood_pressure || "")
    } catch (error) {
      console.error("Error fetching patient data", error)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchPatientData()
    }
  }, [isOpen, patientId])

  if (!isOpen) return null

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.preventDefault()
    setLoading(true)
    try {
      // Fetch current patient data
      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
      const patientData = (await response.json()) as PatientData

      // Create an object with all the required fields, using the existing values for the fields you don't want to change
      const updatedData = {
        ...patientData,
        heart_rate: heartRate,
        body_temperature: bodyTemperature,
        glucose_level: glucoseLevel,
        blood_pressure: bloodPressure,
        hmo: patientData.hmo.id, // Only include the HMO ID
      }

      // Remove 'discount_value' if it's empty or invalid
      if (!patientData.discount_value || patientData.discount_value.length === 0) {
        delete updatedData.discount_value
      }

      console.log("Payload to be sent:", updatedData)

      const updateResponse = await fetch(`https://api2.caregiverhospital.com/patient/edit/patient/${patientId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (updateResponse.ok) {
        // Refetch the patient data to refresh the updated information
        await fetchPatientData()

        onSubmitSuccess()
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
      onClose()
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Update Vitals </h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <div className="my-2 grid grid-cols-2 gap-2">
            <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="heartRate"
                placeholder="Heart Rate (bpm)"
                className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
              />
            </div>

            <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="bodyTemperature"
                placeholder="Body Temperature (°C)"
                className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={bodyTemperature}
                onChange={(e) => setBodyTemperature(e.target.value)}
              />
            </div>
          </div>
          <div className="my-2 grid grid-cols-2 gap-2">
            <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="bloodPressure"
                placeholder="Blood Pressure (mmHg)"
                className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
              />
            </div>

            <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="glucoseLevel"
                placeholder="Glucose Level (mg/dl)"
                className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={glucoseLevel}
                onChange={(e) => setGlucoseLevel(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={!heartRate || !bodyTemperature || !glucoseLevel || !bloodPressure}
            >
              {loading ? "Updating..." : "UPDATE VITALS"}
            </button>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="Success" />
          <span className="text-sm font-normal">Vitals Updated Successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#CC0000] bg-[#FFF1F1] text-[#CC0000] shadow-[#cc000014]">
          <Image src="/error-triangle.svg" width={16} height={16} alt="Error" />
          <span className="text-sm font-normal">Error updating vitals</span>
        </div>
      )}
    </div>
  )
}

export default UpdateVitalsModal

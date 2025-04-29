import React, { useState } from "react"
import styles from "./modal.module.css"
import { Patient } from "utils"
import { toast } from "sonner"
import CustomDropdown from "components/Patient/CustomDropdown"
import CancelDelete from "public/svgs/cancel-delete"

const wardOptions = [
  { id: "1", name: "Male Recovery" },
  { id: "2", name: "Female Recovery" },
  { id: "3", name: "Post Natal Ward" },
  { id: "4", name: "Pediatric Ward" },
  { id: "5", name: "Female General Ward" },
  { id: "6", name: "Male Ward" },
  { id: "7", name: "Semi-Private Ward (Male)" },
  { id: "8", name: "Semi-Private Ward (Female)" },
  { id: "9", name: "Amenity 1" },
  { id: "10", name: "Amenity 2" },
  { id: "11", name: "Amenity 3" },
  { id: "12", name: "Amenity 4" },
]

interface PatientDetail {
  id: string
  name: string
  heart_rate?: string
  body_temperature?: string
  glucose_level?: string
  blood_pressure?: string
  address: string
  phone_no: string
  dob: string
  blood_group?: string
  hmo: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }
  policy_id?: string
  allergies?: string
  nok_name: string
  nok_phone_no: string
  appointments: { id: number; doctor: string; pub_date: string; detail: string }[]
  prescriptions: {
    id: string
    category: string
    name: string
    complain: string
    code: string
    unit: number
    dosage: number
    rate: string
    usage: string
    note: string
    status: boolean
    pub_date: string
    doctor_name: string
  }[]
  lab_tests: {
    id: string
    doctor_name: string
    doctor_image: string
    test: string
    result: string
    test_type: string
    pub_date: string
  }[]
}

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: () => void
  onClose: () => void
  patientDetail: PatientDetail
  patientId: string
}

const AdmissionModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, patientId, patientDetail }) => {
  const [wardId, setWardId] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.preventDefault()
    setLoading(true)

    try {
      const wardName = wardOptions.find((option) => option.id === wardId)?.name || ""

      const response = await fetch(
        `https://api2.caregiverhospital.com/patient/add-check-app-to-patient/${patientId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ward: wardName,
            reason,
          }),
        }
      )

      if (response.ok) {
        onSubmitSuccess()
        onClose()
        toast.success("Admission successful", {
          description: "The patient has been admitted successfully.",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        })
      } else {
        console.error("Failed to submit form")
        toast.error("Admission failed", {
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
      toast.error("Admission failed", {
        description: "An unexpected error occurred. Please try again.",
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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Admission</h6>
            <div className="m-1 cursor-pointer" onClick={onClose}>
              <CancelDelete />
            </div>
          </div>
          <p>Check in {Patient.find((patient) => patient.id === patientId)?.name}</p>

          <div className="my-4">
            <p className="mb-1 text-sm">Ward</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <CustomDropdown
                options={wardOptions}
                selectedOption={wardId}
                onChange={(selected) => setWardId(selected)}
                placeholder="Select a ward"
              />
            </div>
          </div>

          <div className="my-4">
            <p className="mb-1 text-sm">Reason</p>
            <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="reason"
                placeholder="Reason for admission"
                className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={!wardId || !reason}
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdmissionModal

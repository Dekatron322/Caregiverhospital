import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { HiMiniStar } from "react-icons/hi2"
import { toast } from "sonner" // Import Sonner toast
import CustomDropdown from "components/Patient/CustomDropdown"
import CancelDelete from "public/svgs/cancel-delete"

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
  patientDetail: PatientDetail // Add this line
  patientId: string
}

const AppointmentModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  patientId,
  patientDetail,
}) => {
  const [doctor, setDoctor] = useState<string>("") // Store doctor's name
  const [detail, setDetail] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchDoctors()
    }
  }, [isOpen])

  const fetchDoctors = async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/app_user/all/")
      const data = (await response.json()) as any[]
      const filteredDoctors = data
        .filter((user: any) => user.account_type === "Doctors")
        .map((doc) => ({
          id: doc.id,
          name: doc.username,
        }))
      setDoctors(filteredDoctors)
    } catch (error) {
      console.error("Error fetching doctors", error)
    }
  }

  if (!isOpen) return null

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(
        `https://api2.caregiverhospital.com/patient/add-appointment-to-patient/${patientId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient_id: patientId, // Include patient_id
            patient_name: patientDetail.name, // Include patient_name
            doctor: doctors.find((doc) => doc.id === doctor)?.name || "", // Doctor's name
            detail,
          }),
        }
      )

      if (response.ok) {
        onSubmitSuccess()
        onClose()
        toast.success("Appointment booked successfully", {
          description: "The appointment has been booked successfully.",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        }) // Sonner success toast
      } else {
        console.error("Failed to submit form", await response.text())
        toast.error("Appointment booking failed", {
          description: "Please try again or contact support.",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        }) // Sonner error toast
      }
    } catch (error) {
      console.error("Error submitting form", error)
      toast.error("Appointment booking failed", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
        cancel: {
          label: "Close",
          onClick: () => {},
        },
      }) // Sonner error toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Appointment</h6>
            <div className="m-1 cursor-pointer" onClick={onClose}>
              <CancelDelete />
            </div>
          </div>
          <p>Books an appointment for {patientDetail.name}</p>

          <div className="relative mt-6">
            <p className="mb-1 text-sm">Doctor</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <CustomDropdown
                options={doctors.map((doc) => ({ id: doc.id, name: doc.name }))}
                selectedOption={doctor}
                onChange={(selectedDoctorName) => setDoctor(selectedDoctorName)} // Ensure name is set
                placeholder="Select Doctor"
              />
            </div>
          </div>

          <div className="my-4">
            <p className="mb-1 text-sm">Detail</p>
            <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="detail"
                placeholder="Detail"
                className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={!doctor || !detail}
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal

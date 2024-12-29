import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { HiMiniStar } from "react-icons/hi2"
import { LiaTimesSolid } from "react-icons/lia"
import axios from "axios"

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

interface PrescribeMedicationModalProps {
  isOpen: boolean
  onSubmitSuccess: () => void
  onClose: () => void
  patientId: string
}

interface UserDetails {
  id: number
  username: string
  email: string
  phone_number: string
  address: string
  account_type: string
}

const PrescribeMedicationModal: React.FC<PrescribeMedicationModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  patientId,
}) => {
  const [description, setDescription] = useState<string>("")
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkAppId, setCheckAppId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchUserDetails()
      fetchCheckAppId()
    }
  }, [isOpen])

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("id")
      if (userId) {
        const response = await axios.get<UserDetails>(
          `https://api2.caregiverhospital.com/app_user/get-user-detail/${userId}/`
        )
        if (response.data) {
          setUserDetails(response.data)
        } else {
          console.log("User details not found.")
        }
      } else {
        console.log("User ID not found.")
      }
    } catch (error) {
      setError("Failed to load user details.")
      console.error("Error fetching user details:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCheckAppId = async () => {
    try {
      const response = await axios.get(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
      const patient = response.data
      if (patient && patient.check_apps && patient.check_apps.length > 0) {
        setCheckAppId(patient.check_apps[0].id)
      } else {
        console.log("Check App ID not found.")
      }
    } catch (error) {
      console.error("Error fetching Check App ID:", error)
    }
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
  }

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (userDetails && checkAppId) {
      try {
        const response = await axios.post(
          `https://api2.caregiverhospital.com/check-app/add-doctor-prescription-to-check-app/${checkAppId}/`,
          {
            doctor_name: userDetails.username,
            prescription: description,
            pub_date: new Date().toISOString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        if (response.status === 200 || response.status === 201) {
          onSubmitSuccess()
          onClose()
        } else {
          throw new Error(`Failed to prescribe medication: ${response.statusText}`)
        }
      } catch (error) {
        console.error("Error prescribing medication:", error)
        setError("Error prescribing medication. Please try again.")
      }
    }
  }

  if (!isOpen) return null

  const isSubmitEnabled = description.trim() !== ""

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Prescribe Medication - Dr. {userDetails?.username || "Loading..."}</h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-3">
            <p className="text-sm">Description</p>
            <textarea
              className="mt-1 h-[173px] w-full rounded-md border bg-transparent p-2 text-xs outline-none"
              placeholder="Add your description..."
              value={description}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={!isSubmitEnabled}
            >
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrescribeMedicationModal

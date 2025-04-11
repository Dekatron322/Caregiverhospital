import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import axios from "axios"
import { toast } from "sonner"

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: any
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

const CheckoutPatientModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, patientId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkAppId, setCheckAppId] = useState<string | null>(null)

  useEffect(() => {
    fetchUserDetails()
    fetchCheckAppId()
  }, [])

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
        // Get the last element of the check_apps array
        const lastIndex = patient.check_apps.length - 1
        setCheckAppId(patient.check_apps[lastIndex].id)
      } else {
        console.log("Check App ID not found.")
      }
    } catch (error) {
      console.error("Error fetching Check App ID:", error)
    }
  }

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (userDetails && checkAppId) {
      try {
        // Show loading toast
        const toastId = toast.loading("Processing checkout...")

        const response = await axios.put(
          `https://api2.caregiverhospital.com/check-app/check-app/${checkAppId}/`,
          {
            checkout_date: new Date().toISOString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (response.status === 200 || response.status === 201) {
          // Update toast to success
          console.log("Patient checked out successfully")
          toast.success("Patient checked out successfully!", { id: toastId })
          onSubmitSuccess()
          onClose()
        } else {
          throw new Error(`Failed to check out patient: ${response.statusText}`)
        }
      } catch (error) {
        console.error("Error checking out patient:", error)
        // Show error toast
        toast.error("Failed to check out patient. Please try again.")
        setError(`Error checking out patient`)
      }
    } else {
      toast.error("Missing required information for checkout")
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Checkout Patient - Dr. {userDetails?.username || "Loading..."}</h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>
          <p>Are you sure you want to check out this patient?</p>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={loading}
            >
              {loading ? "PROCESSING..." : "CONFIRM CHECKOUT"}
            </button>
          </div>
          {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPatientModal

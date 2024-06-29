import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import axios from "axios"

interface RequestTest {
  id: string
  name: string

  // Add other properties here
}

interface ModalProps {
  results: RequestTest
  onClose: () => void
  userId: string
}

interface UserDetails {
  id: number
  username: string
  email: string
  phone_number: string
  address: string
  account_type: string
}

const LabTestModal: React.FC<ModalProps> = ({ results, onClose, userId }) => {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [doctorName, setDoctorName] = useState<string>("")
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [test, setTest] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [diagnosis, SetDiagnosis] = useState<string>("")
  const [status, SetStatus] = useState<string>("Not Approved")

  useEffect(() => {
    setMounted(true)
    fetchUserDetails()
  }, [])

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("id")
      if (userId) {
        const response = await axios.get<UserDetails>(
          `https://api.caregiverhospital.com/app_user/get-user-detail/${userId}/`
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

  const handleAddPrescription = async () => {
    if (userDetails) {
      setDoctorName(userDetails.username)
    }

    const prescriptionData = {
      doctor_name: doctorName,
      test_type: test,
      diagnosis_code: diagnosis,
      note,
      status_note: status,
      pub_date: new Date().toISOString(),
    }

    try {
      console.log("Prescription data being sent:", prescriptionData)

      const response = await fetch(`https://api.caregiverhospital.com/patient/add-lab-test-to-patient/${results.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prescriptionData),
      })

      if (!response.ok) {
        const responseBody = await response.json()
        console.error("Failed to add prescription. Status:", response.status, "Response body:", responseBody)
        throw new Error("Failed to add prescription")
      }

      // setShowSuccessNotification(true)
      // setTimeout(() => setShowSuccessNotification(false), 5000)
      onClose()
    } catch (error) {
      console.error("Error adding prescription:", error)
      // setShowErrorNotification(true)
      // setTimeout(() => setShowErrorNotification(false), 5000)
    }
  }
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Request Lab Test</p>
            <LiaTimesSolid className="close" onClick={onClose} />
          </div>

          <p>Enter test result for {results.name}</p>
          <div className="flex w-full gap-2">
            <div className="my-2 w-full">
              {/* <p className="text-sm">Test type</p> */}
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="test"
                  placeholder="Enter test type"
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={test}
                  onChange={(e) => setTest(e.target.value)}
                />
              </div>
            </div>
            <div className="my-2 w-full">
              {/* <p className="text-sm">Diagnosis code</p> */}
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="diagnosis"
                  placeholder=""
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={diagnosis}
                  onChange={(e) => SetDiagnosis(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mb-2  gap-3">
            {/* <p>Note</p> */}
            <textarea
              id="note"
              className="search-bg  h-[100px] w-full rounded border bg-transparent p-2 outline-none"
              placeholder="Add how to use..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm  text-[#FFFFFF]
               max-sm:h-[45px]"
              onClick={handleAddPrescription}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabTestModal

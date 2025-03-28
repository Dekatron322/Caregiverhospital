import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import axios from "axios"
import { toast } from "sonner"
import Image from "next/image"
import CustomDropdown from "components/Patient/CustomDropdown"
import CustomDropdownTest from "../Patient/CustomDropdownTest"
import CancelDelete from "public/svgs/cancel-delete"

interface RequestTest {
  policy_id: any
  hmo: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }
  id: string
  name: string
}

interface ModalProps {
  results: RequestTest
  onClose: () => void
  userId: string
  onPrescriptionSubmit: () => void
}

interface UserDetails {
  id: number
  username: string
  email: string
  phone_number: string
  address: string
  account_type: string
}

interface Diagnosis {
  id: string
  name: string
}

interface TestOption {
  id: string
  title: string
  detail: string
  test_range: string
  test_price: string
  status: boolean
  pub_date: string
}

const LabTestModal: React.FC<ModalProps> = ({ results, onClose, userId, onPrescriptionSubmit }) => {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [doctorName, setDoctorName] = useState<string>("")
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [test, setTest] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [diagnosis, setDiagnosis] = useState<string>("")
  const [status, setStatus] = useState<string>("Not Approved")
  const [diagnosisData, setDiagnosisData] = useState<Diagnosis[]>([])
  const [testOptions, setTestOptions] = useState<TestOption[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false) // New state for submission tracking

  useEffect(() => {
    setMounted(true)
    fetchUserDetails()
    fetchDiagnosis()
    fetchTestOptions()
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

  const fetchDiagnosis = async () => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/diagnosis/diagnosis/`)
      if (!response.ok) {
        throw new Error("Failed to fetch diagnosis")
      }
      const data = (await response.json()) as Diagnosis[]
      setDiagnosisData(data)
    } catch (error) {
      console.error("Error fetching diagnosis:", error)
    }
  }

  const fetchTestOptions = async () => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/testt/testt/`)
      if (!response.ok) {
        throw new Error("Failed to fetch test options")
      }
      const data = (await response.json()) as TestOption[]
      setTestOptions(data)
    } catch (error) {
      console.error("Error fetching test options:", error)
    }
  }

  const handleAddPrescription = async () => {
    setIsSubmitting(true) // Disable button during submission

    try {
      if (!userDetails) {
        console.error("User details are not available.")
        toast.error("Submission Failed", {
          description: "User details are not available.",
          duration: 5000,
        })
        return
      }

      const doctorName = userDetails.username

      const selectedTestOption = testOptions.find((option) => option.id === test)
      const testName = selectedTestOption ? selectedTestOption.title : ""

      const selectedDiagnosis = diagnosisData.find((dia) => dia.id === diagnosis)
      const diagnosisName = selectedDiagnosis ? selectedDiagnosis.name : ""

      const prescriptionData = {
        patient_id: results.id,
        patient_name: results.name,
        doctor_name: doctorName,
        test_type: testName,
        test: testName,
        diagnosis_code: diagnosisName,
        hmo_id: results.hmo.id,
        policy_id: results.policy_id,
        hmo_name: results.hmo.name,
        hmo_category: results.hmo.category,
        hmo_description: results.hmo.description,
        note,
        status_note: status,
        pub_date: new Date().toISOString(),
      }

      console.log("Prescription data being sent:", prescriptionData)

      const response = await fetch(
        `https://api2.caregiverhospital.com/patient/add-lab-test-to-patient/${results.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionData),
        }
      )

      if (!response.ok) {
        const responseBody = await response.json()
        console.error("Failed to add prescription. Status:", response.status, "Response body:", responseBody)
        throw new Error("Failed to add prescription")
      }

      toast.success("Lab Test Request Submitted", {
        description: "The lab test request has been successfully submitted.",
        duration: 5000,
      })

      onClose()
      onPrescriptionSubmit()
    } catch (error) {
      console.error("Error adding prescription:", error)
      toast.error("Submission Failed", {
        description: "There was an error submitting the lab test request. Please try again.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false) // Re-enable button
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Request Lab Test</p>
            <div className="m-1 cursor-pointer" onClick={onClose}>
              <CancelDelete />
            </div>
          </div>

          <p>Request Lab Test for {results.name}</p>
          <div className="flex w-full gap-2">
            <div className="my-2 w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <CustomDropdownTest
                  options={testOptions}
                  selectedOption={test}
                  onChange={setTest}
                  placeholder="Select test type"
                />
              </div>
            </div>
            <div className="my-2 w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded  py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <CustomDropdown
                  options={diagnosisData.map((dia) => ({ id: dia.id, name: dia.name }))}
                  selectedOption={diagnosis}
                  onChange={setDiagnosis}
                  placeholder="Select Diagnosis"
                />
              </div>
            </div>
          </div>

          <div className="mb-2 gap-3">
            <textarea
              id="note"
              className="search-bg h-[100px] w-full rounded border bg-transparent p-2 text-xs outline-none"
              placeholder="Add note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className={`button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px] ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handleAddPrescription}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabTestModal

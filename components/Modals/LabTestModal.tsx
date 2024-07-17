import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import axios from "axios"
import AOS from "aos"
import "aos/dist/aos.css"
import Image from "next/image"
import CustomDropdown from "components/Patient/CustomDropdown"

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

interface Diagnosis {
  id: string
  name: string
}

const testOptions = [
  { id: "1", name: "Postrate Specific Antigen (PSA)" },
  { id: "2", name: "Estradiol" },
  { id: "3", name: "Progesterone" },
  { id: "4", name: "Testosterone" },
  { id: "5", name: "FSH" },
  { id: "6", name: "2HPP" },
  { id: "7", name: "FBS" },
  { id: "8", name: "Electrolyte/Urea/Creatinine" },
  { id: "9", name: "Liver Function Test" },
  { id: "10", name: "Lipid Profile" },
  { id: "11", name: "RBS" },
  { id: "12", name: "Full Blood Count" },
  { id: "13", name: "LH" },
  { id: "14", name: "Thyriod Function Test" },
  { id: "15", name: "Anti Microbial Susceptibility Test" },
  { id: "16", name: "HVS M/C/S" },
  { id: "17", name: "Malaria Parasite" },
  { id: "18", name: "Salmonella" },
  { id: "19", name: "Urinalysis" },
  { id: "20", name: "Urine Microscopy" },
  { id: "21", name: "SCSH_Stool Analysis" },
  { id: "22", name: "OGTT" },
]

const LabTestModal: React.FC<ModalProps> = ({ results, onClose, userId }) => {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [doctorName, setDoctorName] = useState<string>("")
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [test, setTest] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [diagnosis, setDiagnosis] = useState<string>("")
  const [status, setStatus] = useState<string>("Not Approved")
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [diagnosisData, setDiagnosisData] = useState<Diagnosis[]>([])

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchUserDetails()
    fetchDiagnosis()
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

  const fetchDiagnosis = async () => {
    try {
      const response = await fetch(`https://api.caregiverhospital.com/diagnosis/diagnosis/`)
      if (!response.ok) {
        throw new Error("Failed to fetch diagnosis")
      }
      const data = (await response.json()) as Diagnosis[]
      setDiagnosisData(data)
    } catch (error) {
      console.error("Error fetching diagnosis:", error)
    }
  }

  const handleAddPrescription = async () => {
    if (userDetails) {
      setDoctorName(userDetails.username)
    }

    const selectedTestOption = testOptions.find((option) => option.id === test)
    const testName = selectedTestOption ? selectedTestOption.name : ""

    const selectedDiagnosis = diagnosisData.find((dia) => dia.id === diagnosis)
    const diagnosisName = selectedDiagnosis ? selectedDiagnosis.name : ""

    const prescriptionData = {
      doctor_name: doctorName,
      test_type: testName,
      diagnosis_code: diagnosisName,
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

      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 5000)
      onClose()
    } catch (error) {
      console.error("Error adding prescription:", error)
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    }
  }

  return (
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Request Lab Test</p>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <p>Enter test result for {results.name}</p>
          <div className="flex w-full gap-2">
            <div className="my-2 w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <CustomDropdown
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
              className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
              onClick={handleAddPrescription}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#0F920F]">Sent Successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in 0 absolute bottom-16 m-5 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514] md:right-16">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#D14343]">Failed to add prescription</span>
        </div>
      )}
    </div>
  )
}

export default LabTestModal

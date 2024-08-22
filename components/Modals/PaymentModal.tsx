import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import { IoIosArrowDown } from "react-icons/io"
import AOS from "aos"
import axios from "axios"
import "aos/dist/aos.css"
import Image from "next/image"

interface HMO {
  id: string
  name: string
  category: string
  description: string
  status: boolean
  pub_date: string
}

interface LabTestResult {
  id: string
  name: string
  test_type: string
  patient_name: string
  policy_id: string
  pub_date: string
  diagnosis_code: string
  patient_id: string
  discount_value: string
  hmo?: HMO
}

interface Diagnosis {
  id: string
  name: string
  code: string
  price: string
  status: boolean
  pub_date: any
}

interface ModalProps {
  results: LabTestResult
  onClose: (isSuccess: boolean) => void
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const PaymentModal: React.FC<ModalProps> = ({ results, onClose }) => {
  const [test, setTest] = useState<string>(results.test_type)
  const [result, setResult] = useState<string>("")
  const [statusNote, setStatusNote] = useState<string>("Approved")
  const [isLoading, setIsLoading] = useState(false)
  const [openSection, setOpenSection] = useState(0)
  const [diagnosisInfo, setDiagnosisInfo] = useState<Diagnosis | null>(null) // State to hold diagnosis info
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })

    // Fetch diagnosis info when results.diagnosis_code changes
    if (results.diagnosis_code) {
      fetchDiagnosisInfo(results.diagnosis_code)
    }
  }, [results.diagnosis_code])

  const fetchDiagnosisInfo = async (diagnosisName: string) => {
    try {
      const response = await axios.get(
        `https://api2.caregiverhospital.com/diagnosis/diagnosis/?name=${encodeURIComponent(diagnosisName)}`
      )
      const data = response.data
      if (data.length > 0) {
        const diagnosis = data[0]
        setDiagnosisInfo(diagnosis)
      } else {
        console.log("Diagnosis not found or API response format unexpected.")
        setDiagnosisInfo(null) // Clear diagnosis info if not found
      }
    } catch (error) {
      console.error("Error fetching diagnosis data:", error)
      setDiagnosisInfo(null) // Clear diagnosis info on error
    }
  }

  const toggleOpen = (index: number) => {
    setOpenSection(openSection === index ? -1 : index)
  }

  const calculateTotal = () => {
    if (diagnosisInfo?.price) {
      const unitPrice = Number(diagnosisInfo.price)
      const discountValue = results.discount_value ? parseFloat(results.discount_value) : 0
      const discountAmount = unitPrice * (discountValue / 100)
      const finalPrice = unitPrice - discountAmount

      return finalPrice.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })
    }
    return "N/A"
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setErrorMessage(null) // Clear previous error message
    try {
      const unitPrice = diagnosisInfo?.price ? Number(diagnosisInfo.price) : 0
      const discountValue = results.discount_value ? parseFloat(results.discount_value) : 0
      const discountAmount = unitPrice * (discountValue / 100)
      const finalPrice = unitPrice - discountAmount

      const payload = {
        enroll_number: results.policy_id,
        enroll_from: diagnosisInfo?.pub_date,
        enroll_to: results.pub_date,
        procedure_code: "null",
        diagnosis_code: diagnosisInfo?.code || "N/A",
        charge_amount: finalPrice.toFixed(2),
        units: "1",
        status: true,
        pub_date: new Date().toISOString(),
        hmo: results.hmo?.id || "N/A",
      }

      console.log("Payload:", payload) // Log the payload to verify its structure

      const response = await axios.post(
        `https://api2.caregiverhospital.com/patient/add-billing-to-patient/${results.patient_id}/`,
        payload
      )
      console.log("Response data:", response.data)
      onClose(true)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating lab test result:", error.response?.data)
        setErrorMessage(error.response?.data.message || "An error occurred while updating the lab test result.")
      } else if (error instanceof Error) {
        console.error("Error updating lab test result:", error.message)
        setErrorMessage(error.message || "An unexpected error occurred.")
      } else {
        console.error("Unknown error:", error)
        setErrorMessage("An unexpected error occurred.")
      }
      onClose(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Invoice</p>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={() => onClose(false)} />
            </div>
          </div>

          <p className="py-2">Test Type: {results.test_type}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {/* <Image src="/admission1.svg" width={40} height={40} alt="" /> */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#46ffa6]">
                <p className="capitalize text-[#000000]">{results.patient_name.charAt(0)}</p>
              </div>
              <div>
                <h5>{results.patient_name}</h5>
                <p className="text-xs">HMO ID: {results.policy_id}</p>
              </div>
            </div>
            <div>
              <p className="text-xs">{formatDate(diagnosisInfo?.pub_date)}</p>
              {/* <p className="text-xs">{formatDate(results.pub_date)}</p> */}
            </div>
          </div>

          <div className="tab-bg mt-2 w-full rounded p-4">
            <div className="flex items-center justify-between" onClick={() => toggleOpen(0)}>
              <p>
                Orders{" "}
                {diagnosisInfo?.price
                  ? Number(diagnosisInfo.price).toLocaleString("en-US", { minimumFractionDigits: 2 })
                  : "N/A"}
              </p>
              <IoIosArrowDown />
            </div>
            {openSection === 0 && (
              <div className="mt-4 flex-col">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-sm">Diagnosis Name</p>
                  <p className="text-sm">{results.diagnosis_code || "N/A"}</p>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <p className="text-sm">Diagnosis Code</p>
                  <p className="text-sm">{diagnosisInfo?.code || "N/A"}</p>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <p className="text-sm">Diagnosis Price</p>
                  <p className="text-sm">
                    ₦
                    {diagnosisInfo?.price
                      ? Number(diagnosisInfo.price).toLocaleString("en-US", { minimumFractionDigits: 2 })
                      : "N/A"}{" "}
                    * 1
                  </p>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <p className="text-sm">Discount</p>
                  <p className="text-sm">{results.discount_value || "N/A"}</p>
                </div>
                <div className="w-full border"></div>
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm">Total</p>
                  <p className="text-sm font-bold">₦{calculateTotal()}</p>
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="mt-4 text-red-600">
              <p>Error: {errorMessage}</p>
            </div>
          )}

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal

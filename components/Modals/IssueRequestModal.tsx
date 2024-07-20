import React, { useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import { IoIosArrowDown } from "react-icons/io"
import AOS from "aos"
import "aos/dist/aos.css"
import axios from "axios"

interface Patient {
  id: string
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
  image: string
  status: boolean
  prescriptions: Prescription[]
  hmo?: HMO
}

interface Prescription {
  id: string
  doctor_name: string
  medicine_id: string
  category: string
  code: string
  name: string
  complain: string
  unit: string
  dosage: string
  rate: string
  usage: string
  status: string
  pub_date: string
}

interface Procedure {
  id: string
  name: string
  code: string
  price: string
  status: boolean
  pub_date: any
}

interface HMO {
  id: string
  name: string
  category: string
  description: string
  status: boolean
  pub_date: string
}

interface PrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
  prescription: Prescription | null
  procedureDetails: Procedure | undefined
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

const IssueRequestModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  patient,
  prescription,
  procedureDetails,
}) => {
  if (!isOpen || !patient || !prescription) {
    return null
  }
  const [openSection, setOpenSection] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const toggleOpen = (index: number) => {
    setOpenSection(openSection === index ? -1 : index)
  }

  const calculateTotal = () => {
    if (procedureDetails?.price && prescription.unit) {
      return (Number(procedureDetails.price) * Number(prescription.unit)).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })
    }
    return "N/A"
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setErrorMessage(null) // Clear previous error message
    try {
      const payload = {
        enroll_number: patient.policy_id,
        enroll_from: procedureDetails?.pub_date,
        enroll_to: prescription.pub_date,
        procedure_code: procedureDetails?.code || "N/A",
        diagnosis_code: "null",
        charge_amount: procedureDetails?.price,
        units: prescription.unit,
        status: true,
        pub_date: new Date().toISOString(), // Or use the appropriate date if provided
        hmo: patient.hmo?.id || "N/A",
      }

      console.log("Payload:", payload) // Log the payload to verify its structure

      const response = await axios.post(
        `https://api.caregiverhospital.com/patient/add-billing-to-patient/${patient.id}/`,
        payload
      )
      console.log("Response data:", response.data)
      onClose()
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
      onClose()
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
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={() => onClose()} />
            </div>
          </div>
          <div>
            <p className="py-2">Medicine Name: {prescription.name}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {/* <Image src="/admission1.svg" width={40} height={40} alt="" /> */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#46ffa6]">
                  <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
                </div>
                <div>
                  <h5>{patient.name}</h5>
                  <p className="text-xs">HMO ID: {patient.policy_id}</p>
                </div>
              </div>
              <div>
                <p className="text-xs">{formatDate(procedureDetails?.pub_date)}</p>
                {/* <p className="text-xs">{formatDate(results.pub_date)}</p> */}
              </div>
            </div>

            <div className="tab-bg mt-2 w-full rounded p-4">
              <div className="flex items-center justify-between" onClick={() => toggleOpen(0)}>
                <p>Orders ₦{calculateTotal()}</p>
                <IoIosArrowDown />
              </div>
              {openSection === 0 && (
                <div className="mt-4 flex-col">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-sm">Procedure Name</p>
                    <p className="text-sm">{procedureDetails?.name || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-sm">Procedure Code</p>
                    <p className="text-sm">{procedureDetails?.code || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between pb-4">
                    <p className="text-sm">Procedure Price</p>
                    <p className="text-sm">
                      ₦
                      {procedureDetails?.price
                        ? Number(procedureDetails.price).toLocaleString("en-US", { minimumFractionDigits: 2 })
                        : "N/A"}{" "}
                      * {prescription.unit}
                    </p>
                  </div>
                  <div className="w-full border"></div>
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm">Total</p>

                    <p className="text-sm font-bold">₦{calculateTotal()}</p>
                  </div>
                  {/* <p className="text-xs">HMO ID: {results.hmo?.id || "N/A"}</p> */}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Submitting..." : "Submit Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueRequestModal

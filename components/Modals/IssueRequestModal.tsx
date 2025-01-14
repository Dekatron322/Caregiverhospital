import React, { useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import { IoIosArrowDown } from "react-icons/io"

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
  issue_status: boolean
  payment_status?: boolean
  discount_value: string
  down_payment: string
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
  console.log("Modal is rendering with isOpen:", isOpen)

  const [openSection, setOpenSection] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState(prescription?.payment_status)
  const [downPayment, setDownPayment] = useState(0)

  if (!isOpen || !patient || !prescription) {
    return null
  }
  const toggleOpen = (index: number) => {
    setOpenSection(openSection === index ? -1 : index)
  }

  const calculateTotal = () => {
    if (procedureDetails?.price && prescription.unit) {
      const unitPrice = Number(procedureDetails.price)
      const quantity = Number(prescription.dosage)
      const totalPrice = unitPrice + quantity

      // Check if there is a discount value
      const discountValue = prescription.discount_value ? parseFloat(prescription.discount_value) : 0
      const discountAmount = totalPrice * (discountValue / 100)
      const finalPrice = totalPrice - discountAmount

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
      const unitPrice = procedureDetails?.price ? Number(procedureDetails.price) : 0
      const quantity = prescription.dosage ? Number(prescription.dosage) : 0
      const totalPrice = unitPrice + quantity

      const discountValue = prescription.discount_value ? parseFloat(prescription.discount_value) : 0
      const discountAmount = totalPrice * (discountValue / 100)
      const finalPrice = totalPrice - discountAmount

      const payload = {
        enroll_number: patient.policy_id,
        enroll_from: procedureDetails?.pub_date,
        enroll_to: prescription.pub_date,
        procedure_code: procedureDetails?.code || "N/A",
        diagnosis_code: "null",
        charge_amount: finalPrice.toFixed(2),
        discount_value: prescription.discount_value,
        units: prescription.unit,
        status: true,
        pub_date: new Date().toISOString(), // Or use the appropriate date if provided
        hmo: patient.hmo?.id || "N/A",
        down_payment: downPayment,
      }

      console.log("Payload:", payload) // Log the payload to verify its structure

      const response = await axios.post(
        `https://api2.caregiverhospital.com/patient/add-billing-to-patient/${patient.id}/`,
        payload
      )
      console.log("Response data:", response.data)

      // Update the issue_status of the prescription
      await axios.put(`https://api2.caregiverhospital.com/prescription/update-payment-status/${prescription.id}/`, {
        payment_status: true,
      })

      onClose()
      setPaymentStatus(true)
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
    <div className={styles.modalOverlay}>
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
                  <p className="text-xs">
                    HMO Name/ID: {patient.hmo?.name || "N/A"} ( {patient?.policy_id || "N/A"})
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs">{formatDate(prescription?.pub_date)}</p>
                {/* <p className="text-xs">{formatDate(results.pub_date)}</p> */}
              </div>
            </div>

            <div className="tab-bg my-3 w-full rounded p-4">
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
                    <p className="text-sm">₦{procedureDetails?.price}</p>
                  </div>
                  <div className="flex items-center justify-between pb-4">
                    <p>Payment Status: </p>
                    <p className={prescription.payment_status ? "text-green-500" : "text-red-500"}>
                      {prescription.payment_status ? "Paid" : "Pending"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pb-2">
                    <p className="text-sm">Medicine Price</p>
                    <p className="text-sm">₦{prescription.dosage}</p>
                  </div>

                  <div className="flex items-center justify-between pb-2">
                    <p className="text-sm">Discount %</p>
                    <p className="text-sm">{prescription.discount_value || "N/A"}</p>
                  </div>
                  <div className="w-full border"></div>
                  <div className="flex items-center justify-between pb-2 pt-4">
                    <p className="text-sm">Total</p>

                    <p className="text-sm font-bold">₦{calculateTotal()}</p>
                  </div>
                  {/* <div className="flex items-center justify-between ">
                    <p className="text-sm">Down Payment</p>
                    <p className="text-sm">₦{prescription.down_payment}</p>
                  </div> */}

                  {/* <p className="text-xs">HMO ID: {results.hmo?.id || "N/A"}</p> */}
                </div>
              )}
            </div>
            <label htmlFor="down-payment">Down Payment:</label>
            <input
              id="down-payment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="search-bg mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter down payment"
            />
          </div>
          <div className="mt-4 flex w-full gap-6">
            {prescription.payment_status ? (
              <p className="txt-2xl w-full rounded-md bg-black py-2 text-center font-bold text-[#46FFA6]">
                Invoice Sent
              </p>
            ) : (
              <button
                className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Submitting..." : "Submit Invoice"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueRequestModal

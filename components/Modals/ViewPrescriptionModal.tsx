import React, { useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

type Patient = {
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
}

type Prescription = {
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
  issue_status: boolean
  pub_date: string
  quantity: string
  discount_value: string
  payment_status?: boolean
}

type Procedure = {
  id: string
  name: string
  code: string
  price: string
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

const ViewPrescriptionModal: React.FC<PrescriptionModalProps> = ({
  onClose,
  patient,
  prescription,
  procedureDetails,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isIssued, setIsIssued] = useState(prescription?.issue_status || false)

  if (!patient || !prescription) {
    return null
  }

  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onClose()
  }

  const handleUpdateIssueStatus = async () => {
    if (!prescription.id) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://api2.caregiverhospital.com/prescription/prescription/${prescription.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issue_status: true }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update issue status: ${response.statusText}`)
      }

      setIsIssued(true) // Update local state
      console.log("Issue status updated successfully")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className="my-2 w-full"></div>
          <div className="px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-semibold">Prescription for {patient.name}</p>
              <div className="hover:rounded-md hover:border">
                <LiaTimesSolid className="m-1 cursor-pointer" onClick={handleIconClick} />
              </div>
            </div>
            <div className="modal-content">
              <p>
                <strong>Doctor Name:</strong> {prescription.doctor_name}
              </p>
              <p>
                <strong>Medicine Name:</strong> {prescription.name}
              </p>
              <p>
                <strong>Category:</strong> {prescription.category}
              </p>
              <p>
                <strong>Unit:</strong> {prescription.unit}
              </p>
              <p>
                <strong>Usage:</strong> {prescription.usage}
              </p>
              <p>
                <strong>Dosage:</strong> {prescription.dosage}
              </p>
              <p>
                <strong>Procedure:</strong> {procedureDetails?.name}
              </p>
              <p>
                <strong>Price:</strong> {procedureDetails?.price}
              </p>
              <div className="flex items-center justify-between pb-4">
                <p>Payment Status: </p>
                <p className={prescription?.payment_status ? "text-green-500" : "text-red-500"}>
                  {prescription?.payment_status ? "Paid" : "Pending"}
                </p>
              </div>
              <p>
                <strong>Patient Complain:</strong> {prescription.complain}
              </p>
              <p>
                <strong>Discount Value:</strong> {prescription.discount_value}
              </p>
              <p>
                <strong>Date:</strong> {prescription.pub_date}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleUpdateIssueStatus}
                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                disabled={loading || isIssued}
              >
                {loading ? "Updating..." : isIssued ? "Issued" : "Mark as Issued"}
              </button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewPrescriptionModal

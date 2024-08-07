import React from "react"

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
  issue_status: boolean // changed from string to boolean
  pub_date: string
  quantity: string
  discount_value: string
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
  if (!patient || !prescription) {
    return null
  }

  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation() // Prevent event bubbling
    console.log("Close icon clicked")
    onClose()
  }

  return (
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
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
            <p>
              <strong>Patient Complain:</strong> {prescription.complain}
            </p>
            <p>
              <strong>Discount Value:</strong> {prescription.discount_value}
            </p>
            <p>
              <strong>Date:</strong> {prescription.pub_date}
            </p>
            {/* Uncomment the button below if you want to use the update functionality */}
            {/* <Button onClick={() => onUpdateStatus(prescription.id)}>Update Issue Status</Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewPrescriptionModal

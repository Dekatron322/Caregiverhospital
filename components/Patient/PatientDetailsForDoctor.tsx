import React, { useEffect, useState } from "react"
import Image from "next/image"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"
import { IoEyeSharp } from "react-icons/io5"
import PrintRecordModal from "components/Modals/PrintRecordModal"
import { IoMdSearch } from "react-icons/io"
import { CiDiscount1 } from "react-icons/ci"
import AddTestDiscountModal from "components/Modals/AddTestDiscountModal"

import styles from "../Modals/modal.module.css"
import AddMedicalDiscountModal from "components/Modals/AddMedicalDiscountModal"
import { LiaTimesSolid } from "react-icons/lia"
import { FiTrash2 } from "react-icons/fi"

interface Appointment {
  id: number
  doctor: string
  pub_date: string
  detail: string
}

interface Prescription {
  id: string
  doctor_name: string
  category: string
  name: string
  complain: string
  code: string
  unit: string
  dosage: string
  rate: string
  usage: string
  discount_value: string
  note: string
  status: boolean
  pub_date: string
}

interface MedicalRecord {
  id: string
  doctor_name: string
  doctor_request_title: string
  doctor_request_description: string
  test_type: string
  result: string
  pub_date: string

  status_note: string
  discount_value: string
  lab_parameters?: {
    id: string
    param_title: string
    param_result: string
    param_unit: string
    param_range: string
  }[]
}

interface Patient {
  id: string
  name: string
  heart_rate?: string
  body_temperature?: string
  glucose_level?: string
  blood_pressure?: string
  address: string
  phone_no: string
  dob: string
  blood_group?: string
  hmo: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }
  policy_id?: string
  allergies?: string
  nok_name: string
  nok_phone_no: string
  appointments: { id: number; doctor: string; pub_date: string; detail: string }[]
  prescriptions: {
    id: string
    category: string
    name: string
    complain: string
    code: string
    unit: string
    dosage: string
    rate: string
    usage: string
    note: string
    status: boolean
    pub_date: string
    doctor_name: string
    discount_value: string
  }[]
  lab_tests: {
    id: string
    doctor_name: string
    doctor_request_title: string
    doctor_request_description: string
    test_type: string
    result: string
    pub_date: string
    payment_status?: string
    status_note: string
    discount_value: string
    lab_parameters: {
      id: string
      param_title: string
      param_result: string
      param_unit: string
      param_range: string
    }[]
  }[]
  testt: {
    id: string
    title: string
    detail: string
    test_range: string
  }[]
}

const formatDateTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

interface PatientDetailsProps {
  patient: Patient
}

const PatientDetailsForDoctor: React.FC<PatientDetailsProps> = ({ patient }) => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("appointments")

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [patientDetail, setPatientDetail] = useState<Patient | null>(null)
  const [discountModalVisible, setDiscountModalVisible] = useState(false)
  const [newDiscountModalVisible, setNewDiscountModalVisible] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)

  useEffect(() => {
    setPatientDetail(patient)
  }, [patient])

  if (!patient) {
    return (
      <div className="loading-text flex h-full items-center justify-center">
        {"loading...".split("").map((letter, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {letter}
          </span>
        ))}
      </div>
    )
  }

  const filteredList = patient.appointments.filter((appointment) =>
    appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPrescription = patient.prescriptions.filter((prescription) =>
    prescription.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMedicalRecords = patient.lab_tests.filter((medical) =>
    medical.test_type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleViewClick = (record: MedicalRecord) => {
    const recordWithPatientName = {
      ...record,
      patient_name: patient?.name,
      patient_id: patient?.id,
      lab_parameters: record.lab_parameters,
    }
    setSelectedRecord(recordWithPatientName)
    setModalVisible(true)
  }

  const handleAddDiscountClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setDiscountModalVisible(true)
  }

  const handleAddMedicalDiscountClick = (medical: MedicalRecord) => {
    setSelectedRecord(medical)
    setNewDiscountModalVisible(true)
  }

  const handleSavePrescriptionDiscount = async (discountValue: string) => {
    if (!selectedPrescription) return

    try {
      const response = await fetch(
        `https://api2.caregiverhospital.com/prescription/add-discount-to/${selectedPrescription.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ discount_value: discountValue }),
        }
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      setPatientDetail((prevDetail) => {
        if (!prevDetail) return prevDetail

        const updatedPrescriptions = prevDetail.prescriptions.map((prescription) =>
          prescription.id === selectedPrescription.id
            ? { ...prescription, discount_value: discountValue }
            : prescription
        )

        return { ...prevDetail, prescriptions: updatedPrescriptions }
      })

      setDiscountModalVisible(false)
    } catch (error) {
      console.error("Error updating discount value:", error)
    }
  }

  const handleSaveRecordDiscount = async (discountValue: string) => {
    if (!selectedRecord) return

    try {
      const response = await fetch(
        `https://api2.caregiverhospital.com/lab-test/add-discount-to/${selectedRecord.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ discount_value: discountValue }),
        }
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      setPatientDetail((prevDetail) => {
        if (!prevDetail) return prevDetail

        const updatedRecords = prevDetail.lab_tests.map((record) =>
          record.id === selectedRecord.id ? { ...record, discount_value: discountValue } : record
        )

        return { ...prevDetail, lab_tests: updatedRecords }
      })

      setNewDiscountModalVisible(false)
    } catch (error) {
      console.error("Error updating discount value:", error)
    }
  }

  const handleDeletePrescription = async (id: string) => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/prescription/prescription/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Immediately update the state to reflect the deletion
        setPatientDetail((prevDetail) => {
          if (!prevDetail) return prevDetail

          // Filter out the deleted prescription
          const updatedPrescriptions = prevDetail.prescriptions.filter((prescription) => prescription.id !== id)

          // Return the updated patient details with the updated prescriptions
          return { ...prevDetail, prescriptions: updatedPrescriptions }
        })
        alert("Prescription deleted successfully.")
      } else {
        alert("Failed to delete prescription.")
      }
    } catch (error) {
      console.error("Error deleting prescription:", error)
    }
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

  const renderAllAppointments = () => (
    <div className="flex flex-col gap-2">
      {filteredList.map((appointment) => (
        <div
          key={appointment.id}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
        >
          <div className="flex w-full items-center gap-1 text-sm font-bold">
            <div>
              <p>{appointment.doctor}</p>
              <small className="text-xm ">Doctor Assigned</small>
            </div>
          </div>
          <div className="flex w-full items-center gap-1 text-sm font-bold">
            <div>
              <p>{formatDateTime(appointment.pub_date)}</p>
              <small className="text-xm ">Appointment Date</small>
            </div>
          </div>
          <div className="md:flex md:w-full md:flex-col md:items-center">
            <p className="rounded bg-[#46FFA6] px-2 py-[2px] text-center text-xs font-bold text-black">
              {appointment.detail}
            </p>
            <p className="text-xs">Complain</p>
          </div>
          <div>
            <PiDotsThree />
          </div>
        </div>
      ))}
    </div>
  )

  const renderPrescriptions = () => (
    <div className="flex flex-col gap-2">
      {filteredPrescription.map((prescription) => (
        <div
          key={prescription.id}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
        >
          {/* <div className="w-full">
            <p className="text-sm font-bold">{prescription.doctor_name}</p>
            <small className="text-xm ">doctor</small>
          </div> */}
          <div className="w-full">
            <p className="text-xs font-semibold">{formatDateTime(prescription.pub_date)}</p>
            <small className="text-xs ">Prescription date</small>
          </div>
          <div className="w-full">
            <p className="text-xs font-semibold">{prescription.name}</p>
            <small className="text-xs ">Prescription</small>
          </div>
          {/* <div className="w-full">
            <p className="text-xs font-semibold">{prescription.complain}</p>
            <small className="text-xm ">Complain</small>
          </div> */}
          <div className="w-full">
            <p className="text-xs font-semibold">{prescription.usage}</p>
            <small className="text-xs ">Usage</small>
          </div>
          <div className="w-full">
            <p className="text-xs font-semibold">{prescription.complain}</p>
            <small className="text-xs ">Complaint</small>
          </div>
          <div className="w-full">
            <p className="text-xs font-semibold">{prescription.rate}</p>
            <small className="text-xm ">Rate</small>
          </div>
          <div className="w-full ">
            <p className="text-xs font-semibold">{prescription.unit}</p>
            <small className="text-xs ">Unit</small>
          </div>
          <div className="w-full ">
            <p className="text-xs font-semibold">{prescription.discount_value}</p>
            <small className="text-xs ">Discount Value</small>
          </div>
          <div>
            <button className="rounded-full p-1 text-blue-500" onClick={() => handleAddDiscountClick(prescription)}>
              <CiDiscount1 size={20} />
            </button>
          </div>
          <button className="rounded-full p-1 text-red-500" onClick={() => handleDeletePrescription(prescription.id)}>
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>
  )

  const renderMedicalRecord = () => (
    <div className="flex flex-col gap-2">
      {filteredMedicalRecords.map((medical) => (
        <div key={medical.id} className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2">
          <div className="flex w-full items-center gap-1 text-sm font-semibold">
            <div>
              <p>{medical.test_type}</p>
              <small className="text-xm ">Test Type</small>
            </div>
          </div>
          {/* <div className="flex w-full items-center gap-1 text-sm font-semibold">
            <div>
              <p>{medical.result}</p>
              <small className="text-xm ">Result</small>
            </div>
          </div> */}
          {/* <div className="flex w-full items-center gap-1 text-sm font-semibold">
            <div>
              <p>{formatDate(medical.pub_date)}</p>
              <small className="text-xm ">Date</small>
            </div>
          </div> */}
          <div className="flex w-full items-center gap-1 text-sm font-semibold">
            <div>
              <small className="text-xm ">Status</small>
              {medical.payment_status ? (
                <p className="w-32 rounded bg-[#000000] px-2 py-[6px] text-center text-xs text-[#46FFA6]">Approved</p>
              ) : (
                <p className="w-32 rounded bg-[#F2B8B5] px-2 py-[6px] text-center text-xs">Not Approved</p>
              )}
            </div>
          </div>
          <div className="md:flex md:w-full md:flex-col md:items-center">
            <p className="rounded bg-[#46FFA6] px-2 py-[2px] text-center text-xs font-semibold text-black">
              {medical.discount_value ? `Discount: ${medical.discount_value}` : "No Discount"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center    text-blue-500"
              onClick={() => handleAddMedicalDiscountClick(medical)}
            >
              <CiDiscount1 size={20} />
            </button>
            <IoEyeSharp size={20} onClick={() => handleViewClick(medical)} />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col">
      <div className="tab-bg mb-4 flex items-center gap-3 rounded-lg p-1 md:w-[350px] md:border">
        <button
          className={activeTab === "appointments" ? "active-tab" : "inactive-tab"}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
        <button
          className={activeTab === "prescriptions" ? "active-tab" : "inactive-tab"}
          onClick={() => setActiveTab("prescriptions")}
        >
          Prescriptions
        </button>
        <button
          className={activeTab === "medicals" ? "active-tab" : "inactive-tab"}
          onClick={() => setActiveTab("medicals")}
        >
          Medical Records
        </button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="search-bg mb-4 flex h-8 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-2 max-md:w-[180px] lg:w-[300px]">
          <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
          <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
          <input
            type="search"
            name="search"
            placeholder="Search by doctor's name"
            className="w-full bg-transparent text-xs outline-none focus:outline-none"
            autoComplete="off"
            onChange={handleSearch}
          />
        </div>
      </div>

      {activeTab === "appointments" && renderAllAppointments()}
      {activeTab === "prescriptions" && renderPrescriptions()}
      {activeTab === "medicals" && renderMedicalRecord()}

      <PrintRecordModal show={modalVisible} onClose={() => setModalVisible(false)} record={selectedRecord} />

      <AddTestDiscountModal
        show={newDiscountModalVisible}
        onClose={() => setNewDiscountModalVisible(false)}
        onSave={handleSaveRecordDiscount}
        record={selectedRecord}
      />

      <AddDiscountModal
        show={discountModalVisible}
        onClose={() => setDiscountModalVisible(false)}
        onSave={handleSavePrescriptionDiscount}
        prescription={selectedPrescription}
      />

      <AddMedicalDiscountModal
        show={newDiscountModalVisible}
        onClose={() => setNewDiscountModalVisible(false)}
        onSave={handleSaveRecordDiscount}
        record={selectedRecord}
      />
    </div>
  )
}

export default PatientDetailsForDoctor

interface AddPrescriptionDiscountModalProps {
  show: boolean
  onClose: () => void
  onSave: (discountValue: string) => void
  prescription: Prescription | null
}

const AddDiscountModal: React.FC<AddPrescriptionDiscountModalProps> = ({ show, onClose, onSave, prescription }) => {
  const [discountValue, setDiscountValue] = useState<string>("")

  const handleSave = () => {
    onSave(discountValue)
    setDiscountValue("")
  }

  if (!show) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Apply Discount</h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>
          <div className="my-4">
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 text-xs hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder="Enter discount value"
                className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
              />
            </div>
          </div>

          <button
            className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

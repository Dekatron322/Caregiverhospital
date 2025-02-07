import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"
import { IoEyeSharp, IoPrintOutline } from "react-icons/io5"
// Lazy load PrintRecordModal only on the client-side
const PrintRecordModal = dynamic(() => import("components/Modals/PrintRecordModal"), { ssr: false })

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
}

interface MedicalRecord {
  id: string
  doctor_name: string
  doctor_image: string
  test: string
  result: string
  test_type: string
  pub_date: string
}

interface PatientDetail {
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
    unit: number
    dosage: number
    rate: string
    usage: string
    note: string
    status: boolean
    pub_date: string
    doctor_name: string
  }[]
  lab_tests: {
    id: string
    doctor_name: string
    doctor_image: string
    test: string
    result: string
    test_type: string
    pub_date: string
  }[]
}

const formatDateTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

interface PatientDetailsProps {
  patientDetail: PatientDetail
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientDetail }) => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("appointments")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)

  const toggleDone = () => {
    setIsDone(!isDone)
  }

  const handleGoBack = () => {
    router.back()
  }

  const filteredList = patientDetail.appointments.filter((appointment) =>
    appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPrescription = patientDetail.prescriptions.filter((prescription) =>
    prescription.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMedicalRecords = patientDetail.lab_tests.filter((medical) =>
    medical.test.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleViewClick = (record: MedicalRecord) => {
    const recordWithPatientName = { ...record, patient_name: patientDetail?.name }
    setSelectedRecord(recordWithPatientName)
    setModalVisible(true)
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
          <div className="">
            <p className="text-sm font-bold">{prescription.doctor_name}</p>
            <small className="text-xm ">Doctor</small>
          </div>
          <div className="">
            <p className="text-sm font-bold">{prescription.name}</p>
            <small className="text-xm ">Medication name</small>
          </div>
          <div className="max-md:hidden">
            <p className="text-sm font-bold">{prescription.category}</p>
            <small className="text-xm ">Category</small>
          </div>
          <div className="max-md:hidden">
            <p className="text-sm font-bold">{prescription.unit}</p>
            <small className="text-xm ">Quantity</small>
          </div>
          <div className="max-md:hidden">
            <p className="text-sm font-bold">{prescription.dosage}</p>
            <small className="text-xm ">Dosage</small>
          </div>
          <div className="max-md:hidden">
            <p className="text-sm font-bold">{prescription.usage}</p>
            <small className="text-xm ">Usage</small>
          </div>
          <PiDotsThree />
        </div>
      ))}
    </div>
  )

  const renderMedicalRecord = () => (
    <div className="flex flex-col gap-2">
      {filteredMedicalRecords.map((medical) => (
        <div key={medical.id} className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2">
          <div className="w-full max-md:hidden">
            <p className="text-sm font-bold">{formatDateTime(medical.pub_date)}</p>
            <small className="text-xm ">Date and Time</small>
          </div>
          <div className="w-full">
            <p className="text-sm font-bold">{medical.test}</p>
            <small className="text-xm ">Name</small>
          </div>
          <div className="flex w-full items-center gap-1 text-sm font-bold max-md:hidden">
            {/* <span>
              <Image src={medical.doctor_image} height={40} width={40} alt="" />
            </span> */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]">
              <p className="capitalize text-[#000000]">{medical.doctor_name.charAt(0)}</p>
            </div>
            <div>
              <p>{medical.doctor_name}</p>
              <p className="text-xs ">Doctor Assigned</p>
            </div>
          </div>
          {/* <div className="max-md:hidden">
            <p className="text-sm font-bold capitalize">{medical.test_type}</p>
            <small className="text-xm ">Test</small>
          </div> */}
          <div className="flex gap-2">
            <button
              className="flex w-28 items-center justify-center gap-1 rounded bg-[#349DFB] px-2 py-2 text-xs text-[#000000]"
              onClick={() => handleViewClick(medical)}
            >
              <IoEyeSharp /> View
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col">
      <div className="tab-bg mb-4 flex items-center gap-3 rounded-lg p-1 md:w-[350px] md:border">
        <button
          className={`${activeTab === "appointments" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
        <button
          className={`${activeTab === "prescriptions" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("prescriptions")}
        >
          Prescriptions
        </button>
        <button
          className={`${activeTab === "medicals" ? "active-tab" : "inactive-tab"}`}
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
    </div>
  )
}

export default PatientDetails

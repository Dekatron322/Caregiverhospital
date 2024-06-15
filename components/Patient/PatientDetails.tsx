import React, { useState, useEffect } from "react"
import Image from "next/image"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"
import { IoEyeSharp, IoPrintOutline } from "react-icons/io5"
import PrintRecordModal from "components/Modals/PrintRecordModal"
import { IoMdSearch } from "react-icons/io"

interface Appointment {
  id: number
  doctor: string
}

interface Prescription {
  id: string
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
  name: string
  doctor_assigned: string
  doctor_image: string
  test: string
  result: string
  pub_date: string
}

interface PatientDetail {
  id: string
  name: string
  appointments: Appointment[]
  prescriptions: Prescription[]
  medical_records: MedicalRecord[]
}

export default function PatientDetails({ params }: { params: { patientId: string } }) {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("appointments")
  const { patientId } = params
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null)

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`https://api.caregiverhospital.com/patient/patient/${patientId}`)
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setPatientDetail(data as PatientDetail)
      } catch (error) {
        console.error("Error fetching patient details:", error)
      }
    }

    fetchPatientDetails()
  }, [patientId])

  const toggleDone = () => {
    setIsDone(!isDone)
  }

  const handleGoBack = () => {
    router.back()
  }

  if (!patientDetail) {
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

  const filteredList = patientDetail.appointments.filter((appointment) =>
    appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPrescription = patientDetail.prescriptions.filter((prescription) =>
    prescription.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMedicalRecords = patientDetail.medical_records.filter((medical) =>
    medical.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleViewClick = (record: MedicalRecord) => {
    setSelectedRecord(record)
    setModalVisible(true)
  }

  const renderAllAppointments = () => (
    <div className="flex flex-col gap-2">
      {filteredList.map((appointment) => (
        <div
          key={appointment.id}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
        >
          <div className="flex items-center gap-1 text-sm font-bold">
            <div>
              <p>{appointment.doctor}</p>
              <small className="text-xm ">Doctor Assigned</small>
            </div>
          </div>

          <PiDotsThree />
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
            <p className="text-sm font-bold">xxxx</p>
            <small className="text-xm ">doctor</small>
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
          <div className="max-md:hidden">
            <p className="text-sm font-bold">{medical.id}</p>
            <small className="text-xm ">{medical.pub_date}</small>
          </div>
          <div className="">
            <p className="text-sm font-bold">{medical.name}</p>
            <small className="text-xm ">Name</small>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold max-md:hidden">
            <span>
              <Image src={medical.doctor_image} height={40} width={40} alt="" />
            </span>
            <div>
              <p>{medical.doctor_assigned}</p>
              <small className="text-xm ">Doctor Assigned</small>
            </div>
          </div>
          <div className="max-md:hidden">
            <p className="text-sm font-bold">{medical.test}</p>
            <small className="text-xm ">Test</small>
          </div>
          <div className="flex gap-2">
            <button className="flex w-28 items-center justify-center gap-1 rounded bg-[#46FFA6] px-2 py-[2px] text-xs text-[#000000]">
              <IoPrintOutline /> Print
            </button>
            <button
              className="flex w-28 items-center justify-center gap-1 rounded bg-[#349DFB] px-2 py-[2px] text-xs text-[#000000]"
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
        <div className="search-bg mb-4 flex h-8 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-md:w-[180px] lg:w-[300px]">
          <IoMdSearch />
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

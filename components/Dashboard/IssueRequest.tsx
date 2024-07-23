import React, { useEffect, useState } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import IssueRequestModal from "components/Modals/IssueRequestModal"

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
  issue_status: boolean // changed from string to boolean
  pub_date: string
}

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
}

interface Procedure {
  id: string
  name: string
  code: string
  price: string
  status: boolean
  pub_date: string
}

type ApiResponse = Patient[]
type ProcedureResponse = Procedure[]

const IssueRequest = () => {
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("pending")
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [proceduresMap, setProceduresMap] = useState<Map<string, Procedure>>(new Map())

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch("https://api.caregiverhospital.com/patient/patient/")
      const data = (await response.json()) as ApiResponse
      const patientsWithAppointments = data.filter((patient) => patient.prescriptions.length > 0)
      setPatients(patientsWithAppointments)
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProcedures = async () => {
    try {
      const response = await fetch("https://api.caregiverhospital.com/procedure/procedure/")
      const data = (await response.json()) as ProcedureResponse
      const proceduresMap = new Map(data.map((procedure) => [procedure.name, procedure]))
      setProceduresMap(proceduresMap)
    } catch (error) {
      console.error("Error fetching procedures:", error)
    }
  }

  useEffect(() => {
    fetchPatients()
    fetchProcedures()
  }, [])

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

  const getProcedureDetails = (procedureName: string) => {
    return proceduresMap.get(procedureName)
  }

  const handleIconClick = (patient: Patient, prescription: Prescription) => {
    if (!prescription.issue_status) {
      setSelectedPatient(patient)
      setSelectedPrescription(prescription)
      setIsModalOpen(true)
    }
  }

  const updateIssueStatus = async (prescriptionId: string) => {
    try {
      const response = await fetch(`https://api.caregiverhospital.com/prescription/prescription/${prescriptionId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issue_status: true }),
      })
      if (!response.ok) {
        throw new Error("Failed to update issue status")
      }
      fetchPatients() // Re-fetch patients to get the updated data
    } catch (error) {
      console.error("Error updating issue status:", error)
    }
  }

  const handleRemoveRedEyeClick = (prescription: Prescription) => {
    updateIssueStatus(prescription.id)
  }

  const renderPrescriptionDetails = (patient: Patient, prescription: Prescription) => {
    const procedureDetails = getProcedureDetails(prescription.code)
    return (
      <div key={prescription.id} className="mb-2 flex w-full items-center justify-between rounded-lg border p-2">
        <div className="flex w-full items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
            <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
          </div>
          <div>
            <p className="text-sm font-bold">{patient.name}</p>
            <p className="text-xs">Doctor: {prescription.doctor_name}</p>
            <p className="text-xs">HMO ID: {patient.policy_id}</p>
          </div>
        </div>
        <div className="w-full max-sm:hidden">
          <p className="text-sm font-bold">Procedure: {procedureDetails?.name}</p>
          <p className="text-xs font-medium">Price: ₦{procedureDetails?.price}</p>
          <p className="text-xs font-medium">Code: {procedureDetails?.code}</p>
        </div>
        <div className="w-full">
          <p className="text-sm font-bold">{prescription.name}</p>
          <small className="text-xs">Medicine Name</small>
        </div>

        <div className="w-full max-sm:hidden">
          <div className="flex gap-1 text-sm font-bold">{prescription.category}</div>
          <small className="text-xs">Category Name</small>
        </div>

        <div className="w-full max-sm:hidden">
          <div className="flex gap-1 text-sm font-bold">{prescription.unit}</div>
          <small className="text-xs">Unit</small>
        </div>
        <div className="w-full max-sm:hidden">
          <p className="text-sm font-bold">{formatDate(procedureDetails?.pub_date || "")}</p>
          <small className="text-xs">Date and Time</small>
        </div>

        <div className="flex gap-2">
          {prescription.issue_status ? (
            <CheckCircleOutlineIcon className="text-gray-400" />
          ) : (
            <>
              <AccountBalanceWalletIcon onClick={() => handleIconClick(patient, prescription)} />
              <RemoveRedEyeIcon className="text-[#46FFA6]" onClick={() => handleRemoveRedEyeClick(prescription)} />
            </>
          )}
        </div>
      </div>
    )
  }

  const renderPendingRequests = () => (
    <div className="flex flex-col gap-2">
      {patients.map((patient) =>
        patient.prescriptions.map((prescription) => renderPrescriptionDetails(patient, prescription))
      )}
    </div>
  )

  const renderIssuedRequests = () => (
    <div className="flex flex-col gap-2">
      {patients
        .filter((patient) => patient.prescriptions.some((prescription) => prescription.status !== "done"))
        .map((patient) =>
          patient.prescriptions
            .filter((prescription) => prescription.status !== "done")
            .map((prescription) => renderPrescriptionDetails(patient, prescription))
        )}
    </div>
  )

  const renderCancelledRequests = () => (
    <div className="flex flex-col gap-2">
      {patients
        .filter((patient) => patient.prescriptions.every((prescription) => prescription.status === "done"))
        .map((patient) =>
          patient.prescriptions.map((prescription) => renderPrescriptionDetails(patient, prescription))
        )}
    </div>
  )

  return (
    <div className="flex w-full flex-col">
      <div className="tab-bg mb-8 flex w-[240px] items-center gap-3 rounded-lg p-1 md:border">
        <button
          className={`${activeTab === "pending" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={`${activeTab === "issued" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("issued")}
        >
          Issued
        </button>

        <button
          className={`${activeTab === "cancelled" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {activeTab === "pending" ? renderPendingRequests() : null}
      {activeTab === "issued" ? renderIssuedRequests() : null}
      {activeTab === "cancelled" ? renderCancelledRequests() : null}

      <IssueRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        prescription={selectedPrescription}
        procedureDetails={getProcedureDetails(selectedPrescription?.code || "")}
      />
    </div>
  )
}

export default IssueRequest

import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import IssueRequestModal from "components/Modals/IssueRequestModal"
import ViewPrescriptionModal from "components/Modals/ViewPrescriptionModal"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import DeleteTestModal from "components/Modals/DeleteTestModal"
import Image from "next/image"
import PaymentStatusModal from "components/Modals/PaymentStatusModal"

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
  discount_value: string
  status: string
  issue_status: boolean // changed from string to boolean
  pub_date: string
  note: string
  quantity: string
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
  const [isPreModalOpen, setIsPreModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [refresh, setRefresh] = useState(false)

  const handleDeleteClick = (id: string) => {
    setSelectedPrescriptionId(id)
    setIsDeleteModalOpen(true)
  }

  const deletePrescription = async () => {
    if (!selectedPrescriptionId) return

    try {
      await axios.delete(`https://api2.caregiverhospital.com/prescription/prescription/${selectedPrescriptionId}/`)
      setShowSuccessNotification(true)
      setRefresh(!refresh) // Refresh the data after deletion
      setTimeout(() => setShowSuccessNotification(false), 5000)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting lab test:", error)
      alert("Failed to delete lab test.")
    }
  }

  const fetchPatients = async () => {
    let allPatients: Patient[] = []
    let start = 0
    const limit = 100
    let hasMore = true

    setIsLoading(true)
    try {
      while (hasMore) {
        const response = await fetch(
          `https://api2.caregiverhospital.com/patient/patient-with-prescription/${start}/${start + limit}/prescription/`
        )
        const data = (await response.json()) as ApiResponse

        if (data.length === 0) {
          hasMore = false
        } else {
          // Ensure no duplicate patients
          const newPatients = data.filter((newPatient) => !allPatients.some((p) => p.id === newPatient.id))

          // Optionally remove duplicate prescriptions in each patient
          newPatients.forEach((patient) => {
            const uniquePrescriptions = Array.from(new Map(patient.prescriptions.map((p) => [p.id, p])).values())
            patient.prescriptions = uniquePrescriptions
          })

          allPatients = [...allPatients, ...newPatients]
          start += limit
        }
      }

      setPatients(allPatients)
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProcedures = async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/procedure/procedure/")
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
  }, [refresh])

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
    setSelectedPatient(patient)
    setSelectedPrescription(prescription)
    setIsModalOpen(true)
  }

  // Calculate age
  const calculateAge = useCallback((dobString: string) => {
    const today = new Date()
    const dob = new Date(dobString)
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    return age
  }, [])

  const updateIssueStatus = async (prescriptionId: string) => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/prescription/prescription/${prescriptionId}/`, {
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

  const handleRemoveRedEyeClick = (patient: Patient, prescription: Prescription) => {
    setSelectedPatient(patient)
    setSelectedPrescription(prescription)
    setIsPreModalOpen(true)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const renderPrescriptionDetails = (patient: Patient, prescription: Prescription) => {
    const procedureDetails = getProcedureDetails(prescription.code)
    return (
      <div key={prescription.id} className="mb-2 flex w-full items-center justify-between gap-3 rounded-lg border p-2">
        <div className="flex w-full items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
            <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
          </div>
          <div>
            <p className="text-xs font-bold">
              {patient.name} - ({calculateAge(patient.dob)})
            </p>
            <p className="text-xs">Doctor: {prescription.doctor_name}</p>
            <p className="text-xs">HMO ID: {patient.policy_id}</p>
          </div>
        </div>
        <div className="flex w-full flex-col max-sm:hidden">
          <p className="text-xs font-bold">Procedure: {procedureDetails?.name}</p>
          <p className="text-xs font-medium">Price: ₦{procedureDetails?.price}</p>
          <p className="text-xs font-medium">Code: {procedureDetails?.code}</p>
        </div>
        <div className="w-full">
          <p className="text-xs font-bold">{prescription.name}</p>
          <p className="text-xs">₦{prescription.dosage}</p>
          <small className="text-xs">Medicine Name</small>
        </div>

        <div className="w-full max-sm:hidden">
          <div className="flex gap-1 text-xs font-bold">{prescription.category}</div>
          <small className="text-xs">Category Name</small>
        </div>

        <div className="w-full max-sm:hidden">
          <div className="flex gap-1 text-xs font-bold">{prescription.unit}</div>
          <small className="text-xs">Unit</small>
        </div>

        <div className="w-full max-sm:hidden">
          <p className="text-xs font-bold">{formatDate(prescription?.pub_date || "")}</p>
          <small className="text-xs">Date and Time</small>
        </div>

        <div className="flex w-full justify-end gap-2">
          <>
            <AccountBalanceWalletIcon onClick={() => handleIconClick(patient, prescription)} />

            <RemoveRedEyeIcon
              className="text-[#46FFA6]"
              onClick={() => handleRemoveRedEyeClick(patient, prescription)}
            />
            <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => handleDeleteClick(prescription.id)} />
          </>
        </div>
      </div>
    )
  }

  const renderPendingRequests = () => (
    <div className="flex flex-col gap-2">
      {filteredPatients.map((patient) =>
        patient.prescriptions
          .filter((prescription) => !prescription.issue_status) // Pending prescriptions
          .sort((a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime()) // Sort by pub_date descending
          .map((prescription) => renderPrescriptionDetails(patient, prescription))
      )}
    </div>
  )

  const renderIssuedRequests = () => (
    <div className="flex flex-col gap-2">
      {filteredPatients.map((patient) =>
        patient.prescriptions
          .filter((prescription) => prescription.issue_status) // Issued prescriptions
          .map((prescription) => renderPrescriptionDetails(patient, prescription))
      )}
    </div>
  )

  return (
    <div className="flex w-full flex-col">
      <div className="tab-bg mb-8 flex w-[160px] items-center gap-3 rounded-lg p-1 md:border">
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
      </div>

      <div className="tab-content">
        <div className="search-bg mb-4 flex h-10 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-md:w-[180px] lg:w-[300px]">
          <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
          <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-transparent text-xs outline-none focus:outline-none"
          />
        </div>
        {activeTab === "pending" && renderPendingRequests()}
        {activeTab === "issued" && renderIssuedRequests()}
      </div>

      <PaymentStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        prescription={selectedPrescription}
        procedureDetails={getProcedureDetails(selectedPrescription?.code || "")}
      />
      {isPreModalOpen && (
        <ViewPrescriptionModal
          isOpen={isPreModalOpen}
          onClose={() => setIsPreModalOpen(false)}
          patient={selectedPatient}
          prescription={selectedPrescription}
          procedureDetails={getProcedureDetails(selectedPrescription?.code || "")}
          // onUpdateStatus={updateIssueStatus}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteTestModal
          title="Confirm Deletion"
          description="Are you sure you want to discard this prescription? This action cannot be undone."
          onConfirm={deletePrescription}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5  flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Prescription Discarded</span>
        </div>
      )}
    </div>
  )
}

export default IssueRequest

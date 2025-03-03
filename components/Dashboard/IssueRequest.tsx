import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { debounce } from "lodash"

// Lazy load components and icons
const PaymentStatusModal = lazy(() => import("components/Modals/PaymentStatusModal"))
const ViewPrescriptionModal = lazy(() => import("components/Modals/ViewPrescriptionModal"))
const DeleteTestModal = lazy(() => import("components/Modals/DeleteTestModal"))
const AccountBalanceWalletIcon = lazy(() => import("@mui/icons-material/AccountBalanceWallet"))
const RemoveRedEyeIcon = lazy(() => import("@mui/icons-material/RemoveRedEye"))
const DeleteForeverIcon = lazy(() => import("@mui/icons-material/DeleteForever"))

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
  issue_status: boolean
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

const CACHE_KEY_PATIENTS = "cached_patients"
const CACHE_KEY_PROCEDURES = "cached_procedures"

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

  // Load cached data on initial render
  useEffect(() => {
    const cachedPatients = localStorage.getItem(CACHE_KEY_PATIENTS)
    const cachedProcedures = localStorage.getItem(CACHE_KEY_PROCEDURES)

    if (cachedPatients) {
      setPatients(JSON.parse(cachedPatients) as Patient[]) // Fix: Type-cast to Patient[]
    } else {
      fetchPatients()
    }

    if (cachedProcedures) {
      setProceduresMap(new Map(JSON.parse(cachedProcedures) as Array<[string, Procedure]>)) // Fix: Type-cast to Array<[string, Procedure]>
    } else {
      fetchProcedures()
    }
  }, [])

  // Save data to cache whenever it changes
  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem(CACHE_KEY_PATIENTS, JSON.stringify(patients))
    }
  }, [patients])

  useEffect(() => {
    if (proceduresMap.size > 0) {
      localStorage.setItem(CACHE_KEY_PROCEDURES, JSON.stringify(Array.from(proceduresMap.entries())))
    }
  }, [proceduresMap])

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
          const newPatients = data.filter((newPatient) => !allPatients.some((p) => p.id === newPatient.id))
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

  const handleDeleteClick = (id: string) => {
    setSelectedPrescriptionId(id)
    setIsDeleteModalOpen(true)
  }

  const deletePrescription = async () => {
    if (!selectedPrescriptionId) return

    try {
      await axios.delete(`https://api2.caregiverhospital.com/prescription/prescription/${selectedPrescriptionId}/`)
      setShowSuccessNotification(true)
      setRefresh(!refresh)
      setTimeout(() => setShowSuccessNotification(false), 5000)
      setIsDeleteModalOpen(false)

      // Clear cache and re-fetch data
      localStorage.removeItem(CACHE_KEY_PATIENTS)
      fetchPatients()
    } catch (error) {
      console.error("Error deleting lab test:", error)
      alert("Failed to delete lab test.")
    }
  }

  const formatDate = useCallback((dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }, [])

  const getProcedureDetails = useCallback(
    (procedureName: string) => {
      return proceduresMap.get(procedureName)
    },
    [proceduresMap]
  )

  const handleIconClick = useCallback((patient: Patient, prescription: Prescription) => {
    setSelectedPatient(patient)
    setSelectedPrescription(prescription)
    setIsModalOpen(true)
  }, [])

  const updateIssueStatus = useCallback(async (prescriptionId: string) => {
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
      fetchPatients()
    } catch (error) {
      console.error("Error updating issue status:", error)
    }
  }, [])

  const handleRemoveRedEyeClick = useCallback((patient: Patient, prescription: Prescription) => {
    setSelectedPatient(patient)
    setSelectedPrescription(prescription)
    setIsPreModalOpen(true)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Search query:", event.target.value) // Debugging log
    setSearchQuery(event.target.value)
  }

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [patients, searchQuery])

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

  const renderPrescriptionDetails = useCallback(
    (patient: Patient, prescription: Prescription) => {
      const procedureDetails = getProcedureDetails(prescription.code)
      return (
        <div
          key={prescription.id}
          className="mb-2 flex w-full items-center justify-between gap-3 rounded-lg border p-2"
        >
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
            <Suspense fallback={<div>Loading...</div>}>
              <AccountBalanceWalletIcon onClick={() => handleIconClick(patient, prescription)} />
              <RemoveRedEyeIcon
                className="text-[#46FFA6]"
                onClick={() => handleRemoveRedEyeClick(patient, prescription)}
              />
              <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => handleDeleteClick(prescription.id)} />
            </Suspense>
          </div>
        </div>
      )
    },
    [getProcedureDetails, formatDate, handleIconClick, handleRemoveRedEyeClick]
  )

  const renderPendingRequests = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        {filteredPatients.map((patient) =>
          patient.prescriptions
            .filter((prescription) => !prescription.issue_status)
            .sort((a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime())
            .map((prescription) => renderPrescriptionDetails(patient, prescription))
        )}
      </div>
    ),
    [filteredPatients, renderPrescriptionDetails]
  )

  const renderIssuedRequests = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        {filteredPatients.map((patient) =>
          patient.prescriptions
            .filter((prescription) => prescription.issue_status)
            .map((prescription) => renderPrescriptionDetails(patient, prescription))
        )}
      </div>
    ),
    [filteredPatients, renderPrescriptionDetails]
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
          <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" priority />
          <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" priority />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-transparent text-xs outline-none focus:outline-none"
          />
        </div>
        {activeTab === "pending" && renderPendingRequests}
        {activeTab === "issued" && renderIssuedRequests}
      </div>

      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" priority />
          <span className="clash-font text-sm text-[#0F920F]">Prescription Discarded</span>
        </div>
      )}
    </div>
  )
}

export default IssueRequest

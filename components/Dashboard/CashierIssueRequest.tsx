"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import IssueRequestModal from "components/Modals/IssueRequestModal"
import ViewPrescriptionModal from "components/Modals/ViewPrescriptionModal"
import DeleteTestModal from "components/Modals/DeleteTestModal"
import Image from "next/image"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"

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
  quantity: string
  down_payment: string
  note: string
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

const SkeletonLoader = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex w-full animate-pulse items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-700"
        >
          <div className="flex items-center gap-1 text-sm font-bold md:w-[20%]">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 max-sm:hidden"></div>
          </div>
          <div className="flex w-full items-center gap-1 text-sm font-bold">
            <div>
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-600"></div>
              <div className="mt-1 h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
            </div>
          </div>
          <div className="w-full max-md:hidden">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
            <div className="mt-1 h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
          </div>
          <div className="w-full max-md:hidden">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
            <div className="mt-1 h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
          </div>
          <div className="w-full">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
            <div className="mt-1 h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
          </div>
          <div className="w-full max-md:hidden">
            <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

const IssueRequest = () => {
  const [activeTab, setActiveTab] = useState("pending")
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [proceduresMap, setProceduresMap] = useState<Map<string, Procedure>>(new Map())
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "day"))
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreModalOpen, setIsPreModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const LOCAL_STORAGE_KEY_PREFIX = "cashierIssuePatients_"

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
    } catch (error) {
      console.error("Error deleting prescription:", error)
      alert("Failed to delete prescription.")
    }
  }

  const fetchPatients = async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true)
    }

    try {
      const start = startDate ? startDate.format("YYYY-MM-DD") : ""
      const end = endDate ? endDate.format("YYYY-MM-DD") : ""
      const response = await fetch(
        `https://api2.caregiverhospital.com/patient/filter/patient-with-prescription/${start}/${end}/prescription/`
      )
      const data = (await response.json()) as ApiResponse

      const newPatients = data.map((patient) => {
        const uniquePrescriptions = Array.from(new Map(patient.prescriptions.map((p) => [p.id, p])).values())
        return { ...patient, prescriptions: uniquePrescriptions }
      })

      setPatients(newPatients)

      const cacheKey = `${LOCAL_STORAGE_KEY_PREFIX}${start}_${end}`
      if (typeof window !== "undefined") {
        try {
          // Avoid exceeding localStorage quota by skipping very large payloads
          if (newPatients.length < 200) {
            localStorage.setItem(cacheKey, JSON.stringify(newPatients))
          } else {
            console.warn("Skipping patients cache due to large size:", newPatients.length)
          }
        } catch (e) {
          console.error("Failed to save patients to localStorage", e)
        }
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      if (!options?.silent) {
        setIsLoading(false)
      }
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
    const start = startDate ? startDate.format("YYYY-MM-DD") : ""
    const end = endDate ? endDate.format("YYYY-MM-DD") : ""
    const cacheKey = `${LOCAL_STORAGE_KEY_PREFIX}${start}_${end}`

    let hasCached = false

    if (typeof window !== "undefined") {
      console.log("Using cacheKey", cacheKey)
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as Patient[]
          console.log("Loaded from cache", parsed.length)
          setPatients(parsed)
          setIsLoading(false)
          hasCached = true
        } catch (e) {
          console.error("Failed to parse cached patients", e)
        }
      }
    }

    fetchPatients(hasCached ? { silent: true } : undefined)
    fetchProcedures()
  }, [refresh, startDate, endDate])

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

  const updateIssueStatus = async (prescriptionId: string) => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/prescription/prescription/${prescriptionId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue_status: true }),
      })
      if (!response.ok) throw new Error("Failed to update issue status")
      fetchPatients()
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

  const getPrescriptionsList = (filterFn: (prescription: Prescription) => boolean) => {
    return filteredPatients.flatMap((patient) =>
      patient.prescriptions.filter(filterFn).map((prescription) => ({ patient, prescription }))
    )
  }

  const getSortedPrescriptionsList = (filterFn: (prescription: Prescription) => boolean) => {
    return getPrescriptionsList(filterFn).sort(
      (a, b) => new Date(b.prescription.pub_date).getTime() - new Date(a.prescription.pub_date).getTime()
    )
  }

  const renderPrescriptionDetails = (patient: Patient, prescription: Prescription) => {
    const procedureDetails = getProcedureDetails(prescription.code)
    return (
      <div
        key={prescription.id}
        className="mb-2 flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-2 dark:border-gray-700"
      >
        <div className="flex w-full items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
            <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
          </div>
          <div>
            <p className="text-xs font-bold ">{patient.name}</p>
            <p className="text-xs ">Doctor: {prescription.doctor_name}</p>
            <p className="text-xs ">HMO ID: {patient.policy_id}</p>
          </div>
        </div>
        <div className="flex w-full flex-col max-sm:hidden">
          <p className="text-xs font-bold ">Procedure: {procedureDetails?.name}</p>
          <p className="text-xs font-medium ">Price: ₦{procedureDetails?.price}</p>
          <p className="text-xs font-medium ">Code: {procedureDetails?.code}</p>
        </div>
        <div className="w-full">
          <p className="text-xs font-bold ">{prescription.name}</p>
          <p className="text-xs ">₦{prescription.dosage}</p>
          <small className="text-xs ">Medicine Name</small>
        </div>
        <div className="w-full max-sm:hidden">
          <div className="flex gap-1 text-xs font-bold ">{prescription.category}</div>
          <small className="text-xs ">Category Name</small>
        </div>
        <div className="w-full max-sm:hidden">
          <div className="flex gap-1 text-xs font-bold ">{prescription.unit}</div>
          <small className="text-xs ">Unit</small>
        </div>
        <div className="w-full max-sm:hidden">
          <p className="text-xs font-bold ">{formatDate(prescription?.pub_date || "")}</p>
          <small className="text-xs ">Date and Time</small>
        </div>
        <div className="flex w-full justify-end gap-2">
          <AccountBalanceWalletIcon
            className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
            onClick={() => handleIconClick(patient, prescription)}
          />
        </div>
      </div>
    )
  }

  const renderPendingRequests = () => {
    const pendingPrescriptions = getSortedPrescriptionsList((prescription) => !prescription.issue_status)

    if (isLoading && patients.length === 0) {
      return <SkeletonLoader count={3} />
    }

    if (pendingPrescriptions.length === 0) {
      return <div className="text-center ">No pending prescriptions found</div>
    }

    return (
      <div className="flex flex-col gap-2">
        {pendingPrescriptions.map(({ patient, prescription }) => renderPrescriptionDetails(patient, prescription))}
      </div>
    )
  }

  const renderIssuedRequests = () => {
    const issuedPrescriptions = getSortedPrescriptionsList((prescription) => prescription.issue_status)

    if (isLoading && patients.length === 0) {
      return <SkeletonLoader count={3} />
    }

    if (issuedPrescriptions.length === 0) {
      return <div className="text-center ">No issued prescriptions found</div>
    }

    return (
      <div className="flex flex-col gap-2">
        {issuedPrescriptions.map(({ patient, prescription }) => renderPrescriptionDetails(patient, prescription))}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col  gap-4 md:justify-between">
        <div className="tab-bg mb-4 flex w-[160px] items-center gap-3 rounded-lg border border-gray-200 p-1 dark:border-gray-700">
          <button
            className={`${
              activeTab === "pending"
                ? "active-tab bg-blue-500 text-white"
                : "inactive-tab text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`${
              activeTab === "issued"
                ? "active-tab bg-blue-500 text-white"
                : "inactive-tab text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("issued")}
          >
            Issued
          </button>
        </div>

        <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="search-bg flex h-10 items-center justify-between gap-2 rounded border border-gray-300 bg-white px-3 py-1  max-md:w-[180px] lg:w-[300px]">
            <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="search" />
            <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="search" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-transparent text-xs  outline-none focus:outline-none dark:text-white"
            />
          </div>
          <div className="bg-white p-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  maxDate={endDate || undefined}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDate={startDate || undefined}
                />
              </div>
            </LocalizationProvider>
          </div>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "pending" && renderPendingRequests()}
        {activeTab === "issued" && renderIssuedRequests()}
      </div>

      <IssueRequestModal
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
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5 flex h-[50px] w-[339px] items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="success" />
          <span className="text-sm text-[#0F920F]">Prescription Discarded</span>
        </div>
      )}
    </div>
  )
}

export default IssueRequest

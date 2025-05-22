"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import Image from "next/image"
import PaymentStatusModal from "components/Modals/PaymentStatusModal"
import IssueRequestModal from "components/Modals/IssueRequestModal"
import ViewPrescriptionModal from "components/Modals/ViewPrescriptionModal"
import DeleteTestModal from "components/Modals/DeleteTestModal"
import { toast, Toaster } from "sonner"
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

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
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
            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600"></div>
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
  const [isLoading, setIsLoading] = useState(false)
  const [proceduresMap, setProceduresMap] = useState<Map<string, Procedure>>(new Map())
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "day"))
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreModalOpen, setIsPreModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)

  const fetchPatients = async () => {
    setIsLoading(true)
    try {
      const start = startDate ? startDate.format("YYYY-MM-DD") : ""
      const end = endDate ? endDate.format("YYYY-MM-DD") : ""
      const response = await fetch(
        `https://api2.caregiverhospital.com/patient/filter/patient-with-prescription/${start}/${end}/prescription/`
      )
      const data = (await response.json()) as ApiResponse

      // Process patients and remove duplicate prescriptions for each patient
      const processedPatients = data.map((patient) => {
        const prescriptionMap = new Map<string, Prescription>()
        patient.prescriptions.forEach((p) => {
          if (!prescriptionMap.has(p.id)) {
            prescriptionMap.set(p.id, p)
          }
        })

        const uniquePrescriptions = Array.from(prescriptionMap.values()).sort(
          (a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime()
        )

        return {
          ...patient,
          prescriptions: uniquePrescriptions,
        }
      })

      setPatients(processedPatients)
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
  }, [startDate, endDate])

  const handleDeleteClick = (id: string) => {
    setSelectedPrescriptionId(id)
    setIsDeleteModalOpen(true)
  }

  const deletePrescription = async () => {
    if (!selectedPrescriptionId) return
    try {
      await axios.delete(`https://api2.caregiverhospital.com/prescription/prescription/${selectedPrescriptionId}/`)
      toast.success("Prescription Discarded", {
        description: "The prescription has been successfully deleted.",
        duration: 5000,
        action: {
          label: "Close",
          onClick: () => {},
        },
      })
      setPatients((prevPatients) =>
        prevPatients.map((patient) => ({
          ...patient,
          prescriptions: patient.prescriptions.filter((p) => p.id !== selectedPrescriptionId),
        }))
      )
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting prescription:", error)
      toast.error("Deletion Failed", {
        description: "Failed to delete the prescription. Please try again.",
        duration: 5000,
        action: {
          label: "Close",
          onClick: () => {},
        },
      })
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

  const getProcedureDetails = (procedureName: string) => proceduresMap.get(procedureName)

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

  const handleIconClick = (patient: Patient, prescription: Prescription) => {
    setSelectedPatient(patient)
    setSelectedPrescription(prescription)
    setIsModalOpen(true)
  }

  const handleRemoveRedEyeClick = (patient: Patient, prescription: Prescription) => {
    setSelectedPatient(patient)
    setSelectedPrescription(prescription)
    setIsPreModalOpen(true)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.membership_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.policy_id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [patients, searchQuery])

  const getSortedPrescriptionsList = (filterFn: (prescription: Prescription) => boolean) => {
    const prescriptionsMap = new Map<string, { patient: Patient; prescription: Prescription }>()
    filteredPatients.forEach((patient) => {
      patient.prescriptions.filter(filterFn).forEach((prescription) => {
        const key = `${patient.id}-${prescription.id}`
        if (!prescriptionsMap.has(key)) {
          prescriptionsMap.set(key, { patient, prescription })
        }
      })
    })
    return Array.from(prescriptionsMap.values()).sort(
      (a, b) => new Date(b.prescription.pub_date).getTime() - new Date(a.prescription.pub_date).getTime()
    )
  }

  const renderPrescriptionDetails = (patient: Patient, prescription: Prescription) => {
    const procedureDetails = getProcedureDetails(prescription.code)
    return (
      <div
        key={`${patient.id}-${prescription.id}`}
        className="mb-2 flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-2 dark:border-gray-700"
      >
        <div className="flex w-full items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
            <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
          </div>
          <div>
            <p className="text-xs font-bold ">
              {patient.name} - ({calculateAge(patient.dob)}yrs)
            </p>
            <p className="text-xs ">Doctor: {prescription.doctor_name}</p>
            <p className="text-xs ">HMO ID: {patient.policy_id}</p>
          </div>
        </div>
        <div className="flex w-full flex-col max-sm:hidden">
          <p className="text-xs font-bold ">Procedure: {procedureDetails?.name}</p>
          <p className="text-xs font-medium ">Price: ₦{procedureDetails?.price}</p>
          <p className="text-xs font-medium ">Code: {procedureDetails?.code}</p>
        </div>
        <div className="flex w-full flex-col">
          <p className="text-xs font-bold ">{prescription.name}</p>
          <p className="text-xs ">₦{prescription.dosage}</p>
          <small className="text-xs ">Medicine Name</small>
        </div>
        <div className="flex w-full flex-col max-sm:hidden">
          <div className="flex gap-1 text-xs font-bold ">{prescription.category}</div>
          <small className="text-xs ">Category Name</small>
        </div>
        <div className="flex w-full flex-col max-sm:hidden">
          <div className="flex gap-1 text-xs font-bold ">{prescription.unit}</div>
          <small className="text-xs ">Unit</small>
        </div>
        <div className="flex w-full flex-col max-sm:hidden">
          <p className="text-xs font-bold ">{formatDate(prescription.pub_date)}</p>
          <small className="text-xs ">Date and Time</small>
        </div>
        <div className="flex w-full justify-end gap-2">
          <AccountBalanceWalletIcon
            className="cursor-pointer text-gray-500 hover:text-blue-500  dark:hover:text-blue-400"
            onClick={() => handleIconClick(patient, prescription)}
          />
          <RemoveRedEyeIcon
            className="cursor-pointer text-gray-500 hover:text-[#46FFA6]  dark:hover:text-[#46FFA6]"
            onClick={() => handleRemoveRedEyeClick(patient, prescription)}
          />
          <DeleteForeverIcon
            className="cursor-pointer text-gray-500 hover:text-[#F2B8B5]  dark:hover:text-[#F2B8B5]"
            onClick={() => handleDeleteClick(prescription.id)}
          />
        </div>
      </div>
    )
  }

  const renderPendingRequests = () => {
    const pendingPrescriptions = getSortedPrescriptionsList((prescription) => !prescription.issue_status)
    return (
      <div className="flex flex-col gap-2">
        {pendingPrescriptions.length > 0 ? (
          pendingPrescriptions.map(({ patient, prescription }) => renderPrescriptionDetails(patient, prescription))
        ) : (
          <div className="flex items-center justify-center p-4">
            <p className="">No pending prescriptions found</p>
          </div>
        )}
      </div>
    )
  }

  const renderIssuedRequests = () => {
    const issuedPrescriptions = getSortedPrescriptionsList((prescription) => prescription.issue_status)
    return (
      <div className="flex flex-col gap-2">
        {issuedPrescriptions.length > 0 ? (
          issuedPrescriptions.map(({ patient, prescription }) => renderPrescriptionDetails(patient, prescription))
        ) : (
          <div className="flex items-center justify-center p-4">
            <p className="">No issued prescriptions found</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <Toaster position="top-center" richColors />

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
          <div className="search-bg flex h-10 items-center justify-between gap-2 rounded border border-gray-300 bg-white px-3 py-1 dark:border-gray-600 dark:bg-gray-700 max-md:w-[180px] lg:w-[300px]">
            <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="search" />
            <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="search" />
            <input
              type="text"
              placeholder="Search by name, membership or policy ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-transparent text-xs text-gray-900 outline-none focus:outline-none dark:text-white"
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

      {isLoading && patients.length === 0 ? (
        <SkeletonLoader />
      ) : (
        <>
          {activeTab === "pending" && renderPendingRequests()}
          {activeTab === "issued" && renderIssuedRequests()}
        </>
      )}

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
    </div>
  )
}

export default IssueRequest

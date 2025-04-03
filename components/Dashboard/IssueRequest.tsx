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
        <div key={index} className="sidebar flex w-full items-center justify-between rounded-lg border p-2">
          <div className="flex items-center gap-1 text-sm font-bold md:w-[20%]">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 max-sm:hidden"></div>
          </div>
          <div className="flex w-full items-center gap-1 text-sm font-bold">
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="w-full max-md:hidden">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="w-full max-md:hidden">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="w-full">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="w-full max-md:hidden">
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
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
  const [offset, setOffset] = useState(0)
  const limit = 500
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreModalOpen, setIsPreModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)

  const fetchPatientsPage = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `https://api2.caregiverhospital.com/patient/patient-with-prescription/${offset}/${offset + limit}/prescription/`
      )
      const data = (await response.json()) as ApiResponse

      if (data.length === 0) {
        setHasMore(false)
      } else {
        // Create a set of existing patient IDs to avoid duplicates
        const existingPatientIds = new Set(patients.map((p) => p.id))

        // Process new patients and remove duplicate prescriptions for each patient
        const newPatients = data.reduce((acc: Patient[], patient) => {
          if (existingPatientIds.has(patient.id)) return acc

          const prescriptionMap = new Map<string, Prescription>()
          patient.prescriptions.forEach((p) => {
            if (!prescriptionMap.has(p.id)) {
              prescriptionMap.set(p.id, p)
            }
          })

          const uniquePrescriptions = Array.from(prescriptionMap.values()).sort(
            (a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime()
          )

          acc.push({
            ...patient,
            prescriptions: uniquePrescriptions,
          })
          return acc
        }, [])

        setPatients((prev) => [...prev, ...newPatients])
        setOffset((prev) => prev + limit)
      }
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
    fetchPatientsPage()
    fetchProcedures()
  }, [])

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

  // Build a list of prescription items without duplicates based on patient and prescription IDs
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
        className="sidebar mb-2 flex w-full items-center justify-between gap-3 rounded-lg border p-2"
      >
        <div className="flex  w-full items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
            <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
          </div>
          <div>
            <p className="text-xs font-bold">
              {patient.name} - ({calculateAge(patient.dob)}yrs)
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
        <div className="flex w-full flex-col">
          <p className="text-xs font-bold">{prescription.name}</p>
          <p className="text-xs">₦{prescription.dosage}</p>
          <small className="text-xs">Medicine Name</small>
        </div>
        <div className="flex w-full flex-col max-sm:hidden">
          <div className="flex gap-1 text-xs font-bold">{prescription.category}</div>
          <small className="text-xs">Category Name</small>
        </div>
        <div className="flex w-full flex-col max-sm:hidden">
          <div className="flex gap-1 text-xs font-bold">{prescription.unit}</div>
          <small className="text-xs">Unit</small>
        </div>
        <div className="flex w-full flex-col max-sm:hidden">
          <p className="text-xs font-bold">{formatDate(prescription.pub_date)}</p>
          <small className="text-xs">Date and Time</small>
        </div>
        <div className="flex w-full justify-end gap-2">
          <AccountBalanceWalletIcon
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleIconClick(patient, prescription)}
          />
          <RemoveRedEyeIcon
            className="cursor-pointer text-[#46FFA6] hover:text-green-700"
            onClick={() => handleRemoveRedEyeClick(patient, prescription)}
          />
          <DeleteForeverIcon
            className="cursor-pointer text-[#F2B8B5] hover:text-red-700"
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
            <p className="text-gray-500">No pending prescriptions found</p>
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
            <p className="text-gray-500">No issued prescriptions found</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <Toaster position="top-center" richColors />

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
            placeholder="Search by name, membership or policy ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-transparent text-xs outline-none focus:outline-none"
          />
        </div>
        {isLoading && patients.length === 0 ? (
          <SkeletonLoader />
        ) : (
          <>
            {activeTab === "pending" && renderPendingRequests()}
            {activeTab === "issued" && renderIssuedRequests()}
          </>
        )}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
            onClick={fetchPatientsPage}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Loading...
              </div>
            ) : (
              "Load More Patients"
            )}
          </button>
        </div>
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

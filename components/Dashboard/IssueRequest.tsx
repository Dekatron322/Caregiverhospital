"use client"
import React, { useEffect, useState } from "react"
import { Request } from "utils"
import Image from "next/image"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"
import AOS from "aos"
import "aos/dist/aos.css"

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
  status: string
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

type ApiResponse = Patient[]

const IssueRequest = () => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("pending")
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const toggleDone = () => {
    setIsDone(!isDone)
  }

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

  useEffect(() => {
    fetchPatients()
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

  const renderPrescriptionDetails = (patient: Patient, prescription: Prescription) => {
    return (
      <div key={prescription.id} className="mb-2 flex w-full items-center justify-between rounded-lg border p-2">
        <div className="flex w-full items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
            <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
          </div>
          <div>
            <p className="text-sm font-bold">{patient.name}</p>
            <p className="text-xs">Patient Name</p>
          </div>
        </div>
        <div className="w-full">
          <p className="text-sm font-bold">{prescription.name}</p>
          <small className="text-xs">Medicine Name</small>
        </div>
        <div className="w-full max-sm:hidden">
          <p className="text-sm font-bold">{prescription.id}</p>
          <small className="text-xs">Medicine ID</small>
        </div>
        <div className="w-full max-sm:hidden">
          <div className="flex gap-1 text-sm font-bold">{prescription.category}</div>
          <small className="text-xs">Category Name</small>
        </div>
        <div className="w-full max-sm:hidden">
          <p className="text-sm font-bold">{formatDate(prescription.pub_date)}</p>
          <small className="text-xs">Date and Time</small>
        </div>
        <div className="w-full max-sm:hidden">
          <p className="rounded py-[2px] text-xs">{prescription.doctor_name}</p>
          <small className="text-xs">Request by</small>
        </div>
        <div className="max-md:hidden">
          <PiDotsThree />
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
    </div>
  )
}

export default IssueRequest

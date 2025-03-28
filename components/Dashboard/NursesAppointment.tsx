"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import { useRouter } from "next/navigation"
import DeleteTestModal from "components/Modals/DeleteTestModal"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"

interface Appointment {
  id: any
  doctor: string
  detail: string
  pub_date: string
  status: boolean
  patient_id: any
  patient_name: string
  time: string
  complain: string
}

const NursesAppointments = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLabTestId, setSelectedLabTestId] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showPaymentSuccessNotification, setShowPaymentSuccessNotification] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleAppointmentClick = (appointmentId: number) => {
    localStorage.setItem("selectedAppointmentId", appointmentId.toString())
    router.push(`/pharmacy-appointments/appointments/`)
  }

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/appointment/all/0/100/`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as Appointment[]

      console.log("API Response Data:", data) // Log the response to check its structure

      setAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [refresh])

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedAppointmentId")
    if (storedPatientId) {
      fetchPatientDetails(storedPatientId)
    } else {
      console.error("No patient ID found in localStorage")
    }
  }, [])

  const fetchPatientDetails = async (patientId: string) => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient details")
      }
      const data = await response.json()
      // Handle the data here
    } catch (error) {
      console.error("Error fetching patient details:", error)
    }
  }

  const handleDeleteClick = (id: string) => {
    setSelectedLabTestId(id)
    setIsDeleteModalOpen(true)
  }

  const deleteLabTest = async () => {
    if (!selectedLabTestId) return

    try {
      await axios.delete(`https://api2.caregiverhospital.com/appointment/appointment/${selectedLabTestId}/`)
      setShowSuccessNotification(true)
      setRefresh(!refresh) // Refresh the data after deletion
      setTimeout(() => setShowSuccessNotification(false), 5000)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting lab test:", error)
      alert("Failed to delete lab test.")
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

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderAppointmentDetails = (appointment: Appointment) => (
    <div key={appointment.id} className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2">
      <div className="flex w-full items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
          <p className="capitalize text-[#000000]">{appointment.patient_name.charAt(0)}</p>
        </div>
        <div>
          <p className="text-sm font-bold">{appointment.patient_name}</p>
          <p className="text-xs">Patient Name</p>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <p className="text-sm font-bold">{appointment.doctor}</p>
        <p className="text-xs">Doctor Assigned</p>
      </div>
      <div className="flex w-full flex-col max-md:hidden">
        <p className="text-sm font-bold">{formatDate(appointment.pub_date)}</p>
        <p className="text-xs">Last Appointment</p>
      </div>
      <div className="md:flex md:w-full md:flex-col md:items-center">
        <p className="rounded bg-[#46FFA6] px-2 py-[2px] text-center text-xs font-bold text-black">
          {appointment.detail}
        </p>
        <p className="text-xs">Complain</p>
      </div>

      <div className="flex gap-2 max-md:hidden">
        <RemoveRedEyeIcon className="text-[#46FFA6]" onClick={() => handleAppointmentClick(appointment.patient_id)} />
        <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => handleDeleteClick(appointment.id)} />
      </div>
    </div>
  )

  const renderAllAppointments = () => (
    <div className="flex flex-col gap-2">
      {filteredAppointments.map((appointment) => renderAppointmentDetails(appointment))}
    </div>
  )

  const renderPendingAppointments = () => (
    <div className="flex flex-col gap-2">
      {filteredAppointments
        .filter((appointment) => appointment.status === true)
        .map((appointment) => renderAppointmentDetails(appointment))}
    </div>
  )

  const renderDoneAppointments = () => (
    <div className="flex flex-col gap-2">
      {filteredAppointments
        .filter((appointment) => appointment.status === false)
        .map((appointment) => renderAppointmentDetails(appointment))}
    </div>
  )

  return (
    <div className="flex w-full flex-col">
      {isLoading ? (
        <div className="loading-text flex h-full items-center justify-center">
          {"loading...".split("").map((letter, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              {letter}
            </span>
          ))}
        </div>
      ) : (
        <>
          <div className="tab-bg mb-8 flex w-[190px] items-center gap-3 rounded-lg p-1 md:border">
            <button
              className={`${activeTab === "all" ? "active-tab" : "inactive-tab"}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`${activeTab === "pending" ? "active-tab" : "inactive-tab"}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
            <button
              className={`${activeTab === "done" ? "active-tab" : "inactive-tab"}`}
              onClick={() => setActiveTab("done")}
            >
              Done
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bg mb-4 w-full rounded-lg border p-2 md:w-[300px]"
          />

          {activeTab === "all" && renderAllAppointments()}
          {activeTab === "pending" && renderPendingAppointments()}
          {activeTab === "done" && renderDoneAppointments()}
        </>
      )}
      {isDeleteModalOpen && (
        <DeleteTestModal
          title="Confirm Delete"
          description="Are you sure you want to discard this Appointment? This action cannot be undone."
          onConfirm={deleteLabTest}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  )
}

export default NursesAppointments

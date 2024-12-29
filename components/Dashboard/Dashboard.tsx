"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import DeleteTestModal from "components/Modals/DeleteTestModal"

interface Appointment {
  id: any
  doctor: string
  detail: string
  pub_date: string
  status: string
  patient_name: string // This is the name of the patient from the appointment
  time: string
  complain: string
}

const Appointments = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLabTestId, setSelectedLabTestId] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showPaymentSuccessNotification, setShowPaymentSuccessNotification] = useState(false)

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

  const toggleDone = (appointmentId: number) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: appointment.status === "done" ? "pending" : "done" }
          : appointment
      )
    )
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

  const renderAppointmentDetails = (appointment: Appointment) => {
    const displayName =
      appointment.patient_name && appointment.patient_name.trim() ? appointment.patient_name : "Unknown Patient"
    const initialLetter = displayName !== "Unknown Patient" ? displayName.charAt(0) : "?"

    return (
      <div
        key={appointment.id}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
      >
        <div className="flex w-full items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
            <p className="capitalize text-[#000000]">{initialLetter}</p>
          </div>
          <div>
            <p className="text-sm font-bold">{displayName}</p>
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
        <div className="flex gap-2">
          <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => handleDeleteClick(appointment.id)} />
        </div>
      </div>
    )
  }

  const renderAllAppointments = () => (
    <div className="flex flex-col gap-2">
      {appointments.map((appointment) => renderAppointmentDetails(appointment))}
    </div>
  )

  const renderPendingAppointments = () => (
    <div className="flex flex-col gap-2">
      {appointments
        .filter((appointment) => appointment.status !== "done")
        .map((appointment) => renderAppointmentDetails(appointment))}
    </div>
  )

  const renderDoneAppointments = () => (
    <div className="flex flex-col gap-2">
      {appointments
        .filter((appointment) => appointment.status === "done")
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

export default Appointments

"use client"
import React, { useEffect, useState } from "react"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import { TiEdit } from "react-icons/ti"
import { useRouter } from "next/navigation"
import styles from "../../components/Modals/modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

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

const DoctorsAppointments = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null)

  const handleAppointmentClick = (appointmentId: number) => {
    localStorage.setItem("selectedAppointmentId", appointmentId.toString())
    router.push(`/doctor-dashboard/doctor/`)
  }

  const handleEditClick = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId)
    setIsModalVisible(true)
  }

  const handleConfirmUpdate = async () => {
    if (selectedAppointmentId !== null) {
      try {
        const response = await fetch(
          `https://api2.caregiverhospital.com/appointment/update-appointment-status/${selectedAppointmentId}/`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: false }), // Updated payload
          }
        )
        if (!response.ok) {
          throw new Error("Failed to update appointment status")
        }
        // Optionally refresh the appointments list
        fetchAppointments()
        setIsModalVisible(false)
      } catch (error) {
        console.error("Error updating appointment status:", error)
      }
    }
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
  }, [])

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

      <div className="flex items-center gap-2">
        <RemoveRedEyeIcon onClick={() => handleAppointmentClick(appointment.patient_id)} />
        <TiEdit className="text-lg" onClick={() => handleEditClick(appointment.id)} />
      </div>
    </div>
  )

  const renderAllAppointments = () => (
    <div className="flex flex-col gap-2">
      {appointments.map((appointment) => renderAppointmentDetails(appointment))}
    </div>
  )

  const renderPendingAppointments = () => (
    <div className="flex flex-col gap-2">
      {appointments
        .filter((appointment) => appointment.status === true)
        .map((appointment) => renderAppointmentDetails(appointment))}
    </div>
  )

  const renderDoneAppointments = () => (
    <div className="flex flex-col gap-2">
      {appointments
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

          {activeTab === "all" && renderAllAppointments()}
          {activeTab === "pending" && renderPendingAppointments()}
          {activeTab === "done" && renderDoneAppointments()}
        </>
      )}
      {isModalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModalContent}>
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Confirm Deletion</h2>
                <div className="border-black  hover:rounded-md hover:border">
                  <LiaTimesSolid className="m-1 cursor-pointer" onClick={() => setIsModalVisible(false)} />
                </div>
              </div>
              <p>Mark appointment as done?</p>
              <div className="mt-3 flex w-full gap-5">
                <button
                  onClick={handleConfirmUpdate}
                  className="button-secondary h-[50px] w-full rounded-sm max-sm:h-[45px]"
                >
                  Yes, mark
                </button>
                <button
                  className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]"
                  onClick={() => setIsModalVisible(false)}
                >
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorsAppointments

"use client" // Mark this as a client component

import React, { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import DeleteTestModal from "components/Modals/DeleteTestModal"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import Image from "next/image"

interface Appointment {
  id: string
  doctor: string
  detail: string
  pub_date: string
  status: boolean
  patient_id: string
  patient_name: string
  time: string
  complain: string
}

const Appointments = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "done">("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLabTestId, setSelectedLabTestId] = useState<string | null>(null)
  const [notification, setNotification] = useState<"success" | "payment" | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`https://api2.caregiverhospital.com/appointment/all/0/100/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = (await response.json()) as Appointment[]
        setAppointments(data)
      } catch (error: any) {
        if (error.name !== "AbortError") console.error("Error fetching appointments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
    return () => controller.abort() // Cleanup fetch on unmount
  }, [])

  const handleAppointmentClick = useCallback(
    (appointmentId: string) => {
      localStorage.setItem("selectedAppointmentId", appointmentId)
      router.push(`/appointments/appointment-detail/`)
    },
    [router]
  )

  const handleDeleteClick = useCallback((id: string) => {
    setSelectedLabTestId(id)
    setIsDeleteModalOpen(true)
  }, [])

  const deleteLabTest = async () => {
    if (!selectedLabTestId) return

    try {
      await axios.delete(`https://api2.caregiverhospital.com/appointment/appointment/${selectedLabTestId}/`)
      setAppointments((prev) => prev.filter((appt) => appt.id !== selectedLabTestId))
      setNotification("success")
      setTimeout(() => setNotification(null), 5000)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting lab test:", error)
      alert("Failed to delete lab test.")
    }
  }

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((appointment) => appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase())),
    [appointments, searchTerm]
  )

  const renderAppointmentDetails = useCallback(
    (appointment: Appointment) => {
      const displayName = appointment.patient_name.trim() || "Unknown Patient"
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
            <p className="text-sm font-bold">{new Date(appointment.pub_date).toLocaleDateString()}</p>
            <p className="text-xs">Last Appointment</p>
          </div>
          <div className="md:flex md:w-full md:flex-col md:items-center">
            <p className="rounded bg-[#46FFA6] px-2 py-[2px] text-center text-xs font-bold text-black">
              {appointment.detail}
            </p>
            <p className="text-xs">Complain</p>
          </div>
          <div className="flex gap-2">
            <RemoveRedEyeIcon
              className="text-[#46FFA6]"
              onClick={() => handleAppointmentClick(appointment.patient_id)}
            />
            <div className="flex cursor-pointer items-center gap-2" onClick={() => handleDeleteClick(appointment.id)}>
              <Image src="/Frame.png" alt="" height={24} width={24} />
            </div>
          </div>
        </div>
      )
    },
    [handleAppointmentClick, handleDeleteClick]
  )

  const renderAppointments = useMemo(() => {
    const filtered =
      activeTab === "all"
        ? filteredAppointments
        : filteredAppointments.filter((appt) => (activeTab === "pending" ? appt.status : !appt.status))

    return <div className="flex flex-col gap-2">{filtered.map(renderAppointmentDetails)}</div>
  }, [activeTab, filteredAppointments, renderAppointmentDetails])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <div className="flex-grow ">
        {isLoading ? (
          // Loading state with animate-pulse
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex w-full items-center justify-between rounded-lg border p-2">
                <div className="flex w-full items-center gap-2">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 max-md:hidden"></div>
                  <div>
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="flex w-full flex-col">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="flex w-full flex-col max-md:hidden">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="md:flex md:w-full md:flex-col md:items-center">
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200"></div>
                  <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                  <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="tab-bg mb-8 flex w-[190px] flex-col items-start gap-3 rounded-lg p-1 md:flex-row md:items-start md:border">
              <div className="flex gap-3 md:flex-row md:items-center">
                {["all", "pending", "done"].map((tab) => (
                  <button
                    key={tab}
                    className={activeTab === tab ? "active-tab" : "inactive-tab"}
                    onClick={() => setActiveTab(tab as "all" | "pending" | "done")}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bg mb-4 w-full rounded-lg border p-2 md:w-[300px]"
            />

            {renderAppointments}
          </>
        )}
      </div>

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

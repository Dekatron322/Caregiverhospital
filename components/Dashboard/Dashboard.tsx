"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import DeleteTestModal from "components/Modals/DeleteTestModal"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"

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
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "day"))
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())

  useEffect(() => {
    const controller = new AbortController()

    const fetchAppointments = async () => {
      try {
        const start = startDate ? startDate.format("YYYY-MM-DD") : ""
        const end = endDate ? endDate.format("YYYY-MM-DD") : ""

        const url = `https://api2.caregiverhospital.com/appointment/all/${start}/${end}/`
        const response = await fetch(url, {
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
  }, [startDate, endDate])

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
          className="sidebar flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
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
            <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => handleDeleteClick(appointment.id)} />
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
    <div className="flex w-full flex-col">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {/* Skeleton Loading for Tabs */}
          <div className="sidebar mb-8 flex w-[190px] flex-col items-start gap-3 rounded-lg p-1 md:flex-row md:items-start md:border">
            <div className="flex gap-3 md:flex-row md:items-center">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
              ))}
            </div>
          </div>

          {/* Skeleton Loading for Search Bar */}
          <div className="search-bg mb-4 h-8 w-full rounded-lg border p-2 md:w-[300px]">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          </div>

          {/* Skeleton Loading for Appointments */}
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="sidebar flex w-full items-center justify-between rounded-lg border p-2">
                <div className="flex w-full items-center gap-2">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="flex w-full flex-col gap-1 max-md:hidden">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="sidebar mb-8 flex w-[190px] flex-col items-start gap-3 rounded-lg p-1 md:flex-row md:items-start md:border">
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

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bg mb-4 w-full rounded-lg border p-2 md:w-[300px]"
            />
            <div className="bg-white p-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    maxDate={endDate || undefined}
                    className="w-full"
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    minDate={startDate || undefined}
                    className="w-full"
                  />
                </div>
              </LocalizationProvider>
            </div>
          </div>

          {renderAppointments}
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

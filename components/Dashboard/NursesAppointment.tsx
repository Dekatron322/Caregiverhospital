"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import { useRouter } from "next/navigation"
import DeleteTestModal from "components/Modals/DeleteTestModal"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"

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
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "done">("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLabTestId, setSelectedLabTestId] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "day"))
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())

  const handleAppointmentClick = (appointmentId: number) => {
    localStorage.setItem("selectedAppointmentId", appointmentId.toString())
    router.push(`/pharmacy-appointments/appointments/`)
  }

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const start = startDate ? startDate.format("YYYY-MM-DD") : ""
      const end = endDate ? endDate.format("YYYY-MM-DD") : ""
      const response = await fetch(`https://api2.caregiverhospital.com/appointment/all/${start}/${end}/`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = (await response.json()) as Appointment[]
      setAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [startDate, endDate])

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedAppointmentId")
    if (storedPatientId) {
      fetchPatientDetails(storedPatientId)
    }
  }, [])

  const fetchPatientDetails = async (patientId: string) => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
      if (!response.ok) throw new Error("Failed to fetch patient details")
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
      fetchAppointments() // Refresh the data after deletion
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
    <div
      key={appointment.id}
      className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-700"
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
          <p className="capitalize text-[#000000]">{appointment.patient_name.charAt(0)}</p>
        </div>
        <div>
          <p className="text-sm font-bold ">{appointment.patient_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Patient Name</p>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <p className="text-sm font-bold ">{appointment.doctor}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Doctor Assigned</p>
      </div>
      <div className="flex w-full flex-col max-md:hidden">
        <p className="text-sm font-bold ">{formatDate(appointment.pub_date)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Last Appointment</p>
      </div>
      <div className="md:flex md:w-full md:flex-col md:items-center">
        <p className="rounded bg-[#46FFA6] px-2 py-[2px] text-center text-xs font-bold text-black">
          {appointment.detail}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Complain</p>
      </div>

      <div className="flex gap-2 max-md:hidden">
        <RemoveRedEyeIcon
          className=" hover:text-[#46ffa6] dark:text-gray-400 dark:hover:text-[#46ffa6]"
          onClick={() => handleAppointmentClick(appointment.patient_id)}
        />
        {/* <DeleteForeverIcon
          className=" hover:text-[#F2B8B5]  dark:hover:text-[#F2B8B5]"
          onClick={() => handleDeleteClick(appointment.id)}
        /> */}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="tab-bg mb-4 flex w-[190px] items-center gap-3 rounded-lg border border-gray-200 p-1 dark:border-gray-700">
            <button
              className={`${activeTab === "all" ? "active-tab " : "inactive-tab "}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`${activeTab === "pending" ? "active-tab " : "inactive-tab "}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
            <button
              className={`${activeTab === "done" ? "active-tab " : "inactive-tab "}`}
              onClick={() => setActiveTab("done")}
            >
              Done
            </button>
          </div>
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
              <input
                type="text"
                placeholder="Search by patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300  p-2  focus:border-blue-500 focus:ring-blue-500    md:w-[300px]"
              />
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

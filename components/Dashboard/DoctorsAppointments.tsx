"use client"

import React, { useEffect, useState } from "react"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import { TiEdit } from "react-icons/ti"
import { useRouter } from "next/navigation"
import styles from "../../components/Modals/modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
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

const DoctorsAppointments: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "done">("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "day"))
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())

  // Handlers
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
            body: JSON.stringify({ status: false }),
          }
        )
        if (!response.ok) throw new Error("Failed to update appointment status")
        fetchAppointments()
        setIsModalVisible(false)
      } catch (error) {
        console.error("Error updating appointment status:", error)
      }
    }
  }

  // Fetch functions
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
    if (storedPatientId) fetchPatientDetails(storedPatientId)
  }, [])

  const fetchPatientDetails = async (patientId: string) => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
      if (!response.ok) throw new Error("Failed to fetch patient details")
      const data = await response.json()
      // handle data
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

  // Filtered lists
  const filteredAppointments = appointments.filter((appt) =>
    appt.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredPending = filteredAppointments.filter((appt) => appt.status)
  const filteredDone = filteredAppointments.filter((appt) => !appt.status)

  // Render functions
  const renderAppointmentDetails = (appointment: Appointment) => (
    <div
      key={appointment.id}
      className="sidebar flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-700"
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
        <p className="text-sm font-bold">{formatDate(appointment.pub_date)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Last Appointment</p>
      </div>
      <div className="md:flex md:w-full md:flex-col md:items-center">
        <p className="rounded bg-[#46FFA6] px-2 py-[2px] text-center text-xs font-bold text-black">
          {appointment.detail}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Complain</p>
      </div>
      <div className="flex items-center gap-2">
        <RemoveRedEyeIcon
          className=" hover:text-[#46ffa6] "
          onClick={() => handleAppointmentClick(appointment.patient_id)}
        />
        <TiEdit className="text-lg  hover:text-[#46ffa6] " onClick={() => handleEditClick(appointment.id)} />
      </div>
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
                  <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="tab-bg mb-8 flex w-[190px] items-center gap-3 rounded-lg border border-gray-200 p-1 dark:border-gray-700">
            <button
              className={`${
                activeTab === "all"
                  ? "active-tab bg-blue-500 text-white"
                  : "inactive-tab text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
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
                activeTab === "done"
                  ? "active-tab bg-blue-500 text-white"
                  : "inactive-tab text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("done")}
            >
              Done
            </button>
          </div>
          {/* Search and Date Filter */}
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
            <div className="search-bg w-full md:w-[300px]">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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

          <div className="mb-3 flex flex-col gap-2">
            {activeTab === "all" && filteredAppointments.map(renderAppointmentDetails)}
            {activeTab === "pending" && filteredPending.map(renderAppointmentDetails)}
            {activeTab === "done" && filteredDone.map(renderAppointmentDetails)}
          </div>
        </>
      )}

      {isModalVisible && (
        <div className={`${styles.modalOverlay} bg-black bg-opacity-50 dark:bg-opacity-70`}>
          <div className={`${styles.deleteModalContent} bg-white dark:bg-gray-800`}>
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Completion</h2>
                <div className="border-black hover:rounded-md hover:border">
                  <LiaTimesSolid
                    className="m-1 cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsModalVisible(false)}
                  />
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Mark appointment as done?</p>
              <div className="mt-3 flex w-full gap-5">
                <button
                  onClick={handleConfirmUpdate}
                  className="button-secondary h-[50px] w-full rounded-sm bg-blue-600 text-white hover:bg-blue-700 max-sm:h-[45px]"
                >
                  Yes, mark
                </button>
                <button
                  className="button-danger h-[50px] w-full rounded-sm bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 max-sm:h-[45px]"
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

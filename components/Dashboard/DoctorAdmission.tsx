"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BsEyeFill } from "react-icons/bs"
import { RiDeleteBin5Line } from "react-icons/ri"
import CancelDelete from "public/svgs/cancel-delete"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"

interface Admission {
  id: string
  name: string
  patient_id: string
  image: string
  ward: string
  reason: string
  checkout_date: string
  pub_date: string
  time: string
  status: "checkout" | "checkin"
}

const AllAdmission: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"all" | "checkout" | "checkin">("all")
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [admissionToDelete, setAdmissionToDelete] = useState<Admission | null>(null)
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "month"))
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())
  const DOCTOR_ADMISSIONS_STORAGE_KEY = "doctor-admissions"

  useEffect(() => {
    try {
      const cached = localStorage.getItem(DOCTOR_ADMISSIONS_STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as Admission[]
        setAdmissions(parsed)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error reading doctor admissions from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    const fetchAdmissions = async () => {
      if (admissions.length === 0) {
        setIsLoading(true)
      }
      try {
        const start = startDate ? startDate.format("YYYY-MM-DD") : ""
        const end = endDate ? endDate.format("YYYY-MM-DD") : ""

        const response = await fetch(
          `https://api2.caregiverhospital.com/patient/filter/patient-with-admission/${start}/${end}/admission/`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = (await response.json()) as any[]

        // Flatten and map into Admission[]
        const formattedData: Admission[] = data.flatMap((patient: any) =>
          patient.check_apps.map((adm: any) => ({
            id: adm.id,
            patient_id: patient.id,
            name: patient.name,
            image: adm.image || "",
            ward: adm.ward,
            reason: adm.reason,
            checkout_date: adm.checkout_date || "",
            pub_date: adm.pub_date,
            time: adm.time,
            status: adm.checkout_date ? "checkout" : "checkin",
          }))
        )

        // Sort by pub_date descending (newest first)
        const sortedData = formattedData.sort(
          (a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime()
        )

        // Keep only the most recent admission per patient_id
        const uniqueMostRecent = sortedData.filter(
          (adm, idx, arr) => arr.findIndex((a) => a.patient_id === adm.patient_id) === idx
        )

        setAdmissions(uniqueMostRecent)

        try {
          localStorage.setItem(DOCTOR_ADMISSIONS_STORAGE_KEY, JSON.stringify(uniqueMostRecent))
        } catch (error) {
          console.error("Error saving doctor admissions to localStorage:", error)
        }
      } catch (error) {
        console.error("Error fetching admissions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdmissions()
  }, [startDate, endDate, admissions.length])

  const handlePatientClick = (patientId: string) => {
    localStorage.setItem("selectedAdmissionId", patientId)
    router.push(`/doctor-admission/admission`)
  }

  const handleDeleteAdmission = async () => {
    if (!admissionToDelete) return

    try {
      const response = await fetch(`https://api2.caregiverhospital.com/check-app/check-app/${admissionToDelete.id}/`, {
        method: "DELETE",
      })

      if (response.ok) {
        const updated = admissions.filter((a) => a.id !== admissionToDelete.id)
        setAdmissions(updated)

        try {
          localStorage.setItem(DOCTOR_ADMISSIONS_STORAGE_KEY, JSON.stringify(updated))
        } catch (error) {
          console.error("Error updating doctor admissions in localStorage after delete:", error)
        }
        setShowDeleteModal(false)
      } else {
        console.error("Failed to delete admission")
      }
    } catch (error) {
      console.error("Error deleting admission:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const renderAppointments = (apps: Admission[]) => (
    <div className="flex flex-col gap-2">
      {apps.map((app) => (
        <div
          key={app.id}
          className="sidebar flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
        >
          <div className="flex w-full items-center gap-2 text-sm font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]">
              <p className="capitalize text-[#000000]">{app.name.charAt(0)}</p>
            </div>
            <div>
              <p className="capitalize">{app.name}</p>
              <small className="text-xs">Patient Name</small>
            </div>
          </div>
          <div className="w-full max-md:hidden">
            <p className="text-sm font-bold">{formatDate(app.pub_date)}</p>
            <small className="text-xs">Check-in Date</small>
          </div>
          <div className="w-full">
            <p className="text-sm font-bold">{app.ward}</p>
            <small className="text-xs">Ward</small>
          </div>
          <div className="w-full max-md:hidden">
            <p className="text-sm font-bold">{app.reason}</p>
            <small className="text-xs">Reason for Check-in</small>
          </div>
          <div className="w-full max-md:hidden">
            <p className="rounded py-[2px] text-xs font-semibold">
              {app.checkout_date ? formatDate(app.checkout_date) : "N/A"}
            </p>
            <small className="text-xs">Check-out Date</small>
          </div>
          <div className="flex items-center gap-2">
            <BsEyeFill
              className="cursor-pointer text-gray-600 hover:text-blue-500"
              onClick={() => handlePatientClick(app.patient_id)}
            />
            <RiDeleteBin5Line
              className="cursor-pointer text-gray-600 hover:text-red-500"
              onClick={() => {
                setAdmissionToDelete(app)
                setShowDeleteModal(true)
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )

  const filteredAdmissions = admissions.filter((app) => {
    const tabFilter =
      activeTab === "all" ? true : activeTab === "checkin" ? app.status === "checkin" : app.status === "checkout"

    const searchFilter =
      !searchTerm ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase())

    return tabFilter && searchFilter
  })

  return (
    <div className="flex h-full flex-col">
      {isLoading && admissions.length === 0 ? (
        <div className="grid gap-2">
          <div className="flex justify-between">
            <div className="h-10 w-64 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="sidebar flex w-full items-center justify-between rounded-lg border p-2">
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
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 md:justify-between">
            <div className="tab-bg flex w-[245px] items-center gap-3 rounded-lg p-1 md:border">
              {["all", "checkin", "checkout"].map((tab) => (
                <button
                  key={tab}
                  className={`${activeTab === tab ? "active-tab" : "inactive-tab"}`}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                >
                  {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search patients, wards, reasons..."
                  className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#46ffa6]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-white p-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="flex flex-col gap-2 md:flex-row">
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      maxDate={endDate || undefined}
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      minDate={startDate || undefined}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </div>
                </LocalizationProvider>
              </div>
            </div>
          </div>
          {filteredAdmissions.length > 0 ? (
            renderAppointments(filteredAdmissions)
          ) : (
            <div className="flex h-32 items-center justify-center text-gray-500">
              No admissions found matching your criteria
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && admissionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[376px] overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between bg-[#F5F8FA] p-4">
              <h3 className="text-lg font-bold text-black">Confirm Deletion</h3>
              <div className="m-1 cursor-pointer" onClick={() => setShowDeleteModal(false)}>
                <CancelDelete />
              </div>
            </div>
            <div className="p-4">
              <p className="my-4 text-black">
                Are you sure you want to delete the admission record for {admissionToDelete.name}?
              </p>
              <div className="flex w-full justify-end gap-4">
                <button
                  className="w-full rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  onClick={handleDeleteAdmission}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllAdmission

"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PiDotsThree } from "react-icons/pi"

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

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const response = await fetch(
          "https://api2.caregiverhospital.com/patient/patient-with-admission/0/100/admission/"
        )
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = (await response.json()) as Admission[]
        const formattedData: Admission[] = data.flatMap((patient: any) =>
          patient.check_apps.map((admission: any) => ({
            id: admission.id,
            patient_id: patient.id,
            name: patient.name,
            image: admission.image || "",
            ward: admission.ward,
            reason: admission.reason,
            checkout_date: admission.checkout_date || "",
            pub_date: admission.pub_date,
            time: admission.time,
            status: admission.checkout_date ? "checkout" : "checkin",
          }))
        )
        // Sort by pub_date in descending order (newest first)
        const sortedData = formattedData.sort((a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime())
        setAdmissions(sortedData)
      } catch (error) {
        console.error("Error fetching admissions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdmissions()
  }, [])

  const handlePatientClick = (admissionId: string) => {
    localStorage.setItem("selectedAdmissionId", admissionId)
    router.push(`/admissions/admission`)
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

  const renderAppointments = (appointments: Admission[]) => (
    <div className="flex flex-col gap-2">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="sidebar flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
          onClick={() => handlePatientClick(appointment.patient_id)}
        >
          <div className="flex w-full items-center gap-2 text-sm font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]">
              <p className="capitalize text-[#000000]">{appointment.name.charAt(0)}</p>
            </div>
            <div>
              <p className="capitalize">{appointment.name}</p>
              <small className="text-xs">Patient Name</small>
            </div>
          </div>
          <div className="w-full max-md:hidden">
            <p className="text-sm font-bold">{formatDate(appointment.pub_date)}</p>
            <small className="text-xs">Check-in Date</small>
          </div>
          <div className="w-full">
            <p className="text-sm font-bold">{appointment.ward}</p>
            <small className="text-xs">Ward</small>
          </div>
          <div className="w-full max-md:hidden">
            <p className="text-sm font-bold">{appointment.reason}</p>
            <small className="text-xs">Reason for Check-in</small>
          </div>
          <div className="w-full max-md:hidden">
            <p className="rounded py-[2px] text-xs font-semibold">{formatDate(appointment.checkout_date) || "N/A"}</p>
            <small className="text-xs">Check-out Date</small>
          </div>
          <div>
            <PiDotsThree />
          </div>
        </div>
      ))}
    </div>
  )

  const filteredAppointments = admissions.filter((appointment) => {
    // Filter by tab first
    const tabFilter =
      activeTab === "all"
        ? true
        : activeTab === "checkin"
        ? appointment.status === "checkin"
        : appointment.status === "checkout"

    // Then filter by search term if it exists
    const searchFilter =
      searchTerm === "" ||
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())

    return tabFilter && searchFilter
  })

  return (
    <div className="flex h-full flex-col">
      {isLoading ? (
        <div className="grid gap-2">
          <div className="flex justify-between">
            <div className="h-10 w-64 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
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
                <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search patients, wards, reasons..."
                className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#46ffa6]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {filteredAppointments.length > 0 ? (
            renderAppointments(filteredAppointments)
          ) : (
            <div className="flex h-32 items-center justify-center text-gray-500">
              No admissions found matching your criteria
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AllAdmission

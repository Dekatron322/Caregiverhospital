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

const NursesAdmission: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"all" | "checkout" | "checkin">("all")
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
            name: patient.name, // Access patient's name here
            image: admission.image || "", // Default to an empty string if image is missing
            ward: admission.ward,
            reason: admission.reason,
            checkout_date: admission.checkout_date || "", // Use empty string if no checkout date
            pub_date: admission.pub_date,
            time: admission.time,
            status: admission.checkout_date ? "checkout" : "checkin", // Set status based on checkout_date
          }))
        )
        setAdmissions(formattedData)
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
    router.push(`/all-admissions/admission`)
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
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
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

  const filteredAppointments = admissions.filter((appointment) =>
    activeTab === "all"
      ? true
      : activeTab === "checkin"
      ? appointment.status === "checkin"
      : appointment.status === "checkout"
  )

  return (
    <div className="flex h-full flex-col">
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
          <div className="tab-bg mb-8 flex w-[245px] items-center gap-3 rounded-lg p-1 md:border">
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
          {renderAppointments(filteredAppointments)}
        </>
      )}
    </div>
  )
}

export default NursesAdmission
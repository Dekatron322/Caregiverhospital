"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PiDotsThree } from "react-icons/pi"
import AOS from "aos"
import "aos/dist/aos.css"

interface CheckApp {
  id: string
  ward: string
  reason: string
  checkout_date: string
  pub_date: string
}

interface Patient {
  id: string
  name: string
  hmo: {
    id: string
    name: string
  }
  check_apps: CheckApp[]
}

interface Admission {
  id: string
  name: string
  image: string
  ward: string
  reason: string
  check_out_date: string
  time: string
  status: "checkout" | "checkin"
}

const DoctorAdmission: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"all" | "checkout" | "checkin">("all")
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const response = await fetch("https://api.caregiverhospital.com/patient/patient/")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = (await response.json()) as Patient[]
        console.log("Fetched data:", data)

        const processedData: Admission[] = data
          .map((patient) => {
            if (!patient.check_apps || patient.check_apps.length === 0) {
              console.warn(`No check_apps found for patient ID: ${patient.id}`)
              return null
            }

            const latestCheckApp = patient.check_apps.reduce((latest, current) =>
              new Date(current.pub_date) > new Date(latest.pub_date) ? current : latest
            )

            return {
              id: patient.id,
              name: patient.name,
              image: "", // Assuming default image path
              ward: latestCheckApp.ward,
              reason: latestCheckApp.reason,
              check_out_date: latestCheckApp.checkout_date,
              time: latestCheckApp.pub_date,
              status: latestCheckApp.checkout_date ? "checkout" : "checkin",
            }
          })
          .filter((admission): admission is Admission => admission !== null)

        console.log("Processed data:", processedData)
        setAdmissions(processedData)
      } catch (error) {
        console.error("Error fetching admissions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdmissions()
  }, [])

  const handlePatientClick = (admissionId: string) => {
    router.push(`/doctor-admission/admission/${admissionId}`)
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

  const renderAppointments = (appointments: Admission[]) => {
    return (
      <div className="flex flex-col gap-2">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
            data-aos="fade-in"
            data-aos-duration="1000"
            data-aos-delay="500"
            onClick={() => handlePatientClick(appointment.id)}
          >
            <div className="flex w-full items-center gap-2 text-sm font-bold">
              <span>
                {/* <Image src={appointment.image} height={40} width={40} alt="Patient" /> */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]">
                  <p className="capitalize text-[#000000]">{appointment.name.charAt(0)}</p>
                </div>
              </span>
              <div>
                <p className="capitalize">{appointment.name}</p>
                <small className="text-xs">Patient Name</small>
              </div>
            </div>
            <div className="w-full max-md:hidden">
              <p className="text-sm font-bold">{formatDate(appointment.time)}</p>
              <small className="text-xs">Check in Date</small>
            </div>
            <div className="w-full">
              <p className="text-sm font-bold">{appointment.ward}</p>
              <small className="text-xm">Ward</small>
            </div>
            <div className="w-full max-md:hidden">
              <p className="text-sm font-bold">{appointment.reason}</p>
              <small className="text-xs">Reason for check in</small>
            </div>
            <div className="w-full max-md:hidden">
              <p className="rounded py-[2px] text-xs font-semibold">{formatDate(appointment.check_out_date)}</p>
              <small className="text-xs">Check-out date</small>
            </div>
            <div>
              <PiDotsThree />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const allAppointments = renderAppointments(admissions)
  const pendingAppointments = renderAppointments(admissions.filter((appointment) => appointment.status === "checkin"))
  const doneAppointments = renderAppointments(admissions.filter((appointment) => appointment.status === "checkout"))

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
            <button
              className={`${activeTab === "all" ? "active-tab" : "inactive-tab"}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`${activeTab === "checkin" ? "active-tab" : "inactive-tab"}`}
              onClick={() => setActiveTab("checkin")}
            >
              Check-Ins
            </button>
            <button
              className={`${activeTab === "checkout" ? "active-tab" : "inactive-tab"}`}
              onClick={() => setActiveTab("checkout")}
            >
              Check-Outs
            </button>
          </div>

          {activeTab === "all" && allAppointments}
          {activeTab === "checkin" && pendingAppointments}
          {activeTab === "checkout" && doneAppointments}
        </>
      )}
    </div>
  )
}

export default DoctorAdmission

"use client" // Add this directive to ensure the code runs on the client-side

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdmissionModal from "components/Modals/AdmissionModal"
import AppointmentModal from "components/Modals/AppointmentModal"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import Link from "next/link"
import PatientDetails from "components/Patient/PatientDetails"
import { IoMdArrowBack } from "react-icons/io"
import { MdLocationPin } from "react-icons/md"
import AOS from "aos"
import "aos/dist/aos.css"

interface PatientDetail {
  id: string
  name: string
  heart_rate?: string
  body_temperature?: string
  glucose_level?: string
  blood_pressure?: string
  address: string
  phone_no: string
  dob: string
  blood_group?: string
  hmo: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }
  policy_id?: string
  allergies?: string
  nok_name: string
  nok_phone_no: string
  appointments: { id: number; doctor: string; pub_date: string }[]
  prescriptions: {
    id: string
    category: string
    name: string
    complain: string
    code: string
    unit: number
    dosage: number
    rate: string
    usage: string
    note: string
    status: boolean
    pub_date: string
  }[]
  medicals: {
    id: string
    name: string
    doctor_image: string
    test: string
    result: string
    pub_date: string
  }[]
}

export default function PatientDetailPage() {
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null)
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showDeleteNotification, setShowDeleteNotification] = useState(false)
  const router = useRouter()

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const patientId = localStorage.getItem("selectedPatientId")

      if (!patientId) {
        console.error("No patient ID found in localStorage")
        return
      }

      try {
        const response = await fetch(`https://api.caregiverhospital.com/patient/patient/${patientId}/`)
        if (!response.ok) {
          const errorDetails = await response.text()
          throw new Error(`Network response was not ok: ${errorDetails}`)
        }
        const data = (await response.json()) as PatientDetail
        setPatientDetail(data)
      } catch (error) {
        console.error("Error fetching patient details:", error)
      }
    }

    fetchPatientDetails()
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  const openAdmissionModal = () => {
    setIsAdmissionOpen(true)
  }

  const openAppointmentModal = () => {
    setIsAppointmentOpen(true)
  }

  const closeAdmissionModal = () => {
    setIsAdmissionOpen(false)
  }

  const closeAppointmentModal = () => {
    setIsAppointmentOpen(false)
  }

  const handleHmoSubmissionSuccess = () => {
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 5000)
    refreshPatientDetails()
  }

  const refreshPatientDetails = async () => {
    const patientId = localStorage.getItem("selectedPatientId")

    if (!patientId) {
      console.error("No patient ID found in localStorage")
      return
    }

    try {
      const response = await fetch(`https://api.caregiverhospital.com/patient/patient/${patientId}/`)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = (await response.json()) as PatientDetail
      setPatientDetail(data)
    } catch (error) {
      console.error("Error refreshing patient details:", error)
    }
  }

  if (!patientDetail) {
    return (
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />
            <div className="loading-text flex h-full items-center justify-center">
              {"loading...".split("").map((letter, index) => (
                <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />

            {patientDetail && (
              <div className="px-16 max-md:px-3 sm:py-10">
                <button onClick={handleGoBack} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <div className="pt-10" data-aos="fade-in" data-aos-duration="1000" data-aos-delay="500">
                  <div className="mb-3 grid w-full grid-cols-4 gap-2 max-sm:grid-cols-2">
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-01.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Heart Rate</h3>
                      <p>{patientDetail.heart_rate || "N/A"}</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-02.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Body Temperature</h3>
                      <p>
                        {patientDetail.body_temperature || "N/A"} <small>°C</small>
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-03.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Glucose Level</h3>
                      <p>{patientDetail.glucose_level || "N/A"}</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-04.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Blood Pressure</h3>
                      <p>{patientDetail.blood_pressure || "N/A"} mg/dl</p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 max-md:flex-col">
                    <div className="md:w-1/4">
                      <div className="flex flex-col justify-center rounded-md border px-4 py-8">
                        <div className="flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#46ffa6]">
                            <p className="capitalize text-[#000000]">{patientDetail.name.charAt(0)}</p>
                          </div>
                        </div>
                        <h1 className="mt-3 text-center font-bold capitalize xl:text-sm">{patientDetail.name}</h1>
                        <p className="text-center text-base font-bold xl:text-sm">
                          Patient ID: <span className="text-[#969696]">{patientDetail.id}</span>
                        </p>
                        <p className="text-center text-base font-bold xl:text-sm">
                          Age: <span className="text-[#969696]">{calculateAge(patientDetail.dob)}</span>
                        </p>
                        <p className="text-center text-base font-bold capitalize xl:text-sm">
                          {patientDetail.policy_id}
                        </p>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-1 text-center text-[#969696]">
                          <MdLocationPin />
                          <p className="text-sm xl:text-xs">{patientDetail.address}</p>
                        </div>
                        <div className="flex justify-center text-[#969696]">
                          <p className="text-sm xl:text-xs">{patientDetail.phone_no}</p>
                        </div>
                        <div className="mt-5 flex flex-col gap-2">
                          <Link
                            href={`/patient/appointments/${patientDetail.id}`}
                            className="btn-accent flex h-10 w-full items-center justify-center rounded-md px-8 py-2 text-sm font-bold uppercase text-[#333333] hover:bg-[#333333] hover:text-[#ffffff] xl:px-4"
                          >
                            Appointment
                          </Link>
                          <button
                            className="btn-accent flex h-10 w-full items-center justify-center rounded-md px-8 py-2 text-sm font-bold uppercase text-[#333333] hover:bg-[#333333] hover:text-[#ffffff] xl:px-4"
                            onClick={openAdmissionModal}
                          >
                            Admission
                          </button>
                          <button
                            className="btn-accent flex h-10 w-full items-center justify-center rounded-md px-8 py-2 text-sm font-bold uppercase text-[#333333] hover:bg-[#333333] hover:text-[#ffffff] xl:px-4"
                            onClick={openAppointmentModal}
                          >
                            Consultation
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-3/4"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

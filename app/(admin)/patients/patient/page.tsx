"use client" // Add this directive to ensure the code runs on the client-side

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdmissionModal from "components/Modals/AdmissionModal"
import AppointmentModal from "components/Modals/AppointmentModal"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import Link from "next/link"

import { IoMdArrowBack } from "react-icons/io"
import { MdLocationPin } from "react-icons/md"

import PatientDetails from "components/Patient/PatientDetails"

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
  appointments: { id: number; doctor: string; pub_date: string; detail: string }[]
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
    doctor_name: string
  }[]
  lab_tests: {
    id: string
    doctor_name: string
    doctor_image: string
    test: string
    result: string
    test_type: string
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
    const fetchPatientDetails = async () => {
      const patientId = localStorage.getItem("selectedPatientId")

      if (!patientId) {
        console.error("No patient ID found in localStorage")
        return
      }

      try {
        const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
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
      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
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
                <div className="pt-10">
                  <div className="mb-3 grid w-full grid-cols-4 gap-2 max-sm:grid-cols-2">
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-01.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Heart Rate</h3>
                      <p>{patientDetail.heart_rate || "N/A"} bpm</p>
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
                      <p>{patientDetail.glucose_level || "N/A"} mg/dl</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-04.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Blood Pressure</h3>
                      <p>{patientDetail.blood_pressure || "N/A"} mmHg</p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 max-md:flex-col">
                    <div className="md:w-1/4">
                      <div className="flex flex-col justify-center rounded-md border px-4 py-8">
                        <div className="flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#46FFA6]">
                            <p className="capitalize text-[#000000]">{patientDetail.name.charAt(0)}</p>
                          </div>
                          {/* <Image src="/default_patient_image.png" height={60} width={60} alt="Patient Image" /> */}
                        </div>
                        <h1 className="mt-3 text-center font-bold capitalize xl:text-sm">{patientDetail.name}</h1>
                        <p className="text-center text-base font-bold xl:text-sm">
                          Patient ID: <span className="font-normal xl:text-sm">{patientDetail.policy_id}</span>
                        </p>
                        <div className="flex items-center justify-center gap-1 text-center">
                          <MdLocationPin className="" />
                          <p className="text-center">{patientDetail.address}</p>
                        </div>
                        <div className="my-4 flex w-full border"></div>
                        <div className="">
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Phone</p>
                            <p className="xl:text-sm">{patientDetail.phone_no}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Age</p>
                            <p className="xl:text-sm">{calculateAge(patientDetail.dob)}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Blood Group</p>
                            <p className="xl:text-sm">{patientDetail.blood_group || "N/A"}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">HMO Name</p>
                            <p className="xl:text-sm">{patientDetail.hmo.name || "N/A"}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="xl:text-sm">Policy ID</p>
                            <p className="xl:text-sm">{patientDetail.policy_id || "N/A"}</p>
                          </div>
                          <div className="mt-6 flex w-full gap-2">
                            <button
                              onClick={openAppointmentModal}
                              className="button-primary h-[40px] w-[60%] whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm"
                            >
                              Book Appointment
                            </button>
                            <button
                              onClick={openAdmissionModal}
                              className="button-primary h-[40px] w-[40%] whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm"
                            >
                              Check In
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <h3 className="mb-1 font-bold">Allergies</h3>
                        <div className="flex flex-wrap">
                          {patientDetail.allergies
                            ? patientDetail.allergies.split(",").map((allergy, index) => (
                                <div key={index} className="w-1/2">
                                  <p className="m-1 rounded bg-[#F2B8B5] p-1 text-center text-sm font-medium capitalize text-[#601410]">
                                    {allergy.trim()}
                                  </p>
                                </div>
                              ))
                            : "No allergies"}
                        </div>
                        {/* <p className="mt-4 text-right font-medium">see all</p> */}
                      </div>

                      <div className="py-2">
                        <div className="nok_area">
                          <h4 className="mb-2 font-medium">Next of Kin</h4>
                          <div className="flex justify-between">
                            <p>{patientDetail.nok_name}</p>
                            <Link href={`tel:${patientDetail.nok_phone_no}`}>
                              <Image src="/phone.svg" height={18} width={18} alt="Call" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 md:w-3/4">
                      <PatientDetails patientDetail={patientDetail} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Footer />
          </div>
        </div>
      </section>
      <AdmissionModal
        isOpen={isAdmissionOpen}
        onClose={closeAdmissionModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
        patientDetail={patientDetail} // This should now be recognized
        patientId={patientDetail.id} // Ensure this matches your interface requirements
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={closeAppointmentModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
        patientDetail={patientDetail}
        patientId={patientDetail.id}
      />

      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#0F920F]">Successfully added</span>
        </div>
      )}

      {showDeleteNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#0F920F]">Successfully deleted</span>
        </div>
      )}
    </>
  )
}

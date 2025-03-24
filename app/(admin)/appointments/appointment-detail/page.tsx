"use client"
import React, { useCallback, useEffect, useState } from "react"
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
import { GoPlus } from "react-icons/go"
import UpdateVitalsModal from "components/Modals/UpdateVitalsModal"
import EditNoteIcon from "@mui/icons-material/EditNote"
import UpdateAllergiesModal from "components/Modals/UpdateAllergiesModal"
import { Toaster, toast } from "sonner"

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
  medicals: {
    id: string
    name: string
    doctor_image: string
    test: string
    result: string
    pub_date: string
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
  notes: {
    id: string
    title: string
    detail: string
    status: string
    pub_date: string
  }[]
}

export default function PatientDetailPage() {
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null)
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const [isUpdateVitalsOpen, setIsUpdateVitalsOpen] = useState(false)
  const [isUpdateAllergiesOpen, setIsUpdateAllergiesOpen] = useState(false)
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [patientId, setPatientId] = useState<string | null>(null)
  const router = useRouter()

  // Fetch patient details
  const fetchPatientDetails = useCallback(async (id: string) => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${id}/`)
      if (!response.ok) {
        const errorDetails = await response.text()
        throw new Error(`Network response was not ok: ${errorDetails}`)
      }
      const data = (await response.json()) as PatientDetail
      setPatientDetail(data)
    } catch (error) {
      console.error("Error fetching patient details:", error)
      toast.error("Failed to fetch patient details", {
        description: "Please try again or contact support.",
        duration: 5000,
      })
    }
  }, [])

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedAppointmentId")
    if (!storedPatientId) {
      console.error("No patient ID found in localStorage")
      return
    }
    setPatientId(storedPatientId)
    fetchPatientDetails(storedPatientId)
  }, [fetchPatientDetails])

  // Handle modal open/close
  const openAdmissionModal = useCallback(() => setIsAdmissionOpen(true), [])
  const closeAdmissionModal = useCallback(() => setIsAdmissionOpen(false), [])
  const openAppointmentModal = useCallback(() => setIsAppointmentOpen(true), [])
  const closeAppointmentModal = useCallback(() => setIsAppointmentOpen(false), [])
  const openUpdateVitalsModal = useCallback(() => setIsUpdateVitalsOpen(true), [])
  const closeUpdateVitalsModal = useCallback(() => setIsUpdateVitalsOpen(false), [])
  const openUpdateAllergiesModal = useCallback(() => setIsUpdateAllergiesOpen(true), [])
  const closeUpdateAllergiesModal = useCallback(() => setIsUpdateAllergiesOpen(false), [])

  // Handle success notifications
  const handleHmoSubmissionSuccess = useCallback(() => {
    toast.success("Operation successful", {
      description: "The operation was completed successfully.",
      duration: 5000,
    })
    refreshPatientDetails()
  }, [])

  // Refresh patient details
  const refreshPatientDetails = useCallback(async () => {
    if (!patientId) return
    await fetchPatientDetails(patientId)
  }, [patientId, fetchPatientDetails])

  // Format date
  const formatDate = useCallback((dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }, [])

  // Calculate age
  const calculateAge = useCallback((dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }, [])

  // Loading state
  if (!patientDetail) {
    return (
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />
            <div className="px-16 max-md:px-3 sm:py-10">
              {/* Skeleton for the back button and update vitals button */}
              <div className="flex justify-between">
                <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200"></div>
                <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200"></div>
              </div>

              {/* Skeleton for the vitals grid */}
              <div className="mb-3 grid w-full grid-cols-4 gap-2 max-sm:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="sidebar flex h-32 w-full animate-pulse flex-col items-center justify-center rounded-md border bg-gray-200 py-3 shadow-md"
                  >
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
                    <div className="mt-2 h-4 w-20 animate-pulse rounded bg-gray-300"></div>
                    <div className="mt-2 h-4 w-16 animate-pulse rounded bg-gray-300"></div>
                  </div>
                ))}
              </div>

              {/* Skeleton for the main content */}
              <div className="flex justify-between gap-2 max-md:flex-col">
                <div className="md:w-1/4">
                  {/* Skeleton for the patient profile card */}
                  <div className="sidebar flex animate-pulse flex-col justify-center rounded-md border px-4 py-8 shadow-md">
                    <div className="flex items-center justify-center">
                      <div className="h-12 w-12 animate-pulse rounded-full bg-gray-300"></div>
                    </div>
                    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
                    <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
                    <div className="my-4 flex w-full border"></div>
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex justify-between pb-2">
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
                      </div>
                    ))}
                    <div className="mt-6 flex w-full gap-2">
                      <div className="h-10 w-3/5 animate-pulse rounded-md bg-gray-300"></div>
                      <div className="h-10 w-2/5 animate-pulse rounded-md bg-gray-300"></div>
                    </div>
                  </div>

                  {/* Skeleton for the allergies section */}
                  <div className="py-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
                      <div className="h-6 w-6 animate-pulse rounded bg-gray-300"></div>
                    </div>
                    <div className="mt-2 flex flex-wrap">
                      {[...Array(2)].map((_, index) => (
                        <div key={index} className="w-1/2">
                          <div className="m-1 h-8 animate-pulse rounded bg-gray-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skeleton for the next of kin section */}
                  <div className="py-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
                    <div className="mt-2 flex justify-between">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
                      <div className="h-6 w-6 animate-pulse rounded bg-gray-300"></div>
                    </div>
                  </div>
                </div>

                <div className="mb-6 md:w-3/4">
                  {/* Skeleton for the patient details section */}
                  <div className="sidebar h-96 animate-pulse rounded border bg-gray-200 p-4"></div>

                  {/* Skeleton for the patient notes section */}
                  <div className="notes-section sidebar mb-4 mt-10 h-48 animate-pulse rounded border bg-gray-200 p-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
                    <div className="mt-4 space-y-2">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-4 w-full animate-pulse rounded bg-gray-300"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <Toaster position="top-center" richColors /> {/* Add Toaster component */}
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />

            <div className="px-16 max-md:px-3 sm:py-10">
              <div className="flex justify-between">
                <button onClick={() => router.back()} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <button className="add-button" onClick={openUpdateVitalsModal}>
                  <p className="text-xs">Update Vitals</p>
                  <GoPlus />
                </button>
              </div>
              <div className="pt-10">
                <div className="mb-3 grid w-full grid-cols-4 gap-2 max-sm:grid-cols-2">
                  <div className="sidebar flex w-full flex-col items-center justify-center rounded-md border py-3 shadow-md ">
                    <Image src="/pt-dashboard-01.svg" height={40} width={40} alt="" />
                    <h3 className="py-2 font-bold">Heart Rate</h3>
                    <p>{patientDetail.heart_rate || "N/A"} bpm</p>
                  </div>
                  <div className="sidebar flex w-full flex-col items-center justify-center rounded-md border py-3 shadow-md ">
                    <Image src="/pt-dashboard-02.svg" height={40} width={40} alt="" />
                    <h3 className="py-2 font-bold">Body Temperature</h3>
                    <p>
                      {patientDetail.body_temperature || "N/A"} <small>°C</small>
                    </p>
                  </div>
                  <div className="sidebar flex w-full flex-col items-center justify-center rounded-md border py-3 shadow-md ">
                    <Image src="/pt-dashboard-03.svg" height={40} width={40} alt="" />
                    <h3 className="py-2 font-bold">Glucose Level</h3>
                    <p>{patientDetail.glucose_level || "N/A"} mg/dl</p>
                  </div>
                  <div className="sidebar flex w-full flex-col items-center justify-center rounded-md border py-3 shadow-md ">
                    <Image src="/pt-dashboard-04.svg" height={40} width={40} alt="" />
                    <h3 className="py-2 font-bold">Blood Pressure</h3>
                    <p>{patientDetail.blood_pressure || "N/A"} mmHg</p>
                  </div>
                </div>
                <div className="flex justify-between gap-2 max-md:flex-col">
                  <div className="md:w-1/4">
                    <div className="sidebar flex flex-col justify-center rounded-md border px-4 py-8 shadow-md">
                      <div className="flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#46FFA6]">
                          <p className="capitalize text-[#000000]">{patientDetail.name.charAt(0)}</p>
                        </div>
                      </div>
                      <h1 className="mt-3 text-center font-bold capitalize xl:text-sm">{patientDetail.name}</h1>
                      <p className="text-center text-base font-bold xl:text-sm">
                        Patient ID: <span className="font-normal xl:text-sm">{patientDetail.policy_id}</span>
                      </p>
                      <div className="flex items-center justify-center gap-1 text-center">
                        <MdLocationPin />
                        <p className="text-center">{patientDetail.address}</p>
                      </div>
                      <div className="my-4 flex w-full border"></div>
                      <div>
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
                      <div className="flex justify-between">
                        <h3 className="mb-1 font-bold">Allergies</h3>
                        <EditNoteIcon onClick={openUpdateAllergiesModal} />
                      </div>
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
                    <div className="notes-section sidebar mb-4 mt-10 rounded border p-4">
                      <h3 className="mb-4 font-bold">Patient Notes</h3>
                      {patientDetail.notes.length > 0 ? (
                        patientDetail.notes.map((note) => (
                          <div key={note.id} className="">
                            <p className="mb-3 text-sm">{note.detail}</p>
                            <p className="mb-2 text-sm text-[#087a43]">{formatDate(note.pub_date)}</p>
                            <div className="my-5 h-[1px] w-full bg-slate-700"></div>
                          </div>
                        ))
                      ) : (
                        <p>No notes available for this patient.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </section>
      <UpdateAllergiesModal
        isOpen={isUpdateAllergiesOpen}
        onClose={closeUpdateAllergiesModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
        patientId={patientDetail.id}
      />
      <UpdateVitalsModal
        isOpen={isUpdateVitalsOpen}
        onClose={closeUpdateVitalsModal}
        onSubmitSuccess={refreshPatientDetails}
        patientId={patientDetail.id}
      />
      <AdmissionModal
        isOpen={isAdmissionOpen}
        onClose={closeAdmissionModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
        patientId={patientDetail.id}
        patientDetail={patientDetail}
      />
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={closeAppointmentModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
        patientDetail={patientDetail}
        patientId={patientDetail.id}
      />
    </>
  )
}

"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import jsPDF from "jspdf"

import Footer from "components/Footer/Footer"
import Image from "next/image"
import { MdLocationPin } from "react-icons/md"
import { IoMdArrowBack } from "react-icons/io"
import Link from "next/link"

import { GoPlus } from "react-icons/go"

import PrescribeMedicationModal from "components/Modals/PrescribeMedicationModal"
import DoctorNav from "components/Navbar/DoctorNav"

interface PatientDetail {
  id: string
  name: string
  heart_rate?: string
  body_temperature?: string
  glucose_level?: string
  blood_pressure?: string
  height?: string
  weight?: string
  bmi?: string
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
  check_apps: {
    id: string
    doctor_prescription?: {
      id: string
      doctor_name: string
      prescription: string
      pub_date: string
    }
    drugs: {
      id: string
      category: string
      name: string
      unit: string
      pub_date: string
    }[]
    ward: string
    reason: string
    checkout_date: string
    pub_date: string
  }[]
}

interface PatientDetailPageProps {
  params: { admissionId: string }
}

const PatientDetailSkeleton = () => {
  return (
    <div className="px-16 py-6">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="mb-10 h-6 w-24 rounded bg-gray-200"></div>

        {/* Header skeleton */}
        <div className="mt-10 flex items-center justify-between">
          <div className="h-6 w-24 rounded bg-gray-200"></div>
          <div className="h-10 w-40 rounded bg-gray-200"></div>
        </div>

        <div className="pt-10">
          <div className="flex justify-between gap-4">
            {/* Left sidebar skeleton */}
            <div className="w-[30%]">
              <div className="sidebar flex flex-col justify-center rounded-md border px-4 py-8">
                <div className="flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                </div>
                <div className="mx-auto mt-3 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mx-auto mt-2 h-3 w-5/6 rounded bg-gray-200"></div>
                <div className="sidebar mt-2 flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded bg-gray-200"></div>
                  <div className="h-3 w-24 rounded bg-gray-200"></div>
                </div>
                <div className="my-4 h-px w-full bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="sidebar flex justify-between">
                    <div className="h-3 w-16 rounded bg-gray-200"></div>
                    <div className="h-3 w-24 rounded bg-gray-200"></div>
                  </div>
                  <div className="sidebar flex justify-between">
                    <div className="h-3 w-16 rounded bg-gray-200"></div>
                    <div className="h-3 w-24 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>

              {/* Allergies skeleton */}
              <div className="py-2">
                <div className="mb-1 h-4 w-24 rounded bg-gray-200"></div>
                <div className="sidebar flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-6 w-16 rounded bg-gray-200"></div>
                  ))}
                </div>
              </div>

              {/* Next of Kin skeleton */}
              <div className="py-2">
                <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                <div className="flex justify-between">
                  <div className="h-4 w-32 rounded bg-gray-200"></div>
                  <div className="h-6 w-6 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>

            {/* Right content skeleton */}
            <div className="mb-2 flex w-full flex-col">
              <div className="w-[50%]">
                <div className="mb-6 h-6 w-48 rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-32 rounded bg-gray-200"></div>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                ))}
                <div className="mb-6 h-6 w-48 rounded bg-gray-200"></div>
              </div>

              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="sidebar mb-2 flex w-full animate-pulse items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex w-full items-center gap-2">
                    <div>
                      <div className="h-3 w-16 rounded bg-gray-200"></div>
                      <div className="mt-1 h-2 w-12 rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="h-3 w-24 rounded bg-gray-200"></div>
                    <div className="mt-1 h-2 w-20 rounded bg-gray-200"></div>
                  </div>
                  <div className="w-full">
                    <div className="h-3 w-24 rounded bg-gray-200"></div>
                    <div className="mt-1 h-2 w-20 rounded bg-gray-200"></div>
                  </div>
                  <div className="w-full">
                    <div className="h-3 w-16 rounded bg-gray-200"></div>
                    <div className="mt-1 h-2 w-20 rounded bg-gray-200"></div>
                  </div>
                  <div className="w-full">
                    <div className="h-3 w-32 rounded bg-gray-200"></div>
                    <div className="mt-1 h-2 w-24 rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
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

export default function PatientDetailPage() {
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [prescriptionUpdated, setPrescriptionUpdated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleGoBack = () => {
    router.back()
  }

  const fetchPatientDetails = async () => {
    try {
      setIsLoading(true)
      const admissionId = localStorage.getItem("selectedAdmissionId")
      if (!admissionId) {
        console.error("No admission ID found in localStorage.")
        return
      }

      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${admissionId}`)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = (await response.json()) as PatientDetail
      setPatientDetail(data)
    } catch (error) {
      console.error("Error fetching patient details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPatientDetails()
  }, [prescriptionUpdated])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const openAdmissionModal = () => {
    setIsAdmissionOpen(true)
  }

  const closeAdmissionModal = () => {
    setIsAdmissionOpen(false)
  }

  const handleHmoSubmissionSuccess = () => {
    setPrescriptionUpdated((prev) => !prev)
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 5000)
  }

  const generatePrescriptionsPDF = () => {
    if (
      !patientDetail ||
      patientDetail.check_apps.length === 0 ||
      !patientDetail.check_apps.some((check) => check.doctor_prescription)
    ) {
      alert("No doctor prescriptions available to download")
      return
    }

    const doc = new jsPDF()

    // Add header
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text("Caregiver Hospital - Doctor Prescriptions", 105, 20, { align: "center" })

    // Add patient info
    doc.setFontSize(12)
    doc.text(`Patient: ${patientDetail.name}`, 14, 35)
    doc.text(`ID: ${patientDetail.policy_id}`, 14, 43)
    doc.text(`DOB: ${formatDate(patientDetail.dob)}`, 14, 51)
    doc.text(`Blood Group: ${patientDetail.blood_group || "N/A"}`, 14, 59)
    doc.text(`Allergies: ${patientDetail.allergies || "None"}`, 14, 67)

    // Add separator
    doc.setDrawColor(200, 200, 200)
    doc.line(14, 75, 196, 75)

    // Add prescriptions title
    doc.setFontSize(16)
    doc.text("Doctor Prescriptions", 105, 85, { align: "center" })

    let yPosition = 95
    let prescriptionCount = 0

    patientDetail.check_apps.forEach((check) => {
      if (check.doctor_prescription) {
        prescriptionCount++

        if (yPosition > 260) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(12)
        doc.setTextColor(40, 40, 40)
        doc.setFont("helvetica", "bold")
        doc.text(`Prescription #${prescriptionCount}`, 14, yPosition)
        doc.setFont("helvetica", "normal")
        yPosition += 10

        doc.text(`Doctor: ${check.doctor_prescription.doctor_name}`, 14, yPosition)
        yPosition += 10

        doc.text(`Date: ${formatDate(check.doctor_prescription.pub_date)}`, 14, yPosition)
        yPosition += 10

        // Split prescription text into multiple lines if needed
        const splitText = doc.splitTextToSize(check.doctor_prescription.prescription, 180)
        doc.text(splitText, 14, yPosition)
        yPosition += splitText.length * 7 + 15

        // Add separator between prescriptions
        doc.setDrawColor(200, 200, 200)
        doc.line(14, yPosition - 5, 196, yPosition - 5)
      }
    })

    // Add footer
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.setTextColor(150, 150, 150)
      doc.text(`Page ${i} of ${totalPages}`, 105, 285, { align: "center" })
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 290, { align: "center" })
    }

    doc.save(
      `${patientDetail.name.replace(/\s+/g, "_")}_Doctor_Prescriptions_${new Date().toISOString().split("T")[0]}.pdf`
    )
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DoctorNav />

            {isLoading ? (
              <PatientDetailSkeleton />
            ) : patientDetail ? (
              <div className="px-16 py-6">
                <button onClick={handleGoBack} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <div className="mt-10 flex items-center justify-between">
                  <h3 className="font-semibold">Details</h3>
                  <button onClick={openAdmissionModal} className="add-button">
                    <p className="text-xs">Prescribe Medication</p>
                    <GoPlus />
                  </button>
                </div>
                <div className="pt-10">
                  <div className="mb-5 grid w-full grid-cols-4 gap-2 max-sm:grid-cols-2">
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
                      <h3 className="py-2 font-bold">SPO2</h3>
                      <p>{patientDetail.glucose_level || "N/A"} %</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-04.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Blood Pressure</h3>
                      <p>{patientDetail.blood_pressure || "N/A"} mmHg</p>
                    </div>
                  </div>
                  <div className="mb-5 grid w-full grid-cols-3 gap-2 max-sm:grid-cols-1">
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/inventory-status.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Height</h3>
                      <p>{patientDetail.height || "N/A"} cm</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/medicines-available.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Weight</h3>
                      <p>{patientDetail.weight || "N/A"} kg</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/Graph.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">BMI</h3>
                      <p>
                        {patientDetail.bmi ? Number(patientDetail.bmi).toFixed(2) : "N/A"}
                        {patientDetail.bmi && <small> kg/m²</small>}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-4">
                    <div className="w-[30%]">
                      <div className="sidebar flex flex-col justify-center rounded-md border px-4 py-8">
                        <div className="flex items-center justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#46FFA6]">
                            <p className="capitalize text-[#000000] ">{patientDetail.name.charAt(0)}</p>
                          </div>
                        </div>
                        <h1 className="mt-3 text-center text-sm font-bold capitalize">{patientDetail.name}</h1>
                        <p className="text-center  text-sm font-medium">
                          Patient ID: <span className="font-normal ">{patientDetail.policy_id}</span>
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <MdLocationPin />
                          {patientDetail.address}
                        </div>
                        <div className="my-4 flex w-full border"></div>
                        <div>
                          <div className="flex justify-between pb-2">
                            <p className="text-sm">Phone</p>
                            <p className="text-sm">{patientDetail.phone_no}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="text-sm">D.O.B</p>
                            <p className="text-sm">{formatDate(patientDetail.dob)}</p>
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
                        <p className="mt-4 text-right font-medium">see all</p>
                      </div>

                      <div className="py-2">
                        <div className="nok_area">
                          <h4 className="mb-2 font-medium">Next of Kin</h4>
                          <div className="flex justify-between">
                            <p>{patientDetail.nok_name}</p>
                            <Link href={patientDetail.nok_phone_no}>
                              <Image src="/phone.svg" height={18} width={18} alt="" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2 flex w-full flex-col">
                      <div className="w-[100%]">
                        <div className="flex justify-between">
                          <h3 className="mb-6 text-xl font-bold">Doctor&apos;s Prescription</h3>
                          <button
                            onClick={generatePrescriptionsPDF}
                            className="button-primary h-[40px] whitespace-nowrap rounded-md px-4 text-sm max-sm:h-[40px]"
                          >
                            Download Prescriptions (PDF)
                          </button>
                        </div>
                        <p className="mb-4 font-semibold">Drugs to Administer</p>
                        {patientDetail.check_apps.map((check) => (
                          <div key={check.id}>
                            {check.doctor_prescription && (
                              <div className="mb-4">
                                <p className="font-medium">Prescribed by: {check.doctor_prescription.doctor_name}</p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(check.doctor_prescription.pub_date)}
                                </p>
                                <p className="mt-2">{check.doctor_prescription.prescription}</p>
                              </div>
                            )}
                          </div>
                        ))}

                        <h3 className="mb-6 text-xl font-bold">Drugs Administered</h3>
                      </div>

                      {patientDetail.check_apps.map((check) => (
                        <div key={check.id}>
                          {check.drugs.map((drug) => (
                            <div
                              key={drug.id}
                              className="mb-2 flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
                            >
                              <div className="flex w-full items-center gap-2">
                                <div>
                                  <p className="text-sm font-medium">Nurse Name</p>
                                  <small className="text-xs">nurse</small>
                                </div>
                              </div>
                              <div className="w-full">
                                <p className="text-xs font-bold">{drug.name}</p>
                                <small className="text-xs">Medication name</small>
                              </div>
                              <div className="w-full">
                                <p className="text-xs font-bold">{drug.category}</p>
                                <small className="text-xs">Category</small>
                              </div>
                              <div className="w-full">
                                <p className="text-xs font-bold">{drug.unit}</p>
                                <small className="text-xs">Units</small>
                              </div>
                              <div className="w-full">
                                <p className="text-xs font-bold">{formatDate(drug.pub_date)}</p>
                                <small className="text-xs">Time and Date Administered</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p>No patient data available</p>
              </div>
            )}
            <Footer />
          </div>
        </div>
      </section>
      {patientDetail && (
        <PrescribeMedicationModal
          isOpen={isAdmissionOpen}
          onClose={closeAdmissionModal}
          onSubmitSuccess={handleHmoSubmissionSuccess}
          patientId={patientDetail.id}
        />
      )}
    </>
  )
}

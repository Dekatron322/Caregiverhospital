"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { MdLocationPin } from "react-icons/md"
import { IoMdArrowBack } from "react-icons/io"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import AdministerDrugModal from "components/Modals/AdministerDrugModal"

import CheckoutPatientModal from "components/Modals/CheckoutPatientModal"
import NursesNav from "components/Navbar/NursesNav"

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
      nurse_name: string
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

export default function PatientDetailPage() {
  const [isAdministerDrugModalOpen, setIsAdministerDrugModalOpen] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const fetchPatientDetails = async () => {
    try {
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
    }
  }

  useEffect(() => {
    fetchPatientDetails()
  }, [refreshKey])

  const openAdministerDrugModal = () => {
    setIsAdministerDrugModalOpen(true)
  }

  const openCheckoutModal = () => {
    setIsCheckoutModalOpen(true)
  }

  const closeAdministerDrugModal = () => {
    setIsAdministerDrugModalOpen(false)
  }

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false)
  }

  const handleHmoSubmissionSuccess = () => {
    setShowSuccessNotification(true)
    setRefreshKey((prevKey) => prevKey + 1)
    fetchPatientDetails() // Refetch patient details to update the drug list
    setTimeout(() => setShowSuccessNotification(false), 5000)
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

  if (!patientDetail) {
    return (
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <NursesNav />
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

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />

            {patientDetail && (
              <div className="px-16 py-6">
                <button onClick={handleGoBack} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <div className="mt-10 flex items-center justify-between">
                  <h3 className="font-semibold">Details</h3>
                  <button onClick={openAdministerDrugModal} className="add-button">
                    <p className="text-xs">Administer Drug</p>
                    <GoPlus />
                  </button>
                </div>
                <div className="pt-10">
                  <div className="flex justify-between gap-4">
                    <div className="w-[30%]">
                      <div className="flex flex-col justify-center rounded-md border px-4 py-8">
                        <div className="flex items-center justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#46FFA6]">
                            <p className="capitalize text-[#000000]">{patientDetail.name.charAt(0)}</p>
                          </div>
                        </div>
                        <h1 className="mt-3 text-center font-bold capitalize">{patientDetail.name}</h1>
                        <p className="text-center text-sm font-bold">
                          Patient ID: <span className="font-normal">{patientDetail.policy_id}</span>
                        </p>
                        <div className="flex items-center justify-center gap-1">
                          <MdLocationPin />
                          <p className="text-center text-sm">{patientDetail.address}</p>
                        </div>
                        <div className="my-4 flex w-full border"></div>
                        <div>
                          <div className="flex justify-between pb-2">
                            <p className="text-sm">Phone</p>
                            <p className="text-sm">{patientDetail.phone_no}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="text-sm">D.O.B</p>
                            <p className="text-sm ">{formatDate(patientDetail.dob)}</p>
                          </div>

                          <div className="mt-6 flex w-full gap-2">
                            <button
                              onClick={openCheckoutModal}
                              className="button-primary h-[40px] w-full whitespace-nowrap rounded-md max-sm:h-[40px]"
                            >
                              Check Out
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
                      <div className="w-[50%]">
                        <h3 className="mb-6 text-xl font-bold">Doctor&apos;s&apos; Prescription</h3>
                        <p className="mb-4 font-semibold">Drugs to Administer</p>
                        {patientDetail.check_apps.map((check) => (
                          <div key={check.id}>
                            {check.doctor_prescription && (
                              <div className="mb-4">
                                <p>{check.doctor_prescription.prescription}</p>
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
                                <div className="">
                                  <p className="text-sm font-bold capitalize">{drug.nurse_name}</p>
                                  <small className="text-xm">nurse</small>
                                </div>
                              </div>
                              <div className="w-full">
                                <p className="text-sm font-bold capitalize">{drug.name}</p>
                                <small className="text-xm">Medication name</small>
                              </div>
                              <div className="w-full">
                                <p className="text-sm font-bold capitalize">{drug.category}</p>
                                <small className="text-xm">Category</small>
                              </div>
                              <div className="w-full">
                                <p className="text-sm font-bold capitalize">{drug.unit}</p>
                                <small className="text-xm">Units</small>
                              </div>
                              <div className="w-full">
                                <p className="whitespace-nowrap text-xs font-bold">{formatDate(drug.pub_date)}</p>
                                <small className="text-xm">Time and Date Administered</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Footer />
          </div>
        </div>
      </section>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#0F920F]">Checkedout Successfully</span>
        </div>
      )}
      {isAdministerDrugModalOpen && (
        <AdministerDrugModal
          isOpen={isAdministerDrugModalOpen}
          onClose={closeAdministerDrugModal}
          onSubmitSuccess={handleHmoSubmissionSuccess}
          patientId={patientDetail.id}
        />
      )}

      {isCheckoutModalOpen && (
        <CheckoutPatientModal
          isOpen={isCheckoutModalOpen}
          onClose={closeCheckoutModal}
          onSubmitSuccess={handleHmoSubmissionSuccess}
          patientId={patientDetail.id}
        />
      )}
    </>
  )
}

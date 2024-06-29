"use client"
import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import Link from "next/link"
import { IoMdArrowBack } from "react-icons/io"
import { MdLocationPin } from "react-icons/md"
import AOS from "aos"
import "aos/dist/aos.css"
import PatientDetailsForDoctor from "components/Patient/PatientDetailsForDoctor"
import LabTestModal from "components/Modals/LabTestModal"
import PrescriptionModal from "components/Modals/PrescriptionModal"

interface Patient {
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
  lab_tests: {
    id: string
    doctor_name: string
    doctor_request_title: string
    doctor_request_description: string
    test: string
    result: string
    pub_date: string
  }[]
}

interface AddPrescription {
  id: string
  name: string
}

interface RequestTest {
  id: string
  name: string
}

export default function PatientDetailPage() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<Patient | null>(null)
  const patientId = pathname.split("/").pop()
  const [clickedCard, setClickedCard] = useState<AddPrescription | null>(null)
  const [clickedRequestCard, setClickedRequestCard] = useState<RequestTest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails(patientId)
    }
  }, [patientId])

  const fetchPatientDetails = async (id: string) => {
    try {
      const response = await fetch(`https://api.caregiverhospital.com/patient/patient/${id}/`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient details")
      }
      const data = (await response.json()) as Patient
      setPatient(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching patient details:", error)
      setLoading(false)
    }
  }
  const handleGoBack = () => {
    router.back()
  }

  const handleCardClick = (results: AddPrescription) => {
    setClickedCard(results)
    setIsModalOpen(true)
  }

  const handleTestClick = (results: RequestTest) => {
    setClickedRequestCard(results)
    setIsRequestModalOpen(true)
  }
  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />

            {patient && (
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
                      <p>{patient.heart_rate || "N/A"}</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-02.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Body Temperature</h3>
                      <p>
                        {patient.body_temperature || "N/A"} <small>°C</small>
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-03.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Glucose Level</h3>
                      <p>{patient.glucose_level || "N/A"}</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-04.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Blood Pressure</h3>
                      <p>{patient.blood_pressure || "N/A"} mg/dl</p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 max-md:flex-col">
                    <div className="md:w-1/4">
                      <div className="flex flex-col justify-center rounded-md border px-4 py-8">
                        <div className="flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#46ffa6]">
                            <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
                          </div>
                          {/* <Image src="/default_patient_image.png" height={60} width={60} alt="Patient Image" /> */}
                        </div>
                        <h1 className="mt-3 text-center font-bold capitalize xl:text-sm">{patient.name}</h1>
                        <p className="text-center text-base font-bold xl:text-sm">
                          Patient ID: <span className="font-normal xl:text-sm">{patient.id}</span>
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <MdLocationPin />
                          {patient.address}
                        </div>
                        <div className="my-4 flex w-full border"></div>
                        <div className="">
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Phone</p>
                            <p className="xl:text-sm">{patient.phone_no}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Age</p>
                            <p className="xl:text-sm">{patient.dob}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Blood Group</p>
                            <p className="xl:text-sm">{patient.blood_group || "N/A"}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">HMO Name</p>
                            <p className="xl:text-sm">{patient.hmo.name || "N/A"}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="xl:text-sm">Policy ID</p>
                            <p className="xl:text-sm">{patient.policy_id || "N/A"}</p>
                          </div>
                        </div>
                        <div className="mt-6 flex w-full flex-col gap-2 ">
                          <button
                            onClick={() => handleCardClick(patient)}
                            className="button-primary h-[40px] w-full whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm"
                          >
                            Add Prescription
                          </button>
                          <button
                            onClick={() => handleTestClick(patient)}
                            className="button-primary h-[40px] w-full whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm"
                          >
                            Request Lab Test
                          </button>
                        </div>
                      </div>

                      <div className="py-2">
                        <h3 className="mb-1 font-bold">Allergies</h3>
                        <div className="flex flex-wrap">
                          {patient.allergies
                            ? patient.allergies.split(",").map((allergy, index) => (
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
                            <p>{patient.nok_name}</p>
                            <Link href={`tel:${patient.nok_phone_no}`}>
                              <Image src="/phone.svg" height={18} width={18} alt="Call" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-3/4">
                      <PatientDetailsForDoctor params={{ patientId }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Footer />
          </div>
        </div>
      </section>
      {isModalOpen && clickedCard && (
        <PrescriptionModal results={clickedCard} onClose={() => setIsModalOpen(false)} userId={""} />
      )}
      {isRequestModalOpen && clickedRequestCard && (
        <LabTestModal results={clickedRequestCard} onClose={() => setIsRequestModalOpen(false)} userId={""} />
      )}
    </>
  )
}

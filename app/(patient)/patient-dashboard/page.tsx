"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import DashboardNav from "components/Navbar/DashboardNav"
import Image from "next/image"
import { MdLocationPin } from "react-icons/md"
import { IoMdArrowBack } from "react-icons/io"
import Link from "next/link"
import { IoEyeSharp, IoPrintOutline } from "react-icons/io5"
import PatientNav from "components/Navbar/PatientNav"
import Footer from "components/Footer/Footer"
import PrintRecordModal from "components/Modals/PrintRecordModal"

interface Appointment {
  id: number
  doctor: string
  pub_date: string
  detail: string
}

interface Prescription {
  id: string
  doctor_name: string
  category: string
  name: string
  complain: string
  code: string
  unit: string
  dosage: string
  rate: string
  usage: string
  discount_value: string
  note: string
  status: boolean
  pub_date: string
}

interface MedicalRecord {
  id: string
  doctor_name: string
  doctor_request_title: string
  doctor_request_description: string
  test_type: string
  result: string
  pub_date: string

  status_note: string
  discount_value: string
  lab_parameters?: {
    id: string
    param_title: string
    param_result: string
    param_unit: string
    param_range: string
  }[]
}

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
  appointments: { id: number; doctor: string; pub_date: string; detail: string }[]
  prescriptions: {
    id: string
    category: string
    name: string
    complain: string
    code: string
    unit: string
    dosage: string
    rate: string
    usage: string
    note: string
    status: boolean
    pub_date: string
    doctor_name: string
    discount_value: string
  }[]
  lab_tests: {
    id: string
    doctor_name: string
    doctor_request_title: string
    doctor_request_description: string
    test_type: string
    result: string
    pub_date: string
    payment_status?: string
    status_note: string
    discount_value: string
    lab_parameters: {
      id: string
      param_title: string
      param_result: string
      param_unit: string
      param_range: string
    }[]
  }[]
  testt: {
    id: string
    title: string
    detail: string
    test_range: string
  }[]
}

const PatientDetailPage: React.FC = () => {
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter() // Initialize the router
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const id = localStorage.getItem("id")

      if (!id) {
        router.push("/login") // Redirect to login if no ID found
        return
      }

      try {
        const response = await axios.get(`https://api2.caregiverhospital.com/patient/patient/get/detail/${id}/`)
        setPatient(response.data)
      } catch (error) {
        setError("Failed to fetch patient details.")
      } finally {
        setLoading(false)
      }
    }

    fetchPatientDetails()
  }, [router])

  const handleViewClick = (record: MedicalRecord) => {
    const recordWithPatientName = {
      ...record,
      patient_name: patient?.name,
      patient_id: patient?.id,
      lab_parameters: record.lab_parameters,
    }
    setSelectedRecord(recordWithPatientName)
    setModalVisible(true)
  }

  if (loading) {
    return (
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <PatientNav />
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

  if (error) {
    return <div>{error}</div>
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <div>
              <PatientNav />
              {patient && (
                <div className="px-16 max-md:px-3 sm:py-10">
                  {/* <button className="redirect">
                    <IoMdArrowBack />
                    <p className="capitalize">Go back</p>
                  </button> */}
                  <div className="pt-10">
                    <div className="mb-3 grid w-full grid-cols-4 gap-2 max-sm:grid-cols-2">
                      <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                        <Image src="/pt-dashboard-01.svg" height={40} width={40} alt="" />
                        <h3 className="py-2 font-bold">Heart Rate</h3>
                        <p>{patient.heart_rate || "N/A"} bpm</p>
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
                        <h3 className="py-2 font-bold">SPO2</h3>
                        <p>{patient.glucose_level || "N/A"} %</p>
                      </div>
                      <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                        <Image src="/pt-dashboard-04.svg" height={40} width={40} alt="" />
                        <h3 className="py-2 font-bold">Blood Pressure</h3>
                        <p>{patient.blood_pressure || "N/A"} mmHg</p>
                      </div>
                    </div>
                    <div className="flex justify-between gap-2 max-md:flex-col">
                      <div className="md:w-1/4">
                        <div className="flex flex-col justify-center rounded-md border px-4 py-8">
                          <div className="flex items-center justify-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#46FFA6]">
                              <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
                            </div>
                            {/* <Image src="/default_patient_image.png" height={60} width={60} alt="Patient Image" /> */}
                          </div>
                          <h1 className="mt-3 text-center font-bold capitalize xl:text-sm">{patient.name}</h1>
                          <p className="text-center text-base font-bold xl:text-sm">
                            Patient ID: <span className="font-normal xl:text-sm">{patient.policy_id}</span>
                          </p>
                          <div className="flex items-center justify-center gap-1 text-center">
                            <MdLocationPin className="" />
                            <p className="text-center">{patient.address}</p>
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
                            <div className="mt-6 flex w-full gap-2">
                              {/* <button
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
                            </button> */}
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <h3 className="mb-1 font-bold">Allergies</h3>
                          <div className="flex flex-wrap">
                            {patient.allergies
                              ? patient.allergies
                                  .split(",")
                                  .map((allergy: string, index: React.Key | null | undefined) => (
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
                              <p>{patient.nok_name}</p>
                              <Link href={`tel:${patient.nok_phone_no}`}>
                                <Image src="/phone.svg" height={18} width={18} alt="Call" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 md:w-3/4">
                        {/* <PatientDetails params={{ patientId }} /> */}
                        <>
                          <div className="flex flex-col gap-2 max-md:hidden">
                            <h3 className="mb-6 font-semibold">Laboratory Reports</h3>
                            {patient.lab_tests.length > 0 ? (
                              patient.lab_tests.map((record: any) => (
                                <div
                                  key={record.id}
                                  className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
                                >
                                  <div className="flex w-full items-center gap-1 text-sm font-bold">
                                    <span>
                                      {/* <Image src={record.doctor_image} height={40} width={40} alt="" /> */}
                                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46FFA6]">
                                        <p className="capitalize text-[#000000]">{record.doctor_name.charAt(0)}</p>
                                      </div>
                                    </span>
                                    <div>
                                      <p className="text-sm font-bold">{record.doctor_name}</p>
                                      <small className="text-xs">Doctor Name</small>
                                    </div>
                                  </div>

                                  <div className="w-full">
                                    <p className="flex w-full text-sm font-bold">{record.pub_date}</p>
                                    <small className="text-xs">Date</small>
                                  </div>

                                  <div className="w-full">
                                    <p className="text-sm font-bold">{record.test_type}</p>
                                    <small className="text-xs">Test</small>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleViewClick(record)}
                                      className="flex w-28 items-center justify-center gap-1 rounded bg-[#349DFB] px-2 py-[2px] text-xs text-[#000000]"
                                    >
                                      <IoEyeSharp /> View
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No reports available.</p>
                            )}
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Footer />
          </div>
          <PrintRecordModal show={modalVisible} onClose={() => setModalVisible(false)} record={selectedRecord} />
        </div>
      </section>
    </>
  )
}

export default PatientDetailPage

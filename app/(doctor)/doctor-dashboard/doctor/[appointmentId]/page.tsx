"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Appointment } from "utils"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { MdLocationPin } from "react-icons/md"
import { IoMdArrowBack } from "react-icons/io"
import Link from "next/link"
import PatientDetails from "components/Doctor/PatientDetails"
import TestModal from "components/Modals/TestModal"
import PrescriptionModal from "components/Modals/PrescriptionModal"
import LabTestModal from "components/Modals/LabTestModal"

interface AddPrescription {
  id: string
  name: string
}

interface RequestTest {
  id: string
  name: string
}

export default function AppointmentDetailPage({ params }: { params: { appointmentId: string } }) {
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [clickedCard, setClickedCard] = useState<AddPrescription | null>(null)
  const [clickedRequestCard, setClickedRequestCard] = useState<RequestTest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false)
  const router = useRouter()
  const { appointmentId } = params

  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleGoBack = () => {
    router.back()
  }

  const results = Appointment.find((appointment) => appointment.id === appointmentId)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
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

            {results && (
              <div className="px-16 py-10 ">
                <button
                  onClick={handleGoBack}
                  className="flex content-center items-center gap-1 rounded-full bg-[#D0D0D0] px-2 py-2"
                >
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <div className="pt-10">
                  <div className="mb-3 flex w-full gap-2">
                    <div className="auth flex w-full flex-col items-center justify-center rounded border py-2 max-xl:h-[171px]">
                      <Image src="/pt-dashboard-01.svg" height={64} width={64} alt="" />
                      <h3 className="max-xl:h-[171px]:py-4 py-2 font-bold">Heart Rate</h3>
                      <p>{results.heart_rate}</p>
                    </div>
                    <div className="auth flex w-full flex-col items-center justify-center rounded border py-2 max-xl:h-[171px]">
                      <Image src="/pt-dashboard-02.svg" height={64} width={64} alt="" />
                      <h3 className="max-xl:h-[171px]:py-4 py-2 font-bold">Body Temperature</h3>
                      <p>
                        {results.body_temperature} <small>c</small>
                      </p>
                    </div>
                    <div className="auth flex w-full flex-col items-center justify-center rounded border py-2 max-xl:h-[171px]">
                      <Image src="/pt-dashboard-03.svg" height={64} width={64} alt="" />
                      <h3 className="max-xl:h-[171px]:py-4 py-2 font-bold">Glucose Level</h3>
                      <p>{results.glocuse_level}</p>
                    </div>
                    <div className="auth flex w-full flex-col items-center justify-center rounded border py-2 max-xl:h-[171px]">
                      <Image src="/pt-dashboard-04.svg" height={64} width={64} alt="" />
                      <h3 className="max-xl:h-[171px]:py-4 py-2 font-bold">Blood Pressure</h3>
                      <p>{results.blood_pressure} mg//dl</p>
                    </div>
                  </div>
                  <div className="flex  justify-between gap-2 ">
                    <div className="w-1/4">
                      <div className="flex flex-col  justify-center rounded-md border px-4 py-4">
                        <div className="flex items-center justify-center">
                          <Image src={results.image} height={60} width={60} alt="" />
                        </div>
                        <h1 className="mt-3 text-center font-bold xl:text-sm">{results.name}</h1>
                        <p className="text-center text-base font-bold xl:text-sm">
                          Patient ID: <span className="font-normal xl:text-sm">{results.id}</span>
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <MdLocationPin />
                          {results.location}
                        </div>
                        <div className="my-4 flex w-full border"></div>
                        <div className="">
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Phone</p>
                            <p className="xl:text-sm">{results.contact}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Age</p>
                            <p className="xl:text-sm">{results.age}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Blood Group</p>
                            <p className="xl:text-sm">{results.blood_group}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">HMO Name</p>
                            <p className="xl:text-sm">{results.hmo_name}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="xl:text-sm">Policy ID</p>
                            <p className="xl:text-sm">{results.hmo_id}</p>
                          </div>
                          <div className="mt-6 flex w-full flex-col gap-2 ">
                            <button
                              onClick={() => handleCardClick(results)}
                              className="button-primary h-[40px] w-full whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm"
                            >
                              Add Prescription
                            </button>
                            <button
                              onClick={() => handleTestClick(results)}
                              className="button-primary h-[40px] w-full whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm"
                            >
                              Request Lab Test
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <h3 className="mb-1 font-bold">Allergies</h3>
                        <div className="flex flex-wrap">
                          {results.allergies.split(",").map((allergy, index) => (
                            <div key={index} className="w-1/2">
                              <p className="m-1 rounded bg-[#F2B8B5] p-1 text-center font-medium capitalize text-[#601410]">
                                {allergy.trim()}
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 text-right font-medium">see all</p>
                      </div>

                      <div className="py-2">
                        <div className="nok_area">
                          <h4 className="mb-2 font-medium">Next of Kin</h4>
                          <div className="flex justify-between">
                            <p>{results.next_of_kin}</p>
                            <Link href={results.nok_contact}>
                              <Image src="/phone.svg" height={18} width={18} alt="" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-3/4">
                      <PatientDetails params={{ appointmentId }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Footer />
          </div>
        </div>
      </section>
      {isModalOpen && clickedCard && <PrescriptionModal results={clickedCard} onClose={() => setIsModalOpen(false)} />}
      {isRequestModalOpen && clickedRequestCard && (
        <LabTestModal results={clickedRequestCard} onClose={() => setIsRequestModalOpen(false)} />
      )}
    </>
  )
}

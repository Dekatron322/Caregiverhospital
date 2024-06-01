"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Patient } from "utils"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { MdLocationPin } from "react-icons/md"
import { IoMdArrowBack } from "react-icons/io"
import Link from "next/link"
import PatientDetails from "components/Patient/PatientDetails"
import AdmissionModal from "components/Modals/AdmissionModal"

export default function PatientDetailPage({ params }: { params: { patientId: string } }) {
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const router = useRouter()
  const { patientId } = params

  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleGoBack = () => {
    router.back()
  }

  const patientDetail = Patient.find((patient) => patient.id === patientId)

  let filteredList = patientDetail ? patientDetail.appointment : []

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
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 5000)
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />

            {patientDetail && (
              <div className="px-16 max-md:px-3 sm:py-10 ">
                <button onClick={handleGoBack} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <div className="pt-10">
                  <div className="mb-3 grid w-full grid-cols-4 gap-2 max-sm:grid-cols-2">
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-01.svg" height={40} width={40} alt="" />

                      <h3 className="py-2  font-bold">Heart Rate</h3>
                      <p>{patientDetail.heart_rate}</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-02.svg" height={40} width={40} alt="" />
                      <h3 className="py-2  font-bold">Body Temperature</h3>
                      <p>
                        {patientDetail.body_temperature} <small>c</small>
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-03.svg" height={40} width={40} alt="" />
                      <h3 className="py-2  font-bold">Glucose Level</h3>
                      <p>{patientDetail.glocuse_level}</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-04.svg" height={40} width={40} alt="" />
                      <h3 className="py-2  font-bold">Blood Pressure</h3>
                      <p>{patientDetail.blood_pressure} mg//dl</p>
                    </div>
                  </div>
                  <div className="flex justify-between  gap-2 max-md:flex-col ">
                    <div className="md:w-1/4">
                      <div className="flex flex-col  justify-center rounded-md border px-4 py-8">
                        <div className="flex items-center justify-center">
                          <Image src={patientDetail.image} height={60} width={60} alt="" />
                        </div>
                        <h1 className="mt-3 text-center font-bold xl:text-sm">{patientDetail.name}</h1>
                        <p className="text-center text-base font-bold xl:text-sm">
                          Patient ID: <span className="font-normal xl:text-sm">{patientDetail.id}</span>
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <MdLocationPin />
                          {patientDetail.location}
                        </div>
                        <div className="my-4 flex w-full border"></div>
                        <div className="">
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Phone</p>
                            <p className="xl:text-sm">{patientDetail.contact}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Age</p>
                            <p className="xl:text-sm">{patientDetail.age}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Blood Group</p>
                            <p className="xl:text-sm">{patientDetail.blood_group}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">HMO Name</p>
                            <p className="xl:text-sm">{patientDetail.hmo_name}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="xl:text-sm">Policy ID</p>
                            <p className="xl:text-sm">{patientDetail.hmo_id}</p>
                          </div>
                          <div className="mt-6 flex w-full gap-2 ">
                            <button className="button-primary h-[40px] w-[60%] whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm">
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
                          {patientDetail.allergies.split(",").map((allergy, index) => (
                            <div key={index} className="w-1/2">
                              <p className="m-1 rounded bg-[#F2B8B5] p-1 text-center text-sm font-medium capitalize text-[#601410]">
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
                            <p>{patientDetail.next_of_kin}</p>
                            <Link href={patientDetail.nok_contact}>
                              <Image src="/phone.svg" height={18} width={18} alt="" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 md:w-3/4">
                      <PatientDetails params={{ patientId }} />
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
        patientId={patientId}
      />
    </>
  )
}

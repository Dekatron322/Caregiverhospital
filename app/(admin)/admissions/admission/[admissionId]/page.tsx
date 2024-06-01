"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Admissions } from "utils"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { MdLocationPin } from "react-icons/md"
import { IoMdArrowBack } from "react-icons/io"
import Link from "next/link"
import { PiDotsThree } from "react-icons/pi"
import { GoPlus } from "react-icons/go"
import AdmissionModal from "components/Modals/AdmissionModal"
import AdministerDrugModal from "components/Modals/AdministerDrugModal"

export default function PatientDetailPage({ params }: { params: { admissionId: string } }) {
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const router = useRouter()
  const { admissionId } = params

  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleGoBack = () => {
    router.back()
  }

  const patientDetail = Admissions.find((patient) => patient.id === admissionId)

  let filteredList = patientDetail ? patientDetail.administered : []

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
              <div className="px-16 py-6 ">
                <button onClick={handleGoBack} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <div className=" mt-10 flex items-center justify-between">
                  <h3 className="font-semibold">Details</h3>
                  <button onClick={openAdmissionModal} className="add-button">
                    <p className="text-xs">Administer Drug</p>
                    <GoPlus />
                  </button>
                </div>
                <div className="pt-10">
                  <div className="flex  justify-between gap-4 ">
                    <div className="w-[30%]">
                      <div className="flex flex-col  justify-center rounded-md border px-4 py-8">
                        <div className="flex items-center justify-center">
                          <Image src={patientDetail.image} height={60} width={60} alt="" />
                        </div>
                        <h1 className="mt-3 text-center font-bold">{patientDetail.name}</h1>
                        <p className="text-center text-base font-bold">
                          Patient ID: <span className="font-normal">{patientDetail.id}</span>
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <MdLocationPin />
                          {patientDetail.location}
                        </div>
                        <div className="my-4 flex w-full border"></div>
                        <div className="">
                          <div className="flex justify-between pb-2">
                            <p>Phone</p>
                            <p>{patientDetail.contact}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p>Age</p>
                            <p>{patientDetail.age}</p>
                          </div>

                          <div className="mt-6 flex w-full gap-2 ">
                            <button
                              onClick={openAdmissionModal}
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
                    <div className="mb-2 flex w-full flex-col">
                      <div className="w-[50%]">
                        <h3 className="mb-6 text-xl font-bold">Doctor's Prescription</h3>
                        <p className="mb-4 font-semibold">Drugs to Administer</p>

                        <p className="my-6">{patientDetail.doctor_prescription}</p>
                        <h3 className="mb-6 text-xl font-bold">Drugs Administered</h3>
                      </div>
                      {filteredList.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="mb-2 flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
                        >
                          <div className="flex items-center gap-2">
                            <div>
                              <Image src={appointment.nurse_image} height={40} width={40} alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{appointment.nurse}</p>
                              <small className="text-xm ">nurse</small>
                            </div>
                          </div>
                          <div className="">
                            <p className="text-sm font-bold">{appointment.medication_name}</p>
                            <small className="text-xm ">Medication name</small>
                          </div>
                          <div className="">
                            <p className="text-sm font-bold">{appointment.category}</p>
                            <small className="text-xm ">Category</small>
                          </div>
                          <div>
                            <p className="text-sm font-bold">{appointment.quantity}</p>
                            <small className="text-xm ">Quantity</small>
                          </div>
                          <div>
                            <p className="text-sm font-bold">{appointment.dosage}</p>
                            <small className="text-xm ">Dosage</small>
                          </div>
                          <div>
                            <p className="text-sm font-bold">{appointment.time}</p>
                            <small className="text-xm ">Time and Date Administered</small>
                          </div>

                          <PiDotsThree />
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
      <AdministerDrugModal
        isOpen={isAdmissionOpen}
        onClose={closeAdmissionModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
        patientId={admissionId}
      />
    </>
  )
}

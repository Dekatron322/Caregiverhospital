"use client"
import React, { useState } from "react"
import { Admissions } from "utils"
import Image from "next/image"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"

const AllAdmission = () => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("all")

  const toggleDone = () => {
    setIsDone(!isDone)
  }

  const handlePatientClick = (admissionId: string) => {
    router.push(`/admissions/admission/${admissionId}`)
  }

  const renderAllAppointments = () => {
    return (
      <>
        <div className="flex flex-col gap-2">
          {Admissions.map((appointment) => (
            <div
              key={appointment.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="flex w-full gap-1 text-sm font-bold">
                <span>
                  <Image src={appointment.image} height={40} width={40} alt="" />
                </span>
                <div>
                  <p>{appointment.name}</p>
                  <small className="text-xm ">Patient</small>
                </div>
              </div>

              <div className="w-full max-md:hidden">
                <p className="text-sm font-bold">{appointment.time}</p>
                <small className="text-xm ">Check in Date</small>
              </div>
              <div className="w-full">
                <p className="text-sm font-bold">{appointment.ward}</p>
                <small className="text-xm ">Ward</small>
              </div>

              <div className="w-full max-md:hidden">
                <p className="text-sm font-bold">{appointment.reason}</p>
                <small className="text-xm ">Reason for check in</small>
              </div>
              <div className=" w-full max-md:hidden">
                <p className="rounded py-[2px] text-xs font-semibold text-[#000000]">{appointment.check_out_date}</p>
                <small className="text-xm ">Chectout date</small>
              </div>
              <div className="">
                <PiDotsThree onClick={() => handlePatientClick(appointment.id)} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderPendingAppointments = () => {
    const pendingAppointments = Admissions.filter((appointment) => appointment.status === "checkin")

    return (
      <>
        <div className="flex flex-col gap-2">
          {pendingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="flex w-full gap-1 text-sm font-bold">
                <span>
                  <Image src={appointment.image} height={40} width={40} alt="" />
                </span>
                <div>
                  <p>{appointment.name}</p>
                  <small className="text-xm ">Patient</small>
                </div>
              </div>

              <div className="w-full max-md:hidden">
                <p className="text-sm font-bold">{appointment.time}</p>
                <small className="text-xm ">Check in Date</small>
              </div>
              <div className=" w-full">
                <p className="text-sm font-bold">{appointment.ward}</p>
                <small className="text-xm ">Ward</small>
              </div>

              <div className="w-full max-md:hidden">
                <p className="text-sm font-bold">{appointment.reason}</p>
                <small className="text-xm ">Reason for check in</small>
              </div>
              <div className="w-full max-md:hidden">
                <p className="rounded py-[2px] text-xs font-semibold text-[#000000]">{appointment.check_out_date}</p>
                <small className="text-xm ">Cheutout date</small>
              </div>
              <div className="">
                <PiDotsThree />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderDoneAppointments = () => {
    const doneAppointments = Admissions.filter((appointment) => appointment.status === "checkout")
    return (
      <>
        <div className="flex flex-col gap-2">
          {doneAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="flex w-full gap-1 text-sm font-bold">
                <span>
                  <Image src={appointment.image} height={40} width={40} alt="" />
                </span>
                <div>
                  <p>{appointment.name}</p>
                  <small className="text-xm ">Patient</small>
                </div>
              </div>

              <div className="w-full max-md:hidden">
                <p className="text-sm font-bold">{appointment.time}</p>
                <small className="text-xm ">Check in Date</small>
              </div>
              <div className="w-full max-md:hidden">
                <p className="text-sm font-bold">{appointment.ward}</p>
                <small className="text-xm ">Ward</small>
              </div>

              <div className="w-full max-md:hidden">
                <p className="text-sm font-bold">{appointment.reason}</p>
                <small className="text-xm ">Reason for check in</small>
              </div>
              <div className="w-full max-md:hidden">
                <p className="rounded py-[2px] text-xs font-semibold text-[#000000]">{appointment.check_out_date}</p>
                <small className="text-xm ">Cheutout date</small>
              </div>
              <div className="">
                <PiDotsThree />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <div className="tab-bg mb-8 flex w-[245px] items-center gap-3 rounded-lg p-1 md:border">
        <button
          className={`${activeTab === "all" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`${activeTab === "checkin" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("checkin")}
        >
          Check-Ins
        </button>

        <button
          className={`${activeTab === "checkout" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("checkout")}
        >
          Check-Outs
        </button>
      </div>

      {activeTab === "all" ? renderAllAppointments() : null}
      {activeTab === "checkin" ? renderPendingAppointments() : null}
      {activeTab === "checkout" ? renderDoneAppointments() : null}
    </div>
  )
}

export default AllAdmission

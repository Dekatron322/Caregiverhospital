"use client"
import React, { useState } from "react"
import { Appointment } from "utils"
import Image from "next/image"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"

const Appointments = () => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("all")

  const toggleDone = () => {
    setIsDone(!isDone)
  }

  const renderAllAppointments = () => {
    return (
      <>
        <div className="flex flex-col gap-2  ">
          {Appointment.map((appointment) => (
            <div
              key={appointment.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="my-4 flex w-[20%] content-center items-center gap-2" onClick={toggleDone}>
                {appointment.status === "done" ? (
                  <Image src="/checkbox1.svg" width={14} height={14} alt="checkbox" />
                ) : (
                  <Image src="/checkbox.svg" width={14} height={14} alt="checkbox" />
                )}
              </div>
              <div className="w-[60%]  max-md:hidden">
                <p className="text-sm font-bold">{appointment.id}</p>
                <p className="text-xs ">ID</p>
              </div>
              <div className="w-full">
                <p className="text-sm font-bold">{appointment.name}</p>
                <p className="text-xs ">Name</p>
              </div>
              <div className="w-full max-md:hidden">
                <div className="flex gap-1 text-sm font-bold">
                  <span>
                    <Image src={appointment.doctor_image} height={20} width={20} alt="" />
                  </span>
                  {appointment.doctor_assigned}
                </div>
                <p className="text-xs ">Doctor Assigned</p>
              </div>
              <div className="w-full max-md:hidden">
                <p className="text-sm font-bold">{appointment.time}</p>
                <p className="text-xs ">Time</p>
              </div>
              <div className="w-full ">
                <div className=" w-[100px] ">
                  <p className="rounded bg-[#46FFA6] px-2 py-[2px] text-center text-xs text-[#000000]">
                    {appointment.complain}
                  </p>
                  <p className="text-xs ">complain</p>
                </div>
              </div>
              <div>
                <PiDotsThree />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderPendingAppointments = () => {
    const pendingAppointments = Appointment.filter((appointment) => appointment.status === "pending")

    return (
      <>
        <div className="flex flex-col gap-2  ">
          {pendingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="my-4 flex content-center items-center gap-2" onClick={toggleDone}>
                {appointment.status === "done" ? (
                  <Image src="/checkbox1.svg" width={14} height={14} alt="checkbox" />
                ) : (
                  <Image src="/checkbox.svg" width={14} height={14} alt="checkbox" />
                )}
              </div>
              <div className="max-md:hidden">
                <p className="text-sm font-bold">{appointment.id}</p>
                <p className="text-xs">ID</p>
              </div>
              <div className="">
                <p className="text-sm font-bold">{appointment.name}</p>
                <p className="text-xs">Name</p>
              </div>
              <div className="max-md:hidden">
                <div className="flex gap-1 text-sm font-bold">
                  <span>
                    <Image src={appointment.doctor_image} height={20} width={20} alt="" />
                  </span>
                  {appointment.doctor_assigned}
                </div>
                <p className="text-xs">Doctor Assigned</p>
              </div>
              <div className="max-md:hidden">
                <p className="text-sm font-bold">{appointment.time}</p>
                <p className="text-xs">Time</p>
              </div>
              <div>
                <p className="rounded bg-[#46FFA6] px-2 py-[2px] text-xs text-[#000000]">{appointment.complain}</p>
                <small className="text-xs">complain</small>
              </div>
              <PiDotsThree />
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderDoneAppointments = () => {
    const doneAppointments = Appointment.filter((appointment) => appointment.status === "done")
    return (
      <>
        <div className="flex flex-col gap-2  ">
          {doneAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="my-4 flex content-center items-center gap-2" onClick={toggleDone}>
                {appointment.status === "done" ? (
                  <Image src="/checkbox1.svg" width={14} height={14} alt="checkbox" />
                ) : (
                  <Image src="/checkbox.svg" width={14} height={14} alt="checkbox" />
                )}
              </div>
              <div className=" max-md:hidden">
                <p className="text-sm font-bold">{appointment.id}</p>
                <p className="text-xs">ID</p>
              </div>
              <div className="">
                <p className="text-sm font-bold">{appointment.name}</p>
                <p className="text-xs">Name</p>
              </div>
              <div className="max-md:hidden">
                <div className="flex gap-1 text-sm font-bold">
                  <span>
                    <Image src={appointment.doctor_image} height={20} width={20} alt="" />
                  </span>
                  {appointment.doctor_assigned}
                </div>
                <p className="text-xs">Doctor Assigned</p>
              </div>
              <div className="max-md:hidden">
                <p className="text-sm font-bold">{appointment.time}</p>
                <small className="text-xs">Time</small>
              </div>
              <div>
                <p className="rounded bg-[#46FFA6] px-2 py-[2px] text-xs text-[#000000]">{appointment.complain}</p>
                <p className="text-xs">complain</p>
              </div>

              <PiDotsThree />
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <div className="tab-bg mb-8 flex w-[190px] items-center gap-3 rounded-lg p-1 md:border">
        <button
          className={`${activeTab === "all" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`${activeTab === "pending" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>

        <button
          className={`${activeTab === "done" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("done")}
        >
          Done
        </button>
      </div>

      {activeTab === "all" ? renderAllAppointments() : null}
      {activeTab === "pending" ? renderPendingAppointments() : null}
      {activeTab === "done" ? renderDoneAppointments() : null}
    </div>
  )
}

export default Appointments

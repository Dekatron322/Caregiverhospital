"use client"
import React, { useState } from "react"
import { Request } from "utils"
import Image from "next/image"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"

const IssueRequest = () => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("pending")

  const toggleDone = () => {
    setIsDone(!isDone)
  }

  const renderPendingRequests = () => {
    const pendingrequests = Request.filter((request) => request.status === "pending")

    return (
      <>
        <div className="flex flex-col gap-2  ">
          {pendingrequests.map((request) => (
            <div
              key={request.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="w-full">
                <p className="text-sm font-bold">{request.name}</p>
                <small className="text-xs">Medicine Name</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{request.medicine_id}</p>
                <small className="text-xs">Medicine ID</small>
              </div>
              <div className="w-full max-sm:hidden">
                <div className="flex gap-1 text-sm font-bold">{request.category_name}</div>
                <small className="text-xs">Category Name</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{request.time}</p>
                <small className="text-xs">Time</small>
              </div>
              <div className="w-full">
                <p className="rounded  py-[2px] text-xs">{request.patient_name}</p>
                <small className="text-xs">Patient Name</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="rounded  py-[2px] text-xs">{request.patient_id}</p>
                <small className="text-xs">patient ID</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="rounded  py-[2px] text-xs">{request.requested}</p>
                <small className="text-xs">Request by</small>
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

  const renderIssuedRequests = () => {
    const issuedRequests = Request.filter((request) => request.status === "issued")
    return (
      <>
        <div className="flex flex-col gap-2  ">
          {issuedRequests.map((request) => (
            <div
              key={request.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="w-full">
                <p className="text-sm font-bold">{request.name}</p>
                <small className="text-xs">Medicine Name</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{request.medicine_id}</p>
                <small className="text-xs">Medicine ID</small>
              </div>
              <div className="w-full max-sm:hidden">
                <div className="flex gap-1 text-sm font-bold">{request.category_name}</div>
                <small className="text-xs">Category Name</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{request.time}</p>
                <small className="text-xs">Time</small>
              </div>
              <div className="w-full">
                <p className="rounded  py-[2px] text-xs">{request.patient_name}</p>
                <small className="text-xs">Patient Name</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="rounded  py-[2px] text-xs">{request.patient_id}</p>
                <small className="text-xs">patient ID</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="rounded  py-[2px] text-xs">{request.requested}</p>
                <small className="text-xs">Request by</small>
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

  const renderCancelledRquests = () => {
    const cancelledRequests = Request.filter((request) => request.status === "cancelled")
    return (
      <>
        <div className="flex flex-col gap-2">
          {cancelledRequests.map((request) => (
            <div
              key={request.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="w-full">
                <p className="text-sm font-bold">{request.name}</p>
                <small className="text-xs">Medicine Name</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{request.medicine_id}</p>
                <small className="text-xs">Medicine ID</small>
              </div>
              <div className="w-full max-sm:hidden">
                <div className="flex gap-1 text-sm font-bold">{request.category_name}</div>
                <small className="text-xs">Category Name</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{request.time}</p>
                <small className="text-xs">Time</small>
              </div>
              <div className="w-full">
                <p className="rounded  py-[2px] text-xs">{request.patient_name}</p>
                <small className="text-xs">Patient Name</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="rounded  py-[2px] text-xs">{request.patient_id}</p>
                <small className="text-xs">patient ID</small>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="rounded  py-[2px] text-xs">{request.requested}</p>
                <small className="text-xs">Request by</small>
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
      <div className="tab-bg mb-8 flex w-[240px] items-center gap-3 rounded-lg p-1 md:border">
        <button
          className={`${activeTab === "pending" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={`${activeTab === "issued" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("issued")}
        >
          Issued
        </button>

        <button
          className={`${activeTab === "cancelled" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {activeTab === "pending" ? renderPendingRequests() : null}
      {activeTab === "issued" ? renderIssuedRequests() : null}
      {activeTab === "cancelled" ? renderCancelledRquests() : null}
    </div>
  )
}

export default IssueRequest

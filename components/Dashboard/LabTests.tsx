"use client"
import React, { useState } from "react"
import { LabTestResults } from "utils"
import Image from "next/image"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"
import TestModal from "components/Modals/TestModal"

interface LabTestResult {
  id: string
  name: string
  test_type: string
  // Add other properties here
}

const LabTests = () => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("all")
  const [clickedCard, setClickedCard] = useState<LabTestResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleCardClick = (results: LabTestResult) => {
    setClickedCard(results)
    setIsModalOpen(true)
  }

  const toggleDone = () => {
    setIsDone(!isDone)
  }

  const getStatusColor = (status: any) => {
    switch (status) {
      case "approved":
        return "bg-green-200"
      case "awaiting specimen":
        return "bg-[#F2B8B5]"
      case "discarded":
        return "bg-gray-200"
      default:
        return "bg-gray-200"
    }
  }

  const renderAllResults = () => {
    return (
      <>
        <div className="flex flex-col gap-2  ">
          {LabTestResults.map((results) => (
            <div
              key={results.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="w-full">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="max-sm:hidden">
                    <Image src={results.image} height={50} width={50} alt="" />
                  </span>
                  <div>
                    <p className="text-sm">{results.name}</p>
                    <p className="text-xs ">HMO ID: {results.hmo_id}</p>
                    <p className="text-xs ">
                      {results.gender}, {results.age} years old
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{results.test_type}</p>
                <p className="text-xs ">Description</p>
              </div>
              <div className="w-full ">
                <p
                  className={`w-32 rounded ${getStatusColor(
                    results.status
                  )} px-2 py-[2px] text-center text-xs text-[#000000]`}
                >
                  {results.status}
                </p>
              </div>

              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">requested by {results.doctor}</p>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold"> {results.time}</p>
              </div>
              <div>
                <PiDotsThree onClick={() => handleCardClick(results)} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderApprovedResults = () => {
    const approvedResults = LabTestResults.filter((results) => results.status === "approved")

    return (
      <>
        <div className="flex flex-col gap-2">
          {approvedResults.map((results) => (
            <div
              key={results.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="w-full">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="max-sm:hidden">
                    <Image src={results.image} height={50} width={50} alt="" />
                  </span>
                  <div>
                    <p className="text-sm">{results.name}</p>
                    <p className="text-xs ">HMO ID: {results.hmo_id}</p>
                    <p className="text-xs ">
                      {results.gender}, {results.age} years old
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{results.test_type}</p>
                <p className="text-xs ">Description</p>
              </div>
              <div className="w-full ">
                <p
                  className={`w-32 rounded ${getStatusColor(
                    results.status
                  )} px-2 py-[2px] text-center text-xs text-[#000000]`}
                >
                  {results.status}
                </p>
              </div>

              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">requested by {results.doctor}</p>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold"> {results.time}</p>
              </div>
              <div>
                <PiDotsThree onClick={() => handleCardClick(results)} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderAwaitingResults = () => {
    const awaitingResults = LabTestResults.filter((results) => results.status === "awaiting specimen")

    return (
      <>
        <div className="flex flex-col gap-2 ">
          {awaitingResults.map((results) => (
            <div
              key={results.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="w-full">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="max-sm:hidden">
                    <Image src={results.image} height={50} width={50} alt="" />
                  </span>
                  <div>
                    <p className="text-sm">{results.name}</p>
                    <p className="text-xs ">HMO ID: {results.hmo_id}</p>
                    <p className="text-xs ">
                      {results.gender}, {results.age} years old
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{results.test_type}</p>
                <small className="text-xs ">Description</small>
              </div>
              <div className="w-full">
                <p
                  className={`w-32 rounded ${getStatusColor(
                    results.status
                  )} px-2 py-[2px] text-center text-xs text-[#000000]`}
                >
                  {results.status}
                </p>
              </div>

              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">requested by {results.doctor}</p>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold"> {results.time}</p>
              </div>
              <div>
                <PiDotsThree onClick={() => handleCardClick(results)} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderDiscardedResults = () => {
    const discardResults = LabTestResults.filter((results) => results.status === "discarded")

    return (
      <>
        <div className="flex flex-col gap-2 ">
          {discardResults.map((results) => (
            <div
              key={results.id}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              <div className="w-full">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="max-sm:hidden">
                    <Image src={results.image} height={50} width={50} alt="" />
                  </span>
                  <div>
                    <p className="text-sm">{results.name}</p>
                    <p className="text-xs ">HMO ID: {results.hmo_id}</p>
                    <p className="text-xs ">
                      {results.gender}, {results.age} years old
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{results.test_type}</p>
                <small className="text-xs ">Description</small>
              </div>
              <div className="w-full">
                <p
                  className={`w-32 rounded ${getStatusColor(
                    results.status
                  )} px-2 py-[2px] text-center text-xs text-[#000000]`}
                >
                  {results.status}
                </p>
              </div>

              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">requested by {results.doctor}</p>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold"> {results.time}</p>
              </div>
              <div>
                <PiDotsThree onClick={() => handleCardClick(results)} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <div className="tab-bg mb-8 flex items-center gap-3 rounded-lg p-1 md:w-[350px] md:border">
        <button
          className={`${activeTab === "all" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`${activeTab === "approved" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>

        <button
          className={`${
            activeTab === "awaiting specimen" ? "active-tab whitespace-nowrap" : "inactive-tab whitespace-nowrap"
          }`}
          onClick={() => setActiveTab("awaiting specimen")}
        >
          Awaiting Approval
        </button>

        <button
          className={`${activeTab === "discarded" ? "active-tab whitespace-nowrap" : "inactive-tab whitespace-nowrap"}`}
          onClick={() => setActiveTab("discarded")}
        >
          Discarded
        </button>
        {isModalOpen && clickedCard && <TestModal results={clickedCard} onClose={() => setIsModalOpen(false)} />}
      </div>

      {activeTab === "all" ? renderAllResults() : null}
      {activeTab === "approved" ? renderApprovedResults() : null}
      {activeTab === "awaiting specimen" ? renderAwaitingResults() : null}
      {activeTab === "discarded" ? renderDiscardedResults() : null}
    </div>
  )
}

export default LabTests

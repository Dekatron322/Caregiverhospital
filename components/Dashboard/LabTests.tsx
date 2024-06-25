import React, { useState, useEffect } from "react"
import axios from "axios"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"
import TestModal from "components/Modals/TestModal"

interface LabTestResult {
  id: string
  name: string
  test_type: string
  status: string
  image: string
  hmo_id: string
  gender: string
  age: number
  doctor: string
  time: string
}

const LabTests = () => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("all")
  const [clickedCard, setClickedCard] = useState<LabTestResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [labTestResults, setLabTestResults] = useState<LabTestResult[]>([])

  useEffect(() => {
    const fetchLabTestResults = async () => {
      try {
        const response = await axios.get("https://api.caregiverhospital.com/patient/patient/")
        const results = response.data.flatMap((patient: any) =>
          patient.lab_tests.map((test: any) => ({
            id: test.id,
            name: patient.name,
            test_type: test.test,
            status: test.status_note,
            image: patient.image,
            hmo_id: patient.hmo.id,
            gender: patient.gender,
            age: new Date().getFullYear() - new Date(patient.dob).getFullYear(),
            doctor: test.doctor_name,
            time: test.pub_date,
          }))
        )
        setLabTestResults(results)
      } catch (error) {
        console.error("Error fetching lab test results:", error)
      }
    }

    fetchLabTestResults()
  }, [])

  const handleCardClick = (results: LabTestResult) => {
    setClickedCard(results)
    setIsModalOpen(true)
  }

  const toggleDone = () => {
    setIsDone(!isDone)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const renderResults = (filter: (results: LabTestResult) => boolean) => {
    return (
      <div className="flex flex-col gap-2">
        {labTestResults.filter(filter).map((results) => (
          <div
            key={results.id}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
          >
            <div className="w-full">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className="max-sm:hidden">
                  {/* <Image src={results.image} height={50} width={50} alt="" /> */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#46ffa6]">
                    <p className="capitalize text-[#000000]">{results.name.charAt(0)}</p>
                  </div>
                </span>

                <div>
                  <p className="text-sm">{results.name}</p>
                  <p className="text-xs">HMO ID: {results.hmo_id}</p>
                  <p className="text-xs">
                    {results.gender}, {results.age} years old
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full max-sm:hidden">
              <p className="text-sm font-bold">{results.test_type}</p>
              <p className="text-xs">Description</p>
            </div>
            <div className="w-full">
              <p
                className={`w-32 rounded ${getStatusColor(
                  results.status
                )} px-2 py-[6px] text-center text-xs text-[#000000]`}
              >
                {results.status}
              </p>
            </div>

            <div className="w-full max-sm:hidden">
              <p className="text-sm font-bold">Requested by {results.doctor}</p>
            </div>
            <div className="w-full max-sm:hidden">
              <p className="text-sm font-bold">{formatDate(results.time)}</p>
            </div>
            <div>
              <PiDotsThree onClick={() => handleCardClick(results)} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <div className="tab-bg mb-8 flex items-center gap-3 rounded-lg p-1 md:w-[358px] md:border">
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
            activeTab === "not approved" ? "active-tab whitespace-nowrap" : "inactive-tab whitespace-nowrap"
          }`}
          onClick={() => setActiveTab("not approved")}
        >
          Not Approved
        </button>

        <button
          className={`${activeTab === "discarded" ? "active-tab whitespace-nowrap" : "inactive-tab whitespace-nowrap"}`}
          onClick={() => setActiveTab("discarded")}
        >
          Discarded
        </button>
        {isModalOpen && clickedCard && <TestModal results={clickedCard} onClose={() => setIsModalOpen(false)} />}
      </div>

      {activeTab === "all" && renderResults(() => true)}
      {activeTab === "approved" && renderResults((results) => results.status.toLowerCase() === "approved")}
      {activeTab === "not approved" && renderResults((results) => results.status.toLowerCase() === "not approved")}
      {activeTab === "discarded" && renderResults((results) => results.status.toLowerCase() === "discarded")}
    </div>
  )
}

export default LabTests

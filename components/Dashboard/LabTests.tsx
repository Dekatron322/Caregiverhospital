import React, { useEffect, useState } from "react"
import axios from "axios"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"
import TestModal from "components/Modals/TestModal"
import AOS from "aos"
import "aos/dist/aos.css"

interface LabTestResult {
  id: string
  name: string
  doctor_name: string
  test_type: string
  status_note: string
  pub_date: string
}

const LabTests = () => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("all")
  const [clickedCard, setClickedCard] = useState<LabTestResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [labTestResults, setLabTestResults] = useState<LabTestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  useEffect(() => {
    const fetchLabTestResults = async () => {
      try {
        const response = await axios.get("https://api.caregiverhospital.com/lab-test/lab-test/")
        console.log(response.data) // Check the complete data
        setLabTestResults(response.data) // Set the full response directly
      } catch (error) {
        console.error("Error fetching lab test results:", error)
      } finally {
        setIsLoading(false)
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
      case "not approved":
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#46ffa6]">
                    <p className="capitalize text-[#000000]">{results.doctor_name.charAt(0)}</p>
                  </div>
                </span>
                <div>
                  <p className="text-sm">Doctor: {results.doctor_name}</p>
                  <p className="text-xs">Test Type: {results.test_type || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="w-full">
              <p
                className={`w-32 rounded ${getStatusColor(
                  results.status_note
                )} px-2 py-[6px] text-center text-xs text-[#000000]`}
              >
                {results.status_note}
              </p>
            </div>
            <div className="w-full max-sm:hidden">
              <p className="text-sm font-bold">{formatDate(results.pub_date)}</p>
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
    <>
      <div className="flex w-full flex-col" data-aos="fade-in" data-aos-duration="1000" data-aos-delay="500">
        {isLoading ? (
          <div className="loading-text flex h-full items-center justify-center">
            {"loading...".split("").map((letter, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                {letter}
              </span>
            ))}
          </div>
        ) : (
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
              className={`${
                activeTab === "discarded" ? "active-tab whitespace-nowrap" : "inactive-tab whitespace-nowrap"
              }`}
              onClick={() => setActiveTab("discarded")}
            >
              Discarded
            </button>
          </div>
        )}

        {activeTab === "all" && renderResults(() => true)}
        {activeTab === "approved" && renderResults((results) => results.status_note.toLowerCase() === "approved")}
        {activeTab === "not approved" &&
          renderResults((results) => results.status_note.toLowerCase() === "not approved")}
        {activeTab === "discarded" && renderResults((results) => results.status_note.toLowerCase() === "discarded")}
      </div>
      {isModalOpen && clickedCard && <TestModal results={clickedCard} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

export default LabTests

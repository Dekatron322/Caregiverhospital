import React, { useEffect, useState } from "react"
import axios from "axios"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"

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

const LabResults = () => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [clickedCard, setClickedCard] = useState<LabTestResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [labTestResults, setLabTestResults] = useState<LabTestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handlePatientClick = (patientId: any) => {
    localStorage.setItem("selectedPatientId", patientId)
    router.push(`/reports/report`)
  }

  useEffect(() => {
    const fetchLabTestResults = async () => {
      try {
        const response = await axios.get("https://api2.caregiverhospital.com/patient/patient/")
        const results = response.data.flatMap((patient: any) =>
          patient.lab_tests
            .filter((test: any) => test.status_note.toLowerCase() === "approved") // Filter for approved tests
            .map((test: any) => ({
              id: patient.id,
              name: patient.name,
              test_type: test.test,
              status: test.status_note,
              image: patient.image,
              hmo_id: patient.hmo.name,
              gender: patient.gender,
              age: new Date().getFullYear() - new Date(patient.dob).getFullYear(),
              doctor: test.doctor_name,
              time: test.pub_date,
            }))
        )
        setLabTestResults(results)
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

  return (
    <div className="flex w-full flex-col gap-2">
      {isLoading ? (
        <div className="loading-text flex h-full items-center justify-center">
          {"loading...".split("").map((letter, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              {letter}
            </span>
          ))}
        </div>
      ) : (
        labTestResults.map((results) => (
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
                  <p className="text-xs">HMO Name: {results.hmo_id}</p>
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
              <PiDotsThree onClick={() => handlePatientClick(results.id)} />
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default LabResults

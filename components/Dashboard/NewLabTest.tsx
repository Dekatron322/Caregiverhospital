import React, { useEffect, useState } from "react"
import axios from "axios"
import dayjs, { Dayjs } from "dayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useRouter } from "next/navigation"
import TestModal from "components/Modals/TestModal"
import Image from "next/image"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import PaymentModal from "components/Modals/PaymentModal"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import DeleteTestModal from "components/Modals/DeleteTestModal"
import LabPaymentModal from "components/Modals/LabPaymentModal"
import TestResult from "components/Modals/TestResult"

interface HMO {
  id: string
  name: string
  category: string
  description: string
  status: boolean
  pub_date: string
}

interface LabTestResult {
  id: string
  doctor_name: string
  test_type: string
  status_note: string
  pub_date: string
  patient_name: string
  patient_id: string // Added field for patient ID
  policy_id: string
  diagnosis_code: string
  discount_value: string
  name: string
  hmo?: HMO
  test_price?: string
  payment_status?: boolean
  lab_parameters: { param_title: string; id: string; param_unit: string; param_range: string; param_result: string }[]
}

interface Diagnosis {
  id: string
  name: string
  code: string
  price: string
  status: boolean
  pub_date: any
}

interface ModalProps {
  results: LabTestResult
  onClose: (isSuccess: boolean) => void
  diagnosis?: Diagnosis
}

const NEW_LAB_TESTS_STORAGE_KEY = "new-lab-tests"

const NewLabTests = () => {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const [clickedCard, setClickedCard] = useState<LabTestResult | null>(null)
  const [paymentCard, setPaymentCard] = useState<LabTestResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false)
  const [labTestResults, setLabTestResults] = useState<LabTestResult[]>([])
  const [diagnosisData, setDiagnosisData] = useState<Diagnosis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showPaymentSuccessNotification, setShowPaymentSuccessNotification] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLabTestId, setSelectedLabTestId] = useState<string | null>(null)
  const resultsPerPage = 20
  const [initialized, setInitialized] = useState(false)
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "day"))
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())

  useEffect(() => {
    try {
      const cached = localStorage.getItem(NEW_LAB_TESTS_STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as LabTestResult[]
        setLabTestResults(parsed)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error reading new lab tests from localStorage:", error)
    }
    setInitialized(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (labTestResults.length === 0) {
        setIsLoading(true)
      }
      try {
        const start = startDate ? startDate.format("YYYY-MM-DD") : ""
        const end = endDate ? endDate.format("YYYY-MM-DD") : ""

        // Explicitly specify the type for the API response
        const labTestResponse = await axios.get<LabTestResult[]>(
          `https://api2.caregiverhospital.com/lab-test/filter-lab-test/${start}/${end}/`
        )
        const diagnosisResponse = await axios.get<Diagnosis[]>(
          "https://api2.caregiverhospital.com/diagnosis/diagnosis/"
        )

        const labTestData = labTestResponse.data
        const fetchedDiagnosisData = diagnosisResponse.data

        setDiagnosisData(fetchedDiagnosisData)

        if (Array.isArray(labTestData)) {
          const filteredTests = labTestData
            .filter(
              (test): test is LabTestResult => test?.lab_parameters?.some((param) => param.param_result.trim() !== "")
            )
            .map((test) => {
              const diagnosis = fetchedDiagnosisData.find((diag) => diag.code === test.diagnosis_code)
              return { ...test, diagnosis }
            })
          setLabTestResults(filteredTests)

          try {
            localStorage.setItem(NEW_LAB_TESTS_STORAGE_KEY, JSON.stringify(filteredTests))
          } catch (error) {
            console.error("Error saving new lab tests to localStorage:", error)
          }
        } else {
          console.error("Unexpected response format for lab test results")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!initialized) return
    fetchData()
  }, [refresh, initialized, labTestResults.length, startDate, endDate])

  const handleCardClick = (results: LabTestResult) => {
    setClickedCard(results)
    setIsModalOpen(true)
  }

  const handlePaymentClick = (results: LabTestResult) => {
    const diagnosis = diagnosisData.find((diag) => diag.code === results.diagnosis_code)
    const resultWithDiagnosis = { ...results, diagnosis }
    setPaymentCard(resultWithDiagnosis)
    setIsPaymentModalOpen(true)
  }
  const handleModalClose = () => {
    setIsModalOpen(false)
    setClickedCard(null)
  }

  const handlePaymentModalClose = (isSuccess: boolean) => {
    if (isSuccess) {
      setShowPaymentSuccessNotification(true)
      setRefresh(!refresh) // Trigger a refresh
      setTimeout(() => setShowPaymentSuccessNotification(false), 5000)
    }
    setIsPaymentModalOpen(false)
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredResults = labTestResults.filter(
    (result) =>
      result.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.test_type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult)

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage)

  const handleDeleteClick = (id: string) => {
    setSelectedLabTestId(id)
    setIsDeleteModalOpen(true)
  }

  const deleteLabTest = async () => {
    if (!selectedLabTestId) return

    try {
      await axios.delete(`https://api2.caregiverhospital.com/lab-test/lab-test/${selectedLabTestId}/`)
      setShowSuccessNotification(true)
      setRefresh(!refresh) // Refresh the data after deletion
      setTimeout(() => setShowSuccessNotification(false), 5000)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting lab test:", error)
      alert("Failed to delete lab test.")
    }
  }

  const filterLogic = {
    all: () => true, // Show all results
  }

  type ActiveTab = keyof typeof filterLogic

  const [activeTab, setActiveTab] = useState<ActiveTab>("all")

  const renderResults = (filter: (results: LabTestResult) => boolean) => {
    return (
      <div className="flex flex-col gap-2">
        {currentResults.filter(filter).map((results) => {
          const diagnosis = diagnosisData.find((diag) => diag.name === results.diagnosis_code)
          return (
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
                    <p className="text-sm">Patient: {results.patient_name}</p>
                    <p className="text-sm">Doctor: {results.doctor_name}</p>
                    <p className="text-xs">Test Type: {results.test_type || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm">{diagnosis?.name || "N/A"}</p>
                <p className="text-xs font-bold">Code: {diagnosis?.code || "N/A"}</p>
              </div>

              <div className="w-full max-sm:hidden">
                <p className="text-sm">₦ {diagnosis?.price || "N/A"}</p>
                <p className="text-xs font-bold">Diagnosis Price</p>
              </div>

              <div className="w-full max-sm:hidden">
                <p className="text-sm">{results.discount_value || "N/A"}</p>
                <p className="text-xs font-bold">Discount</p>
              </div>
              <div className="w-full">
                {results.payment_status ? (
                  <p className="w-32 rounded bg-[#000000] px-2 py-[6px] text-center text-xs text-[#46FFA6]">Paid</p>
                ) : (
                  <p className="w-32 rounded bg-[#F2B8B5] px-2 py-[6px] text-center text-xs">Not Paid</p>
                )}
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{formatDate(results?.pub_date)}</p>
                <p className="text-xs font-bold">Date Requested</p>
              </div>
              <div className="ml-10 flex">
                {results.payment_status ? (
                  <RemoveRedEyeIcon className="text-[#46FFA6]" onClick={() => handleCardClick(results)} />
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>
          )
        })}
        <div className="mb-4 flex items-center justify-end  max-sm:px-3 md:mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-button ${
                currentPage === index + 1
                  ? "active h-6 w-6 rounded-full bg-[#131414] text-sm text-[#ffffff] shadow"
                  : "h-6 w-6 rounded-full bg-[#F1FFF0] text-sm text-[#1E1E1E]"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex w-full flex-col">
        {isLoading && labTestResults.length === 0 ? (
          <div className="loading-text flex h-full items-center justify-center">
            {"loading...".split("").map((letter, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                {letter}
              </span>
            ))}
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="search-bg mb-4 flex h-10 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-md:w-[180px] lg:w-[300px]">
                  <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
                  <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-transparent text-xs outline-none focus:outline-none"
                  />
                </div>
                <div className="bg-white p-4">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        maxDate={endDate || undefined}
                      />
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        minDate={startDate || undefined}
                      />
                    </div>
                  </LocalizationProvider>
                </div>
              </div>
              {renderResults(filterLogic[activeTab])}
            </div>
          </>
        )}
      </div>

      {isModalOpen && clickedCard && <TestResult results={clickedCard} onClose={handleModalClose} />}
    </>
  )
}

export default NewLabTests

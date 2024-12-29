import React, { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import TestModal from "components/Modals/TestModal"
import Image from "next/image"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import PaymentModal from "components/Modals/PaymentModal"

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
  payment_status?: boolean
  test_price?: string
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

const CashierLabTests = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch lab test results
        const labTestResponse = await axios.get("https://api2.caregiverhospital.com/lab-test/lab-test/")
        const labTestData = labTestResponse.data

        // Fetch diagnosis data
        const diagnosisResponse = await axios.get("https://api2.caregiverhospital.com/diagnosis/diagnosis/")
        const fetchedDiagnosisData = diagnosisResponse.data
        setDiagnosisData(fetchedDiagnosisData)

        if (Array.isArray(labTestData)) {
          const tests = labTestData.map((test: any) => {
            const diagnosis = fetchedDiagnosisData.find((diag: any) => diag.code === test.diagnosis_code)
            return {
              ...test,
              diagnosis,
            }
          })

          setLabTestResults(tests)
        } else {
          console.error("Unexpected response format for lab test results")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [refresh])

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

  const filterLogic = {
    all: () => true, // Show all results
    approved: (results: LabTestResult) => results.payment_status === true, // Paid
    notApproved: (results: LabTestResult) => results.payment_status === false, // Not Paid
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
                  <p className="w-32 rounded bg-[#46ffa6] px-2 py-[6px] text-center text-xs text-[#000000]">Paid</p>
                ) : (
                  <p className="w-32 rounded bg-[#F2B8B5] px-2 py-[6px] text-center text-xs">Not Paid</p>
                )}
              </div>
              <div className="w-full max-sm:hidden">
                <p className="text-sm font-bold">{formatDate(results?.pub_date)}</p>
                <p className="text-xs font-bold">Date Requested</p>
              </div>
              <div className="flex gap-2">
                <AccountBalanceWalletIcon onClick={() => handlePaymentClick(results)} />
              </div>
            </div>
          )
        })}
        <div className="mb-4 flex items-center justify-end max-sm:px-3 md:mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-button ${
                currentPage === index + 1
                  ? "active h-6 w-6 rounded-full bg-[#131414] text-sm text-[#ffffff] shadow"
                  : "h-6 w-6 rounded-full bg-[#F1F1F1] text-sm"
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
        {isLoading ? (
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
              <div className="tab-bg md:borde mb-4 flex items-center gap-3 rounded-lg p-1 md:w-[260px]">
                <button
                  onClick={() => setActiveTab("all")}
                  className={activeTab === "all" ? "active-tab" : "inactive-tab"}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("approved")}
                  className={activeTab === "approved" ? "active-tab" : "inactive-tab"}
                >
                  Approved
                </button>
                <button
                  onClick={() => setActiveTab("notApproved")}
                  className={activeTab === "notApproved" ? "active-tab" : "inactive-tab"}
                >
                  Not Approved
                </button>
              </div>
              <div>
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
                {renderResults(filterLogic[activeTab])}
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && clickedCard && <TestModal results={clickedCard} onClose={handleModalClose} />}
      {isPaymentModalOpen && paymentCard && <PaymentModal results={paymentCard} onClose={handlePaymentModalClose} />}

      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5  flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Result Submitted</span>
        </div>
      )}
      {showPaymentSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5  flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Invoice Sent</span>
        </div>
      )}
    </>
  )
}

export default CashierLabTests

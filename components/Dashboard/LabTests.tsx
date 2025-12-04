"use client"

import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Image from "next/image"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"

// Lazy load modals
const TestModal = lazy(() => import("components/Modals/TestModal"))
const LabPaymentModal = lazy(() => import("components/Modals/LabPaymentModal"))
const DeleteTestModal = lazy(() => import("components/Modals/DeleteTestModal"))

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
  patient_id: string
  policy_id: string
  diagnosis_code: string
  discount_value: string
  name: string
  hmo?: HMO
  test_price?: string
  payment_status?: boolean
  lab_parameters: {
    param_title: string
    id: string
    param_unit: string
    param_range: string
    param_result: string
  }[]
  diagnosis?: Diagnosis
}

interface Diagnosis {
  id: string
  name: string
  code: string
  price: string
  status: boolean
  pub_date: any
}

type ActiveTab = "all" | "approved" | "notApproved"

const filterLogic = {
  all: (result: LabTestResult) => true,
  approved: (result: LabTestResult) => result.payment_status === true,
  notApproved: (result: LabTestResult) => result.payment_status === false,
}

const LAB_TESTS_STORAGE_KEY = "lab-test-results"

const SkeletonLoader = () => (
  <div className="flex w-full animate-pulse items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-700">
    <div className="flex items-center gap-1 text-sm font-bold md:w-[20%]">
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 max-sm:hidden"></div>
    </div>
    <div className="flex w-full items-center gap-1 text-sm font-bold">
      <div>
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-600"></div>
        <div className="mt-1 h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
      </div>
    </div>
    <div className="w-full max-md:hidden">
      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
      <div className="mt-1 h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
    </div>
    <div className="w-full max-md:hidden">
      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
      <div className="mt-1 h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
    </div>
    <div className="w-full">
      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
      <div className="mt-1 h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
    </div>
    <div className="w-full max-md:hidden">
      <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600"></div>
      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600"></div>
      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600"></div>
    </div>
  </div>
)

const ResultCard = React.memo(function ResultCard({
  result,
  diagnosisData,
  onCardClick,
  onPaymentClick,
  onDeleteClick,
}: {
  result: LabTestResult
  diagnosisData: Diagnosis[]
  onCardClick: (result: LabTestResult) => void
  onPaymentClick: (result: LabTestResult) => void
  onDeleteClick: (id: string) => void
}) {
  const diagnosis = diagnosisData.find((diag) => diag.name === result.diagnosis_code)

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
    <div className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-700">
      <div className="w-full">
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="max-sm:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#46ffa6]">
              <p className="capitalize text-[#000000]">{result.doctor_name.charAt(0)}</p>
            </div>
          </span>
          <div>
            <p className="text-sm ">Patient: {result.patient_name}</p>
            <p className="text-sm ">Doctor: {result.doctor_name}</p>
            <p className="text-xs ">Test Type: {result.test_type || "N/A"}</p>
          </div>
        </div>
      </div>
      <div className="w-full max-sm:hidden">
        <p className="text-sm ">{diagnosis?.name || "N/A"}</p>
        <p className="text-xs font-bold ">Code: {diagnosis?.code || "N/A"}</p>
      </div>
      <div className="w-full max-sm:hidden">
        <p className="text-sm ">₦ {diagnosis?.price || "N/A"}</p>
        <p className="text-xs font-bold ">Diagnosis Price</p>
      </div>
      <div className="w-full max-sm:hidden">
        <p className="text-sm ">{result.discount_value || "N/A"}</p>
        <p className="text-xs font-bold ">Discount</p>
      </div>
      <div className="w-full">
        {result.payment_status ? (
          <p className="w-32 rounded bg-[#000000] px-2 py-[6px] text-center text-xs text-[#46FFA6]">Paid</p>
        ) : (
          <p className="w-32 rounded bg-[#F2B8B5] px-2 py-[6px] text-center text-xs text-black">Not Paid</p>
        )}
      </div>
      <div className="w-full max-sm:hidden">
        <p className="text-sm font-bold ">{formatDate(result.pub_date)}</p>
        <p className="text-xs font-bold ">Date Requested</p>
      </div>
      <div className="flex gap-2">
        {result.payment_status ? (
          <RemoveRedEyeIcon
            className="text-gray-500 hover:text-[#46ffa6] dark:text-gray-400 dark:hover:text-[#46ffa6]"
            onClick={() => onCardClick(result)}
          />
        ) : (
          <p className="">-</p>
        )}
        <AccountBalanceWalletIcon
          className=" hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
          onClick={() => onPaymentClick(result)}
        />
        <DeleteForeverIcon
          className=" hover:text-[#F2B8B5] dark:text-gray-400 dark:hover:text-[#F2B8B5]"
          onClick={() => onDeleteClick(result.id)}
        />
      </div>
    </div>
  )
})

const LabTests = () => {
  const router = useRouter()
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLabTestId, setSelectedLabTestId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>("all")
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "day"))
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())
  const resultsPerPage = 20
  const maxVisiblePages = 5
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      const cached = localStorage.getItem(LAB_TESTS_STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as LabTestResult[]
        setLabTestResults(parsed as any)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error reading lab test results from localStorage:", error)
    }
    setInitialized(true)
  }, [])

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])

  const fetchData = useCallback(async () => {
    if (labTestResults.length === 0) {
      setIsLoading(true)
    }
    const cancelTokenSource = axios.CancelToken.source()

    try {
      const diagnosisPromise =
        diagnosisData.length > 0
          ? Promise.resolve({ data: diagnosisData })
          : axios.get("https://api2.caregiverhospital.com/diagnosis/diagnosis/", {
              cancelToken: cancelTokenSource.token,
            })

      const start = startDate ? startDate.format("YYYY-MM-DD") : ""
      const end = endDate ? endDate.format("YYYY-MM-DD") : ""

      const [labTestResponse, diagnosisResponse] = await Promise.all([
        axios.get(`https://api2.caregiverhospital.com/lab-test/filter-lab-test/${start}/${end}/`, {
          params: { page: currentPage, limit: resultsPerPage },
          cancelToken: cancelTokenSource.token,
        }),
        diagnosisPromise,
      ])

      if (!diagnosisData.length && diagnosisResponse.data) {
        setDiagnosisData(diagnosisResponse.data)
      }

      const labTestData: LabTestResult[] = labTestResponse.data.results || labTestResponse.data
      const diagnosisMap = new Map(diagnosisResponse.data.map((diag: Diagnosis) => [diag.code, diag]))

      const tests = labTestData
        .map((test) => ({
          ...test,
          diagnosis: diagnosisMap.get(test.diagnosis_code),
        }))
        .sort((a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime())

      setLabTestResults(tests as any)

      try {
        localStorage.setItem(LAB_TESTS_STORAGE_KEY, JSON.stringify(tests))
      } catch (error) {
        console.error("Error saving lab test results to localStorage:", error)
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching data:", error)
      }
    } finally {
      setIsLoading(false)
    }

    return () => cancelTokenSource.cancel()
  }, [currentPage, diagnosisData.length, refresh, startDate, endDate, labTestResults.length])

  useEffect(() => {
    if (!initialized) return
    fetchData()
  }, [fetchData, initialized])

  const handleCardClick = useCallback((results: LabTestResult) => {
    setClickedCard(results)
    setIsModalOpen(true)
  }, [])

  const handlePaymentClick = useCallback(
    (results: LabTestResult) => {
      const diagnosis = diagnosisData.find((diag) => diag.code === results.diagnosis_code)
      setPaymentCard({ ...results, diagnosis })
      setIsPaymentModalOpen(true)
    },
    [diagnosisData]
  )

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setClickedCard(null)
  }, [])

  const handlePaymentModalClose = useCallback((isSuccess: boolean) => {
    if (isSuccess) {
      setShowPaymentSuccessNotification(true)
      setRefresh((prev) => !prev)
      setTimeout(() => setShowPaymentSuccessNotification(false), 5000)
    }
    setIsPaymentModalOpen(false)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }, [])

  const { currentResults, totalPages } = useMemo(() => {
    const filtered = labTestResults.filter(
      (result) =>
        result.patient_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        result.doctor_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        result.test_type.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )

    const indexOfLastResult = currentPage * resultsPerPage
    const indexOfFirstResult = indexOfLastResult - resultsPerPage
    const current =
      labTestResults.length > resultsPerPage ? filtered.slice(indexOfFirstResult, indexOfLastResult) : filtered

    return {
      currentResults: current,
      totalPages: Math.ceil(filtered.length / resultsPerPage),
    }
  }, [labTestResults, debouncedSearchQuery, currentPage])

  const visiblePages = useMemo(() => {
    const pages = []
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = startPage + maxVisiblePages - 1
    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push("...")
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...")
      }
      pages.push(totalPages)
    }
    return pages
  }, [currentPage, totalPages])

  const handleDeleteClick = useCallback((id: string) => {
    setSelectedLabTestId(id)
    setIsDeleteModalOpen(true)
  }, [])

  const deleteLabTest = useCallback(async () => {
    if (!selectedLabTestId) return
    try {
      await axios.delete(`https://api2.caregiverhospital.com/lab-test/lab-test/${selectedLabTestId}/`)
      setShowSuccessNotification(true)
      setRefresh((prev) => !prev)
      setTimeout(() => setShowSuccessNotification(false), 5000)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting lab test:", error)
      alert("Failed to delete lab test.")
    }
  }, [selectedLabTestId])

  const renderResults = (filter: (result: LabTestResult) => boolean) => {
    const filtered = currentResults.filter(filter)

    return (
      <div className="flex flex-col gap-2">
        {filtered.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
            diagnosisData={diagnosisData}
            onCardClick={handleCardClick}
            onPaymentClick={handlePaymentClick}
            onDeleteClick={handleDeleteClick}
          />
        ))}

        {totalPages > 1 && (
          <div className="mb-4 flex items-center justify-between max-sm:px-3 md:mt-4">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 rounded px-3 py-1 text-sm ${
                currentPage === 1
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <ChevronLeftIcon fontSize="small" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {visiblePages.map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-2 py-1 text-gray-700 dark:text-gray-300">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(Number(page))}
                    className={`h-8 w-8 rounded-full text-sm ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 rounded px-3 py-1 text-sm ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Next
              <ChevronRightIcon fontSize="small" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="flex w-full flex-col">
        {isLoading && labTestResults.length === 0 ? (
          <div className="grid gap-2">
            {Array.from({ length: Math.min(6, resultsPerPage) }).map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="tab-bg mb-4 flex w-[260px] items-center gap-3 rounded-lg border border-gray-200 p-1 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`${
                    activeTab === "all"
                      ? "active-tab bg-blue-500 text-white"
                      : "inactive-tab text-gray-700 dark:text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("approved")}
                  className={`${
                    activeTab === "approved"
                      ? "active-tab bg-blue-500 text-white"
                      : "inactive-tab text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setActiveTab("notApproved")}
                  className={`${
                    activeTab === "notApproved"
                      ? "active-tab bg-blue-500 text-white"
                      : "inactive-tab text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Not Approved
                </button>
              </div>
            </div>
            <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="search-bg flex h-10 items-center justify-between gap-2 rounded border border-gray-300 bg-white px-3 py-1 dark:border-gray-600 dark:bg-gray-700 max-md:w-[180px] lg:w-[300px]">
                <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="search" priority />
                <Image
                  className="dark-icon-style"
                  src="/search-dark.svg"
                  width={16}
                  height={16}
                  alt="search"
                  priority
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-transparent text-xs  outline-none focus:outline-none dark:text-white"
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
        )}
      </div>

      <Suspense fallback={null}>
        {isModalOpen && clickedCard && <TestModal results={clickedCard} onClose={handleModalClose} />}
        {isPaymentModalOpen && paymentCard && (
          <LabPaymentModal results={paymentCard} onClose={handlePaymentModalClose} />
        )}
        {isDeleteModalOpen && (
          <DeleteTestModal
            title="Confirm Deletion"
            description="Are you sure you want to discard this lab test? This action cannot be undone."
            onConfirm={deleteLabTest}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </Suspense>

      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5 flex h-[50px] w-[339px] items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="success" priority />
          <span className="text-sm text-[#0F920F]">Result Submitted</span>
        </div>
      )}
      {showPaymentSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5 flex h-[50px] w-[339px] items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="success" priority />
          <span className="text-sm text-[#0F920F]">Invoice Sent</span>
        </div>
      )}
    </>
  )
}

export default React.memo(LabTests)

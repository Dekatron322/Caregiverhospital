import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import AOS from "aos"
import axios from "axios"
import "aos/dist/aos.css"

interface LabTestResult {
  id: string
  name: string
  test_type: string
}

interface ModalProps {
  results: LabTestResult
  onClose: (isSuccess: boolean) => void
}

interface TestDetail {
  id: string
  title: string
  detail: string
  test_range: string
  test_price: string
  status: boolean
  pub_date: string
}

const TestModal: React.FC<ModalProps> = ({ results, onClose }) => {
  const [test, setTest] = useState<string>(results.test_type)
  const [result, setResult] = useState<string>("")
  const [statusNote, setStatusNote] = useState<string>("Approved")
  const [isLoading, setIsLoading] = useState(false)
  const [testDetail, setTestDetail] = useState<TestDetail | null>(null)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })

    const fetchTestDetail = async () => {
      try {
        const response = await axios.get("https://api2.caregiverhospital.com/testt/testt/")
        const matchedTest = response.data.find((test: TestDetail) => test.title === results.test_type)
        if (matchedTest) {
          setTestDetail(matchedTest)
        }
      } catch (error) {
        console.error("Error fetching test details:", error)
      }
    }

    fetchTestDetail()
  }, [results.test_type])

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await axios.put(`https://api2.caregiverhospital.com/lab-test/lab-test/${results.id}/`, {
        test: test,
        result: result,
        status_note: statusNote,
      })
      console.log(response.data)
      onClose(true)
    } catch (error) {
      console.error("Error updating lab test result:", error)
      onClose(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Enter test result</p>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={() => onClose(false)} />
            </div>
          </div>

          <p>Test Type: {results.test_type}</p>

          {/* Display additional test details if available */}
          {testDetail && (
            <div className="my-4">
              <p className="text-center font-bold">Text Info</p>
              <div className="my-3 border-b"></div>
              <div className="flex justify-between">
                <p>Title: </p>
                <p className="font-semibold">{testDetail.title}</p>
              </div>
              <div className="my-3 border-b"></div>
              <div className="flex justify-between">
                <p>Unit of measurement: </p>
                <p className="font-semibold">{testDetail.detail}</p>
              </div>
              <div className="my-3 border-b"></div>
              <div className="flex justify-between">
                <p>Test Range: </p>
                <p className="font-semibold">{testDetail.test_range}</p>
              </div>
              <div className="my-3 border-b"></div>
            </div>
          )}

          <div className="flex w-full gap-2">
            <div className="my-4 w-full">
              <p className="text-sm">Result</p>
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="result"
                  placeholder="Enter Result"
                  className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Result"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestModal

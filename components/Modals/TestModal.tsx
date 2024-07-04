import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import { MdArrowBackIosNew } from "react-icons/md"
import AOS from "aos"
import axios from "axios"
import "aos/dist/aos.css"

interface LabTestResult {
  id: string
  name: string
  test_type: string
  // Add other properties here
}

interface ModalProps {
  results: LabTestResult
  onClose: (isSuccess: boolean) => void
}

interface TestRange {
  title: string
  ranges: { label: string; value: string }[]
}

// Map for test ranges
const testRanges: Record<string, TestRange> = {
  "Postrate Specific Antigen (PSA)": {
    title: "Reference Range",
    ranges: [{ label: "0 - 4", value: "ng/mL" }],
  },
  Estradiol: {
    title: "Reference Range",
    ranges: [
      { label: "Men", value: "< 62 pg/mL" },
      { label: "Follicular phase", value: "18 - 147 pg/mL" },
      { label: "Pre-ovulatory peak", value: "93 - 575 pg/mL" },
      { label: "Menopause", value: "58 pg/mL" },
    ],
  },
  Progesterone: {
    title: "Reference Range",
    ranges: [
      { label: "Female", value: "0.1 - 0.9 ng/mL" },
      { label: "Male", value: "3.0 - 10.6 ng/mL" },
    ],
  },

  Testosterone: {
    title: "Reference Range",
    ranges: [
      { label: "Folicular Phase ", value: "0.15 - 0.17 ng/mL" },
      { label: "Mid Cycle", value: "< 16.1 ng/mL" },
      { label: "Luteal Phase", value: "2.00 - 25.00 ng/mL" },
    ],
  },
  FSH: {
    title: "Normal Range",
    ranges: [
      { label: "1st half of the Folicular Phase ", value: "3.9 - 12" },
      { label: "2nd half of the Folicular Phase ", value: "2.9 - 9.0" },
      { label: "Ovulation Peak(D12)", value: "6.3 - 24.0" },
      { label: "Luteal Phase(D21)", value: "1.5 - 7.0" },
      { label: "Menopause", value: "1.7 - 12.0" },
      { label: "Male", value: "1.7 - 12.0" },
    ],
  },
  "2HPP": {
    title: "Reference Range",
    ranges: [
      { label: "Normal", value: "70 - 140 mg/dL" },
      { label: "Impaired Glucose Tolerance", value: "140 - 199 mg/dL" },
      { label: "Diabetes Mellituta", value: ">= 200 mg/dL" },
    ],
  },
  FBS: {
    title: "Reference Range",
    ranges: [
      { label: "Normal", value: "70 - 99 mg/dL" },
      { label: "Prediabetic", value: "100 - 125 mg/dL" },
      { label: "Diabetes", value: "126 mg/dL Above" },
    ],
  },
  "Electrolyte/Urea/Creatinine": {
    title: "Reference Range",
    ranges: [
      { label: "Sodium", value: "135 - 155 mmol/L" },
      { label: "Potassium", value: "3.5 - 5.5 mmol/L" },
      { label: "Chlorine", value: "95 - 110 mmol/L" },
      { label: "Calcium", value: "1.1 - 1.3 mmol/L" },
      { label: "PH", value: "7.2 - 7.6" },
      { label: "Urea", value: "10.22 - 49.9 mg/dL" },
      { label: "Creatine", value: "0.49 - 1.4 mg/dL" },
    ],
  },
  "Liver Function Test": {
    title: "Reference Range",
    ranges: [
      { label: "T-Proteins", value: "6.4 - 8.3 g/dl" },
      { label: "Albumin", value: "3.5 - 5.2 g/dl" },
      { label: "Globulin", value: "1.8 - 3.5 g/dl" },
      { label: "Total Bilirubin", value: "0.2 - 1.2 mg/dl" },
      { label: "Direct Bilirubin", value: "0.0 - 0.2 mg/dl" },
      { label: "Indirect Bilirubin", value: "0.2 - 0.8 mg/dl" },
      { label: "ALT(GPT)", value: "0.0 - 45 U/L" },
      { label: "ALK-Phosphatase", value: "53 - 128 U/L" },
      { label: "AsT(GOT)", value: "0.0 - 35 U/L" },
      { label: "GGT", value: "0.0 - 55 U/L" },
    ],
  },
  "Malaria Parasite": {
    title: "Reference Range",
    ranges: [
      { label: "Men", value: "62 pg/mL" },
      { label: "Follicular phase", value: "18 - 147 pg/mL" },
      { label: "Pre-ovulatory peak", value: "93 - 575 pg/mL" },
      { label: "Menopause", value: "58 pg/mL" },
    ],
  },
  // Add other test types and their ranges here
}

const TestModal: React.FC<ModalProps> = ({ results, onClose }) => {
  const [test, setTest] = useState<string>(results.test_type)
  const [result, setResult] = useState<string>("")
  const [statusNote, setStatusNote] = useState<string>("Approved")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await axios.put(`https://api.caregiverhospital.com/lab-test/lab-test/${results.id}/`, {
        test: test,
        result: result,
        status_note: statusNote,
      })
      console.log(response.data)
      onClose(true) // Pass true to indicate success
    } catch (error) {
      console.error("Error updating lab test result:", error)
      onClose(false) // Pass false to indicate failure
    } finally {
      setIsLoading(false)
    }
  }

  // Get the ranges for the current test type
  const testRange = testRanges[test] || { title: "", ranges: [] }

  // Debugging: log the testRange object
  console.log("testRange:", testRange)

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
          {testRange.title && (
            <div className="space-y-2">
              <h5 className="text-lg font-semibold">{testRange.title}</h5>
              {testRange.ranges.map((range, index) => (
                <div key={index} className="flex items-center gap-1">
                  <p>{range.label}</p>
                  <p>{range.value}</p>
                </div>
              ))}
            </div>
          )}
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

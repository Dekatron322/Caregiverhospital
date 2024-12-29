import React, { useRef, useState } from "react"
import styles from "./modal.module.css"
import Image from "next/image"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import axios from "axios"

interface LabParameter {
  id: string
  param_title: string
  param_unit: string
  param_range: string
  param_result: string
}

interface LabTestResult {
  patient_name: string
  doctor_name: string
  test_type: string
  diagnosis_code: string
  discount_value: string
  id: string
  lab_parameters: LabParameter[]
}

interface TestModalProps {
  results: LabTestResult
  onClose: () => void
}

const TestResult: React.FC<TestModalProps> = ({ results, onClose }) => {
  const [parameters, setParameters] = useState(results.lab_parameters)
  const printableRef = useRef<HTMLDivElement>(null)

  const printResults = () => {
    if (printableRef.current) {
      const printContents = printableRef.current.innerHTML
      const printWindow = window.open("", "_blank") as Window
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Lab Test Result</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h2, h3 { text-align: center; }
              .text-semibold { font-weight: bold; }
            </style>
          </head>
          <body>
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="/ic_logo.svg" alt="dekalo" style="width: 150px; height: auto;" />
            </div>
            ${printContents}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className={styles.modalContainers}>
      <div className={styles.modalBodys}>
        <div className="p-4" ref={printableRef}>
          <div className="mb-4 flex items-center justify-between">
            <div className="icon-style content-center">
              <img src="/ic_logo.svg" width={150} height={43} alt="dekalo" />
            </div>
            <div className="dark-icon-style content-center">
              <img src="/dark_logo.svg" width={150} height={43} alt="dekalo" />
            </div>
            <button onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>
          <h2 className="text-center font-bold">Lab Test Details</h2>
          <p>
            Patient: <span className="text-semibold">{results.patient_name}</span>
          </p>
          <p>
            Doctor: <span className="text-semibold">{results.doctor_name}</span>
          </p>
          <p>
            Test Type: <span className="text-semibold">{results.test_type}</span>
          </p>
          <p>
            Diagnosis Code: <span className="text-semibold">{results.diagnosis_code}</span>
          </p>
          <p>Discount: {results.discount_value || "N/A"}</p>

          {parameters.length > 0 ? (
            <div className="my-3 w-full border ">
              <h3 className="pt-3 text-center font-bold">Test Parameters</h3>
              {parameters.map((param) => (
                <>
                  <div className=" w-full p-4">
                    <p className="">Parameter: {param.param_title}</p>
                    <p className="">Range: {param.param_range}</p>
                    <p className="">Unit: {param.param_unit || "-"}</p>
                    <div className="flex justify-between gap-2">
                      <p>Result</p>
                      <p>{param.param_result}</p>
                    </div>
                  </div>
                </>
              ))}
            </div>
          ) : (
            <p>No parameters available.</p>
          )}
          <div className="mt-4 flex justify-center">
            <button className="btn-primary" onClick={printResults}>
              Print Results
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestResult

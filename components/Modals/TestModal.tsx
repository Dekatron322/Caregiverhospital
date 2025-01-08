import React, { useState } from "react"
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
  note?: string
  id: string
  lab_parameters: LabParameter[]
}

interface TestModalProps {
  results: LabTestResult
  onClose: () => void
}

const TestModal: React.FC<TestModalProps> = ({ results, onClose }) => {
  const [parameters, setParameters] = useState(results.lab_parameters)

  const handleResultChange = (id: string, value: string) => {
    setParameters((prev) => prev.map((param) => (param.id === id ? { ...param, param_result: value } : param)))
  }

  const saveResult = async (id: string) => {
    const parameter = parameters.find((param) => param.id === id)
    if (!parameter) return

    try {
      const response = await axios.put(`https://api2.caregiverhospital.com/lab-test/add-result-to-parameter/${id}/`, {
        param_result: parameter.param_result,
      })
      console.log("Result saved successfully:", response.data)
      alert("Result updated successfully!")
    } catch (error) {
      console.error("Error updating result:", error)
      alert("Failed to update result. Please try again.")
    }
  }

  return (
    <div className={styles.modalContainers}>
      <div className={styles.modalBodys}>
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="icon-style content-center">
              <Image src="/ic_logo.svg" width={150} height={43} alt="dekalo" />
            </div>
            <div className="dark-icon-style content-center">
              <Image src="/dark_logo.svg" width={150} height={43} alt="dekalo" />
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
            Doctor Note: <span className="text-semibold">{results.note}</span>
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
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={param.param_result}
                        onChange={(e) => handleResultChange(param.id, e.target.value)}
                        className="w-full gap-3 border p-1"
                      />
                      <button
                        onClick={() => saveResult(param.id)}
                        className="button-primary rounded  px-2 py-1 text-white"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </>
              ))}
            </div>
          ) : (
            <p>No parameters available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestModal

import React, { useRef } from "react"
import dynamic from "next/dynamic"
import styles from "./modal.module.css"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined"
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined"

import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import Image from "next/image"

// Regular dynamic import for html2pdf.js
const loadHtml2pdf = async () => {
  const html2pdf = (await import("html2pdf.js")).default
  return html2pdf
}
type LabParameter = {
  name: string
  param_title: string
  param_unit: string
  param_range: string
}

type ModalProps = {
  show: boolean
  onClose: () => void
  record: any
}

const formatDateTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const PrintRecordModal: React.FC<ModalProps> = ({ show, onClose, record }) => {
  const modalContentRef = useRef<HTMLDivElement>(null)

  if (!show) return null

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    const element = modalContentRef.current
    if (element) {
      const html2pdf = await loadHtml2pdf()
      const opt = {
        margin: 1,
        filename: "medical_record.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      }
      html2pdf().from(element).set(opt).save()
    }
  }

  return (
    <div className={styles.modalContainers}>
      <div className={styles.modalBodys}>
        <div className="p-4" ref={modalContentRef}>
          <div className="mb-4 flex items-center justify-between">
            <button onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-center">
            <p className=" text-lg font-bold ">Medical Record Details</p>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <CalendarMonthOutlinedIcon className="" />
            <p className="flex items-center gap-1 text-sm ">Time: {formatDateTime(record.pub_date)}</p>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <ReceiptLongOutlinedIcon className="" />
            <p className="flex items-center gap-1 text-sm ">Issuer: {record.doctor_name}</p>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <AssignmentIndOutlinedIcon className="" />
            <p className="flex items-center gap-1 text-sm ">Issued to: {record.patient_name}</p>
          </div>

          <h2 className="mb-3 text-lg font-bold">Test Result</h2>
          <div className="result_area  h-full w-full rounded-lg p-4">
            {record.lab_parameters && record.lab_parameters.length > 0 && (
              <div className="mt-2">
                <div className="flex w-full items-center justify-center">
                  <Image
                    className="icon-style content-center"
                    src="/ic_logo.svg"
                    width={200}
                    height={43}
                    alt="dekalo"
                  />

                  <Image
                    className="dark-icon-style content-center"
                    src="/dark_logo.svg"
                    width={200}
                    height={43}
                    alt="dekalo"
                  />
                </div>
                <h2 className="mb-3 text-lg font-bold text-black">Lab Parameters</h2>
                {record.lab_parameters.map((param: any, index: any) => (
                  <div key={index} className="mb-3 flex justify-between rounded-md border p-4">
                    {/* <p className="text-sm text-black">Value: {param.id}</p> */}
                    <p className="text-xs text-black">Value: {param.param_title}</p>
                    <p className="text-xs text-black">Unit: {param.param_unit}</p>
                    <p className="text-xs text-black">Reference Range: {param.param_range}</p>
                    <p className="text-xs text-black">Result: {param.param_result}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lab Parameters Section */}

          <div className="mt-4 flex items-end justify-between">
            <div className="flex cursor-pointer items-center gap-2" onClick={handlePrint}>
              <LocalPrintshopOutlinedIcon className="text-black" />
              <p className="text-sm text-black">Print</p>
            </div>

            <div className="flex cursor-pointer items-center gap-2" onClick={handleDownloadPDF}>
              <FileDownloadOutlinedIcon className="text-black" />
              <p className="text-sm text-black">Download PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintRecordModal

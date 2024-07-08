// components/Modal.tsx
import React, { useRef } from "react"
import styles from "./modal.module.css"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined"
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined"
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined"
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined"
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined"
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import Image from "next/image"
import html2pdf from "html2pdf.js"

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

  const handleDownloadPDF = () => {
    const element = modalContentRef.current
    if (element) {
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
            <Image src="/ic_logo.svg" width={115} height={43} alt="dekalo" />
            <button onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-center">
            <p className=" text-lg font-bold">Medical Record Details</p>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <CalendarMonthOutlinedIcon />
            <p className="flex items-center gap-1 text-sm">Time: {formatDateTime(record.pub_date)}</p>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <ReceiptLongOutlinedIcon />
            <p className="flex items-center gap-1 text-sm">Issuer: {record.doctor_name}</p>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <AssignmentIndOutlinedIcon />
            <p className="flex items-center gap-1 text-sm">Issued to: {record.patient_name}</p>
          </div>

          <h2 className="mb-3 text-lg font-bold">Test Result</h2>
          <div className="result_area  h-full w-full rounded-lg p-4">
            <div className=" w-full items-center justify-between">
              <p className="mb-2 text-sm font-bold">Test type: {record.test_type}</p>
              <div className="flex items-center gap-2">
                <InboxOutlinedIcon className="text-lg font-bold" /> <p className="text-sm font-bold">Result: 10</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="mb-3 font-bold">Reference Range</p>
              <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-bold">
                  Men{" "}
                  <span>
                    <KeyboardArrowLeftOutlinedIcon />
                  </span>{" "}
                  <span className="font-regular">62 pg/mL</span>
                </p>
              </div>
              <p className="text-sm font-bold">Female</p>
              <div className="my-3 flex items-center gap-2">
                <p className="text-sm ">
                  Folicular phase <span className="font-regular"> 18 - 147 pg/mL</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm ">
                  Pre-ovulatory peak <span className="font-regular"> 93 - 575 pg/mL</span>
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <p className="text-sm ">
                  Menopause{" "}
                  <span>
                    <KeyboardArrowLeftOutlinedIcon />
                  </span>{" "}
                  <span className="font-regular">58 pg/mL</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div className="flex cursor-pointer items-center gap-2" onClick={handlePrint}>
              <LocalPrintshopOutlinedIcon />
              <p className="text-sm">Print</p>
            </div>

            <div className="flex cursor-pointer items-center gap-2" onClick={handleDownloadPDF}>
              <FileDownloadOutlinedIcon />
              <p className="text-sm">Download PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintRecordModal

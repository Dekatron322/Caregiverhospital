// components/Modal.tsx
import React from "react"
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

type ModalProps = {
  show: boolean
  onClose: () => void
  record: any // Define the type based on your data structure
}

const PrintRecordModal: React.FC<ModalProps> = ({ show, onClose, record }) => {
  if (!show) return null

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBody}>
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className=" text-lg font-bold">Medical Record Details</p>
            <button onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <CalendarMonthOutlinedIcon />
            <p className="flex items-center gap-1 text-sm">Time: {record.time}</p>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <ReceiptLongOutlinedIcon />
            <p className="flex items-center gap-1 text-sm">Issuer: {record.doctor_assigned}</p>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <AssignmentIndOutlinedIcon />
            <p className="flex items-center gap-1 text-sm">Issued to: {record.name}</p>
          </div>

          <h2 className="mb-3 text-lg">Test Result</h2>
          <div className="nok_area  h-full w-full rounded-lg p-3">
            <div className="flex w-full items-center justify-between">
              <p className="text-sm font-bold">{record.test}</p>
              <div className="flex items-center gap-2">
                <InboxOutlinedIcon className="text-lg font-bold" /> <p className="text-sm font-bold">Result: 10</p>
              </div>

              <div className="flex items-center gap-2">
                <MilitaryTechOutlinedIcon className="text-lg" /> <p className="text-sm font-bold">Status: High</p>
              </div>
            </div>
            <div className="mt-3">
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
            <div className="flex items-center gap-2">
              <LocalPrintshopOutlinedIcon />
              <p className="text-sm">Print</p>
            </div>

            <div className="flex items-center gap-2">
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

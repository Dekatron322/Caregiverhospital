import React from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import { MdArrowBackIosNew, MdCheckBoxOutlineBlank, MdKeyboardArrowDown } from "react-icons/md"

interface RequestTest {
  id: string
  name: string

  // Add other properties here
}

interface ModalProps {
  results: RequestTest
  onClose: () => void
}

const LabTestModal: React.FC<ModalProps> = ({ results, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Request Lab Test</p>
            <LiaTimesSolid className="close" onClick={onClose} />
          </div>

          <p>Enter test result for {results.name}</p>
          <div className="flex w-full gap-2">
            <div className="my-2 w-full">
              <p className="text-sm">Test type</p>
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="search"
                  placeholder="Enter test type"
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
              </div>
            </div>
            <div className="my-2 w-full">
              <p className="text-sm">Diagnosis code</p>
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="search"
                  placeholder=""
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
              </div>
            </div>
          </div>

          <div className="mb-2  gap-3">
            <p>Note</p>
            <textarea
              className="search-bg  h-[100px] w-full rounded border bg-transparent p-2 outline-none"
              placeholder="Add how to use..."
            ></textarea>
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm  text-[#FFFFFF]
               max-sm:h-[45px]"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabTestModal

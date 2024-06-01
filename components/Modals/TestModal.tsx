import React from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import { MdArrowBackIosNew, MdKeyboardArrowDown } from "react-icons/md"

interface LabTestResult {
  id: string
  name: string
  test_type: string
  // Add other properties here
}

interface ModalProps {
  results: LabTestResult
  onClose: () => void
}

const TestModal: React.FC<ModalProps> = ({ results, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Enter test result for {results.name}</p>
            <LiaTimesSolid className="close" onClick={onClose} />
          </div>

          <p>Test Type: {results.test_type}</p>
          <div className="flex w-full gap-2">
            <div className="my-4 w-full">
              <p className="text-sm">Select Text</p>
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="search"
                  placeholder="Select Test"
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
                <MdKeyboardArrowDown />
              </div>
            </div>
            <div className="my-4 w-full">
              <p className="text-sm">Result</p>
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="search"
                  placeholder="Enter Result"
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="text-lg font-semibold">Range</h5>
            <div className="flex items-center gap-1">
              <p className="">Men 62</p>

              <p>pg/mL</p>
            </div>
            <p>Folicular phase 18 - 147 pg/mL</p>
            <p>Pre-ovulatory peak 93 - 575 pg/mL</p>
            <div className="flex items-center gap-1">
              <p>Menopause</p>
              <MdArrowBackIosNew className="text-xs" />
              <p>58 pg/mL</p>
            </div>
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm  text-[#FFFFFF]
               max-sm:h-[45px]"
            >
              Submit Result
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestModal

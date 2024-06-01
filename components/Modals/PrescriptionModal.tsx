import React from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import { MdArrowBackIosNew, MdCheckBoxOutlineBlank, MdKeyboardArrowDown } from "react-icons/md"

interface AddPrescription {
  id: string
  name: string

  // Add other properties here
}

interface ModalProps {
  results: AddPrescription
  onClose: () => void
}

const PrescriptionModal: React.FC<ModalProps> = ({ results, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Add Prescription for {results.name}</p>
            <LiaTimesSolid className="close" onClick={onClose} />
          </div>

          <p>Please enter user essentials to add give them access to the platform</p>
          <div className="flex w-full gap-2">
            <div className="my-2 w-full">
              <p className="text-sm">Medicine Category</p>
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="search"
                  placeholder="Select Category"
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
                <MdKeyboardArrowDown />
              </div>
            </div>
            <div className="my-2 w-full">
              <p className="text-sm">Medicine Name</p>
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
          <div className="flex w-full gap-2">
            <div className=" w-full">
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="search"
                  placeholder="Code"
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="number"
                  id="search"
                  placeholder="Unit"
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="number"
                  id="search"
                  placeholder="Dosage"
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="search"
                  placeholder="Rate"
                  className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
                <MdKeyboardArrowDown />
              </div>
            </div>
          </div>
          <div className="my-2">
            <h5 className=" font-semibold">Usage</h5>
            <div className="flex items-center  gap-4">
              <div className="flex items-center gap-1">
                <MdCheckBoxOutlineBlank /> <p>Morning</p>
              </div>
              <div className="flex items-center gap-1">
                <MdCheckBoxOutlineBlank /> <p>Afternoon</p>
              </div>
              <div className="flex items-center gap-1">
                <MdCheckBoxOutlineBlank /> <p>Evening</p>
              </div>
              <div className="flex items-center gap-1">
                <MdCheckBoxOutlineBlank /> <p>Night</p>
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
              Add Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionModal

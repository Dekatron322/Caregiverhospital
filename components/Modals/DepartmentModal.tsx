"use client"
import React, { FormEvent, useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: () => void
  onClose: () => void
}

const DepartmentModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [name, setName] = useState("")
  const [status, setStatus] = useState(true)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const submitForm = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("https://api2.caregiverhospital.com/department/department/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          status: status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add department")
      }

      onSubmitSuccess()
      onClose()
    } catch (error) {
      console.error("Error adding department:", error)
      // Handle error state or display error message to the user
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Add Department</h6>
            <div className="p-1 hover:rounded-md hover:border">
              <LiaTimesSolid className="cursor-pointer " onClick={onClose} />
            </div>
          </div>

          <form onSubmit={submitForm}>
            <div className="my-4">
              <p className="text-sm">Name</p>
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="name"
                  placeholder="Enter department name"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* You can include other form fields here */}

            <div className="mt-4 flex w-full gap-6">
              <button
                type="submit"
                className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
                disabled={loading}
              >
                {loading ? "Submitting..." : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DepartmentModal

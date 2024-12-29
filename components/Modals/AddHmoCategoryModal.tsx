"use client"
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import axios from "axios"

interface AddHmoCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
}

const AddHmoCategoryModal: React.FC<AddHmoCategoryModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name || !description) {
      setError("Name and description are required.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await axios.post("https://api2.caregiverhospital.com/hmo-category/hmo-category/", {
        name,
        detail: description,
        status: true,
        pub_date: new Date().toISOString(),
      })
      setLoading(false)
      onSubmitSuccess()
      onClose()
    } catch (error) {
      setLoading(false)
      setError("Failed to add HMO category. Please try again.")
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Add Hmo</h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <form onSubmit={submitForm}>
            <div className="my-4">
              <p className="text-sm">Name</p>
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 text-xs hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={handleNameChange}
                  className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                />
              </div>
            </div>

            <div className="mt-3">
              <p className="text-sm">Description</p>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                className="mt-1 h-[173px] w-full rounded-md border bg-transparent p-2 text-xs outline-none"
                placeholder="Add your description..."
              ></textarea>
            </div>

            {error && <p className="mt-2 text-red-500">{error}</p>}

            <div className="mt-4 flex w-full gap-6">
              <button
                type="submit"
                className={`button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px] ${
                  loading && "cursor-not-allowed opacity-50"
                }`}
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

export default AddHmoCategoryModal

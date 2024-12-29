import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

interface Diagnosis {
  id: string
  name: string
  code: string
  status: string
  price: string
  pub_date: string
}

interface EditDiagnosisModalProps {
  isOpen: boolean
  onClose: () => void
  diagnosis: Diagnosis | null
  onSave: (updatedDiagnosis: Diagnosis) => void
}

const EditDiagnosisModal: React.FC<EditDiagnosisModalProps> = ({ isOpen, onClose, diagnosis, onSave }) => {
  const [formData, setFormData] = useState<Diagnosis>({
    id: "",
    name: "",
    code: "",
    status: "false",
    price: "",
    pub_date: "",
  })

  useEffect(() => {
    if (diagnosis) {
      setFormData(diagnosis)
    }
  }, [diagnosis])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/diagnosis/diagnosis/${formData.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update diagnosis")
      }

      const updatedDiagnosis = (await response.json()) as Diagnosis
      onSave(updatedDiagnosis)
      onClose()
    } catch (error) {
      console.error("Error updating diagnosis:", error)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-xl font-bold">Edit Diagnosis</h2>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>
          <div className="my-4"></div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
              />
            </div>
            <div className="my-4">
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditDiagnosisModal
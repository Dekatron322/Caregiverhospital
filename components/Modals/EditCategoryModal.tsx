import React, { useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

interface MedicineCategory {
  id: string
  name: string
}

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: MedicineCategory | null
  onSubmitSuccess: () => void
}

export default function EditCategoryModal({ isOpen, onClose, category, onSubmitSuccess }: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState<string>(category?.name || "")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleEditCategory = async () => {
    if (!category) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api2.caregiverhospital.com/medicine-category/medicine_category/${category.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: categoryName }),
        }
      )

      const responseBody = await response.json()

      if (!response.ok) {
        throw new Error(`Failed to edit category: ${response.status}`)
      }

      onSubmitSuccess()
      onClose()
    } catch (error) {
      console.error("Error editing category:", error)
      setError("Failed to edit category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-xl font-bold">Edit Category</h2>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
            <input
              type="text"
              className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
              onClick={handleEditCategory}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

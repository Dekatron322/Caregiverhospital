"use client"
import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

interface MedicineCategory {
  id: string
  title: string
  detail: string
  test_range: string
  status: boolean
  test_price: string
  pub_date: string
}

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: MedicineCategory | null
  onSubmitSuccess: () => void
}

export default function EditTestModal({ isOpen, onClose, category, onSubmitSuccess }: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState<string>(category?.title || "")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [categoryPrice, setCategoryPrice] = useState<string>(category?.test_price || "")
  const [categoryDetail, setCategoryDetail] = useState<string>(category?.detail || "")
  const [categoryRange, setCategoryRange] = useState<string>(category?.test_range || "")

  useEffect(() => {
    if (category) {
      setCategoryName(category.title)
      setCategoryPrice(category.test_price)
      setCategoryDetail(category.detail)
      setCategoryRange(category.test_range)
    }
  }, [category])

  const handleEditCategory = async () => {
    if (!category) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://api2.caregiverhospital.com/testt/testt/${category.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: categoryName,
          test_price: categoryPrice,
          detail: categoryDetail,
          test_range: categoryRange,
          status: true,
          pub_date: new Date().toISOString(),
        }),
      })

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

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-xl font-bold">Edit Test</h2>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>
          {error && <p className="mb-4 text-red-500">{error}</p>}

          <div className="mb-4">
            <p className="text-sm">Test Name</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm">Test Price</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                placeholder="Enter Test Price"
                className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={categoryPrice}
                onChange={(e) => setCategoryPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm">Details</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                placeholder="Enter Details"
                className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={categoryDetail}
                onChange={(e) => setCategoryDetail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm">Test Range</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                placeholder="Enter Test Range"
                className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                value={categoryRange}
                onChange={(e) => setCategoryRange(e.target.value)}
              />
            </div>
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

import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import AOS from "aos"
import "aos/dist/aos.css"
import { LiaTimesSolid } from "react-icons/lia"

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
}

const AddTestModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [categoryName, setCategoryName] = useState<string>("")
  const [categoryPrice, setCategorPrice] = useState<string>("")
  const [categorDetail, setCategorDetail] = useState<string>("000")
  const [categorRange, setCategorRange] = useState<string>("000")

  const handleCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(event.target.value)
  }

  const handleCategorPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategorPrice(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/testt/testt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: categoryName,
          test_price: categoryPrice,
          detail: categorDetail,
          test_range: categorRange,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to add category")
      }
      onSubmitSuccess()
      onClose()
    } catch (error) {
      console.error("Error adding category:", error)
      // Handle error state or display error message
    }
  }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Add New Test</h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <div className="my-4">
            <p className="text-sm">Test Name</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="categoryName"
                placeholder="Enter Test Name"
                className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                style={{ width: "100%" }}
                value={categoryName}
                onChange={handleCategoryNameChange}
              />
            </div>

            <div className="my-4">
              <p className="text-sm">Test Price</p>
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="categoryPrice"
                  placeholder="Enter Test Price"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%" }}
                  value={categoryPrice}
                  onChange={handleCategorPriceChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
              onClick={handleSubmit}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTestModal

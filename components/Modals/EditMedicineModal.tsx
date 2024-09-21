import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import CustomDropdown from "components/Patient/CustomDropdown"

interface Medicine {
  id: string
  name: string
  quantity: string
  category: string
  expiry_date: string
  price: string
  how_to_use: string
  side_effect: string
  medicine_id: string
  status: boolean
  pub_date: string
}

interface EditMedicineModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  medicine: Medicine // Pass the entire medicine object to prefill the form fields
}

interface Category {
  id: string
  name: string
}

const EditMedicineModal: React.FC<EditMedicineModalProps> = ({ isOpen, onClose, onSubmitSuccess, medicine }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [formData, setFormData] = useState({
    medicine_id: medicine.medicine_id,
    name: medicine.name,
    quantity: medicine.quantity,
    category: medicine.category, // Prefill with the current category
    expiry_date: medicine.expiry_date,
    price: medicine.price,
    how_to_use: medicine.how_to_use,
    side_effect: medicine.side_effect,
    status: medicine.status,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api2.caregiverhospital.com/medicine-category/medicine-category/")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = (await response.json()) as Category[]
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryChange = (selected: string) => {
    setSelectedCategory(selected)
    setFormData({ ...formData, category: selected }) // Update category in formData
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/medicine/medicine/${medicine.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update medicine")
      }

      // Trigger success action
      onSubmitSuccess()
      onClose()
    } catch (error) {
      console.error("Error updating medicine:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Edit Medicine </h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <form>
            <div className="grid w-full grid-cols-2 gap-2">
              <div className="my-2">
                <p className="mb-1 text-sm">Medicine ID</p>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="medicine_id"
                    value={formData.medicine_id}
                    onChange={handleInputChange}
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  />
                </div>
              </div>
              <div className="my-2">
                <p className="mb-1 text-sm">Name</p>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              <div className="my-2">
                <p className="mb-1 text-sm">Quantity</p>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  />
                </div>
              </div>
              <div className="my-2">
                <p className="mb-1 text-sm">Category</p>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <CustomDropdown
                    options={categories}
                    selectedOption={selectedCategory} // Ensure the dropdown shows the current category
                    onChange={handleCategoryChange} // Update category on change
                    placeholder="Select Category"
                  />
                </div>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              <div className="my-2">
                <p className="mb-1 text-sm">Expiry Date</p>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleInputChange}
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  />
                </div>
              </div>
              <div className="my-2">
                <p className="mb-1 text-sm">Price</p>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="my-4">
              <p className="mb-1 text-sm">How to use</p>
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  name="how_to_use"
                  value={formData.how_to_use}
                  onChange={handleInputChange}
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                />
              </div>
            </div>
            <div className="my-4">
              <p>Side Effect</p>
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  name="side_effect"
                  value={formData.side_effect}
                  onChange={handleInputChange}
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditMedicineModal

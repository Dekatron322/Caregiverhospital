import React, { useState } from "react"
import styles from "./modal.module.css"
import { MdKeyboardArrowDown } from "react-icons/md"
import { LiaTimesSolid } from "react-icons/lia"
import { toast } from "sonner" // Import Sonner toast

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
}

const EditModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])
  const [name, setName] = useState<string>("")
  const [category, setCategory] = useState<string>("")

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory)
    setIsDropdownOpen(false)
    toast.info("Category selected", {
      description: `Selected: ${selectedCategory}`,
    })
  }

  if (!isOpen) return null

  const submitForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault()

    try {
      // Validate inputs
      if (!name.trim()) {
        toast.error("Validation Error", {
          description: "Please enter a name for the HMO",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        })
        return
      }

      if (!category) {
        toast.error("Validation Error", {
          description: "Please select a category",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        })
        return
      }

      // Simulate API call or form processing
      // In a real implementation, you would make an API call here
      toast.promise(
        new Promise((resolve) => {
          // Simulate network request
          setTimeout(() => {
            onSubmitSuccess()
            onClose()
            resolve(null)
          }, 1000)
        }),
        {
          loading: "Updating HMO...",
          success: "HMO updated successfully!",
          error: "Failed to update HMO",
        }
      )
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
        duration: 5000,
        cancel: {
          label: "Close",
          onClick: () => {},
        },
      })
      console.error("Error updating HMO:", error)
    }
  }

  const isSubmitEnabled = name.trim() !== "" && category.trim() !== ""

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Edit Hmo</h6>
            <LiaTimesSolid className="cursor-pointer" onClick={onClose} />
          </div>

          <div className="my-4">
            <p className="text-sm">Name</p>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="name"
                placeholder="Name"
                className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
                style={{ width: "100%", height: "45px" }}
                value={name}
                onChange={handleNameChange}
              />
            </div>
          </div>

          <div className="my-4">
            <p className="text-sm">Category</p>
            <button
              onClick={toggleDropdown}
              className="search-bg mt-1 flex w-full content-center items-center rounded-md"
            >
              <div className="flex h-[50px] w-full items-center justify-between px-2">
                <p>{category || "Select Category"}</p>
                <MdKeyboardArrowDown />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="relative">
                <div className="absolute left-0 top-full z-50 max-h-[323px] w-full">
                  <div className="modal-dropdown flex-wrap overflow-auto rounded-md border p-2 max-sm:h-[323px] sm:flex">
                    {["Category 1", "Category 2", "Category 3"].map((item) => (
                      <div
                        key={item}
                        className="cursor-pointer p-2 hover:bg-gray-100"
                        onClick={() => handleCategorySelect(item)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3">
            <p className="text-sm">Description</p>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              className="mt-1 h-[173px] w-full rounded-md border bg-transparent p-2 outline-none"
              placeholder="Add your description..."
            ></textarea>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className={`h-[50px] w-full rounded-sm max-sm:h-[45px] ${
                isSubmitEnabled ? "button-primary" : "bg-[#D0D0D0]"
              } text-[#FFFFFF]`}
              onClick={isSubmitEnabled ? submitForm : undefined}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditModal

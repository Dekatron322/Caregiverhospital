import React, { useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
}

const AddCategoryModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  if (!isOpen) return null

  const submitForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    onSubmitSuccess()
    onClose()
  }

  const isSubmitEnabled = comment.trim() !== "" || selectedAmenities.length > 0 || rating > 0

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Add Category</h6>
            <LiaTimesSolid className="cursor-pointer" onClick={onClose} />
          </div>

          <div className="my-4">
            <p className="text-sm">Category Name</p>
            <div className="search-bg mt-1  flex h-[50px] w-[100%]  items-center justify-between gap-3  rounded   px-3 py-1  hover:border-[#5378F6]  focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="text"
                id="search"
                placeholder="Enter Category Name"
                className="h-[45px] w-full bg-transparent  outline-none focus:outline-none"
                style={{ width: "100%", height: "45px" }}
              />
            </div>
          </div>

          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm  text-[#FFFFFF]
               max-sm:h-[45px]"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCategoryModal

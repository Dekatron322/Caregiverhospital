import React from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
interface DeleteCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.deleteModalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="mb-4 text-xl font-bold">Delete Category</h6>
            <div className="border-black hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>
          <p className="mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <button className="button-secondary h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={onClose}>
              Cancel
            </button>
            <button className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteCategoryModal

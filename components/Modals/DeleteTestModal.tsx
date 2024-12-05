import React, { useEffect } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import AOS from "aos"
import "aos/dist/aos.css"

interface TestModalProps {
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
}

const DeleteTestModal: React.FC<TestModalProps> = ({ title, description, onConfirm, onCancel }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  return (
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
      <div className={styles.deleteModalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{title}</h2>
            <div className="border-black  hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onCancel} />
            </div>
          </div>
          <p className="mt-4">{description}</p>
          <div className="mt-6 flex justify-end gap-4">
            <button className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={onConfirm}>
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteTestModal

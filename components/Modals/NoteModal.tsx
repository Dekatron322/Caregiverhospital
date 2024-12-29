import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"

import Image from "next/image"

interface Note {
  id: string
  detail: string
  title: string
}
interface ModalProps {
  results: Note
  onClose: () => void
  userId: string
}

const NoteModal: React.FC<ModalProps> = ({ results, onClose, userId }) => {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string>("")
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddNote = async () => {
    const noteData = {
      title: results.title,
      detail: note,
    }

    try {
      const response = await fetch(`https://api2.caregiverhospital.com/patient/add-note-to-patient/${results.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      })

      if (!response.ok) {
        const responseBody = await response.json()
        console.error("Failed to add note. Status:", response.status, "Response body:", responseBody)
        throw new Error("Failed to add note")
      }

      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 5000)
      onClose()
    } catch (error) {
      console.error("Error adding note:", error)
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Add Note</p>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <div className="mb-2 gap-3">
            <textarea
              id="note"
              className="search-bg h-[100px] w-full rounded border bg-transparent p-2 text-xs outline-none"
              placeholder="Add note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
              onClick={handleAddNote}
            >
              Submit Note
            </button>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#0F920F]">Sent Successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in 0 absolute bottom-16 m-5 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514] md:right-16">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#D14343]">Failed to add note</span>
        </div>
      )}
    </div>
  )
}

export default NoteModal

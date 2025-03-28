import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import { toast } from "sonner"
import Image from "next/image"
import CancelDelete from "public/svgs/cancel-delete"

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddNote = async () => {
    setIsSubmitting(true)

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

      toast.success("Note Added Successfully", {
        description: "The note has been successfully added to the patient's record.",
        duration: 5000,
      })

      onClose()
    } catch (error) {
      console.error("Error adding note:", error)
      toast.error("Failed to Add Note", {
        description: "There was an error adding the note. Please try again.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Add Note</p>
            <div className="m-1 cursor-pointer" onClick={onClose}>
              <CancelDelete />
            </div>
          </div>

          <div className="my-2 gap-3">
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
              className={`button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px] ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handleAddNote}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Note"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteModal

"use client"

import React, { useState, useEffect } from "react"
import styles from "./modal.module.css"
import { MdKeyboardArrowDown } from "react-icons/md"
import { LiaTimesSolid } from "react-icons/lia"
import { toast } from "sonner"
import { Patients } from "app/(admin)/patients/page"

interface Hmo {
  id: string
  name: string
  category: string
  description: string
  status: boolean
  pub_date: string
}

interface EditHmoModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patients | null
  onUpdateSuccess: (updatedPatient: Patients) => void
}

const EditHmoModal: React.FC<EditHmoModalProps> = ({ isOpen, onClose, patient, onUpdateSuccess }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedHmo, setSelectedHmo] = useState<Hmo | null>(null)
  const [hmoList, setHmoList] = useState<Hmo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingHmos, setIsFetchingHmos] = useState(false)

  // Fetch HMO list
  useEffect(() => {
    const fetchHmos = async () => {
      setIsFetchingHmos(true)
      try {
        const response = await fetch("https://api2.caregiverhospital.com/hmo/hmo/fetch/lite-mode/")
        if (!response.ok) throw new Error("Failed to fetch HMOs")
        const data = (await response.json()) as any
        setHmoList(data)
      } catch (error) {
        console.error("Error fetching HMOs:", error)
        toast.error("Failed to load HMOs. Please try again.")
      } finally {
        setIsFetchingHmos(false)
      }
    }

    if (isOpen) {
      fetchHmos()
    }
  }, [isOpen])

  // Initialize form with patient data
  useEffect(() => {
    if (patient && hmoList.length > 0) {
      const currentHmo = hmoList.find((hmo) => hmo.id === patient.hmo.id)
      if (currentHmo) {
        setSelectedHmo(currentHmo)
      }
    }
  }, [patient, hmoList])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleHmoSelect = (hmo: Hmo) => {
    setSelectedHmo(hmo)
    setIsDropdownOpen(false)
  }

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!patient || !selectedHmo) return

    try {
      setIsLoading(true)

      // Prepare payload
      const payload = {
        hmo: selectedHmo.id,
      }

      const response = await fetch(`https://api2.caregiverhospital.com/patient/update/patient-hmo/${patient.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to update patient HMO")
      }

      // Prepare updated patient data
      const updatedPatient = {
        ...patient,
        hmo: {
          ...selectedHmo,
          id: selectedHmo.id,
        },
      }

      // Notify parent component of successful update
      onUpdateSuccess(updatedPatient)

      toast.success("HMO Updated", {
        description: "The patient's HMO has been successfully updated.",
      })

      onClose()
    } catch (error) {
      console.error("Error updating patient HMO:", error)
      toast.error("Update Failed", {
        description: "Failed to update the patient's HMO. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !patient) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Edit Patient HMO</h6>
            <LiaTimesSolid className="cursor-pointer" onClick={onClose} />
          </div>

          <form onSubmit={submitForm}>
            <div className="my-4">
              <p className="text-sm">Current HMO</p>
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  className="h-[45px] w-full bg-transparent outline-none focus:outline-none"
                  value={patient.hmo.name}
                  readOnly
                />
              </div>
            </div>

            <div className="my-4">
              <p className="text-sm">Select New HMO</p>
              <div className="relative">
                <div
                  className="search-bg mt-1 flex h-[50px] w-[100%] cursor-pointer items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2"
                  onClick={toggleDropdown}
                >
                  <input
                    type="text"
                    className="h-[45px] w-full cursor-pointer bg-transparent outline-none focus:outline-none"
                    value={selectedHmo?.name || "Select HMO"}
                    readOnly
                  />
                  <MdKeyboardArrowDown />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                    {isFetchingHmos ? (
                      <div className="p-2 text-center">Loading HMOs...</div>
                    ) : hmoList.length === 0 ? (
                      <div className="p-2 text-center">No HMOs available</div>
                    ) : (
                      hmoList.map((hmo) => (
                        <div
                          key={hmo.id}
                          className={`cursor-pointer p-2 hover:bg-gray-100 ${
                            selectedHmo?.id === hmo.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleHmoSelect(hmo)}
                        >
                          <p className="font-medium text-gray-500">{hmo.name}</p>
                          <p className="text-xs text-gray-500">{hmo.category}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex w-full gap-6">
              <button
                type="submit"
                className={`h-[50px] w-full rounded-sm max-sm:h-[45px] ${
                  selectedHmo ? "button-primary" : "bg-[#D0D0D0]"
                } text-[#FFFFFF]`}
                disabled={!selectedHmo || isLoading || selectedHmo.id === patient.hmo.id}
              >
                {isLoading ? "UPDATING..." : "UPDATE HMO"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditHmoModal

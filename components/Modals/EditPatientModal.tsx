import React, { useRef, useState } from "react"
import styles from "./modal.module.css"
import { Patients } from "app/(admin)/patients/page"
import { IoChevronDownOutline } from "react-icons/io5"
import Image from "next/image"
import CancelDelete from "public/svgs/cancel-delete"
import { toast, Toaster } from "sonner" // Import Sonner toast notifications

interface HMO {
  id: string
  name: string
}

interface EditPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (updatedPatientData: Patients) => void
  patient: Patients
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({ isOpen, onClose, onConfirm, patient }) => {
  // Log the patient object to verify its contents
  console.log("Patient Data:", patient)

  const [formData, setFormData] = useState<Patients>(patient)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showHmoDropdown, setShowHmoDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHmo, setSelectedHmo] = useState<string | null>(formData.hmo.id || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSave = () => {
    const updatedPatientData = {
      ...formData,
      blood_pressure: patient.blood_pressure || "N/A",
      body_temperature: patient.body_temperature || "N/A",
      discount_value: patient.discount_value || "N/A",
      glucose_level: patient.glucose_level || "N/A",
      heart_rate: patient.heart_rate || "N/A",
    }
    console.log("Updated Patient Data:", updatedPatientData)

    try {
      onConfirm(updatedPatientData)
      // Display success toast notification
      toast.success("Patient details updated successfully", {
        description: "The patient's details have been successfully updated.",
        duration: 5000,
        cancel: {
          label: "Close",
          onClick: () => {},
        },
      })
    } catch (error) {
      // Display error toast notification if something goes wrong
      toast.error("Failed to update patient details", {
        description: "An error occurred while updating the patient details.",
        duration: 5000,
        cancel: {
          label: "Close",
          onClick: () => {},
        },
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDropdownSelect = (id: string) => {
    setSelectedHmo(id)
    setFormData((prev) => ({ ...prev, hmo_id: id }))
    setSearchTerm("")
    setShowHmoDropdown(false)
  }

  const handleGenderChange = (selectedGender: string) => {
    setFormData((prev) => ({ ...prev, gender: selectedGender }))
    setShowGenderDropdown(false)
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      {/* Add Toaster component to render the toast notifications */}
      <Toaster position="top-center" richColors />
      <div className={styles.modalContent}>
        <div className="sidebar p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Edit Patient Details</h2>
            <div className="m-1 cursor-pointer" onClick={onClose}>
              <CancelDelete />
            </div>
          </div>
          <form>
            {/* Existing form fields */}
            <div className="my-4 grid grid-cols-3 gap-3 max-sm:grid-cols-2">
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "50px" }}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Gender dropdown */}
              <div className="relative flex items-center">
                <div
                  className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2"
                  onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                >
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    placeholder="Gender"
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%", height: "50px" }}
                  />
                  <IoChevronDownOutline />
                </div>
                {showGenderDropdown && (
                  <div ref={dropdownRef} className="dropdown absolute top-[55px] z-10 w-full rounded-lg shadow-lg">
                    {["Male", "Female"].map((gender) => (
                      <div
                        key={gender}
                        className="cursor-pointer p-2 text-sm hover:bg-[#747A80]"
                        onClick={() => handleGenderChange(gender)}
                      >
                        {gender}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="datetime-local"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                />
              </div>

              {/* Email Address */}
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  name="email_address"
                  placeholder="Email Address"
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "50px" }}
                  value={formData.email_address}
                  onChange={handleChange}
                />
              </div>

              {/* Phone Number */}
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  name="phone_no"
                  placeholder="Phone number"
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "40px" }}
                  value={formData.phone_no}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "50px" }}
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Policy ID and Membership Number */}
            <div className="mb-3 flex gap-3">
              <div className="search-bg relative flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <div className="flex w-[100%] items-center justify-between gap-3">
                  <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
                  <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
                  <input
                    type="text"
                    name="policy_id"
                    placeholder="Policy ID"
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%", height: "50px" }}
                    value={formData.policy_id}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  name="membership_no"
                  placeholder="Membership number"
                  className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "50px" }}
                  value={formData.membership_no}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Allergies and Password */}
            <div className="mb-3">
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="allergies"
                    placeholder="Allergies"
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%", height: "50px" }}
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </div>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="password"
                    placeholder="Enter Password"
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%", height: "50px" }}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <p className="my-2 text-xs text-[#0F920F]">Separate allergies with &rdquo;,&rdquo;</p>
              </div>
            </div>

            {/* Next of Kin Information */}
            <h6 className="text-lg font-medium">Next of Kin Information</h6>
            <div className="mt-3">
              <div className="mb-3 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="nok_name"
                    placeholder="Name"
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%", height: "50px" }}
                    value={formData.nok_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="nok_phone_no"
                    placeholder="Phone number"
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%", height: "40px" }}
                    value={formData.nok_phone_no}
                    onChange={handleChange}
                  />
                </div>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="text"
                    name="nok_address"
                    placeholder="Address"
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%", height: "50px" }}
                    value={formData.nok_address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="mt-4 flex w-full">
            <button onClick={handleSave} className="button-primary h-[50px] w-full rounded px-4 py-2">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPatientModal

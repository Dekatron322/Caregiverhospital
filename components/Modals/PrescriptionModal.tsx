import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import axios from "axios"
import CustomDropdown from "components/Patient/CustomDropdown"
import Image from "next/image"
import Select from "react-select"
import { toast } from "sonner"
import CancelDelete from "public/svgs/cancel-delete"

interface AddPrescription {
  id: string
  name: string
}

type OptionType = {
  value: string
  label: string
}

// Options for multi-select
const options: OptionType[] = [
  { value: "1", label: "Abdominal Pain" },
  { value: "2", label: "Chest Pain" },
  { value: "3", label: "Joint Pain" },
  { value: "4", label: "Waist Pain" },
  { value: "5", label: "Eye Discharge" },
  { value: "6", label: "Nose Discharge" },
  { value: "7", label: "Vagina Discharge" },
  { value: "8", label: "Penial Discharge" },
  { value: "9", label: "Weakness" },
  { value: "10", label: "Vomiting" },
  { value: "11", label: "Cough" },
  { value: "12", label: "Catarrh" },
  { value: "13", label: "Stooling" },
  { value: "14", label: "Poor Appetite" },
  { value: "15", label: "Poor Sleep" },
  { value: "16", label: "Rashes" },
  { value: "17", label: "Sore throat" },
  { value: "18", label: "Fever" },
  { value: "19", label: "Eye Itching" },
  { value: "20", label: "Body Itching" },
  { value: "21", label: "Ear Itching" },
  { value: "22", label: "Perineal Itching" },
  { value: "23", label: "Swollen Eye" },
  { value: "24", label: "Swollen Ear" },
  { value: "25", label: "Swollen Nose" },
  { value: "26", label: "Swollen Perineal" },
  { value: "27", label: "Swollen Penial" },
]

interface ModalProps {
  results: AddPrescription
  onClose: () => void
  userId: string
  onPrescriptionSubmit: () => void
}

interface Medicine {
  id: string
  name: string
  quantity: string
  category: string
  expiry_date: string
  price: string
  how_to_use: string
  side_effect: string
  status: boolean
  pub_date: string
}

interface Category {
  id: string
  name: string
  medicines: Medicine[]
  status: boolean
  pub_date: string
}

interface UserDetails {
  id: number
  username: string
  email: string
  phone_number: string
  address: string
  account_type: string
}

interface Procedure {
  id: string
  name: string
}

const PrescriptionModal: React.FC<ModalProps> = ({ results, onClose, userId, onPrescriptionSubmit }) => {
  const [category, setCategory] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [code, setCode] = useState<string>("")
  const [unit, setUnit] = useState<number>(1)
  const [dosage, setDosage] = useState<string>("")
  const [rate, setRate] = useState<string>("")
  const [usage, setUsage] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [complain, setComplain] = useState<string>("")
  const [status, setStatus] = useState<boolean>(false)
  const [doctorName, setDoctorName] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [procedureData, setProcedureData] = useState<Procedure[]>([])
  const [procedure, setProcedure] = useState<string>("")
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Selected options:", selectedOptions)
  }

  useEffect(() => {
    setMounted(true)
    fetchUserDetails()
    fetchProcedure()
  }, [])

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("id")
      if (userId) {
        const response = await axios.get<UserDetails>(
          `https://api2.caregiverhospital.com/app_user/get-user-detail/${userId}/`
        )
        if (response.data) {
          setUserDetails(response.data)
          setDoctorName(response.data.username)
        } else {
          console.log("User details not found.")
        }
      } else {
        console.log("User ID not found.")
      }
    } catch (error) {
      setError("Failed to load user details.")
      console.error("Error fetching user details:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProcedure = async () => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/procedure/procedure/`)
      if (!response.ok) {
        throw new Error("Failed to fetch procedure")
      }
      const data = (await response.json()) as Procedure[]
      setProcedureData(data)
    } catch (error) {
      console.error("Error fetching procedure:", error)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`https://api2.caregiverhospital.com/medicine-category/medicine-category/`)
        if (!response.ok) {
          throw new Error("Failed to fetch medicine categories")
        }
        const data = (await response.json()) as Category[]
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryChange = (selectedCategoryId: string) => {
    setCategory(selectedCategoryId)
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
    if (selectedCategory) {
      setMedicines(selectedCategory.medicines)
    } else {
      setMedicines([])
    }
  }

  const handleAddPrescription = async () => {
    setIsSubmitting(true)

    try {
      if (userDetails) {
        setDoctorName(userDetails.username)
      }

      const selectedCategory = categories.find((cat) => cat.id === category)
      const selectedMedicine = medicines.find((med) => med.id === name)
      const selectedProceduce = procedureData.find((pro) => pro.id === procedure)
      const procedureName = selectedProceduce ? selectedProceduce.name : ""
      const selectedComplaints = selectedOptions.map((option) => option.label).join(", ")

      const prescriptionData = {
        doctor_name: doctorName,
        category: selectedCategory ? selectedCategory.name : "",
        name: selectedMedicine ? selectedMedicine.name : "",
        dosage: selectedMedicine ? selectedMedicine.price : "",
        complain: selectedComplaints,
        code: procedureName,
        unit,
        payment_status: false,
        rate,
        usage,
        note,
        status: false,
        pub_date: new Date().toISOString(),
      }

      console.log("Prescription data being sent:", prescriptionData)

      const response = await fetch(
        `https://api2.caregiverhospital.com/patient/add-prescription-to-patient/${results.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionData),
        }
      )

      if (!response.ok) {
        const responseBody = await response.json()
        console.error("Failed to add prescription. Status:", response.status, "Response body:", responseBody)
        throw new Error("Failed to add prescription")
      }

      toast.success("Prescription Added Successfully", {
        description: "The prescription has been successfully added to the patient's record.",
        duration: 5000,
      })

      onClose()
      onPrescriptionSubmit()
    } catch (error) {
      console.error("Error adding prescription:", error)
      toast.error("Failed to Add Prescription", {
        description: "There was an error adding the prescription. Please try again.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="my-2 w-full"></div>
        <div className="px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold">Add Prescription for {results.name}</p>
            <div className="m-1 cursor-pointer" onClick={onClose}>
              <CancelDelete />
            </div>
          </div>

          <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded  py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
            <CustomDropdown
              options={procedureData.map((pro) => ({ id: pro.id, name: pro.name }))}
              selectedOption={procedure}
              onChange={setProcedure}
              placeholder="Select Procedure"
            />
          </div>

          <div className="my-2 flex w-full gap-2">
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded  py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <CustomDropdown
                options={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
                selectedOption={category}
                onChange={handleCategoryChange}
                placeholder="Select Category"
              />
            </div>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded  py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <CustomDropdown
                options={medicines.map((med) => ({ id: med.id, name: med.name }))}
                selectedOption={name}
                onChange={setName}
                placeholder="Select Medicine"
              />
            </div>
          </div>
          <div className="my-2 flex w-full gap-2">
            <div className="w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="number"
                  id="unit"
                  placeholder="Unit"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={unit}
                  onChange={(e) => setUnit(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="hidden w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="dosage"
                  placeholder="Dosage"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="my-2 flex w-full gap-2">
            <div className=" w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="rate"
                  placeholder="Enter Rate"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="usage"
                  placeholder="Enter Usage"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className=" my-2 w-full">
            <Select
              options={options}
              isMulti
              className="search-bg text-xs text-black"
              value={selectedOptions}
              onChange={(selected) => setSelectedOptions(selected as OptionType[])}
              placeholder="Select Complaints"
            />
          </div>

          <div className="my-2 w-full">
            <div className="search-bg mt-1 flex h-[80px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <textarea
                id="note"
                placeholder="Enter Note"
                className="h-[75px] w-full bg-transparent text-xs outline-none focus:outline-none"
                style={{ width: "100%", height: "75px" }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              className={`button-primary h-[50px] w-full rounded-sm max-sm:h-[45px] ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handleAddPrescription}
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
                  Processing...
                </span>
              ) : (
                "Add Prescription"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionModal

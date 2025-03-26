import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { HiMiniStar } from "react-icons/hi2"
import axios from "axios"
import CustomDropdown from "components/Patient/CustomDropdown"
import { toast } from "sonner"
import CancelDelete from "public/svgs/cancel-delete"

interface RateIconProps {
  filled: boolean
  onClick: () => void
}

const RateIcon: React.FC<RateIconProps> = ({ filled, onClick }) => {
  return (
    <span onClick={onClick} style={{ cursor: "pointer" }}>
      {filled ? (
        <HiMiniStar className="h-5 w-5 text-[#FFC70066]" />
      ) : (
        <HiMiniStar className="h-5 w-5 text-[#FFC70066] opacity-40" />
      )}
    </span>
  )
}

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
  patientId: string
}

interface UserDetails {
  id: number
  username: string
  email: string
  phone_number: string
  address: string
  account_type: string
}

interface Medicine {
  id: string
  name: string
  category: string
  quantity: string
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
  status: boolean
  pub_date: string
  medicines: Medicine[]
}

const AdministerDrugModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, patientId }) => {
  const [unit, setUnit] = useState<string>("")
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>("")
  const [selectedMedicineName, setSelectedMedicineName] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkAppId, setCheckAppId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])

  useEffect(() => {
    fetchUserDetails()
    fetchCheckAppId()
    fetchCategoriesAndMedicines()
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

  const fetchCheckAppId = async () => {
    try {
      const response = await axios.get(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
      const patient = response.data
      if (patient && patient.check_apps && patient.check_apps.length > 0) {
        setCheckAppId(patient.check_apps[0].id)
      } else {
        console.log("Check App ID not found.")
      }
    } catch (error) {
      console.error("Error fetching Check App ID:", error)
    }
  }

  const fetchCategoriesAndMedicines = async () => {
    try {
      const response = await axios.get<Category[]>(
        `https://api2.caregiverhospital.com/medicine-category/medicine-category/`
      )
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories and medicines:", error)
    }
  }

  const handleCategoryChange = (selected: string) => {
    setCategory(selected)
    const selectedCategory = categories.find((category) => category.id === selected)
    if (selectedCategory) {
      setFilteredMedicines(selectedCategory.medicines)
    } else {
      setFilteredMedicines([])
    }
  }

  const handleMedicineChange = (selected: string) => {
    setSelectedMedicineId(selected)
    const selectedMedicine = filteredMedicines.find((medicine) => medicine.id === selected)
    if (selectedMedicine) {
      setSelectedMedicineName(selectedMedicine.name)
    }
  }

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (userDetails && checkAppId) {
      try {
        const response = await axios.post(
          `https://api2.caregiverhospital.com/check-app/add-drug-to-check-app/${checkAppId}/`,
          {
            nurse_name: userDetails.username,
            category: categories.find((cat) => cat.id === category)?.name || "",
            name: selectedMedicineName,
            unit: unit,
            pub_date: new Date().toISOString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        if (response.status === 200 || response.status === 201) {
          toast.success("Medication administered successfully!")
          onSubmitSuccess()
          onClose()
        } else {
          throw new Error(`Failed to prescribe medication: ${response.statusText}`)
        }
      } catch (error) {
        console.error("Error prescribing medication:", error)
        toast.error("Error administering medication")
      }
    }
  }

  if (!isOpen) return null

  const isSubmitEnabled = selectedMedicineId.trim() !== "" && category.trim() !== "" && unit.trim() !== ""

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">
              Administer Medication - Nurse. {userDetails?.username || "Loading..."}
            </h6>
            <div className="m-1 cursor-pointer" onClick={onClose}>
              <CancelDelete />
            </div>
          </div>

          <div className="mt-3">
            <div className="my-2 flex w-full gap-2">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <CustomDropdown
                  options={categories.map((category) => ({ id: category.id, name: category.name }))}
                  selectedOption={category}
                  onChange={handleCategoryChange}
                  placeholder="Select Category"
                />
              </div>
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <CustomDropdown
                  options={filteredMedicines.map((medicine) => ({ id: medicine.id, name: medicine.name }))}
                  selectedOption={selectedMedicineId}
                  onChange={handleMedicineChange}
                  placeholder="Select Medicine"
                />
              </div>
            </div>

            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <input
                type="number"
                id="unit"
                placeholder="Unit"
                className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                style={{ width: "100%", height: "45px" }}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex w-full gap-6">
            <button
              className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              onClick={submitForm}
              disabled={!isSubmitEnabled}
            >
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdministerDrugModal

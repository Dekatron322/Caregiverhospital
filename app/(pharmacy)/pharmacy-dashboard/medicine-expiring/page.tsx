"use client"
import { useEffect, useState } from "react"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowBack, IoMdSearch } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import { HiOutlineTrash } from "react-icons/hi2"
import TrashDrugModal from "components/Modals/TrashDrugModal"
import PharmacyNav from "components/Navbar/PharmacyNav"

interface Medicine {
  id: string
  name: string
  quantity: string
  category: string // This is the category ID
  expiry_date: string
  price: string
  procedure_code: string
  how_to_use: string
  side_effect: string
  status: boolean
  pub_date: string
  medicine_id: string
}

interface Category {
  id: string
  name: string
  status: boolean
  pub_date: string
}

interface MedicineExpiringProps {
  params: {
    medicineId: any
  }
}

export default function MedicineExpiring({ params }: MedicineExpiringProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [categories, setCategories] = useState<Category[]>([]) // Add state for categories
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null)
  const { medicineId } = params

  const patientsPerPage = 7
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = medicines.slice(indexOfFirstPatient, indexOfLastPatient)

  const pageNumbers: number[] = []
  for (let i = 1; i <= Math.ceil(medicines.length / patientsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const filteredPatients = currentPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleGoBack = () => {
    router.back()
  }

  const openDeleteModal = () => {
    setIsDeleteOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setSelectedMedicineId(id)
    setIsDeleteOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteOpen(false)
  }

  const handleHmoSubmissionSuccess = () => {
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 5000)
  }

  const fetchMedicines = async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/medicine/medicine")
      const data = (await response.json()) as Medicine[]
      const today = new Date()
      const filteredData = data.filter((medicine) => {
        const expiryDate = new Date(medicine.expiry_date)
        return expiryDate <= today
      })
      setMedicines(filteredData)
    } catch (error) {
      console.error("Error fetching medicines:", error)
    }
  }

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/medicine-category/medicine-category/")
      const data = (await response.json()) as Category[]
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchMedicines()
    fetchCategories() // Fetch categories when component mounts
  }, [])

  // Function to get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Unknown"
  }

  return (
    <section>
      <div className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <PharmacyNav />

            <div className="flex items-center gap-2 px-16 pt-6 max-sm:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>
            {filteredPatients.length === 0 ? (
              <section></section>
            ) : (
              <div className="mb-6 mt-10 flex items-center justify-between px-16 max-sm:px-3">
                <h3 className="font-semibold">Drug Shortage</h3>
                <div className="search-bg flex h-8 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-sm:w-[180px] lg:w-[300px]">
                  <IoMdSearch />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search"
                    className="w-full bg-transparent outline-none focus:outline-none"
                    style={{ width: "100%" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 px-16 max-sm:px-3">
              {filteredPatients.length === 0 ? (
                <section>
                  <div className="mt-auto flex h-full w-full items-center justify-center">
                    <div>
                      <Image src="/undraw_medical_care_movn.svg" height={237} width={341} alt="pharmacy" />
                      <div className="mt-16 items-center justify-center">
                        <h1 className="text-center text-5xl font-bold">No Expired drugs</h1>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </section>
              ) : (
                filteredPatients.map((shortage) => (
                  <div
                    key={shortage.id}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
                  >
                    <div className="w-full">
                      <p className="text-sm font-bold">{shortage.name}</p>
                      <small className="text-xs">Medicine Name</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold">{shortage.medicine_id}</p>
                      <small className="text-xs">Medicine ID</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <div className="flex gap-1 text-sm font-bold">{getCategoryNameById(shortage.category)}</div>
                      <small className="text-xs">Category Name</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold">{shortage.expiry_date}</p>
                      <small className="text-xs">Expiry date</small>
                    </div>

                    <div className="" onClick={() => handleDeleteClick(shortage.id)}>
                      <button className="flex content-center items-center gap-1 whitespace-nowrap rounded-md bg-[#F2B8B5] px-2 py-2 text-[#601410]">
                        <p className="text-[12px]">Trash Medicine</p>
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredPatients.length === 0 ? (
              <section></section>
            ) : (
              <div className="mb-4 mt-4 flex items-center justify-end px-16 max-sm:px-3">
                <ul className="flex items-center gap-2">
                  <li>
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                      <IoIosArrowBack />
                    </button>
                  </li>
                  {pageNumbers.map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => handlePageChange(number)}
                        className={
                          currentPage === number
                            ? "h-6 w-6 rounded-full bg-[#131414] text-sm text-[#ffffff] shadow"
                            : "h-6 w-6 rounded-full bg-[#F1FFF0] text-sm text-[#1E1E1E]"
                        }
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === Math.ceil(medicines.length / patientsPerPage)}
                    >
                      <IoIosArrowForward />
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <Footer />
          </div>
        </div>
      </div>
      <TrashDrugModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
        medicineId={selectedMedicineId}
      />
    </section>
  )
}

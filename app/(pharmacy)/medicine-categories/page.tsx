"use client"
import AddCategoryModal from "components/Modals/AddCategoryModal"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import { IoIosArrowBack, IoIosArrowForward, IoMdSearch } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import { SetStateAction, useEffect, useState } from "react"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import PharmacyNav from "components/Navbar/PharmacyNav"
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined"
import DeleteCategoryModal from "components/Modals/DeleteCategoryModal"
import EditCategoryModal from "components/Modals/EditCategoryModal"
// Define types
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

interface MedicineCategory {
  id: string
  medicines: Medicine[]
  name: string
  status: boolean
  pub_date: string
}

export default function MedicineCategories() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false)
  const [medicineCategories, setMedicineCategories] = useState<MedicineCategory[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)

  const [categoryToEdit, setCategoryToEdit] = useState<MedicineCategory | null>(null)

  // Function to open the edit modal

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/medicine-category/medicine-category/")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = (await response.json()) as MedicineCategory[]
      setMedicineCategories(data)
    } catch (error) {
      console.error("Error fetching medicine categories:", error)
      setError("Failed to fetch medicine categories")
    } finally {
      setLoading(false)
    }
  }

  const handlePatientClick = (medicineId: string) => {
    router.push(`/medicines/medicine-details/${medicineId}`)
  }

  const openDeleteModal = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setIsDeleteModalOpen(true)
  }

  // Function to close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setCategoryToDelete(null)
  }

  const patientsPerPage = 100
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = medicineCategories.slice(indexOfFirstPatient, indexOfLastPatient)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(medicineCategories.length / patientsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1)
  }

  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    setCurrentPage(pageNumber)
  }

  const openEditModal = (category: MedicineCategory) => {
    setCategoryToEdit(category)
    setIsEditModalOpen(true)
  }

  // Function to close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setCategoryToEdit(null)
  }

  const filteredPatients = currentPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openCategoryModal = () => {
    setIsCategoryOpen(true)
  }

  const closeCategoryModal = () => {
    setIsCategoryOpen(false)
  }

  const handleHmoSubmissionSuccess = () => {
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 5000)
    fetchCategories()
    setIsCategoryOpen(false)
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetch(
        `https://api2.caregiverhospital.com/medicine-category/medicine_category/${categoryToDelete}/`,
        {
          method: "DELETE",
        }
      )

      const responseBody = await response.text() // or response.json() if it's JSON

      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.status} - ${responseBody}`)
      }

      // Refresh categories after successful deletion
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      setError("Failed to delete category")
    } finally {
      closeDeleteModal()
    }
  }

  return (
    <section>
      <div className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <PharmacyNav />

            <div className="flex items-center gap-2 px-16 pt-4 max-md:px-3">
              <p className="font-bold">Pharmacy</p>
              <IoIosArrowForward />
              <p className="capitalize">List of {pathname.split("/").pop()}</p>
            </div>
            {filteredPatients.length === 0 ? (
              <section></section>
            ) : (
              <div className="mb-6 mt-10 flex items-center justify-between px-16 max-sm:px-3">
                <div className="search-bg flex h-10 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-sm:w-[180px] lg:w-[300px]">
                  <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search"
                    className="w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button onClick={openCategoryModal} className="add-button">
                  <p className="text-[12px]">Add New Category</p>
                  <GoPlus />
                </button>
              </div>
            )}

            <div className="flex h-full flex-col gap-2 px-16 max-sm:px-3">
              {loading ? (
                <div className="loading-text flex h-full items-center justify-center">
                  {"loading...".split("").map((letter, index) => (
                    <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                      {letter}
                    </span>
                  ))}
                </div>
              ) : error ? (
                <p>{error}</p>
              ) : filteredPatients.length === 0 ? (
                <section>
                  <div className="mt-auto flex h-full w-full items-center justify-center">
                    <div>
                      <Image src="/undraw_medical_care_movn.svg" height={237} width={341} alt="pharmacy" />
                      <div className="mt-16 items-center justify-center">
                        <h1 className="text-center text-5xl font-bold">No Medicine Yet</h1>
                        <button className="flex cursor-pointer items-center justify-center" onClick={openCategoryModal}>
                          <p className="text-center">Add a new Medicine</p>
                          <IoAddCircleSharp />
                        </button>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </section>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
                  >
                    <div className="w-full">
                      <p className="text-sm font-bold">{patient.name}</p>
                      <small className="text-xs">Category name</small>
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-bold">{patient.medicines.length}</p>
                      <small className="text-xs">No. of medicine</small>
                    </div>

                    <div className="flex gap-2">
                      <BorderColorOutlinedIcon onClick={() => openEditModal(patient)} />
                      <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => openDeleteModal(patient.id)} />
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
                  <li className="flex items-center">
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
                  <li className="flex items-center">
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === Math.ceil(medicineCategories.length / patientsPerPage)}
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
      <AddCategoryModal
        isOpen={isCategoryOpen}
        onClose={closeCategoryModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
      />

      {isEditModalOpen && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          category={categoryToEdit}
          onSubmitSuccess={handleHmoSubmissionSuccess}
        />
      )}

      <DeleteCategoryModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onDelete={handleDeleteCategory} />

      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Category added successfully</span>
        </div>
      )}
    </section>
  )
}

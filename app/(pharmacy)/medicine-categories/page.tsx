"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowForward, IoMdSearch, IoIosArrowBack, IoMdArrowBack } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import { MedicineCategory } from "utils"
import { SetStateAction, useState } from "react"

import "aos/dist/aos.css"
import Image from "next/image"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import AddCategoryModal from "components/Modals/AddCategoryModal"

export default function MedicineCategories() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const router = useRouter()
  const handlePatientClick = (medicineId: string) => {
    router.push(`/medicines/medicine-details/${medicineId}`)
  }

  const patientsPerPage = 7
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = MedicineCategory.slice(indexOfFirstPatient, indexOfLastPatient)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(MedicineCategory.length / patientsPerPage); i++) {
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
  }

  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />

            <div className="flex items-center gap-2 px-16  pt-4 max-md:px-3">
              <p className="font-bold">Pharmacy</p>
              <IoIosArrowForward />
              <p className="capitalize">List of {pathname.split("/").pop()}</p>
            </div>
            {filteredPatients.length === 0 ? (
              <></>
            ) : (
              <div className="mb-6 mt-10 flex items-center justify-between px-16 max-sm:px-3">
                <div className="search-bg flex h-8 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-sm:w-[180px] lg:w-[300px]">
                  <IoMdSearch />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search"
                    className="w-full bg-transparent  outline-none focus:outline-none"
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

            <div className=" flex  flex-col gap-2 px-16  max-sm:px-3 ">
              {filteredPatients.length === 0 ? (
                <>
                  <div className="mt-auto flex h-full w-full items-center justify-center">
                    <div>
                      <Image src="/undraw_medical_care_movn.svg" height={237} width={341} alt="pharmacy" />
                      <div className="mt-16 items-center justify-center">
                        <h1 className="text-center text-5xl font-bold">No Patient Yet</h1>
                        <Link className="flex cursor-pointer items-center justify-center" href="/patients/add">
                          <p className="text-center">Add a new Patient</p>
                          <IoAddCircleSharp />
                        </Link>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </>
              ) : (
                filteredPatients.map((patient, index) => (
                  <div
                    key={patient.id}
                    className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
                  >
                    <div className="w-full">
                      <p className="text-sm font-bold">{patient.name}</p>
                      <small className="text-xs ">Category name</small>
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-bold">{patient.number_of_medicines}</p>
                      <small className="text-xs ">No. of medicine</small>
                    </div>

                    <div className="">
                      <p className="w-full  whitespace-nowrap px-2 py-[2px] text-center text-xs font-semibold">
                        View Full Detail
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredPatients.length === 0 ? (
              <></>
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
                      disabled={currentPage === Math.ceil(MedicineCategories.length / patientsPerPage)}
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
      </section>
      <AddCategoryModal
        isOpen={isCategoryOpen}
        onClose={closeCategoryModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
      />
    </>
  )
}

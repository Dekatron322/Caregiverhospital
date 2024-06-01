"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowForward, IoMdSearch, IoIosArrowBack, IoMdArrowBack } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import { MedicineList } from "utils"
import { SetStateAction, useState } from "react"

import "aos/dist/aos.css"
import Image from "next/image"
import Link from "next/link"
import { PiDotsThree } from "react-icons/pi"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"

export default function Medicines() {
  const pathname = usePathname()
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const handlePatientClick = (medicineId: string) => {
    router.push(`/medicines/medicine-details/${medicineId}`)
  }

  const patientsPerPage = 7
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = MedicineList.slice(indexOfFirstPatient, indexOfLastPatient)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(MedicineList.length / patientsPerPage); i++) {
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
    patient.medicine_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <div className="mb-6 mt-10 flex items-center justify-between px-16 max-md:px-3">
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
                <Link href="/medicines/add" className="add-button">
                  <p className="text-[12px]">Add New Item</p>
                  <GoPlus />
                </Link>
              </div>
            )}

            <div className=" flex  flex-col gap-2 px-16  max-sm:px-3">
              {filteredPatients.length === 0 ? (
                <>
                  <div className="mt-auto flex h-full w-full items-center justify-center">
                    <div>
                      <Image src="/undraw_medical_care_movn.svg" height={237} width={341} alt="pharmacy" />
                      <div className="mt-16 items-center justify-center">
                        <h1 className="text-center text-5xl font-bold">No Patient Yet</h1>
                        <Link className="flex cursor-pointer items-center justify-center" href="/medicines/add">
                          <p className="text-center">Add a new Medicine</p>
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
                      <p className="text-sm font-bold">{patient.medicine_name}</p>
                      <small className="text-xs ">Medicine Name</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold">{patient.medicine_id}</p>
                      <small className="text-xs ">Medicine Id</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <div className="flex gap-1 text-sm font-bold">{patient.category}</div>
                      <small className="text-xs ">Category</small>
                    </div>
                    <div className="w-full ">
                      <p className="text-sm font-bold">{patient.stock}</p>
                      <small className="text-xs ">Quantity in Stock</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <button
                        onClick={() => handlePatientClick(patient.id)}
                        className="w-full  whitespace-nowrap px-2 py-[2px] text-center text-xs font-semibold"
                      >
                        View Full Detail
                      </button>
                    </div>
                    <div className="">
                      <PiDotsThree />
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
                      disabled={currentPage === Math.ceil(MedicineList.length / patientsPerPage)}
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
    </>
  )
}

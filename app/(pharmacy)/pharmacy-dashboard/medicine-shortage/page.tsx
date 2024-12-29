"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowBack, IoMdSearch } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import { Shortage } from "utils"
import { SetStateAction, useState } from "react"

import Image from "next/image"
import Link from "next/link"
import { PiDotsThree } from "react-icons/pi"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import PharmacyNav from "components/Navbar/PharmacyNav"

export default function MedicineShortage() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const handlePatientClick = (patientId: string) => {
    router.push(`/patients/patient/${patientId}`)
  }

  const patientsPerPage = 7
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = Shortage.slice(indexOfFirstPatient, indexOfLastPatient)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(Shortage.length / patientsPerPage); i++) {
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

  const handleGoBack = () => {
    router.back()
  }

  return (
    <section>
      <div className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <PharmacyNav />

            <div className="flex items-center gap-2 px-16  pt-6 max-sm:px-3">
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
                    className="w-full bg-transparent  outline-none focus:outline-none"
                    style={{ width: "100%" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 px-16  max-sm:px-3">
              {filteredPatients.length === 0 ? (
                <section>
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
                </section>
              ) : (
                filteredPatients.map((shortage, index) => (
                  <div
                    key={shortage.id}
                    className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
                  >
                    <div className="w-full">
                      <p className="text-sm font-bold">{shortage.name}</p>
                      <small className="text-xs ">Medicine Name</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold">{shortage.medicine_id}</p>
                      <small className="text-xs ">Medicine ID</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <div className="flex gap-1 text-sm font-bold">{shortage.category_name}</div>
                      <small className="text-xs ">Category Name</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold ">{shortage.in_stock}</p>
                      <small className="text-xs ">Qty. in Stock</small>
                    </div>

                    <div className="">
                      <button className="flex content-center items-center gap-1 whitespace-nowrap rounded-md bg-[#076fc6] px-2 py-2 text-[#ffffff]">
                        <p className="text-[12px]">Resolve Shortage</p>
                        <GoPlus />
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
                      disabled={currentPage === Math.ceil(Shortage.length / patientsPerPage)}
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
    </section>
  )
}

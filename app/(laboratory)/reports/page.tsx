"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowForward, IoMdSearch, IoIosArrowBack, IoMdArrowBack } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import { LabTestResults } from "utils"
import { SetStateAction, useState } from "react"

import "aos/dist/aos.css"
import Image from "next/image"
import Link from "next/link"
import { PiDotsThree } from "react-icons/pi"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"

export default function Reports() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const handlePatientClick = (reportId: any) => {
    router.push(`/reports/report/${reportId}`)
  }

  const reportsPerPage = 7
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReport = LabTestResults.slice(indexOfFirstReport, indexOfLastReport)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(LabTestResults.length / reportsPerPage); i++) {
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

  const filteredReports = currentReport.filter((report) => report.status.toLowerCase() === "approved")

  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />

            <div className="flex items-center gap-2 px-16  pt-6 max-sm:px-3">
              <p className="font-bold">Admin Dashboard</p>
              <IoIosArrowForward />
              <p className="capitalize">{pathname.split("/").pop()}</p>
            </div>
            {filteredReports.length === 0 ? (
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
              </div>
            )}

            <div className=" flex   flex-col gap-2 px-16 max-sm:px-3">
              {filteredReports.length === 0 ? (
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
                filteredReports.map((results, index) => (
                  <div
                    key={results.id}
                    className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
                  >
                    <div className="w-full ">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <span className="max-sm:hidden">
                          <Image src={results.image} height={50} width={50} alt="" />
                        </span>
                        <div>
                          <p>{results.name}</p>
                          <p className="text-xs ">HMO ID: {results.hmo_id}</p>
                          <p className="text-xs ">
                            {results.gender}, {results.age} years old
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold">{results.test_type}</p>
                      <p className="text-xs ">Description</p>
                    </div>
                    <div className="w-full ">
                      <p
                        className="w-32 rounded 
                         bg-[#46FFA6] px-2 py-[2px] text-center text-xs text-[#000000]"
                      >
                        {results.status}
                      </p>
                    </div>

                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold">requested by {results.doctor}</p>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold"> {results.time}</p>
                    </div>
                    <div>
                      <PiDotsThree onClick={() => handlePatientClick(results.id)} />
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredReports.length === 0 ? (
              <></>
            ) : (
              <div className="mb-4 mt-4 flex items-center justify-end px-16 max-sm:px-3">
                <ul className="flex items-center justify-center gap-2">
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
                      disabled={currentPage === Math.ceil(LabTestResults.length / reportsPerPage)}
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

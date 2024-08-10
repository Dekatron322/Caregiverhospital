"use client"
import React, { SetStateAction, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Footer from "components/Footer/Footer"
import { IoIosArrowBack, IoIosArrowForward, IoMdSearch } from "react-icons/io"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined"
import Image from "next/image"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import DeletePatientModal from "components/Modals/DeletePatientModal"
import EditDiagnosisModal from "components/Modals/EditDiagnosisModal"

import NursesNav from "components/Navbar/NursesNav"

interface Diagnosis {
  id: string
  name: string
  code: string
  status: string
  price: string
  pub_date: string
}

export default function Patients() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [diagnosisToDelete, setDiagnosisToDelete] = useState<Diagnosis | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [diagnosisToEdit, setDiagnosisToEdit] = useState<Diagnosis | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  useEffect(() => {
    fetchDiagnosis()
  }, [])

  const openDeleteModal = (diagnosis: Diagnosis) => {
    setDiagnosisToDelete(diagnosis)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDiagnosisToDelete(null)
    setIsDeleteModalOpen(false)
  }

  const confirmDelete = async () => {
    if (diagnosisToDelete) {
      try {
        const response = await fetch(`https://api.caregiverhospital.com/diagnosis/diagnosis/${diagnosisToDelete.id}/`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error("Failed to delete diagnosis")
        }
        setDiagnosis(diagnosis.filter((d) => d.id !== diagnosisToDelete.id))
        closeDeleteModal()
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 5000)
      } catch (error) {
        console.error("Error deleting diagnosis:", error)
      }
    }
  }

  const openEditModal = (diagnosis: Diagnosis) => {
    setDiagnosisToEdit(diagnosis)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setDiagnosisToEdit(null)
    setIsEditModalOpen(false)
  }

  const handleEditSave = (updatedDiagnosis: Diagnosis) => {
    setDiagnosis((prev) => prev.map((d) => (d.id === updatedDiagnosis.id ? updatedDiagnosis : d)))
  }

  const fetchDiagnosis = async () => {
    try {
      const response = await fetch("https://api.caregiverhospital.com/diagnosis/diagnosis/")
      if (!response.ok) {
        throw new Error("Failed to fetch diagnosis")
      }
      const data = (await response.json()) as Diagnosis[]
      setDiagnosis(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching diagnosis:", error)
      setLoading(false)
    }
  }

  const diagnosisPerPage = 7
  const indexOfLastDiagnosis = currentPage * diagnosisPerPage
  const indexOfFirstDiagnosis = indexOfLastDiagnosis - diagnosisPerPage
  const currentDiagnosis = diagnosis.slice(indexOfFirstDiagnosis, indexOfLastDiagnosis)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(diagnosis.length / diagnosisPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    setCurrentPage(pageNumber)
  }

  const filteredDiagnosis = currentDiagnosis.filter((diagnosis) =>
    diagnosis.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <NursesNav />

            <div className="flex items-center gap-2 px-16 pt-4 max-md:px-3">
              <p className="font-bold">Admin Dashboard</p>
              <IoIosArrowForward />
              <p className="capitalize">{pathname.split("/").pop()}</p>
            </div>

            <div className="mb-6 mt-10 flex items-center justify-between px-16 max-md:px-3">
              <div className="search-bg flex h-10 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-md:w-[180px] lg:w-[300px]">
                <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
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
              <Link href="/all-diagnosis/add" className="add-button">
                <p className="text-[12px]">Add Diagnosis</p>
                <GoPlus />
              </Link>
            </div>

            <div className="mb-4 flex h-full flex-col gap-2 px-16 max-sm:px-4">
              {loading ? (
                <div className="loading-text flex h-full items-center justify-center">
                  {"loading...".split("").map((letter, index) => (
                    <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                      {letter}
                    </span>
                  ))}
                </div>
              ) : filteredDiagnosis.length === 0 ? (
                <div className="mt-auto flex h-full w-full items-center justify-center">
                  <div>
                    <Image src="/undraw_medical_care_movn.svg" height={237} width={341} alt="pharmacy" />
                    <div className="mt-16 items-center justify-center">
                      <h1 className="text-center text-5xl font-bold">No Diagnosis yet</h1>
                      <Link className="flex cursor-pointer items-center justify-center" href="/all-diagnosis/add">
                        <p className="text-center">Add a new Diagnosis</p>
                        <IoAddCircleSharp />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                filteredDiagnosis.map((diagnosis) => (
                  <div
                    key={diagnosis.id}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
                  >
                    <div className="flex w-[20%] items-center gap-1 text-sm font-bold">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]">
                        <p className="capitalize text-[#000000]">{diagnosis.name.charAt(0)}</p>
                      </div>
                    </div>
                    <div className="flex w-full items-center gap-1 text-sm font-bold">
                      <div>
                        <p>{diagnosis.name}</p>
                        <small className="text-xs">Diagnosis</small>
                      </div>
                    </div>

                    <div className="w-full max-md:hidden">
                      <p className="text-sm font-bold">{diagnosis.code}</p>
                      <small className="text-xs">Diagnosis Code</small>
                    </div>
                    <div className="w-full max-md:hidden">
                      <div className="flex gap-1 text-sm font-bold">{diagnosis.price}</div>
                      <small className="text-xs">Price/Unit</small>
                    </div>

                    <div className="w-full max-md:hidden">
                      <div className="flex gap-1 text-sm font-bold">{formatDate(diagnosis.pub_date)}</div>
                      <small className="text-xs">Date Added</small>
                    </div>

                    <div className="flex gap-2">
                      <BorderColorOutlinedIcon onClick={() => openEditModal(diagnosis)} />
                      <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => openDeleteModal(diagnosis)} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredDiagnosis.length > 0 && (
              <div className="mb-4 flex items-center justify-end px-16 max-sm:px-3 md:mt-4">
                <ul className="flex items-center gap-2">
                  <li>
                    <button className="flex items-center" onClick={handlePrevPage} disabled={currentPage === 1}>
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
                      className="flex items-center"
                      onClick={handleNextPage}
                      disabled={currentPage === pageNumbers.length}
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

      <DeletePatientModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        patientName={diagnosisToDelete?.name || ""}
      />

      <EditDiagnosisModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        diagnosis={diagnosisToEdit}
        onSave={handleEditSave}
      />

      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Deleted Successfully</span>
        </div>
      )}
    </>
  )
}

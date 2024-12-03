"use client"
import { SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import Link from "next/link"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import PharmacyNav from "components/Navbar/PharmacyNav"
import LaboratoryNav from "components/Navbar/LaboratoryNav"
import { FaEdit } from "react-icons/fa"
import { LiaTimesSolid } from "react-icons/lia"

interface Medicine {
  id: string
  param_title: string
  param_result: string
  category: string
  param_unit: string
  param_range: string
  status: boolean
  pub_date: string
}

interface Category {
  id: string
  title: string
  parameters: Medicine[]
}

export default function Medicines() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("https://api2.caregiverhospital.com/testt/testt/")
        if (!response.ok) {
          throw new Error("Failed to fetch medicines")
        }
        const data = (await response.json()) as Category[]
        const extractedMedicines: Medicine[] = data.flatMap((category) =>
          category.parameters.map((medicine) => ({
            ...medicine,
            category: category.title, // Assign category name to each medicine
          }))
        )

        // Sort medicines alphabetically by name
        extractedMedicines.sort((a, b) => a.param_title.localeCompare(b.param_title))

        setMedicines(extractedMedicines)
      } catch (error) {
        console.error("Error fetching medicines:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()
  }, [])

  const medicinesPerPage = 100

  // Filter the entire list of medicines based on the search query
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.param_title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Apply pagination on the filtered list
  const indexOfLastMedicine = currentPage * medicinesPerPage
  const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage
  const currentMedicines = filteredMedicines.slice(indexOfFirstMedicine, indexOfLastMedicine)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(filteredMedicines.length / medicinesPerPage); i++) {
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

  // Reset current page to 1 when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset page to 1 on search
  }

  const handleEditClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedMedicine(null)
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedMedicine) return

    setLoading(true) // Set loading to true before starting the request

    try {
      const response = await fetch(`https://api2.caregiverhospital.com/testt/parameter/${selectedMedicine.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMedicine),
      })

      if (!response.ok) {
        throw new Error("Failed to update parameter")
      }

      // Update state to reflect changes
      const updatedMedicines = medicines.map((medicine) =>
        medicine.id === selectedMedicine.id ? selectedMedicine : medicine
      )
      setMedicines(updatedMedicines)
      handleModalClose()
    } catch (error) {
      console.error("Error updating parameter:", error)
    } finally {
      setLoading(false) // Set loading to false after the request is complete
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (selectedMedicine) {
      setSelectedMedicine({
        ...selectedMedicine,
        [event.target.name]: event.target.value,
      })
    }
  }

  return (
    <section>
      <div className="h-full ">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <LaboratoryNav />

            <div className="flex items-center gap-2 px-16 pt-4 max-md:px-3">
              <p className="font-bold">Laboratory</p>
              <IoIosArrowForward />
              <p className="capitalize">Test Parameters</p>
            </div>
            {filteredMedicines.length === 0 ? (
              <section></section>
            ) : (
              <div className="mb-6 mt-10 flex items-center justify-between px-16 max-md:px-3">
                <div className="search-bg flex h-10 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-sm:w-[180px] lg:w-[300px]">
                  <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search"
                    className="w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%" }}
                    value={searchQuery}
                    onChange={handleSearchChange} // Use the new handler
                  />
                </div>
                <Link href="/test-parameters/add" className="add-button">
                  <p className="text-[12px]">Add New Parameter</p>
                  <GoPlus />
                </Link>
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
              ) : currentMedicines.length === 0 ? (
                <section>
                  <div className="mt-auto flex h-full w-full items-center justify-center">
                    <div>
                      <Image src="/undraw_medical_care_movn.svg" height={237} width={341} alt="pharmacy" />
                      <div className="mt-16 items-center justify-center">
                        <h1 className="text-center text-5xl font-bold">No Test Parameters Found</h1>
                        <Link className="flex cursor-pointer items-center justify-center" href="/test-parameters/add">
                          <p className="text-center">Add a new Parameter</p>
                          <IoAddCircleSharp />
                        </Link>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </section>
              ) : (
                currentMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
                  >
                    <div className="w-full">
                      <p className="text-sm font-bold">{medicine.param_title}</p>
                      <small className="text-xs">Parameter Name</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold">{medicine.param_unit || "N/A"}</p>
                      <small className="text-xs">Param Unit</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold">{medicine.param_range || "N/A"}</p>
                      <small className="text-xs">Param Range</small>
                    </div>
                    <div className="w-full">
                      <div className="flex gap-1 whitespace-nowrap text-sm font-bold">{medicine.category}</div>
                      <small className="text-xs">Test</small>
                    </div>

                    <div className="">
                      <button
                        onClick={() => handleEditClick(medicine)}
                        className="w-full whitespace-nowrap px-2 py-[2px] text-center text-xs font-semibold"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredMedicines.length === 0 ? (
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
                      disabled={currentPage === Math.ceil(filteredMedicines.length / medicinesPerPage)}
                    >
                      <IoIosArrowForward />
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {isModalOpen && selectedMedicine && (
              <div className="modalOverlay">
                <div className="modalContent">
                  <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">Edit Parameter</p>
                      <div className="hover:rounded-md hover:border">
                        <LiaTimesSolid className="m-1 cursor-pointer" onClick={handleModalClose} />
                      </div>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                      <div className="my-4">
                        <p className="text-sm">Parameter Name</p>
                        <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            name="param_title"
                            value={selectedMedicine.param_title}
                            onChange={handleInputChange}
                            className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="my-4">
                        <p className="text-sm">Parameter Unit</p>
                        <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            name="param_unit"
                            value={selectedMedicine.param_unit}
                            onChange={handleInputChange}
                            className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="my-4">
                        <p className="text-sm">Parameter Range</p>
                        <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                          <input
                            type="text"
                            name="param_range"
                            value={selectedMedicine.param_range}
                            onChange={handleInputChange}
                            className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="button-primary h-[50px] w-full rounded-sm text-[#FFFFFF] max-sm:h-[45px]"
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Parameter"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <Footer />
          </div>
        </div>
      </div>
    </section>
  )
}

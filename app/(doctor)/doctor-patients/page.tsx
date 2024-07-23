"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowBack, IoIosArrowForward, IoMdSearch } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import { SetStateAction, useEffect, useState } from "react"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined"
import Image from "next/image"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import DeletePatientModal from "components/Modals/DeletePatientModal"
import AOS from "aos"
import "aos/dist/aos.css"
import DoctorNav from "components/Navbar/DoctorNav"

interface Patients {
  id: string
  name: string
  gender: string
  dob: string
  membership_no: string
  policy_id: string
  email_address: string
  phone_no: string
  address: string
  age: string
  image: string
  hmo: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }
  status: boolean
}

export default function Patients() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [patients, setPatients] = useState<Patients[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<Patients | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

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

  const handlePatientClick = (patientId: string) => {
    router.push(`/doctor-patients/patient/${patientId}`)
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const openModal = (patient: Patients) => {
    setPatientToDelete(patient)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setPatientToDelete(null)
    setIsModalOpen(false)
  }

  const confirmDelete = async () => {
    if (patientToDelete) {
      try {
        const response = await fetch(`https://api.caregiverhospital.com/patient/patient/${patientToDelete.id}/`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error("Failed to delete patient")
        }
        setPatients(patients.filter((patient) => patient.id !== patientToDelete.id))
        closeModal()
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 5000)
      } catch (error) {
        console.error("Error deleting patient:", error)
      }
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await fetch("https://api.caregiverhospital.com/patient/patient/")
      if (!response.ok) {
        throw new Error("Failed to fetch patients")
      }
      const data = (await response.json()) as Patients[]
      setPatients(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching Patients:", error)
      setLoading(false)
    }
  }

  const patientsPerPage = 7
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(patients.length / patientsPerPage); i++) {
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

  const filteredPatients = currentPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <section className="h-full ">
        <div className="flex min-h-screen ">
          <div className="flex w-screen flex-col ">
            <DoctorNav />

            <div className="flex items-center gap-2 px-16 pt-4 max-md:px-3">
              <p className="font-bold">Admin Dashboard</p>
              <IoIosArrowForward />
              <p className="capitalize">{pathname.split("/").pop()}</p>
            </div>

            <div
              className="mb-6 mt-10 flex items-center justify-between px-16 max-md:px-3"
              data-aos="fade-in"
              data-aos-duration="1000"
              data-aos-delay="500"
            >
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
              ) : filteredPatients.length === 0 ? (
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
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2 "
                    data-aos="fade-in"
                    data-aos-duration="1000"
                    data-aos-delay="500"
                  >
                    <div className="flex w-[20%] items-center gap-1 text-sm font-bold">
                      {/* {patient.image ? (
                        <img
                          src={`https://api.caregiverhospital.com${patient.image}`}
                          alt={patient.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : ( */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]">
                        <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
                      </div>
                      {/* )} */}
                    </div>
                    <div className="flex w-full items-center gap-1 text-sm font-bold">
                      <div>
                        <p>{patient.name}</p>
                        <small className="text-xs">{patient.email_address}</small>
                      </div>
                    </div>

                    <div className="w-full max-md:hidden">
                      <p className="text-xs font-bold">{formatDate(patient.dob)}</p>
                      <small className="text-xs">Date of Birth</small>
                    </div>
                    <div className="w-full max-md:hidden">
                      <div className="flex gap-1 text-sm font-bold">{patient.membership_no}</div>
                      <small className="text-xs">Hmo ID</small>
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-bold">{patient.hmo.name}</p>
                      <small className="text-xs">Hmo name</small>
                    </div>
                    <div className="w-full max-md:hidden">
                      {patient.hmo.status ? (
                        <p className="w-[100px] rounded bg-[#46FFA6] px-2 py-[2px] text-center text-xs text-[#000000]">
                          Active
                        </p>
                      ) : (
                        <p className="w-[100px] rounded bg-[#F20089] px-2 py-[2px] text-center text-xs text-[#ffffff]">
                          Inactive
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <RemoveRedEyeIcon className="text-[#46FFA6]" onClick={() => handlePatientClick(patient.id)} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredPatients.length > 0 && (
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
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        patientName={patientToDelete?.name || ""}
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

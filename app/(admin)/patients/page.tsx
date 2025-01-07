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
import EditPatientModal from "components/Modals/EditPatientModal"

export interface Patients {
  id: string
  name: string
  gender: string
  dob: string
  membership_no: string
  policy_id: string
  email_address: string
  phone_no: string
  address: string
  allergies: string
  age: string
  nok_name: string
  image: string
  password: string
  nok_phone_no: string
  nok_address: string
  hmo: {
    id: any
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }
  status: boolean
  heart_rate: string
  body_temperature: string
  glucose_level: string
  blood_pressure: string
  discount_value: string
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
  const [showEditedNotification, setShowEditedNotification] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [patientToEdit, setPatientToEdit] = useState<Patients | null>(null)
  const [allPatients, setAllPatients] = useState<Patients[]>([])

  const patientsPerPage = 100

  const handleEditClick = (patient: Patients) => {
    setPatientToEdit(patient)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setPatientToEdit(null)
    setIsEditModalOpen(false)
  }

  // Preprocess patient data for updates
  const preprocessPatientData = (data: Patients) => {
    const processedData: Partial<Patients> = {}
    if (data.heart_rate) processedData.heart_rate = data.heart_rate
    if (data.body_temperature) processedData.body_temperature = data.body_temperature
    if (data.glucose_level) processedData.glucose_level = data.glucose_level
    if (data.blood_pressure) processedData.blood_pressure = data.blood_pressure
    if (data.discount_value) processedData.discount_value = data.discount_value

    if (data.hmo) {
      processedData.hmo = {
        id: data.hmo.id,
        name: data.hmo.name || "",
        category: data.hmo.category || "",
        description: data.hmo.description || "",
        status: data.hmo.status ?? false,
        pub_date: data.hmo.pub_date || "",
      }
    }

    processedData.name = data.name
    processedData.gender = data.gender
    processedData.dob = data.dob
    processedData.membership_no = data.membership_no
    processedData.email_address = data.email_address
    processedData.phone_no = data.phone_no
    processedData.address = data.address
    processedData.allergies = data.allergies
    processedData.age = data.age
    processedData.nok_name = data.nok_name
    processedData.password = data.password
    processedData.nok_phone_no = data.nok_phone_no
    processedData.nok_address = data.nok_address
    processedData.status = data.status
    processedData.policy_id = data.policy_id

    return processedData
  }

  const confirmEdit = async (updatedPatientData: Patients) => {
    if (patientToEdit) {
      try {
        const preprocessedData = preprocessPatientData(updatedPatientData)
        const response = await fetch(`https://api2.caregiverhospital.com/patient/edit/patient/${patientToEdit.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preprocessedData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Failed to update patient:", errorData)
          throw new Error("Failed to update patient")
        }

        setPatients((prevPatients) =>
          prevPatients.map((patient) => (patient.id === updatedPatientData.id ? updatedPatientData : patient))
        )
        closeEditModal()
        setShowEditedNotification(true)
        setTimeout(() => setShowEditedNotification(false), 5000)
      } catch (error) {
        console.error("Error updating patient:", error)
      }
    }
  }

  const handlePatientClick = (patientId: string) => {
    localStorage.setItem("selectedPatientId", patientId)
    router.push(`/patients/patient`)
  }

  const fetchPatients = async (page: number, query: string = "") => {
    setLoading(true)
    const start = (page - 1) * patientsPerPage + 1
    const stop = page * patientsPerPage

    try {
      let response
      let data: Patients[] = []

      if (query) {
        // Split query into parts for each word in the name
        const queryParts = query.split(" ")
        for (const part of queryParts) {
          const encodedQueryPart = encodeURIComponent(part)
          const searchResponse = await fetch(
            `https://api2.caregiverhospital.com/patient/patient/search/search-patients/by-name/${encodedQueryPart}/`
          )

          if (searchResponse.ok) {
            const partData = (await searchResponse.json()) as Patients[]
            data = [...data, ...partData] // Append results for each part of the query
          }
        }
        // Remove duplicates from merged results, if any
        data = Array.from(new Set(data.map((p) => p.id))).map((id) => data.find((p) => p.id === id)!)
      } else {
        response = await fetch(`https://api2.caregiverhospital.com/patient/patient/${start}/${stop}`)
        if (!response.ok) throw new Error("Failed to fetch patients")
        data = (await response.json()) as Patients[]
      }

      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name))
      setPatients(sortedData)
    } catch (error) {
      console.error("Error fetching Patients:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients(currentPage, searchQuery)
  }, [currentPage, searchQuery])

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId")
    if (storedPatientId) {
      fetchPatientDetails(storedPatientId)
    } else {
      console.error("No patient ID found in localStorage")
    }
  }, [])

  const fetchPatientDetails = async (patientId: string) => {
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/get/detail/${patientId}/`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient details")
      }
      const data = await response.json()
      // Handle the data here
    } catch (error) {
      console.error("Error fetching patient details:", error)
    }
  }

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
        const response = await fetch(
          `https://api2.caregiverhospital.com/patient/patient/get/detail/${patientToDelete.id}/`,
          {
            method: "DELETE",
          }
        )
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

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const calculateAge = (dobString: string) => {
    const today = new Date()
    const dob = new Date(dobString)
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    return age
  }

  return (
    <section>
      <div className="h-full ">
        <div className="flex min-h-screen ">
          <div className="flex w-screen flex-col ">
            <DashboardNav />

            <div className="flex items-center gap-2 px-16 pt-4 max-md:px-3">
              <p className="font-bold">Admin Dashboard</p>
              <IoIosArrowForward />
              <p className="capitalize">{pathname.split("/").pop()}</p>
            </div>

            <div className="mb-6 mt-1 flex items-center justify-between px-16 max-md:px-3">
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
                  onChange={handleSearch}
                />
              </div>
              <Link href="/patients/add" className="add-button">
                <p className="text-[12px]">Add Patient</p>
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
              ) : patients.length === 0 ? (
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
                <div className="relative w-full overflow-hidden">
                  <div className="overflow-x- mb-2">
                    {patients
                      .filter((patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((patient) => (
                        <div
                          key={patient.id}
                          className="mb-2 flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
                        >
                          <div className="flex items-center gap-1 text-sm font-bold md:w-[20%]">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46FFA6] max-sm:hidden">
                              <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
                            </div>
                          </div>
                          <div className="flex w-full items-center gap-1 text-sm font-bold">
                            <div>
                              <p>{patient.name}</p>
                              <small className="text-xs">{patient.email_address}</small>
                            </div>
                          </div>

                          <div className="w-full max-md:hidden">
                            <p className="text-xs font-bold">{calculateAge(patient.dob)} years old</p>
                            <small className="text-xs">Age</small>
                          </div>
                          <div className="w-full max-md:hidden">
                            <div className="flex gap-1 text-sm font-bold">{patient.membership_no}</div>
                            <small className="text-xs">Hmo ID</small>
                          </div>
                          <div className="w-full">
                            <p className="text-sm font-bold">{patient.hmo.name}</p>
                            <small className="text-xs">
                              {patient.hmo.name === "Cargivers Finance" ? "Out of Pocket" : "Hmo name"}
                            </small>
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
                            <RemoveRedEyeIcon
                              className="text-[#46FFA6]"
                              onClick={() => handlePatientClick(patient.id)}
                            />
                            <BorderColorOutlinedIcon onClick={() => handleEditClick(patient)} />
                            <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => openModal(patient)} />
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-between  py-4 max-md:px-3">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded bg-[#46ffac] p-2 disabled:opacity-50"
                    >
                      <IoIosArrowBack />
                    </button>
                    <p>Page {currentPage}</p>
                    <button onClick={() => setCurrentPage((prev) => prev + 1)} className="rounded bg-[#46ffac] p-2">
                      <IoIosArrowForward />
                    </button>
                  </div>
                </div>
              )}

              <Footer />
            </div>
          </div>
        </div>

        <DeletePatientModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmDelete}
          patientName={patientToDelete?.name || ""}
        />

        {patientToEdit && (
          <EditPatientModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onConfirm={confirmEdit}
            patient={patientToEdit}
          />
        )}

        {showSuccessNotification && (
          <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
            <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
            <span className="clash-font text-sm  text-[#0F920F]">Deleted Successfully</span>
          </div>
        )}

        {showEditedNotification && (
          <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
            <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
            <span className="clash-font text-sm  text-[#0F920F]">Updated Successfully</span>
          </div>
        )}
      </div>
    </section>
  )
}

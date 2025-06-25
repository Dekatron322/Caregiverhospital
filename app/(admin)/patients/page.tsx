"use client" // Mark this as a client component

import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined"
import Image from "next/image"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import DeletePatientModal from "components/Modals/DeletePatientModal"
import EditPatientModal from "components/Modals/EditPatientModal"
import { toast, Toaster } from "sonner" // Import Sonner
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined"
import EditHmoModal from "components/Modals/EditHmoModal"

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [patientToEdit, setPatientToEdit] = useState<Patients | null>(null)

  const [isHmoModalOpen, setIsHmoModalOpen] = useState(false)
  const [patientToEditHmo, setPatientToEditHmo] = useState<Patients | null>(null)

  const patientsPerPage = 100

  // Fetch patients
  const fetchPatients = useCallback(async (page: number, query: string = "") => {
    setLoading(true)
    const start = (page - 1) * patientsPerPage + 1
    const stop = page * patientsPerPage

    try {
      let data: Patients[] = []

      if (query) {
        const queryParts = query.split(" ")
        for (const part of queryParts) {
          const encodedQueryPart = encodeURIComponent(part)
          const searchResponse = await fetch(
            `https://api2.caregiverhospital.com/patient/patient/search/search-patients/by-name/${encodedQueryPart}/`
          )

          if (searchResponse.ok) {
            const partData = (await searchResponse.json()) as Patients[]
            data = [...data, ...partData]
          }
        }
        data = Array.from(new Set(data.map((p) => p.id))).map((id) => data.find((p) => p.id === id)!)
      } else {
        const response = await fetch(`https://api2.caregiverhospital.com/patient/patient/${start}/${stop}`)
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
  }, [])

  useEffect(() => {
    fetchPatients(currentPage, searchQuery)
  }, [currentPage, searchQuery, fetchPatients])

  // Handle search
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }, [])

  // Handle edit click
  const handleEditClick = useCallback((patient: Patients) => {
    setPatientToEdit(patient)
    setIsEditModalOpen(true)
  }, [])

  // Close edit modal
  const closeEditModal = useCallback(() => {
    setPatientToEdit(null)
    setIsEditModalOpen(false)
  }, [])

  // Preprocess patient data for updates
  const preprocessPatientData = useCallback((data: Patients) => {
    const processedData: Partial<Patients> = {
      ...data,
      hmo: {
        id: data.hmo.id,
        name: data.hmo.name || "",
        category: data.hmo.category || "",
        description: data.hmo.description || "",
        status: data.hmo.status ?? false,
        pub_date: data.hmo.pub_date || "",
      },
    }
    return processedData
  }, [])

  // Confirm edit
  const confirmEdit = useCallback(
    async (updatedPatientData: Patients) => {
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

          // Show success toast
          toast.success("Patient Updated", {
            description: "The patient has been successfully updated.",
            duration: 5000,
            cancel: {
              label: "Close",
              onClick: () => {},
            },
          })
        } catch (error) {
          console.error("Error updating patient:", error)

          // Show error toast
          toast.error("Update Failed", {
            description: "Failed to update the patient. Please try again.",
            duration: 5000,
            cancel: {
              label: "Close",
              onClick: () => {},
            },
          })
        }
      }
    },
    [patientToEdit, preprocessPatientData, closeEditModal]
  )

  // Handle patient click
  const handlePatientClick = useCallback(
    (patientId: string) => {
      localStorage.setItem("selectedPatientId", patientId)
      router.push(`/patients/patient`)
    },
    [router]
  )

  // Open delete modal
  const openModal = useCallback((patient: Patients) => {
    setPatientToDelete(patient)
    setIsModalOpen(true)
  }, [])

  // Close delete modal
  const closeModal = useCallback(() => {
    setPatientToDelete(null)
    setIsModalOpen(false)
  }, [])

  // Confirm delete
  const confirmDelete = useCallback(async () => {
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

        // Remove the deleted patient from the list
        setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientToDelete.id))

        // Close the modal
        closeModal()

        // Show success toast
        toast.success("Patient Deleted", {
          description: "The patient has been successfully deleted.",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        })
      } catch (error) {
        console.error("Error deleting patient:", error)

        // Show error toast
        toast.error("Delete Failed", {
          description: "Failed to delete the patient. Please try again.",
          duration: 5000,
          cancel: {
            label: "Close",
            onClick: () => {},
          },
        })
      }
    }
  }, [patientToDelete, closeModal])

  // Calculate age
  const calculateAge = useCallback((dobString: string) => {
    const today = new Date()
    const dob = new Date(dobString)
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    return age
  }, [])

  // Filter patients by name, email, or membership number
  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase()
    const nameMatch = patient.name.toLowerCase().includes(query)
    const emailMatch = patient.email_address.toLowerCase().includes(query)
    const membershipMatch = patient.membership_no.toLowerCase().includes(query)

    // Split the search query into parts for names with spaces
    const queryParts = query.split(" ")
    const namePartsMatch = queryParts.every((part) => patient.name.toLowerCase().includes(part))

    return nameMatch || emailMatch || membershipMatch || namePartsMatch
  })

  const handleEditHmoClick = useCallback((patient: Patients) => {
    setPatientToEditHmo(patient)
    setIsHmoModalOpen(true)
  }, [])

  const closeHmoModal = useCallback(() => {
    setPatientToEditHmo(null)
    setIsHmoModalOpen(false)
  }, [])

  const handleHmoUpdateSuccess = useCallback((updatedPatient: Patients) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient))
    )
  }, [])

  return (
    <section>
      <div className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
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
                // Loading state with animate-pulse
                <div className="grid gap-2">
                  {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <div key={index} className="sidebar flex w-full items-center justify-between rounded-lg border p-2">
                      <div className="flex items-center gap-1 text-sm font-bold md:w-[20%]">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 max-sm:hidden"></div>
                      </div>
                      <div className="flex w-full items-center gap-1 text-sm font-bold">
                        <div>
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                          <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                        </div>
                      </div>
                      <div className="w-full max-md:hidden">
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                        <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                      </div>
                      <div className="w-full max-md:hidden">
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                        <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                      </div>
                      <div className="w-full">
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                        <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                      </div>
                      <div className="w-full max-md:hidden">
                        <div className="h-6 w-16 animate-pulse rounded bg-gray-200"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                      </div>
                    </div>
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
                <div className="relative w-full overflow-hidden">
                  <div className="overflow-x- mb-2">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="sidebar mb-2 flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
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
                          <RemoveRedEyeIcon className="text-[#46FFA6]" onClick={() => handlePatientClick(patient.id)} />
                          <BorderColorOutlinedIcon onClick={() => handleEditClick(patient)} />
                          <MedicalServicesOutlinedIcon onClick={() => handleEditHmoClick(patient)} />
                          <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => openModal(patient)} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between py-4 max-md:px-3">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded bg-[#46ffac] p-2 disabled:opacity-50"
                    >
                      <IoIosArrowBack />
                    </button>
                    <p>Page {currentPage}</p>
                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="rounded bg-[#46ffac] p-2 text-black"
                    >
                      <IoIosArrowForward />
                    </button>
                  </div>
                </div>
              )}
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
        {patientToEditHmo && (
          <EditHmoModal
            isOpen={isHmoModalOpen}
            onClose={closeHmoModal}
            patient={patientToEditHmo}
            onUpdateSuccess={handleHmoUpdateSuccess}
          />
        )}
        <Toaster position="top-center" richColors /> {/* Add Toaster component */}
      </div>
      <Footer />
    </section>
  )
}

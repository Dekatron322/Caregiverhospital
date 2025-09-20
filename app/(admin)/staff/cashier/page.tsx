"use client"

import { useEffect, useState } from "react"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import { RxDotsVertical } from "react-icons/rx"
import { toast, Toaster } from "sonner"
import Cookies from "js-cookie"

interface User {
  id: number
  username: string
  email: string
  phone_number: string | null
  address: string | null
  account_type: string
  notifications: any[]
}

// Type guards to validate cached/fetched data shapes at runtime
const isUser = (obj: unknown): obj is User => {
  if (!obj || typeof obj !== "object") return false
  const u = obj as Record<string, unknown>
  return (
    typeof u.id === "number" &&
    typeof u.username === "string" &&
    typeof u.email === "string" &&
    typeof u.account_type === "string"
  )
}

const isUserArray = (data: unknown): data is User[] => Array.isArray(data) && data.every(isUser)

// Skeleton Loader Component
const DoctorCardSkeleton = () => (
  <div className="relative animate-pulse rounded-lg bg-white p-4 shadow-lg">
    <div className="flex gap-4">
      <div className="h-[46px] w-[46px] rounded-md bg-gray-200"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        <div className="h-3 w-1/2 rounded bg-gray-200"></div>
      </div>
      <div className="h-5 w-5 rounded bg-gray-200"></div>
    </div>
    <div className="my-4 flex items-center justify-between">
      <div className="h-3 w-1/4 rounded bg-gray-200"></div>
      <div className="h-3 w-1/6 rounded bg-gray-200"></div>
    </div>
    <div className="mt-2 flex items-center justify-between">
      <div className="h-3 w-1/3 rounded bg-gray-200"></div>
    </div>
    <div className="mt-4 space-y-2 rounded-md bg-gray-100 p-3">
      <div className="h-3 w-full rounded bg-gray-200"></div>
      <div className="h-3 w-full rounded bg-gray-200"></div>
    </div>
    <div className="mt-4 h-10 w-full rounded bg-gray-200"></div>
  </div>
)

// Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  doctorName,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  doctorName: string
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="text-lg font-bold">Confirm Delete</h3>
        <p className="mt-2 text-gray-600">
          Are you sure you want to delete <span className="font-semibold">{doctorName}</span>? This action cannot be
          undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MedicalConsultants() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [doctors, setDoctors] = useState<User[]>([])
  const [dataVersion, setDataVersion] = useState(0)
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState<{ id: number; name: string } | null>(null)

  useEffect(() => {
    // Check if we have a cached version in cookies
    const cachedDoctors = Cookies.get("doctorsData")
    const cachedVersion = Cookies.get("doctorsDataVersion")

    if (cachedDoctors && cachedVersion) {
      try {
        const parsed = JSON.parse(cachedDoctors) as unknown
        const version = parseInt(cachedVersion)
        if (isUserArray(parsed)) {
          setDoctors(parsed)
          setDataVersion(version)
          setLoading(false)
        } else {
          // Fallback to fetching if cache is malformed
          fetchDoctors()
          return
        }

        // Still fetch fresh data in the background
        fetchDoctors(true)
      } catch (error) {
        console.error("Error parsing cached data:", error)
        // If parsing fails, fetch fresh data
        fetchDoctors()
      }
    } else {
      // No cached data, fetch fresh
      fetchDoctors()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId === null) return
      const el = document.getElementById(`dropdown-${openDropdownId}`)
      if (el && !el.contains(event.target as Node)) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdownId])

  const fetchDoctors = async (isBackgroundUpdate = false) => {
    try {
      if (!isBackgroundUpdate) {
        setLoading(true)
      }

      const userResponse = await fetch("https://api2.caregiverhospital.com/app_user/all/")
      if (!userResponse.ok) {
        throw new Error("Failed to fetch users")
      }
      const usersData = (await userResponse.json()) as User[]

      // Filter users with account_type "Doctor" (case-insensitive)
      const doctorsData = usersData.filter((user) => {
        const role = user.account_type?.toLowerCase().trim()
        return role === "cashier" || role === "cashier"
      })

      // Update state only if this is not a background update
      if (!isBackgroundUpdate) {
        setDoctors(doctorsData)
        setLoading(false)
      }

      // Always update cookies with fresh data
      const newVersion = dataVersion + 1
      Cookies.set("doctorsData", JSON.stringify(doctorsData), { expires: 1 }) // Expires in 1 day
      Cookies.set("doctorsDataVersion", newVersion.toString(), { expires: 1 })

      if (!isBackgroundUpdate) {
        setDataVersion(newVersion)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      if (!isBackgroundUpdate) {
        toast.error("Error", {
          description: "Failed to fetch doctors data.",
          duration: 5000,
        })
        setLoading(false)
      }
    }
  }

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id)
  }

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit doctor with ID:", id)
    setOpenDropdownId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return

    try {
      const response = await fetch(`https://api2.caregiverhospital.com/app_user/delete/${doctorToDelete.id}/`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Success", {
          description: "Doctor deleted successfully.",
          duration: 5000,
        })

        // Remove the deleted doctor from state and update cache atomically
        setDoctors((prev) => {
          const updated = prev.filter((doctor) => doctor.id !== doctorToDelete.id)
          Cookies.set("doctorsData", JSON.stringify(updated), { expires: 1 })
          Cookies.set("doctorsDataVersion", (dataVersion + 1).toString(), { expires: 1 })
          return updated
        })
        setDataVersion((v) => v + 1)
      } else {
        throw new Error("Failed to delete doctor")
      }
    } catch (error) {
      console.error("Error deleting doctor:", error)
      toast.error("Error", {
        description: "Failed to delete doctor.",
        duration: 5000,
      })
    } finally {
      setDeleteModalOpen(false)
      setDoctorToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setDoctorToDelete(null)
  }

  const handleViewDetails = (id: number) => {
    // Handle view details functionality
    console.log("View details for doctor with ID:", id)
    router.push(`/doctors/${id}`)
  }

  // Function to manually refresh data (e.g., when adding a new doctor)
  const refreshData = () => {
    fetchDoctors()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleDeleteClick = (id: number, name: string) => {
    setDoctorToDelete({ id, name })
    setDeleteModalOpen(true)
    setOpenDropdownId(null) // Close the dropdown
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />

            <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
              <p className="text-2xl font-medium max-sm:text-lg">Cashier</p>
              <div className="flex gap-2">
                <Link href="/staff/add-staff" className="button-primary h-[36px] w-full rounded-sm max-sm:h-[45px]">
                  Add Cashier
                </Link>
              </div>
            </div>

            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="flex h-screen w-full max-sm:flex-col">
                <div className="w-full flex-1">
                  <div className="grid w-full gap-4 max-sm:mb-4 max-sm:grid-cols-1 max-sm:px-0 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4">
                    {loading ? (
                      Array.from({ length: 8 }).map((_, index) => <DoctorCardSkeleton key={`skeleton-${index}`} />)
                    ) : doctors.length > 0 ? (
                      doctors.map((doctor) => (
                        <div key={doctor.id} className="sidebar relative rounded-lg p-4 shadow-lg">
                          <div className="flex gap-2">
                            <div className="relative size-11">
                              <div className="text-grey-600 flex size-10 items-center justify-center rounded-full bg-[#46ffa6] font-medium text-black">
                                {getInitials(doctor.username)}
                              </div>
                            </div>

                            <div className="flex-1">
                              <h3 className="text-base font-bold">{doctor.username}</h3>
                              <p className="text-sm">{doctor.email}</p>
                            </div>
                            <div className="relative" id={`dropdown-${doctor.id}`}>
                              <button
                                onClick={() => toggleDropdown(doctor.id)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                              >
                                <RxDotsVertical />
                              </button>
                              {openDropdownId === doctor.id && (
                                <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleDeleteClick(doctor.id, doctor.username)}
                                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="my-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-grey-400">Role:</span>
                                <span className="font-medium">Nurse</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end text-sm">
                              <span className="flex items-center gap-2">
                                <span className="text-sm text-[#27AE60]">Active</span>
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-grey-400">Phone:</span>
                              <span className="font-medium">{doctor.phone_number || "-"}</span>
                            </div>
                          </div>

                          <div className="search-bg mt-4 rounded-md p-3">
                            <div className="flex justify-between text-sm">
                              <span>Email:</span>
                              <span className="text-grey-300">
                                <span className="text-base font-bold ">{doctor.email}</span>
                              </span>
                            </div>
                            <div className="mt-2 flex justify-between text-sm">
                              <span>Address:</span>
                              <span className="text-grey-300">
                                <span className="text-base font-bold ">{doctor.address || "No address provided"}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex w-full items-center justify-center rounded-lg border p-8">
                        <p className="text-gray-500">No doctors found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          doctorName={doctorToDelete?.name || ""}
        />

        <Toaster position="top-center" richColors />
      </section>
    </>
  )
}

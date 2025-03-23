"use client" // Mark this as a client component

import { useCallback, useEffect, useMemo, useState } from "react"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowForward } from "react-icons/io"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import DepartmentModal from "components/Modals/DepartmentModal"
import { HiOutlineTrash } from "react-icons/hi2"
import DeleteDepartmentModal from "components/Modals/DeleteDepartmentModal"
import { toast, Toaster } from "sonner" // Import Sonner

interface Department {
  id: number
  name: string
  staffCount: number
  slug: string
}

const getDepartmentImage = (departmentName: string): string => {
  switch (departmentName.toLowerCase()) {
    case "pharmacy":
      return "/pharmacy-symbol.svg"
    case "laboratory":
      return "/laboratory-analyst.svg"
    case "medical consultant":
      return "/avatar-doctor-health-hospital-man-medical-2.svg"
    default:
      return "/avatar-doctor-health-hospital-man-medical-2.svg"
  }
}

const getDepartmentUrl = (departmentName: string): string => {
  switch (departmentName.toLowerCase()) {
    case "pharmacy":
      return "pharmacy"
    case "laboratory":
      return "laboratory"
    case "medical consultant":
      return "medical-consultant"
    default:
      return ""
  }
}

export default function Dashboard() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null)

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/department/department/")
      if (!response.ok) {
        throw new Error("Failed to fetch departments")
      }
      const data = (await response.json()) as Department[]
      setDepartments(data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  // Handle modal open/close
  const openDepartmentModal = useCallback(() => setIsAddDepartmentOpen(true), [])
  const closeDepartmentModal = useCallback(() => setIsAddDepartmentOpen(false), [])
  const openDeleteModal = useCallback((id: number) => {
    setDepartmentToDelete(id)
    setIsDeleteOpen(true)
  }, [])
  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false)
    setDepartmentToDelete(null)
  }, [])

  // Handle success notifications
  const handleHmoSubmissionSuccess = useCallback(async () => {
    toast.success("Department Added", {
      description: "The department has been successfully added.",
      duration: 5000,
      cancel: {
        label: "Close",
        onClick: () => {},
      },
    })
    await fetchDepartments()
  }, [fetchDepartments])

  const handleDeleteSuccess = useCallback(async () => {
    toast.success("Department Deleted", {
      description: "The department has been successfully deleted.",
      duration: 5000,
      cancel: {
        label: "Close",
        onClick: () => {},
      },
    })
    closeDeleteModal()
    await fetchDepartments()
  }, [closeDeleteModal, fetchDepartments])

  // Memoize department cards to avoid unnecessary re-renders
  const departmentCards = useMemo(
    () =>
      departments.map((department) => (
        <div key={department.id} className="sidebar w-full rounded-md p-4 shadow-md">
          <div className="mb-4 flex justify-between">
            <h6 className="font-bold">{department.name}</h6>
            <Image src={getDepartmentImage(department.name)} height={48} width={48} alt={department.name} />
          </div>
          <div className="flex justify-between">
            <h6 className="font-bold">Registered Staff</h6>
            <h6 className="font-bold">{department.staffCount}</h6>
          </div>
          <div className="mt-4 flex w-full gap-2 lowercase">
            <Link
              href={`departments/${getDepartmentUrl(department.name)}`}
              className="button-primary h-[50px] w-full rounded-sm capitalize max-sm:h-[45px]"
            >
              View
            </Link>
            <div
              onClick={() => openDeleteModal(department.id)}
              className="flex cursor-pointer content-center items-center justify-center rounded bg-[#F14848] text-[#ffffff] transition-colors duration-500 hover:bg-[#601410] hover:text-[#F2B8B5] max-md:p-2 md:h-[50px] md:w-[50px]"
            >
              <HiOutlineTrash />
            </div>
          </div>
        </div>
      )),
    [departments, openDeleteModal]
  )

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />
            <div className="flex items-center justify-between px-16 pt-4 max-md:px-3">
              <div className="flex items-center gap-2">
                <p className="font-bold">Admin Dashboard</p>
                <IoIosArrowForward className="max-md:hidden" />
                <p className="capitalize max-md:hidden">{pathname.split("/").pop()}</p>
              </div>
              <button className="add-button" onClick={openDepartmentModal}>
                <p className="text-xs">Add Department</p>
                <GoPlus />
              </button>
            </div>
            {loading ? (
              // Loading state with animate-pulse
              <div className="my-10 grid gap-4 px-16 max-md:mt-4 max-md:grid-cols-1 max-md:px-3 xl:grid-cols-2 2xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <div key={index} className="sidebar w-full rounded border p-4">
                    <div className="mb-4 flex justify-between">
                      <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
                    </div>
                    <div className="mt-4 flex w-full gap-2">
                      <div className="h-12 w-full animate-pulse rounded bg-gray-200"></div>
                      <div className="h-12 w-12 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className=" my-10 grid gap-4 px-16 max-md:mt-4 max-md:grid-cols-1 max-md:px-3 xl:grid-cols-2 2xl:grid-cols-3">
                {departmentCards}
              </div>
            )}
            <Footer />
          </div>
        </div>
        <DeleteDepartmentModal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          onSubmitSuccess={handleDeleteSuccess}
          departmentId={departmentToDelete}
        />
        <DepartmentModal
          isOpen={isAddDepartmentOpen}
          onClose={closeDepartmentModal}
          onSubmitSuccess={handleHmoSubmissionSuccess}
        />
      </section>
      <Toaster position="top-center" richColors /> {/* Add Toaster component */}
    </>
  )
}

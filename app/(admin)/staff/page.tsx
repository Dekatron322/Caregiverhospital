"use client" // Mark this as a client component

import { useEffect, useState } from "react"
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

interface User {
  id: number
  username: string
  email: string
  phone_number: string | null
  address: string | null
  account_type: string
}

const getDepartmentImage = (departmentName: string): string => {
  switch (departmentName.toLowerCase()) {
    case "pharmacy":
      return "/pharmacy-symbol.svg"
    case "laboratory":
      return "/laboratory-analyst.svg"
    case "doctors":
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
    case "doctors":
      return "medical-consultant"
    case "nurses":
      return "nurses"
    case "cashier":
      return "cashier"
    case "admin":
      return "admin"
    default:
      return ""
  }
}

export default function Staff() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const departmentResponse = await fetch("https://api2.caregiverhospital.com/department/department/")
      if (!departmentResponse.ok) {
        throw new Error("Failed to fetch departments")
      }
      const departmentsData = (await departmentResponse.json()) as Department[]

      const userResponse = await fetch("https://api2.caregiverhospital.com/app_user/all/")
      if (!userResponse.ok) {
        throw new Error("Failed to fetch users")
      }
      const usersData = (await userResponse.json()) as User[]

      const departmentsWithStaffCount = departmentsData.map((department) => {
        const staffCount = usersData.filter(
          (user) => user.account_type.toLowerCase() === department.name.toLowerCase()
        ).length
        return { ...department, staffCount }
      })

      setDepartments(departmentsWithStaffCount)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const openDepartmentModal = () => {
    setIsAddDepartmentOpen(true)
  }

  const closeDepartmentModal = () => {
    setIsAddDepartmentOpen(false)
  }

  const openDeleteModal = (id: number) => {
    setDepartmentToDelete(id)
    setIsDeleteOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteOpen(false)
    setDepartmentToDelete(null)
  }

  const handleHmoSubmissionSuccess = async () => {
    toast.success("Department Added", {
      description: "The department has been successfully added.",
      duration: 5000,
      cancel: {
        label: "Close",
        onClick: () => {},
      },
    })
    await fetchDepartments()
  }

  const handleDeleteSuccess = async () => {
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
  }

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
              <Link href="/staff/add-staff" className="add-button">
                <p className="text-xs">Add Staff</p>
                <GoPlus />
              </Link>
            </div>
            {loading ? (
              // Loading state with animate-pulse
              <div className="my-10 grid gap-2 px-16 max-md:mt-4 max-md:grid-cols-1 max-md:px-3 xl:grid-cols-2 2xl:grid-cols-3">
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
              <div className="my-10 grid gap-4 px-16 max-md:mt-4 max-md:grid-cols-1 max-md:px-3 xl:grid-cols-2 2xl:grid-cols-3">
                {departments.map((department) => (
                  <div key={department.id} className="sidebar w-full rounded-md p-6 shadow-md">
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
                        href={`staff/${getDepartmentUrl(department.name)}`}
                        className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
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
                ))}
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

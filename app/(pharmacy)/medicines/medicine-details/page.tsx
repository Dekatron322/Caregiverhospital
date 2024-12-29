"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoMdArrowBack } from "react-icons/io"
import { HiOutlineTrash } from "react-icons/hi2"
import RestockModal from "components/Modals/RestockModal"
import { FaRegEdit } from "react-icons/fa"
import DeleteMedicineModal from "components/Modals/DeleteMedicineModal"
import Image from "next/image"
import EditMedicineModal from "components/Modals/EditMedicineModal"

import PharmacyNav from "components/Navbar/PharmacyNav"

// Define types
interface Medicine {
  id: string
  name: string
  quantity: string
  category: string
  expiry_date: string
  price: string
  how_to_use: string
  side_effect: string
  medicine_id: string
  status: boolean
  pub_date: string
}

interface Category {
  id: string
  name: string
  medicines: Medicine[]
  status: boolean
  pub_date: string
}

export default function MedicineDetailPage({ params }: { params: { medicineId: string } }) {
  const [medicineDetail, setMedicineDetail] = useState<Medicine | null>(null)
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false) // New state for edit modal
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const router = useRouter()
  const { medicineId } = params

  const fetchMedicineDetail = async () => {
    const medicineId = localStorage.getItem("selectedMedicineId")
    if (!medicineId) {
      console.error("No patient ID found in localStorage")
      return
    }
    try {
      const response = await fetch(`https://api2.caregiverhospital.com/medicine/medicine/${medicineId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch medicine details")
      }
      const data = (await response.json()) as Medicine
      // Fetch category name
      const categoryResponse = await fetch(
        `https://api2.caregiverhospital.com/medicine-category/medicine_category/${data.category}`
      )
      if (!categoryResponse.ok) {
        throw new Error("Failed to fetch category details")
      }
      const categoryData = (await categoryResponse.json()) as Category
      // Replace category ID with category name
      setMedicineDetail({ ...data, category: categoryData.name })
    } catch (error) {
      console.error("Error fetching medicine details:", error)
    }
  }

  useEffect(() => {
    fetchMedicineDetail()
  }, [medicineId])

  const handleGoBack = () => {
    router.back()
  }

  const openAdmissionModal = () => {
    setIsAdmissionOpen(true)
  }

  const closeAdmissionModal = () => {
    setIsAdmissionOpen(false)
  }

  const openDeleteModal = () => {
    setIsDeleteOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteOpen(false)
  }

  const handleHmoSubmissionSuccess = async () => {
    setShowSuccessNotification(true)
    await fetchMedicineDetail() // Re-fetch the updated medicine details
    setTimeout(() => setShowSuccessNotification(false), 5000)
  }

  const openEditModal = () => {
    setIsEditOpen(true)
  }

  const closeEditModal = () => {
    setIsEditOpen(false)
  }

  if (!medicineDetail) {
    return (
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <PharmacyNav />
            <div className="loading-text flex h-full items-center justify-center">
              {"loading...".split("").map((letter, index) => (
                <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <PharmacyNav />

            {medicineDetail && (
              <div className="px-16 py-6 max-sm:px-3">
                <button onClick={handleGoBack} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <div className="pt-10">
                  <h3 className="font-bold">{medicineDetail.name}</h3>
                  <div className="mt-4 grid w-full grid-cols-2 gap-2 max-sm:grid-cols-1">
                    <div key={medicineDetail.id} className="auth flex flex-col justify-center rounded-sm border ">
                      <p className="px-4 py-2 font-semibold">Medicine</p>
                      <div className="border"></div>
                      <div className="flex justify-between">
                        <div className="px-4 py-2 ">
                          <p className="text-sn pb-4 font-bold">{medicineDetail.medicine_id}</p>
                          <p className="text-xs">Medicine ID</p>
                        </div>
                        <div className="px-4 py-2">
                          <p className="pb-4 text-sm font-bold">{medicineDetail.category}</p>
                          <p className="text-xs">Medicine Category</p>
                        </div>
                      </div>
                    </div>
                    <div key={medicineDetail.id} className="auth flex flex-col justify-center rounded-sm border ">
                      <p className="px-4 py-2 font-semibold">Inventory</p>
                      <div className="border"></div>
                      <div className="flex justify-between">
                        <div className="px-4 py-2 ">
                          <p className="pb-4 text-sm font-bold">{medicineDetail.quantity}</p>
                          <p className="text-xs">Quantity</p>
                        </div>
                        <div className="px-4 py-2 ">
                          <p className="pb-4 text-sm font-bold">{medicineDetail.price}</p>
                          <p className="text-xs">Price</p>
                        </div>
                        <div className="px-4 py-2 ">
                          <p className="pb-4 text-sm font-bold">{medicineDetail.status ? "Active" : "Inactive"}</p>
                          <p className="text-xs">Status</p>
                        </div>
                        <div className="px-4 py-2 max-sm:hidden">
                          <p className="pb-4 text-sm font-bold">{medicineDetail.expiry_date}</p>
                          <p className="text-xs">Expiry Date</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="auth mt-2 flex w-full flex-col justify-center rounded-sm border ">
                    <p className="px-4 py-2 font-semibold">How to use</p>
                    <div className="border"></div>
                    <div className="flex">
                      <div className="px-4 py-4 ">
                        <p className="text-xs">{medicineDetail.how_to_use}</p>
                      </div>
                    </div>
                  </div>
                  <div className="auth mt-2 flex w-full flex-col justify-center rounded-sm border ">
                    <p className="px-4 py-2 font-semibold">Side Effects</p>
                    <div className="border"></div>
                    <div className="flex">
                      <div className="px-4 py-4 ">
                        <p className="text-sm">{medicineDetail.side_effect}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div
                    onClick={openEditModal} // Open edit modal on click
                    className="mt-4 flex h-[50px] w-[150px] cursor-pointer content-center items-center justify-center gap-2 rounded bg-[#46FFA6] text-[#000000]"
                  >
                    <FaRegEdit />
                    <p className="text-sm">Edit Medicine</p>
                  </div>
                  <div
                    onClick={openAdmissionModal}
                    className="mt-4 flex h-[50px] w-[150px] cursor-pointer  content-center items-center justify-center gap-2 rounded bg-[#46FFA6] text-[#000000]"
                  >
                    <FaRegEdit />
                    <p className="text-sm">Restock Medicine</p>
                  </div>
                  <div
                    onClick={openDeleteModal}
                    className="mt-4 flex h-[50px] w-[150px] cursor-pointer  content-center items-center justify-center gap-2 rounded bg-[#F2B8B5] text-[#601410]"
                  >
                    <HiOutlineTrash />
                    <p className="text-sm">Delete Medicine</p>
                  </div>
                </div>
              </div>
            )}
            <Footer />
          </div>
        </div>
      </section>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Successful</span>
        </div>
      )}
      <RestockModal
        isOpen={isAdmissionOpen}
        onClose={closeAdmissionModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
        medicineId={medicineId}
      />
      <DeleteMedicineModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onSubmitSuccess={handleHmoSubmissionSuccess}
        medicineId={medicineDetail?.id} // Ensure the correct ID is passed
      />

      <EditMedicineModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        onSubmitSuccess={handleHmoSubmissionSuccess} // Use the same success handler
        medicine={medicineDetail} // Pass medicine details to the modal
      />
    </>
  )
}

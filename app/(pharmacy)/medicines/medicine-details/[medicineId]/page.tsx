"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { MedicineList } from "utils"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoMdArrowBack } from "react-icons/io"
import { HiOutlineTrash } from "react-icons/hi2"
import RestockModal from "components/Modals/RestockModal"
import { FaRegEdit } from "react-icons/fa"
import DeleteMedicineModal from "components/Modals/DeleteMedicineModal"

export default function MedicineDetailPage({ params }: { params: { medicineId: string } }) {
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const router = useRouter()
  const { medicineId } = params

  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleGoBack = () => {
    router.back()
  }

  const medicineDetail = MedicineList.find((medicine) => medicine.id === medicineId)

  let filteredList = medicineDetail

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
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

  const handleHmoSubmissionSuccess = () => {
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 5000)
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />

            {medicineDetail && (
              <div className="px-16 py-6 max-sm:px-3 ">
                <button onClick={handleGoBack} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <div className="pt-10">
                  <h3 className="font-bold">{medicineDetail.medicine_name}</h3>
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
                          <p className="pb-4 text-sm font-bold">{medicineDetail.lifetime_supply}</p>
                          <p className="text-xs">Lifetime Supply</p>
                        </div>
                        <div className="px-4 py-2 ">
                          <p className="pb-4 text-sm font-bold">{medicineDetail.lifetime_sales}</p>
                          <p className="text-xs">Lifetime Sales</p>
                        </div>
                        <div className="px-4 py-2 ">
                          <p className="pb-4 text-sm font-bold">{medicineDetail.stock_left}</p>
                          <p className="text-xs">Stock Left</p>
                        </div>
                        <div className="px-4 py-2 max-sm:hidden">
                          <p className="pb-4 text-sm font-bold">{medicineDetail.expiry}</p>
                          <p className="text-xs">Expiry</p>
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
                        <p className="text-sm">{medicineDetail.side_effects}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
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
        medicineId={medicineId}
      />
    </>
  )
}

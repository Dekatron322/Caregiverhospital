"use client"
import React, { useState } from "react"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import { IoMdArrowBack } from "react-icons/io"
import { GoPlus } from "react-icons/go"
import HmoComponent from "components/Hmo/Hmo"
import AddHmoCategoryModal from "components/Modals/AddHmoCategoryModal"
import DeleteHmoCategoryModal from "components/Modals/DeleteHmoCategoryModal"

const Dashboard: React.FC = () => {
  const [isAddHmoOpen, setIsAddHmoOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [hmoToDelete, setHmoToDelete] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const openHmoModal = () => {
    setIsAddHmoOpen(true)
  }

  const closeHmoModal = () => {
    setIsAddHmoOpen(false)
  }

  const openDeleteModal = (hmoId: string) => {
    setHmoToDelete(hmoId)
    setIsDeleteOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteOpen(false)
  }

  const handleHmoSubmissionSuccess = (message: string = "Category Created Successfully") => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />
            <div className="flex justify-between px-16 pt-4 max-md:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go Back</p>
              </button>
              <button className="add-button" onClick={openHmoModal}>
                <p className="text-[12px]">Add new category</p>
                <GoPlus />
              </button>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col items-center max-md:w-full">
                <div className="mt-4 w-full px-16 max-md:flex-col max-md:px-3 md:min-w-[650px]">
                  <p className="mb-4 font-semibold">HMOs</p>
                  <HmoComponent refreshKey={refreshKey} openDeleteModal={openDeleteModal} />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
        <AddHmoCategoryModal
          isOpen={isAddHmoOpen}
          onClose={closeHmoModal}
          onSubmitSuccess={() => handleHmoSubmissionSuccess("Category Created Successfully")}
        />
        <DeleteHmoCategoryModal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          onSubmitSuccess={() => handleHmoSubmissionSuccess("Category Deleted Successfully")}
          hmoId={hmoToDelete}
        />
      </section>
    </>
  )
}

export default Dashboard

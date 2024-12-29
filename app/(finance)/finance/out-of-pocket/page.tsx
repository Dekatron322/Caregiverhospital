"use client"
import React, { useEffect, useState } from "react"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { usePathname, useRouter } from "next/navigation"

import Image from "next/image"
import { IoMdArrowBack } from "react-icons/io"
import { GoPlus } from "react-icons/go"

import HmoComponent from "components/Hmo/Hmo"
import AddHmoCategoryModal from "components/Modals/AddHmoCategoryModal"
import DeleteHmoCategoryModal from "components/Modals/DeleteHmoCategoryModal"
import OutOfPocketComponent from "components/Hmo/OutOfPocket"

const Dashboard: React.FC = () => {
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [isAddHmoOpen, setIsAddHmoOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [hmoToDelete, setHmoToDelete] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  setTimeout(() => setLoading(false), 5000)

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

  const handleHmoSubmissionSuccess = () => {
    setShowSuccessNotification(true)
    setRefreshKey((prevKey) => prevKey + 1) // Trigger refresh
    setTimeout(() => setShowSuccessNotification(false), 5000)
  }

  return (
    <>
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
                  <p className="mb-4 font-semibold">Out of pocket</p>
                  <OutOfPocketComponent refreshKey={refreshKey} openDeleteModal={openDeleteModal} />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
        <AddHmoCategoryModal
          isOpen={isAddHmoOpen}
          onClose={closeHmoModal}
          onSubmitSuccess={handleHmoSubmissionSuccess}
        />
        <DeleteHmoCategoryModal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          onSubmitSuccess={handleHmoSubmissionSuccess}
          hmoId={hmoToDelete}
        />
      </section>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm text-[#0F920F]">Category Created Successfully</span>
        </div>
      )}
    </>
  )
}

export default Dashboard

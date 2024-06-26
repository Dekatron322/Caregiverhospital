"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoMdArrowBack, IoMdSearch } from "react-icons/io"
import { HiOutlineTrash } from "react-icons/hi2"
import { FaRegEdit } from "react-icons/fa"
import { GoPlus } from "react-icons/go"
import HmoModal from "components/Modals/HmoModal"
import Image from "next/image"
import DeleteModal from "components/Modals/DeleteModal"
import EditModal from "components/Modals/EditModal"
import { IoAddCircleSharp, IoReceipt } from "react-icons/io5"
import AOS from "aos"
import "aos/dist/aos.css"

interface HmoDetail {
  id: string
  name: string
  detail: string
  status: boolean
  pub_date: string
  hmos: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }[]
}

interface HmoDetailPageProps {
  params: { hmoId: string }
}

export default function HmoDetailPage({ params }: HmoDetailPageProps) {
  const [hmoDetail, setHmoDetail] = useState<HmoDetail | null>(null)
  const [isAddHmoOpen, setIsAddHmoOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [refreshKey, setRefreshKey] = useState(0) // State to trigger refresh
  const [hmoToDelete, setHmoToDelete] = useState<string | null>(null) // State to store HMO ID to delete
  const router = useRouter()
  const { hmoId } = params

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  useEffect(() => {
    const fetchHmoDetails = async () => {
      try {
        const response = await fetch(`https://api.caregiverhospital.com/hmo-category/hmo_category/${hmoId}/`)
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = (await response.json()) as HmoDetail
        setHmoDetail(data)
      } catch (error) {
        console.error("Error fetching HMO details:", error)
      }
    }

    fetchHmoDetails()
  }, [hmoId, refreshKey])

  const handleGoBack = () => {
    router.back()
  }

  let filteredList = hmoDetail?.hmos || []

  if (searchQuery) {
    filteredList = filteredList.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
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

  const openEditModal = () => {
    setIsEditOpen(true)
  }

  const closeEditModal = () => {
    setIsEditOpen(false)
  }

  const handleHmoSubmissionSuccess = () => {
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 5000)
    setRefreshKey((prevKey) => prevKey + 1) // Trigger refresh
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />
            {filteredList.length === 0 ? (
              <>
                <div className="flex h-full w-full items-center justify-center">
                  <div>
                    <Image src="/undraw_working_re_ddwy.svg" height={339} width={595} alt="pharmacy" />
                    <div className="mt-16 items-center justify-center">
                      <h1 className="text-center text-5xl font-bold">No HMO Yet</h1>
                      <div className="flex cursor-pointer items-center justify-center" onClick={openHmoModal}>
                        <p className="text-center">Add a new HMO</p>
                        <IoAddCircleSharp />
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
                <Footer />
              </>
            ) : (
              <>
                {" "}
                {hmoDetail && (
                  <div
                    className="px-16 py-3 max-md:px-3"
                    data-aos="fade-in"
                    data-aos-duration="1000"
                    data-aos-delay="500"
                  >
                    <div className="flex justify-between pt-4">
                      <button onClick={handleGoBack} className="redirect">
                        <IoMdArrowBack />
                        <p className="capitalize">Go back</p>
                      </button>
                      <button className="add-button" onClick={openHmoModal}>
                        <p className="text-[12px]">Add new HMO</p>
                        <GoPlus />
                      </button>
                    </div>
                    <div className="pt-10">
                      <div className="flex items-center justify-between">
                        <h1 className="font-semibold">{hmoDetail.name}</h1>
                        <div className="search-bg flex h-10 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-md:w-[180px] lg:w-[300px]">
                          <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
                          <Image
                            className="dark-icon-style"
                            src="/search-dark.svg"
                            width={16}
                            height={16}
                            alt="dekalo"
                          />
                          <input
                            type="text"
                            id="search"
                            placeholder="Search"
                            className="w-full bg-transparent text-xs outline-none focus:outline-none"
                            value={searchQuery}
                            onChange={handleSearch}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-4 md:grid-cols-3">
                        {filteredList.map((item) => (
                          <div key={item.id} className="rounded-md border p-6 max-md:p-3">
                            <h3 className="font-semibold max-md:text-sm">{item.name}</h3>
                            <p className="max-md:text-xs">{item.description}</p>
                            <div>
                              <div className="flex items-center justify-between pt-6">
                                <div className="max-md:hidden">
                                  <button className="button-primary h-[50px] rounded-sm max-md:h-[40px]">
                                    View invoice
                                  </button>
                                </div>
                                <div className="md:hidden">
                                  <button className="rounded border p-2">
                                    <IoReceipt />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div
                                    onClick={() => openDeleteModal(item.id)}
                                    className="flex cursor-pointer content-center items-center justify-center rounded bg-[#F20089] text-[#ffffff] transition-colors duration-500 hover:bg-[#601410] hover:text-[#F2B8B5] max-md:p-2 md:h-[50px] md:w-[50px]"
                                  >
                                    <HiOutlineTrash />
                                  </div>
                                  <div
                                    onClick={openEditModal}
                                    className="flex cursor-pointer content-center items-center justify-center rounded bg-[#46FFA6] text-[#000000] transition-colors duration-500 hover:bg-[#087A43] hover:text-[#ffffff] max-md:p-2 md:h-[50px] md:w-[50px]"
                                  >
                                    <FaRegEdit className="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <Footer />
              </>
            )}
          </div>
        </div>
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          onSubmitSuccess={handleHmoSubmissionSuccess}
          hmoId={hmoToDelete}
        />
        <HmoModal
          isOpen={isAddHmoOpen}
          onClose={closeHmoModal}
          onSubmitSuccess={handleHmoSubmissionSuccess}
          hmoCategoryId={hmoId}
        />
        <EditModal isOpen={isEditOpen} onClose={closeEditModal} onSubmitSuccess={handleHmoSubmissionSuccess} />
      </section>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">HMO added successfully</span>
        </div>
      )}
    </>
  )
}

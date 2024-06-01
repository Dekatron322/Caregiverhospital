"use client"
import React, { useState } from "react"
import { LabTestResults } from "utils"
import Image from "next/image"
import { PiDotsThree } from "react-icons/pi"
import { useRouter } from "next/navigation"
import { IoEyeSharp, IoPrintOutline } from "react-icons/io5"

export default function ReportDetails({ params }: { params: { reportId: string } }) {
  const router = useRouter()
  const [isDone, setIsDone] = useState<boolean>(false)
  const { reportId } = params

  const toggleDone = () => {
    setIsDone(!isDone)
  }

  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleGoBack = () => {
    router.back()
  }

  const patientDetail = LabTestResults.find((report) => report.id === reportId)

  let filteredMedicalRecords = patientDetail ? patientDetail.medicals : []

  if (searchQuery) {
    filteredMedicalRecords = filteredMedicalRecords.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <>
      <div className="flex flex-col gap-2 max-md:hidden ">
        <h3 className="mb-6 font-semibold">Laboratory Reports</h3>
        {filteredMedicalRecords.map((record) => (
          <div
            key={record.id}
            className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
          >
            <div className="">
              <p className="text-sm font-bold">{record.id}</p>
              <small className="text-xm ">{record.time}</small>
            </div>
            <div className="">
              <p className="text-sm font-bold">{record.name}</p>
              <small className="text-xm ">Name</small>
            </div>

            <div className="flex items-center gap-1 text-sm font-bold">
              <span>
                <Image src={record.doctor_image} height={40} width={40} alt="" />
              </span>
              <div>
                <p>{record.doctor_assigned}</p>
                <small className="text-xm ">Doctor Assigned</small>
              </div>
            </div>
            <div className="">
              <p className="text-sm font-bold">{record.test}</p>
              <small className="text-xm ">Test</small>
            </div>

            <div className="flex gap-2">
              <button className="flex w-28 items-center justify-center gap-1 rounded bg-[#46FFA6] px-2 py-[2px] text-xs text-[#000000]">
                <IoPrintOutline /> Print
              </button>
              <button className="flex w-28 items-center justify-center gap-1 rounded bg-[#349DFB] px-2 py-[2px] text-xs text-[#000000]">
                <IoEyeSharp /> View
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

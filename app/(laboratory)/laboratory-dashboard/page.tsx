"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { useState } from "react"
import { PharmacyReports, Pharmacy } from "utils"
import "aos/dist/aos.css"
import Image from "next/image"
import Link from "next/link"
import Appointments from "components/Dashboard/Dashboard"
import { PiDotsThree } from "react-icons/pi"
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import LabTests from "components/Dashboard/LabTests"

export default function PharmacyDashboard() {
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />

            <div className="px-16 pb-4 max-sm:px-3 md:mt-10">
              <h4 className="font-semibold">Laboratory Dashboard</h4>
              <p className="text-xs">A Quick overview of your lab</p>
            </div>
            <div className="mb-3 grid w-full grid-cols-3 gap-2 px-16 max-sm:grid-cols-1 max-sm:px-3">
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#01A768] pt-2  ">
                  <Image src="/inventory-status.svg" height={40} width={40} alt="" />
                  <h3 className=" py-2 font-bold capitalize">{pharmacy.inventory_status} </h3>
                  <p>Inventory Status</p>
                  <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#AADCC9] py-1 text-[#000000]">
                    <p className="text-xs">View Inventory Status</p>
                    <MdKeyboardDoubleArrowRight />
                  </div>
                </div>
              ))}
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#03A9F5] pt-2 ">
                  <Image src="/medicines-available.svg" height={40} width={40} alt="" />
                  <h3 className=" py-2 font-bold">{pharmacy.medicines_available}</h3>
                  <p>Medicines Available</p>
                  <Link
                    href="/medicines/"
                    className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#ABDDF4] py-1 text-[#000000]"
                  >
                    <p className="text-xs">View Inventory</p>
                    <MdKeyboardDoubleArrowRight />
                  </Link>
                </div>
              ))}
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#FED600] pt-2 ">
                  <Image src="/revenue.svg" height={38} width={38} alt="" />
                  <h3 className="py-2 font-bold">{pharmacy.revenue_status}</h3>
                  <p>Revenue Status</p>
                  <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#F6EAAA] py-1 text-[#000000]">
                    <p className="text-xs">View Detailed report</p>
                    <MdKeyboardDoubleArrowRight />
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 flex w-full grid-cols-2 gap-2 px-16 max-sm:px-3">
              <LabTests />
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}

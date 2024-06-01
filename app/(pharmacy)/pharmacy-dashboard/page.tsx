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

export default function PharmacyDashboard() {
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />

            <div className="px-16 pb-4 max-md:px-3 md:mt-10">
              <h4 className="font-semibold">Pharmacy Dashboard</h4>
              <p className="text-xs">A Quick overview of your pharmacy</p>
            </div>
            <div className="mb-3 grid w-full grid-cols-3 gap-2 px-16 max-md:grid-cols-1 max-md:px-3">
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#01A768] pt-2  ">
                  <Image src="/inventory-status.svg" height={40} width={40} alt="" />
                  <h3 className="py-2  font-bold capitalize">{pharmacy.inventory_status} </h3>
                  <p>Inventory Status</p>
                  <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#AADCC9] py-1 text-black">
                    <p className="text-xs">View Inventory Status</p>
                    <MdKeyboardDoubleArrowRight />
                  </div>
                </div>
              ))}
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#03A9F5] pt-2 ">
                  <Image src="/medicines-available.svg" height={40} width={40} alt="" />
                  <h3 className="py-2  font-bold">{pharmacy.medicines_available}</h3>
                  <p>Medicines Available</p>
                  <Link
                    href="/medicines/"
                    className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#ABDDF4] py-1 text-black"
                  >
                    <p className="text-xs">View Inventory</p>
                    <MdKeyboardDoubleArrowRight />
                  </Link>
                </div>
              ))}
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#FED600] pt-2 ">
                  <Image src="/revenue.svg" height={38} width={38} alt="" />
                  <h3 className="py-2  font-bold">{pharmacy.revenue_status}</h3>
                  <p>Revenue Status</p>
                  <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#F6EAAA] py-1 text-black">
                    <p className="text-xs">View Detailed report</p>
                    <MdKeyboardDoubleArrowRight />
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-3 flex w-full gap-2 px-16 max-md:px-3">
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#F2C0BD] pt-2 ">
                  <Image src="/shortage.svg" height={38} width={38} alt="" />
                  <h3 className="py-2  font-bold capitalize">{pharmacy.medicine_shortage} </h3>
                  <p>Medicine Shortage</p>
                  <Link
                    href="/pharmacy-dashboard/medicine-shortage"
                    className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#F2C0BD] py-1 text-black"
                  >
                    <p className="text-xs">Resolve Shortage</p>
                    <MdKeyboardDoubleArrowRight />
                  </Link>
                </div>
              ))}
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#C20505] pt-2">
                  <Image src="/expiring.svg" height={34} width={34} alt="" />
                  <h3 className="py-2  font-bold">{pharmacy.medicines_expiring}</h3>
                  <p>Medicines Expiring</p>
                  <Link
                    href="/pharmacy-dashboard/medicine-expiring"
                    className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#FF0909] py-1 text-black"
                  >
                    <p className="text-xs">Resolve Expiry</p>
                    <MdKeyboardDoubleArrowRight />
                  </Link>
                </div>
              ))}
            </div>
            <div className="auth mt-16 flex gap-6 py-6 pt-16">
              <div className="grid w-full grid-cols-2 gap-2 px-16 max-md:grid-cols-1 max-md:px-3">
                {PharmacyReports.map((report) => (
                  <div key={report.id} className="auth flex flex-col justify-center rounded-sm border ">
                    <p className="px-4 py-2 font-semibold">{report.title}</p>
                    <div className="border"></div>
                    <div className="flex justify-between">
                      <div className="px-4 py-2 ">
                        <p className="pb-4 text-base font-bold">{report.value}</p>
                        <p className="text-sm">{report.name}</p>
                      </div>
                      <div className="px-4 py-2">
                        <p className="pb-4 text-base font-bold">{report.sub_value}</p>
                        <p className="text-sm">{report.sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}

"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { Pharmacy } from "utils"
import "aos/dist/aos.css"
import Image from "next/image"
import Link from "next/link"
import DoctorsAppointments from "components/Dashboard/DoctorsAppointments"
import { MdKeyboardDoubleArrowRight } from "react-icons/md"

export default function PharmacyDashboard() {
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />

            <div className="mt-10 px-16 pb-4">
              <h4 className="font-semibold">Pharmacy Dashboard</h4>
              <p className="text-xs">A Quick overview of your pharmacy</p>
            </div>
            <div className="mb-3 flex w-full gap-2 px-16">
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#01A768] pt-2  max-xl:h-[171px]">
                  <Image src="/inventory-status.svg" height={40} width={40} alt="" />
                  <h3 className="max-xl:h-[171px]:py-4 py-2 font-bold capitalize">{pharmacy.inventory_status} </h3>
                  <p>Inventory Status</p>
                  <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#AADCC9] py-1">
                    <p className="text-xs">View Inventory Status</p>
                    <MdKeyboardDoubleArrowRight />
                  </div>
                </div>
              ))}
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#03A9F5] pt-2 max-xl:h-[171px]">
                  <Image src="/medicines-available.svg" height={40} width={40} alt="" />
                  <h3 className="max-xl:h-[171px]:py-4 py-2 font-bold">{pharmacy.medicines_available}</h3>
                  <p>Medicines Available</p>
                  <Link
                    href="/medicines/"
                    className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#ABDDF4] py-1"
                  >
                    <p className="text-xs">View Inventory</p>
                    <MdKeyboardDoubleArrowRight />
                  </Link>
                </div>
              ))}
              {Pharmacy.map((pharmacy) => (
                <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#FED600] pt-2 max-xl:h-[171px]">
                  <Image src="/revenue.svg" height={38} width={38} alt="" />
                  <h3 className="max-xl:h-[171px]:py-4 py-2 font-bold">{pharmacy.revenue_status}</h3>
                  <p>Revenue Status</p>
                  <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#F6EAAA] py-1">
                    <p className="text-xs">View Detailed report</p>
                    <MdKeyboardDoubleArrowRight />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex w-full grid-cols-2 gap-2 px-16">
              <DoctorsAppointments />
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}

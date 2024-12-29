"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { useState } from "react"
import { Phermacy } from "utils"
import Image from "next/image"
import Link from "next/link"
import Appointments from "components/Dashboard/Dashboard"
import { PiDotsThree } from "react-icons/pi"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"
import { IoAddCircleSharp } from "react-icons/io5"
import { GoPlus } from "react-icons/go"
import { MdLocationPin } from "react-icons/md"

export default function Dashboard() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />

            <div className="px-16 pb-4 max-md:px-3 md:mt-6">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize ">Go back</p>
              </button>
            </div>

            <div className="px-16 pb-4 max-md:px-3 md:mt-10">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="mb-8 font-semibold">Pharmacy</p>
                  <div>
                    <Link href="/staff/add-staff" className="add-button">
                      <p className="text-[12px]">Add Staff</p>
                      <GoPlus />
                    </Link>
                  </div>
                </div>
                <>
                  {Phermacy.map((item, index) => (
                    <div className="flex w-full gap-4 max-md:flex-col" key={item.id}>
                      <div className="gap-3 md:w-[30%]">
                        <div className="flex flex-col  justify-center rounded-md border px-4 py-4">
                          <div className="flex items-center justify-center">
                            <Image src={item.image} height={60} width={60} alt="" />
                          </div>
                          <h1 className="mt-3 text-center font-bold">{item.name}</h1>
                          <p className="text-center text-base font-bold">
                            Patient ID: <span className="font-normal">{item.id}</span>
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <MdLocationPin />
                            {item.location}
                          </div>
                          <div className="my-4 flex w-full border"></div>
                          <div className="">
                            <div className="flex justify-between pb-2">
                              <p className="text-sm">Phone</p>
                              <p className="text-sm">{item.contact}</p>
                            </div>
                            <div className="flex justify-between pb-2">
                              <p className="text-sm">Age</p>
                              <p className="text-sm">{item.age}</p>
                            </div>
                            <div className="flex justify-between pb-2">
                              <p className="text-sm">Status</p>
                              <p className="text-sm">{item.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full  flex-col gap-2 ">
                        <div className="flex w-full gap-2 max-md:flex-col">
                          <div key={index} className="w-full gap-2">
                            {item.quick_report.map((report, idx) => (
                              <div key={idx} className=" flex flex-col justify-center rounded border ">
                                <p className="px-4 py-2 font-semibold">Quick Report</p>
                                <div className="border"></div>
                                <div className="flex justify-between">
                                  <div className=" px-4 py-2 ">
                                    <p className="text-sm  font-bold">{report.medicine_sold}</p>
                                    <p className="text-sm">Medicine Sold</p>
                                  </div>
                                  <div className="px-4 py-2">
                                    <p className="text-sm font-bold">{report.invoice_generated}</p>
                                    <p className="text-sm">Invoice Generated</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div key={index} className="w-full gap-2">
                            {item.customer.map((report, idx) => (
                              <div key={idx} className=" flex flex-col justify-center rounded border ">
                                <p className="px-4 py-2 font-semibold">Customers</p>
                                <div className="border"></div>
                                <div className="flex justify-between">
                                  <div className="px-4 py-2 ">
                                    <p className="text-sm font-bold">{report.costomer_count}</p>
                                    <p className="text-sm">Total no. of Suppliers</p>
                                  </div>
                                  <div className="px-4 py-2">
                                    <p className="text-sm font-bold">{report.frequently_bought}</p>
                                    <p className="text-sm">Total no. of Users</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div key={index} className="mt-2 w-full gap-2">
                          {item.my_pharmacy.map((report, idx) => (
                            <div key={idx} className=" flex flex-col justify-center rounded border ">
                              <p className="px-4 py-2 font-semibold">Customers</p>
                              <div className="border"></div>
                              <div className="flex justify-between">
                                <div className="px-4 py-2 ">
                                  <p className="text-sm font-bold">{report.total_suppliers}</p>
                                  <p className="text-sm">Total no. of Customers</p>
                                </div>
                                <div className="px-4 py-2">
                                  <p className="text-sm font-bold">{report.total_users}</p>
                                  <p className="text-sm">Frequently bought item</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}

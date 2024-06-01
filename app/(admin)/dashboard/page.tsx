"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { useState } from "react"
import { Statistics, Admissions } from "utils"
import "aos/dist/aos.css"
import Image from "next/image"
import Link from "next/link"
import Appointments from "components/Dashboard/Dashboard"
import { PiDotsThree } from "react-icons/pi"

export default function Dashboard() {
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />

            <div className="px-16 pb-4 max-md:px-3 md:mt-10">
              <h4 className="font-semibold">Statistics</h4>
            </div>
            <div className="  flex gap-2 px-16 max-md:grid max-md:grid-cols-2  max-md:px-3">
              {Statistics.map((item, index) => (
                <div className=" w-full rounded border-[0.5px] p-4 shadow" key={item.id}>
                  <div className="mb-8 flex justify-between">
                    <h6 className="font-bold">{item.name}</h6>
                    <Image src={item.image} height={30} width={30} alt="pharmacy" />
                  </div>
                  <div className="flex justify-between">
                    <h6 className="font-bold">35</h6>
                    <Link href={item.url} className="rounded-full bg-[#46FFA6] px-2 py-1 text-xs text-[#000000]">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-6 max-md:flex-col max-md:px-4 max-md:pt-6  md:mb-16 md:px-16 md:pt-16">
              <div className=" md:w-[70%]">
                <p className="mb-8 font-semibold max-md:mb-4">Appointments</p>
                <Appointments />
              </div>
              <div className="grid w-full rounded-xl border-[0.5px]  px-4 py-4 shadow md:w-[30%]">
                <div className="mb-12 flex items-center justify-between">
                  <h3 className="font-bold">Admissions</h3>
                  <button className="redirect ">
                    <Link href="/appointments" className="">
                      View all
                    </Link>
                  </button>
                </div>
                {Admissions.map((item, index) => (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="mb-4 flex items-center  gap-1">
                        <Image src={item.image} height={40} width={40} alt="" />
                        <div>
                          <div className="flex items-baseline">
                            <p className="text-sm font-semibold">{item.name}</p> ,{" "}
                            <p className="text-xs">{item.gender}</p> ,<p className="text-sm">{item.age}</p>
                          </div>
                          <p className="text-xs">{item.ward}</p>
                        </div>
                      </div>
                      <PiDotsThree />
                    </div>
                  </>
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

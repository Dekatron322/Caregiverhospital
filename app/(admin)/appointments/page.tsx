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

export default function Appointment() {
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />

            <div className="px-16 pb-4 max-md:px-3 md:mt-10">
              <div className="w-full">
                <p className="mb-8 font-semibold">Appointments</p>
                <Appointments />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}

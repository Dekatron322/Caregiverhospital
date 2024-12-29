"use client"
import { useEffect, useState } from "react"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import Link from "next/link"
import DoctorsAppointments from "components/Dashboard/DoctorsAppointments"
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import axios from "axios"
import DoctorNav from "components/Navbar/DoctorNav"

export default function PharmacyDashboard() {
  const [doctorCount, setDoctorCount] = useState(0)
  const [appointmentCount, setAppointmentCount] = useState(0)
  const [checkAppCount, setCheckAppCount] = useState(0)

  useEffect(() => {
    const fetchDoctorCount = async () => {
      try {
        const response = await axios.get("https://api2.caregiverhospital.com/app_user/all/")
        const doctors = response.data.filter((user: any) => user.account_type === "Doctors")
        setDoctorCount(doctors.length)
      } catch (error) {
        console.error("Error fetching doctor count:", error)
      }
    }

    const fetchPatientData = async () => {
      try {
        const response = await axios.get("https://api2.caregiverhospital.com/patient/patient/0/5000/")
        let appointmentCount = 0
        let checkAppCount = 0
        response.data.forEach((patient: any) => {
          appointmentCount += patient.appointments.length
          checkAppCount += patient.check_apps.length
        })
        setAppointmentCount(appointmentCount)
        setCheckAppCount(checkAppCount)
      } catch (error) {
        console.error("Error fetching patient data:", error)
      }
    }

    fetchDoctorCount()
    fetchPatientData()
  }, [])

  return (
    <section>
      <div className="h-full ">
        <div className="flex min-h-screen ">
          <div className="flex w-screen flex-col ">
            <DoctorNav />

            <div className="mt-10 px-16 pb-4">
              <h4 className="font-semibold">Doctor&apos;s Dashboard</h4>
              <p className="text-xs">A Quick overview of your dashboard</p>
            </div>
            <div className="mb-3 grid w-full grid-cols-3 gap-2 px-16 max-sm:grid-cols-1 max-sm:px-3">
              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#01A768] pt-2">
                <Image src="/inventory-status.svg" height={40} width={40} alt="" />
                <h3 className="py-2 font-bold capitalize">{doctorCount}</h3>
                <p>Registered Doctors</p>
                <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#AADCC9] py-1 text-[#000000]">
                  <p className="text-xs">View Inventory Status</p>
                  <MdKeyboardDoubleArrowRight />
                </div>
              </div>

              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#03A9F5] pt-2 ">
                <Image src="/medicines-available.svg" height={40} width={40} alt="" />
                <h3 className="py-2 font-bold">{appointmentCount}</h3>
                <p>Total Appointments</p>
                <Link
                  href="/"
                  className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#ABDDF4] py-1 text-[#000000]"
                >
                  <p className="text-xs">View appointments</p>
                  <MdKeyboardDoubleArrowRight />
                </Link>
              </div>

              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#FED600] pt-2 ">
                <Image src="/revenue.svg" height={38} width={38} alt="" />
                <h3 className="py-2 font-bold">{checkAppCount}</h3>
                <p>Total Admissions</p>
                <Link
                  href="/doctor-admission/"
                  className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#F6EAAA] py-1 text-[#000000]"
                >
                  <p className="text-xs">View Admission</p>
                  <MdKeyboardDoubleArrowRight />
                </Link>
              </div>
            </div>

            <div className="mt-6 flex w-full grid-cols-2 gap-2 px-16">
              <DoctorsAppointments />
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </section>
  )
}

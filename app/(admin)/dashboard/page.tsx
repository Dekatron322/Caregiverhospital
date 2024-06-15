"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { useEffect, useState } from "react"
import { Statistics, Admissions } from "utils"
import "aos/dist/aos.css"
import Image from "next/image"
import Link from "next/link"
import Appointments from "components/Dashboard/Dashboard"
import { PiDotsThree } from "react-icons/pi"

interface Patient {
  id: string
  name: string
  gender: string
  dob: string
  appointments: {
    id: number
    doctor: string
    detail: string
    pub_date: string
  }[]
  // Add other fields as needed
}

interface Department {
  name: string
}

interface Staff {
  username: string
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientsWithAppointments, setPatientsWithAppointments] = useState<Patient[]>([])
  const [departmentCount, setDepartmentCount] = useState(0)
  const [staffCount, setStaffCount] = useState(0)

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("https://api.caregiverhospital.com/patient/patient/")
        if (!response.ok) {
          throw new Error("Failed to fetch patients")
        }
        const data = (await response.json()) as Patient[] // Type assertion here
        setPatients(data)

        // Filter patients with appointments
        const patientsWithApps = data.filter((patient) => patient.appointments.length > 0)
        setPatientsWithAppointments(patientsWithApps)
      } catch (error) {
        console.error("Error fetching patients:", error)
        // Optionally, handle errors
      }
    }

    fetchPatients()
  }, [])

  useEffect(() => {
    async function fetchDepartmentCount() {
      try {
        const response = await fetch("https://api.caregiverhospital.com/department/department/")
        if (!response.ok) {
          throw new Error("Failed to fetch department count")
        }
        const data = (await response.json()) as Department[]
        setDepartmentCount(data.length)
      } catch (error) {
        console.error("Error fetching department count:", error)
      }
    }

    fetchDepartmentCount()
  }, [])

  useEffect(() => {
    async function fetchStaffCount() {
      try {
        const response = await fetch("https://api.caregiverhospital.com/app_user/all/")
        if (!response.ok) {
          throw new Error("Failed to fetch staff count")
        }
        const data = (await response.json()) as Staff[]
        setStaffCount(data.length)
      } catch (error) {
        console.error("Error fetching staff count:", error)
      }
    }

    fetchStaffCount()
  }, [])
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
              <div className=" w-full rounded border-[0.5px] p-4 shadow">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Appointments</h6>
                  <Image src="/calendar.svg" height={30} width={30} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">{patientsWithAppointments.length}</h6>
                  <Link href="/appointments" className="rounded-full bg-[#46FFA6] px-2 py-1 text-xs text-[#000000]">
                    View
                  </Link>
                </div>
              </div>
              {/*  */}
              <div className=" w-full rounded border-[0.5px] p-4 shadow">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Departments</h6>
                  <Image src="/department.svg" height={30} width={30} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">{departmentCount}</h6>
                  <Link href="/department" className="rounded-full bg-[#46FFA6] px-2 py-1 text-xs text-[#000000]">
                    View
                  </Link>
                </div>
              </div>
              {/*  */}

              <div className=" w-full rounded border-[0.5px] p-4 shadow">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Staff</h6>
                  <Image src="/staff.svg" height={30} width={30} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">{staffCount}</h6>
                  <Link href="/staff" className="rounded-full bg-[#46FFA6] px-2 py-1 text-xs text-[#000000]">
                    View
                  </Link>
                </div>
              </div>
              {/*  */}
              <div className=" w-full rounded border-[0.5px] p-4 shadow">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Patients</h6>
                  <Image src="/outpatient.svg" height={30} width={30} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">{patients.length}</h6>
                  <Link href="/patients" className="rounded-full bg-[#46FFA6] px-2 py-1 text-xs text-[#000000]">
                    View
                  </Link>
                </div>
              </div>
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

"use client" // Mark this as a client component

import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Appointments from "components/Dashboard/Dashboard"

interface Department {
  name: string
}

interface Staff {
  username: string
}

interface PatientCountResponse {
  total: number
}

export default function Dashboard() {
  const [departmentCount, setDepartmentCount] = useState(0)
  const [staffCount, setStaffCount] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all required data in a single function
  const fetchData = useCallback(async () => {
    try {
      // Fetch patient count
      const patientResponse = await fetch(
        "https://api2.caregiverhospital.com/patient/patient/fetch/count/get-patient-count/"
      )
      if (!patientResponse.ok) throw new Error("Failed to fetch patient count")
      const patientData = (await patientResponse.json()) as PatientCountResponse
      setTotalPatients(patientData.total)

      // Fetch department count
      const departmentResponse = await fetch("https://api2.caregiverhospital.com/department/department/")
      if (!departmentResponse.ok) throw new Error("Failed to fetch department count")
      const departmentData = (await departmentResponse.json()) as Department[]
      setDepartmentCount(departmentData.length)

      // Fetch staff count
      const staffResponse = await fetch("https://api2.caregiverhospital.com/app_user/all/")
      if (!staffResponse.ok) throw new Error("Failed to fetch staff count")
      const staffData = (await staffResponse.json()) as Staff[]
      setStaffCount(staffData.length)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Memoize the statistics cards to avoid unnecessary re-renders
  const statisticsCards = useMemo(
    () => [
      {
        title: "Appointments",
        value: 0, // Replace with actual data if available
        icon: "/calendar.svg",
        link: "/appointments",
      },
      {
        title: "Departments",
        value: departmentCount,
        icon: "/department.svg",
        link: "/department",
      },
      {
        title: "Staff",
        value: staffCount,
        icon: "/staff.svg",
        link: "/staff",
      },
      {
        title: "Patients",
        value: totalPatients,
        icon: "/outpatient.svg",
        link: "/patients",
      },
    ],
    [departmentCount, staffCount, totalPatients]
  )

  if (loading) {
    return (
      <div className="flex h-screen flex-col">
        <DashboardNav />
        <div className="flex-grow px-16 py-4 max-md:px-3">
          <h4 className="mb-4 font-semibold">Statistics</h4>
          <div className="flex gap-2 max-md:grid max-md:grid-cols-2">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="w-full rounded border-[0.5px] p-4 shadow">
                <div className="mb-8 flex justify-between">
                  <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="mb-4 font-semibold">Appointments</p>
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex w-full items-center justify-between rounded-lg border p-2">
                  <div className="flex w-full items-center gap-2">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 max-md:hidden"></div>
                    <div>
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                      <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                  </div>
                  <div className="flex w-full flex-col max-md:hidden">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                  </div>
                  <div className="md:flex md:w-full md:flex-col md:items-center">
                    <div className="h-6 w-16 animate-pulse rounded bg-gray-200"></div>
                    <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                    <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />

            <div className="px-12 py-4 max-md:px-3 md:mt-10">
              <h4 className="font-semibold">Statistics</h4>
            </div>
            <div className=" flex gap-4 px-12 max-md:grid max-md:grid-cols-2 max-md:px-3">
              {statisticsCards.map((card, index) => (
                <div key={index} className="sidebar w-full rounded border-[0.5px] p-4 shadow">
                  <div className="mb-8 flex justify-between">
                    <h6 className="font-bold">{card.title}</h6>
                    <Image src={card.icon} height={30} width={30} alt={card.title.toLowerCase()} />
                  </div>
                  <div className="flex justify-between">
                    <h6 className="font-bold">{card.value}</h6>
                    <Link href={card.link} className="rounded-full bg-[#46FFA6] px-2 py-1 text-xs text-[#000000]">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-6 max-md:flex-col max-md:px-4 max-md:pt-6 md:mb-16 md:px-16 md:pt-16">
              <div className="md:w-full">
                <p className="mb-8 font-semibold max-md:mb-4">Appointments</p>
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

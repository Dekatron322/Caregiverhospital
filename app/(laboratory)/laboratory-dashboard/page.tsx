"use client"
import { useEffect, useState } from "react"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import LabTests from "components/Dashboard/LabTests"
import LaboratoryNav from "components/Navbar/LaboratoryNav"

interface LabTest {
  id: string
  doctor_name: string
  test_type: string
  diagnosis_code: string
  note: string
  test: string
  result: string
  status_note: string
  status: boolean
  pub_date: string
}

export default function PharmacyDashboard() {
  const [pharmacyData, setPharmacyData] = useState<LabTest[]>([])
  const [totalTests, setTotalTests] = useState(0)
  const [approvedTests, setApprovedTests] = useState(0)
  const [notApprovedTests, setNotApprovedTests] = useState(0)

  useEffect(() => {
    fetch("https://api2.caregiverhospital.com/lab-test/lab-test/")
      .then((response) => response.json())
      .then((data: unknown) => {
        const labTests = data as LabTest[]
        setPharmacyData(labTests)
        const total = labTests.length
        const approved = labTests.filter((test) => test.status_note === "Approved").length
        const notApproved = labTests.filter((test) => test.status_note === "Not Approved").length

        setTotalTests(total)
        setApprovedTests(approved)
        setNotApprovedTests(notApproved)
      })
      .catch((error) => console.error("Error fetching lab test data:", error))
  }, [])

  return (
    <section>
      <div className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <LaboratoryNav />

            <div className="px-16 pb-4 max-sm:px-3 md:mt-10">
              <h4 className="font-semibold">Laboratory Dashboard</h4>
              <p className="text-xs">A Quick overview of your lab</p>
            </div>

            <div className="mb-3 grid w-full grid-cols-3 gap-2 px-16 max-sm:grid-cols-1 max-sm:px-3">
              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#01A768] pt-2">
                <Image src="/inventory-status.svg" height={40} width={40} alt="" />
                <h3 className="py-2 font-bold capitalize">{totalTests}</h3>
                <p>Total Test</p>
                <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#AADCC9] py-1 text-[#000000]">
                  <p className="text-xs">View Inventory Status</p>
                  <MdKeyboardDoubleArrowRight />
                </div>
              </div>

              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#03A9F5] pt-2">
                <Image src="/medicines-available.svg" height={40} width={40} alt="" />
                <h3 className="py-2 font-bold">{approvedTests}</h3>
                <p>Test Approved</p>
                <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#ABDDF4] py-1 text-[#000000]">
                  <p className="text-xs">View Inventory</p>
                  <MdKeyboardDoubleArrowRight />
                </div>
              </div>

              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#FED600] pt-2">
                <Image src="/revenue.svg" height={38} width={38} alt="" />
                <h3 className="py-2 font-bold">{notApprovedTests}</h3>
                <p>Test Not Approved</p>
                <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#F6EAAA] py-1 text-[#000000]">
                  <p className="text-xs">View Detailed report</p>
                  <MdKeyboardDoubleArrowRight />
                </div>
              </div>
            </div>

            <div className="my-6 flex w-full grid-cols-2 gap-2 px-16 max-sm:px-3">
              <LabTests />
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </section>
  )
}

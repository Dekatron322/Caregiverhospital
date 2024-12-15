"use client"
import { useEffect, useState } from "react"
import Footer from "components/Footer/Footer"
import LabTests from "components/Dashboard/LabTests"
import LaboratoryNav from "components/Navbar/LaboratoryNav"
import CashierLabTests from "components/Dashboard/CashierLabTest"
import CashierNav from "components/Navbar/CashierNav"

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
  discount_value: string
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
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <CashierNav />

            <div className="px-16 pb-4 max-sm:px-3 md:mt-10">
              <h4 className="font-semibold">Carshier Dashboard</h4>
              {/* <p className="text-xs">A Quick overview of your lab</p> */}
            </div>

            <div className="my-6 flex w-full grid-cols-2 gap-2 px-16 max-sm:px-3">
              <CashierLabTests />
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}

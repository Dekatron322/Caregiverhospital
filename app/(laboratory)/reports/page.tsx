"use client"
import Footer from "components/Footer/Footer"
import LabResults from "components/Dashboard/LabResults"
import LaboratoryNav from "components/Navbar/LaboratoryNav"

export default function PharmacyDashboard() {
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <LaboratoryNav />

            <div className="px-16 pb-4 max-sm:px-3 md:mt-10">
              <h4 className="font-semibold">Laboratory Dashboard</h4>
              <p className="text-xs">A Quick overview of your lab</p>
            </div>

            <div className="my-6 flex w-full grid-cols-2 gap-2 px-16 max-sm:px-3">
              <LabResults />
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}

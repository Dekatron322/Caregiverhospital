"use client"
import Footer from "components/Footer/Footer"
import NursesAppointments from "components/Dashboard/NursesAppointment"
import PharmacyNav from "components/Navbar/PharmacyNav"

export default function Appointment() {
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <PharmacyNav />

            <div className="px-16 py-4 max-md:px-3 md:mt-10">
              <div className="w-full">
                <p className="mb-8 font-semibold">Appointments</p>
                <NursesAppointments />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}

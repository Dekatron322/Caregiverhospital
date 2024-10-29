"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Appointments from "components/Dashboard/Dashboard"
import NursesNav from "components/Navbar/NursesNav"
import NursesAppointments from "components/Dashboard/NursesAppointment"

export default function Appointment() {
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <NursesNav />

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

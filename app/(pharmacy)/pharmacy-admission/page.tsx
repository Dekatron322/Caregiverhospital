"use client"
import Footer from "components/Footer/Footer"
import AllAdmission from "components/Dashboard/AllAdmission"
import { useRouter } from "next/navigation"
import { IoMdArrowBack } from "react-icons/io"

import PharmacyNav from "components/Navbar/PharmacyNav"
import PharmacyAdmission from "components/Dashboard/PharmacyAdmission"

export default function Admission() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <PharmacyNav />
            <div className="flex justify-between px-16 py-6 max-md:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>

            <div className="flex gap-6 px-16 max-md:px-3 md:py-6">
              <div className="w-full">
                <div className="flex justify-between"></div>
                <p className="mb-8 font-semibold max-md:mb-2">Admissions</p>

                <PharmacyAdmission />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}
